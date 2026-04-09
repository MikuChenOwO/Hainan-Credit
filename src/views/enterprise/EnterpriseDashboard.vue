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
          <el-button type="primary" link @click="openUploadDialog">上传文件</el-button>
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
                <el-tag :type="scope.row.status === '成功' ? 'success' : 'warning'">{{ scope.row.status }}</el-tag>
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
import { onMounted, reactive, ref } from 'vue'
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
      uploadHistory,
      handleCloseEditDialog,
      openEditDialog,
      saveEnterpriseInfo,
      openUploadDialog,
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
</style>