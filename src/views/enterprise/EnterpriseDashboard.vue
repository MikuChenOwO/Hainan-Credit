<template>
  <div class="enterprise-dashboard">
    <!-- 欢迎区域 -->
    <el-card class="welcome-card">
      <div class="welcome-content">
        <h2>企业信用中心</h2>
        <p>基于AI技术的企业信用评估与风险监控</p>
      </div>
    </el-card>

    <!-- 企业基本信息 -->
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
            <span>{{ enterpriseInfo.registeredCapital }}万元</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 功能卡片区域 -->
    <div class="function-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card 
            class="function-card" 
            :class="{ 'active': activeTab === 'risk' }"
            @click="activeTab = 'risk'"
          >
            <div class="card-content">
              <el-icon size="48" :color="activeTab === 'risk' ? '#E6A23C' : '#E6A23C'"><Warning /></el-icon>
              <h3>风险预测</h3>
              <p>企业信用风险评估</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card 
            class="function-card" 
            :class="{ 'active': activeTab === 'finance' }"
            @click="activeTab = 'finance'"
          >
            <div class="card-content">
              <el-icon size="48" :color="activeTab === 'finance' ? '#409EFF' : '#409EFF'"><Money /></el-icon>
              <h3>财务分析</h3>
              <p>财务报表分析</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card 
            class="function-card" 
            :class="{ 'active': activeTab === 'monitor' }"
            @click="activeTab = 'monitor'"
          >
            <div class="card-content">
              <el-icon size="48" :color="activeTab === 'monitor' ? '#67C23A' : '#67C23A'"><Monitor /></el-icon>
              <h3>风险监控</h3>
              <p>实时风险监控</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card 
            class="function-card" 
            :class="{ 'active': activeTab === 'report' }"
            @click="activeTab = 'report'"
          >
            <div class="card-content">
              <el-icon size="48" :color="activeTab === 'report' ? '#909399' : '#909399'"><Document /></el-icon>
              <h3>信用报告</h3>
              <p>生成信用报告</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 风险预测内容 -->
      <div v-show="activeTab === 'risk'">
        <EnterpriseRiskPrediction />
      </div>
      
      <!-- 财务分析内容 -->
      <div v-show="activeTab === 'finance'">
        <EnterpriseFinancialAnalysis />
      </div>
      
      <!-- 风险监控内容 -->
      <div v-show="activeTab === 'monitor'">
        <EnterpriseRiskMonitoring />
      </div>
      
      <!-- 信用报告内容 -->
      <div v-show="activeTab === 'report'">
        <EnterpriseCreditReport />
      </div>
    </div>

    <!-- 编辑企业信息对话框 -->
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import EnterpriseRiskPrediction from './components/EnterpriseRiskPrediction.vue'
import EnterpriseFinancialAnalysis from './components/EnterpriseFinancialAnalysis.vue'
import EnterpriseRiskMonitoring from './components/EnterpriseRiskMonitoring.vue'
import EnterpriseCreditReport from './components/EnterpriseCreditReport.vue'

export default {
  name: 'EnterpriseDashboard',
  components: {
    ...ElementPlusIconsVue,
    EnterpriseRiskPrediction,
    EnterpriseFinancialAnalysis,
    EnterpriseRiskMonitoring,
    EnterpriseCreditReport
  },
  setup() {
    const activeTab = ref('risk')
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
      // 将当前信息复制到编辑表单
      Object.assign(editForm, enterpriseInfo.value)
      editDialogVisible.value = true
    }
    
    const handleCloseEditDialog = (done) => {
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
      // 保存编辑的信息
      Object.assign(enterpriseInfo.value, editForm)
      editDialogVisible.value = false
      ElMessage.success('企业信息更新成功')
    }
    
    // 风险监控相关逻辑
    const monitorFilters = reactive({
      industry: '',
      riskLevel: '',
      region: ''
    })
    
    const monitorData = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    
    // 模拟监控数据
    const mockMonitorData = [
      {
        id: 1,
        companyName: '海南科技有限公司',
        industry: '信息技术',
        region: '海口市',
        riskLevel: 'low',
        riskScore: 85,
        lastUpdate: '2024-01-15 10:30',
        status: '正常'
      },
      {
        id: 2,
        companyName: '三亚旅游发展有限公司',
        industry: '旅游服务',
        region: '三亚市',
        riskLevel: 'medium',
        riskScore: 65,
        lastUpdate: '2024-01-15 09:45',
        status: '关注'
      },
      {
        id: 3,
        companyName: '儋州制造企业',
        industry: '制造业',
        region: '儋州市',
        riskLevel: 'high',
        riskScore: 45,
        lastUpdate: '2024-01-15 08:20',
        status: '预警'
      },
      {
        id: 4,
        companyName: '琼海金融服务公司',
        industry: '金融服务',
        region: '琼海市',
        riskLevel: 'low',
        riskScore: 90,
        lastUpdate: '2024-01-15 11:15',
        status: '正常'
      },
      {
        id: 5,
        companyName: '文昌房地产集团',
        industry: '房地产',
        region: '文昌市',
        riskLevel: 'critical',
        riskScore: 30,
        lastUpdate: '2024-01-15 14:00',
        status: '高风险'
      }
    ]
    
    const searchMonitorData = () => {
      loading.value = true
      // 模拟API调用延迟
      setTimeout(() => {
        // 模拟筛选逻辑
        let filteredData = [...mockMonitorData]
        
        if (monitorFilters.industry) {
          filteredData = filteredData.filter(item => item.industry.includes(monitorFilters.industry))
        }
        
        if (monitorFilters.riskLevel) {
          filteredData = filteredData.filter(item => item.riskLevel === monitorFilters.riskLevel)
        }
        
        if (monitorFilters.region) {
          filteredData = filteredData.filter(item => item.region.includes(monitorFilters.region))
        }
        
        monitorData.value = filteredData
        total.value = filteredData.length
        loading.value = false
        
        ElMessage.success(`查询到 ${filteredData.length} 条记录`)
      }, 500)
    }
    
    const exportMonitorData = () => {
      ElMessage.success('数据导出功能正在开发中...')
    }
    
    const viewDetail = (row) => {
      ElMessage.info(`查看企业详情：${row.companyName}`)
    }
    
    const getRiskTagType = (level) => {
      const types = {
        low: 'success',
        medium: 'warning',
        high: 'danger',
        critical: 'danger'
      }
      return types[level] || 'info'
    }
    
    const getRiskLevelText = (level) => {
      const texts = {
        low: '低风险',
        medium: '中风险',
        high: '高风险',
        critical: '极高风险'
      }
      return texts[level] || '未知'
    }
    
    const handleSizeChange = (size) => {
      pageSize.value = size
      searchMonitorData()
    }
    
    const handleCurrentChange = (page) => {
      currentPage.value = page
      searchMonitorData()
    }
    
    // 初始化时加载数据
    onMounted(() => {
      searchMonitorData()
    })
    
    return {
      activeTab,
      editDialogVisible,
      enterpriseInfo,
      editForm,
      monitorFilters,
      monitorData,
      loading,
      currentPage,
      pageSize,
      total,
      openEditDialog,
      handleCloseEditDialog,
      saveEnterpriseInfo,
      searchMonitorData,
      exportMonitorData,
      viewDetail,
      getRiskTagType,
      getRiskLevelText,
      handleSizeChange,
      handleCurrentChange
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

.function-cards {
  margin-bottom: 20px;
}

.function-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 165px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.function-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.function-card.active {
  border: 2px solid #409EFF;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(64, 158, 255, 0.2);
}

.function-card.active .card-content h3 {
  color: #409EFF;
  font-weight: 600;
}

.function-card.active .card-content p {
  color: #606266;
}

.card-content {
  text-align: center;
}

.card-content h3 {
  margin: 15px 0 10px;
  color: #303133;
}

.card-content p {
  color: #909399;
  font-size: 14px;
}

.content-area {
  background: white;
  border-radius: 4px;
  padding: 20px;
}

.tab-content {
  padding: 20px;
  min-height: 300px;
}

.tab-content h3 {
  color: #303133;
  margin-bottom: 15px;
}

.tab-content p {
  color: #606266;
  margin-bottom: 20px;
}

.tab-content .el-progress {
  width: 200px;
}

/* 风险监控样式 */
.monitor-content {
  padding: 0;
}

.filter-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-weight: 600;
  color: #606266;
  font-size: 14px;
  margin-bottom: 5px;
}

.filter-item .el-select {
  width: 100%;
}

/* 修复下拉框显示问题 */
.filter-item .el-select .el-input {
  width: 100% !important;
}

.filter-item .el-select .el-input__inner {
  height: 36px;
  line-height: 36px;
  width: 100% !important;
  min-width: 120px;
}

.filter-item .el-select .el-input__suffix {
  line-height: 36px;
}

/* 确保下拉框选项显示完整 */
.el-select-dropdown {
  min-width: 200px !important;
}

.el-select-dropdown__item {
  padding: 0 20px;
  height: 34px;
  line-height: 34px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-select-dropdown__item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
}

/* 选中项显示优化 */
.el-select .el-input__inner {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.monitor-data {
  margin-top: 0;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

/* 确保下拉框选项显示完整 */
.el-select-dropdown {
  min-width: 120px;
}

.el-select-dropdown__item {
  padding: 0 20px;
  height: 34px;
  line-height: 34px;
}

.el-select-dropdown__item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 表格样式优化 */
.el-table {
  font-size: 14px;
}

.el-table .el-table__cell {
  padding: 12px 0;
}

.el-table .el-table__header th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #303133;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-section .el-col {
    margin-bottom: 15px;
  }
  
  .filter-item {
    gap: 6px;
  }
  
  .filter-item label {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .filter-section {
    padding: 15px;
  }
  
  .filter-section .el-col {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .data-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .pagination-container {
    text-align: center;
  }
}
</style>