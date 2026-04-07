<template>
  <div class="enterprise-dashboard">
    <el-card class="welcome-card">
      <div class="welcome-content">
        <h2>企业信用中心</h2>
        <p>基于 AI 技术的企业信用评估与风险监控</p>
      </div>
    </el-card>

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
    EnterpriseRiskPrediction
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
      handleCloseEditDialog,
      openEditDialog,
      saveEnterpriseInfo
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
</style>
