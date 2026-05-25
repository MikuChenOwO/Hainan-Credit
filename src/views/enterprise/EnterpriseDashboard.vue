<template>
  <div class="enterprise-dashboard">

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>企业基本信息</span>
          <el-button type="primary" link @click="openEditDialog">编辑信息</el-button>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="6">
          <div class="info-item">
            <label>企业名称：</label>
            <span>{{ enterpriseInfo.name }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <label>统一信用代码：</label>
            <span>{{ enterpriseInfo.creditCode }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <label>行业类型：</label>
            <span>{{ enterpriseInfo.industry }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="info-item">
            <label>注册资本：</label>
            <span>{{ enterpriseInfo.registeredCapital }} 万元</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 企业文件数据上传 -->
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <span>企业文件数据上传</span>
          <div class="header-actions">
            <el-button type="primary" link @click="openFillDialog">在线填报</el-button>
            <el-button type="primary" link @click="openUploadDialog">上传文件</el-button>
          </div>
        </div>
      </template>

      <div class="upload-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="upload-section">
              <h4>财务报表上传</h4>
              <p class="upload-desc">支持上传资产负债表、利润表、现金流量表等财务文件</p>
              <el-button type="primary" @click="uploadFinancialFiles">
                <el-icon><Document /></el-icon>
                上传财务文件
              </el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="upload-section">
              <h4>业务数据上传</h4>
              <p class="upload-desc">支持上传业务合同、交易记录、客户数据等业务文件</p>
              <el-button type="success" @click="uploadBusinessFiles">
                <el-icon><Files /></el-icon>
                上传业务文件
              </el-button>
            </div>
          </el-col>
        </el-row>

        <el-divider />

        <div class="upload-history">
          <h4>最近上传记录</h4>
          <el-table :data="uploadHistory" style="width: 100%" size="small">
            <el-table-column prop="fileName" label="文件名" width="200" />
            <el-table-column prop="fileType" label="文件类型" width="120">
              <template #default="scope">
                <el-tag :type="getFileTypeTag(scope.row.fileType)">{{ scope.row.fileType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="uploadTime" label="上传时间" width="180" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === '成功' ? 'success' : scope.row.status === '待复核' ? 'danger' : 'warning'">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" @click="downloadFile(scope.row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <el-dialog
      v-model="fillReportDialogVisible"
      title="企业经营与财务在线填报"
      width="960px"
      destroy-on-close
    >
      <el-form :model="fillForm" label-width="128px" class="enterprise-fill-form">
        <el-divider content-position="left">基础信息</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="填报期间">
              <el-date-picker
                v-model="fillForm.reportPeriod"
                type="month"
                value-format="YYYY-MM"
                placeholder="选择月份"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="填报类型">
              <el-select v-model="fillForm.reportType" style="width: 100%">
                <el-option label="月度经营快报" value="月度经营快报" />
                <el-option label="季度财务填报" value="季度财务填报" />
                <el-option label="年度经营填报" value="年度经营填报" />
                <el-option label="专项风险填报" value="专项风险填报" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业名称">
              <el-input v-model="fillForm.companyName" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="统一信用代码">
              <el-input v-model="fillForm.creditCode" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法定代表人">
              <el-input v-model="fillForm.legalPerson" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人">
              <el-input v-model="fillForm.contactName" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="联系电话">
              <el-input v-model="fillForm.contactPhone" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系邮箱">
              <el-input v-model="fillForm.contactEmail" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在地区">
              <el-input v-model="fillForm.region" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">经营数据</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="营业收入(万)">
              <el-input-number v-model="fillForm.revenue" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="营业成本(万)">
              <el-input-number v-model="fillForm.operatingCost" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="净利润(万)">
              <el-input-number v-model="fillForm.profit" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="员工人数">
              <el-input-number v-model="fillForm.employees" :min="0" :step="5" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="新增订单数">
              <el-input-number v-model="fillForm.newOrders" :min="0" :step="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="在手合同额(万)">
              <el-input-number v-model="fillForm.contractAmount" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">资产负债</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="总资产(万)">
              <el-input-number v-model="fillForm.assets" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总负债(万)">
              <el-input-number v-model="fillForm.liabilities" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流动资产(万)">
              <el-input-number v-model="fillForm.currentAssets" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="流动负债(万)">
              <el-input-number v-model="fillForm.currentLiabilities" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应收账款(万)">
              <el-input-number v-model="fillForm.accountsReceivable" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="存货金额(万)">
              <el-input-number v-model="fillForm.inventory" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">现金流与偿债</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="经营现金流(万)">
              <el-input-number v-model="fillForm.operatingCashFlow" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="短期借款(万)">
              <el-input-number v-model="fillForm.shortTermDebt" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="长期借款(万)">
              <el-input-number v-model="fillForm.longTermDebt" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="本期还款(万)">
              <el-input-number v-model="fillForm.repaymentAmount" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="逾期金额(万)">
              <el-input-number v-model="fillForm.overdueAmount" :min="0" :step="10" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="涉诉/处罚次数">
              <el-input-number v-model="fillForm.legalDisputeCount" :min="0" :step="1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="fill-metrics">
          <div class="metric-item">
            <span>资产负债率</span>
            <strong>{{ fillMetrics.debtRatio }}%</strong>
          </div>
          <div class="metric-item">
            <span>净利率</span>
            <strong>{{ fillMetrics.profitMargin }}%</strong>
          </div>
          <div class="metric-item">
            <span>流动比率</span>
            <strong>{{ fillMetrics.currentRatio }}</strong>
          </div>
          <div class="metric-item">
            <span>经营现金流</span>
            <strong>{{ fillForm.operatingCashFlow }}万</strong>
          </div>
        </div>

        <el-divider content-position="left">经营与风险说明</el-divider>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="经营状态">
              <el-select v-model="fillForm.operationStatus" style="width: 100%">
                <el-option label="正常经营" value="正常经营" />
                <el-option label="经营波动" value="经营波动" />
                <el-option label="停产/停业" value="停产/停业" />
                <el-option label="异常经营" value="异常经营" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要风险标签">
              <el-select v-model="fillForm.riskTags" multiple collapse-tags style="width: 100%">
                <el-option label="现金流紧张" value="现金流紧张" />
                <el-option label="订单下降" value="订单下降" />
                <el-option label="应收账款偏高" value="应收账款偏高" />
                <el-option label="负债率偏高" value="负债率偏高" />
                <el-option label="涉诉处罚" value="涉诉处罚" />
                <el-option label="无明显风险" value="无明显风险" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="经营情况">
          <el-input
            v-model="fillForm.businessSummary"
            type="textarea"
            :rows="3"
            placeholder="填写本期主营业务、经营变化、重点项目等"
          />
        </el-form-item>

        <el-form-item label="风险说明">
          <el-input
            v-model="fillForm.riskHighlights"
            type="textarea"
            :rows="3"
            placeholder="填写本期风险点、异常说明或补充备注"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="fillReportDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFillReport">提交填报</el-button>
        </span>
      </template>
    </el-dialog>

    <div class="content-area">
      <div v-show="activeTab === 'risk'">
        <EnterpriseRiskPrediction />
      </div>

      <div v-show="activeTab === 'finance'">
        <EnterpriseFinancialAnalysis />
      </div>

      <div v-show="activeTab === 'monitor'">
        <EnterpriseRiskMonitoring />
      </div>

      <div v-show="activeTab === 'report'">
        <EnterpriseCreditReport />
      </div>
    </div>

    <el-dialog
      v-model="editDialogVisible"
      title="编辑企业信息"
      width="600px"
      :before-close="handleCloseEditDialog"
    >
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="企业名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="统一信用代码">
          <el-input v-model="editForm.creditCode" />
        </el-form-item>
        <el-form-item label="行业类型">
          <el-input v-model="editForm.industry" />
        </el-form-item>
        <el-form-item label="注册资本(万元)">
          <el-input-number v-model="editForm.registeredCapital" :min="0" />
        </el-form-item>
        <el-form-item label="成立日期">
          <el-date-picker
            v-model="editForm.establishDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="法定代表人">
          <el-input v-model="editForm.legalPerson" />
        </el-form-item>
        <el-form-item label="企业地址">
          <el-input v-model="editForm.address" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEnterpriseInfo">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Files } from '@element-plus/icons-vue'
import EnterpriseRiskPrediction from './components/EnterpriseRiskPrediction.vue'
import EnterpriseFinancialAnalysis from './components/EnterpriseFinancialAnalysis.vue'
import EnterpriseRiskMonitoring from './components/EnterpriseRiskMonitoring.vue'
import EnterpriseCreditReport from './components/EnterpriseCreditReport.vue'
import { useFeatureAccess } from '@/composables/useFeatureAccess'
import { getFeatureItems } from '@/config/userAccess'
import { getCurrentUserProfile } from '@/utils/auth'

const ENTERPRISE_FEATURES = getFeatureItems('enterprise')

const percent = (numerator, denominator) => {
  const base = Number(denominator || 0)
  if (!base) return 0
  return Number(((Number(numerator || 0) / base) * 100).toFixed(1))
}

export default {
  name: 'EnterpriseDashboard',
  components: {
    EnterpriseCreditReport,
    EnterpriseFinancialAnalysis,
    EnterpriseRiskMonitoring,
    EnterpriseRiskPrediction,
    Document,
    Files
  },
  setup() {
    const { activeTab } = useFeatureAccess(
      'enterprise',
      ENTERPRISE_FEATURES,
      'risk'
    )

    const editDialogVisible = ref(false)
    const fillReportDialogVisible = ref(false)

    const enterpriseInfo = ref({
      name: '海南科技有限公司',
      creditCode: '91460000MA5TXXXXXX',
      industry: '信息技术服务',
      registeredCapital: 1000,
      establishDate: '2018-05-20',
      legalPerson: '李四',
      address: '海南省海口市美兰区'
    })

    const editForm = reactive({
      name: '',
      creditCode: '',
      industry: '',
      registeredCapital: 0,
      establishDate: '',
      legalPerson: '',
      address: ''
    })

    const fillForm = reactive({
      reportPeriod: '',
      reportType: '月度经营快报',
      companyName: '',
      creditCode: '',
      legalPerson: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      region: '',
      revenue: 0,
      operatingCost: 0,
      profit: 0,
      assets: 0,
      liabilities: 0,
      currentAssets: 0,
      currentLiabilities: 0,
      accountsReceivable: 0,
      inventory: 0,
      operatingCashFlow: 0,
      shortTermDebt: 0,
      longTermDebt: 0,
      repaymentAmount: 0,
      overdueAmount: 0,
      legalDisputeCount: 0,
      employees: 0,
      newOrders: 0,
      contractAmount: 0,
      operationStatus: '正常经营',
      riskTags: [],
      businessSummary: '',
      riskHighlights: ''
    })

    const fillMetrics = computed(() => ({
      debtRatio: percent(fillForm.liabilities, fillForm.assets),
      profitMargin: percent(fillForm.profit, fillForm.revenue),
      currentRatio: fillForm.currentLiabilities
        ? (Number(fillForm.currentAssets || 0) / Number(fillForm.currentLiabilities)).toFixed(2)
        : '0.00'
    }))

    const openEditDialog = () => {
      Object.assign(editForm, enterpriseInfo.value)
      editDialogVisible.value = true
    }

    const handleCloseEditDialog = done => {
      ElMessageBox.confirm('确定要取消编辑吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        done()
      }).catch(() => {
        // 用户取消关闭
      })
    }

    const saveEnterpriseInfo = () => {
      Object.assign(enterpriseInfo.value, editForm)
      editDialogVisible.value = false
      ElMessage.success('企业信息更新成功')
    }

    const openFillDialog = () => {
      const profile = getCurrentUserProfile()
      Object.assign(fillForm, {
        reportPeriod: new Date().toISOString().slice(0, 7),
        reportType: '月度经营快报',
        companyName: enterpriseInfo.value.name,
        creditCode: enterpriseInfo.value.creditCode,
        legalPerson: enterpriseInfo.value.legalPerson,
        contactName: profile?.realName || profile?.username || '',
        contactPhone: profile?.phone || '',
        contactEmail: profile?.email || '',
        region: enterpriseInfo.value.address || '',
        revenue: 0,
        operatingCost: 0,
        profit: 0,
        assets: enterpriseInfo.value.registeredCapital || 0,
        liabilities: 0,
        currentAssets: 0,
        currentLiabilities: 0,
        accountsReceivable: 0,
        inventory: 0,
        operatingCashFlow: 0,
        shortTermDebt: 0,
        longTermDebt: 0,
        repaymentAmount: 0,
        overdueAmount: 0,
        legalDisputeCount: 0,
        employees: 0,
        newOrders: 0,
        contractAmount: 0,
        operationStatus: '正常经营',
        riskTags: [],
        businessSummary: '',
        riskHighlights: ''
      })
      fillReportDialogVisible.value = true
    }

    const submitFillReport = () => {
      if (!fillForm.companyName || !fillForm.reportPeriod) {
        ElMessage.warning('请先完善填报期间和企业名称')
        return
      }

      uploadHistory.value.unshift({
        fileName: `${fillForm.reportPeriod} ${fillForm.reportType}`,
        fileType: '在线填报',
        uploadTime: new Date().toLocaleString('zh-CN'),
        status: fillForm.overdueAmount > 0 || fillForm.legalDisputeCount > 0 ? '待复核' : '成功'
      })

      fillReportDialogVisible.value = false
      ElMessage.success('在线填报已提交')
    }

    // 文件上传相关逻辑
    const uploadDialogVisible = ref(false)
    const uploadHistory = ref([
      {
        fileName: '2023年度财务报表.xlsx',
        fileType: '财务文件',
        uploadTime: '2024-01-15 14:30:25',
        status: '成功'
      },
      {
        fileName: '业务合同汇总.pdf',
        fileType: '业务文件',
        uploadTime: '2024-01-14 10:15:42',
        status: '成功'
      },
      {
        fileName: '客户数据.csv',
        fileType: '业务文件',
        uploadTime: '2024-01-13 16:20:18',
        status: '处理中'
      }
    ])

    const openUploadDialog = () => {
      uploadDialogVisible.value = true
    }

    const uploadFinancialFiles = () => {
      ElMessage.info('财务文件上传功能开发中...')
    }

    const uploadBusinessFiles = () => {
      ElMessage.info('业务文件上传功能开发中...')
    }

    const getFileTypeTag = (fileType) => {
      const typeMap = {
        '财务文件': 'primary',
        '业务文件': 'success',
        '在线填报': 'warning',
        '其他文件': 'info'
      }
      return typeMap[fileType] || 'info'
    }

    const downloadFile = (file) => {
      ElMessage.info(`下载文件: ${file.fileName}`)
    }

    onMounted(() => {
      const profile = getCurrentUserProfile()
      if (profile?.userType === 'enterprise') {
        enterpriseInfo.value = {
          ...enterpriseInfo.value,
          name: profile.organization || enterpriseInfo.value.name,
          industry: profile.industry || enterpriseInfo.value.industry
        }
      }
    })

    return {
      activeTab,
      editDialogVisible,
      editForm,
      enterpriseInfo,
      fillForm,
      fillMetrics,
      fillReportDialogVisible,
      uploadHistory,
      handleCloseEditDialog,
      openEditDialog,
      openFillDialog,
      saveEnterpriseInfo,
      openUploadDialog,
      submitFillReport,
      uploadFinancialFiles,
      uploadBusinessFiles,
      getFileTypeTag,
      downloadFile
    }
  }
}
</script>

<style scoped>
.enterprise-dashboard {
  padding: 0;
}

.welcome-card {
  margin-bottom: 20px;
}

.welcome-content h2 {
  color: #303133;
  margin-bottom: 10px;
}

.welcome-content p {
  color: #606266;
}

.info-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.header-actions {
  display: inline-flex;
  gap: 12px;
  align-items: center;
}

.info-item {
  margin-bottom: 15px;
}

.info-item label {
  font-weight: 600;
  color: #606266;
  margin-right: 10px;
}

.info-item span {
  color: #303133;
}

.content-area {
  background: white;
  border-radius: 4px;
  padding: 20px;
}

.upload-card {
  margin-bottom: 20px;
}

.upload-content {
  padding: 10px 0;
}

.upload-section {
  text-align: center;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.upload-section:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.upload-section h4 {
  margin-bottom: 10px;
  color: #303133;
  font-size: 16px;
}

.upload-desc {
  color: #606266;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.upload-history {
  margin-top: 20px;
}

.upload-history h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
}

.enterprise-fill-form :deep(.el-input-number),
.enterprise-fill-form :deep(.el-select),
.enterprise-fill-form :deep(.el-date-editor) {
  width: 100%;
}

.fill-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 12px 0 18px;
}

.metric-item {
  padding: 14px 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #f8fafc;
}

.metric-item span {
  display: block;
  color: #606266;
  font-size: 13px;
  margin-bottom: 6px;
}

.metric-item strong {
  color: #303133;
  font-size: 20px;
}
</style>
