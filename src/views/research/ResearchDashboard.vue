<template>
  <div class="research-dashboard">
    <!-- 欢迎区域 -->
    <el-card class="welcome-card">
      <div class="welcome-content">
        <h2>科研算法中心</h2>
        <p>信用风险算法研发、测试与部署平台</p>
      </div>
    </el-card>

    <!-- 统计概览 -->
    <el-row :gutter="20" class="stats-overview">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon size="48" color="#409EFF"><Cpu /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalAlgorithms }}</div>
              <div class="stat-label">已开发算法</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon size="48" color="#67C23A"><Check /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.deployedAlgorithms }}</div>
              <div class="stat-label">已部署算法</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon size="48" color="#E6A23C"><Clock /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.testingAlgorithms }}</div>
              <div class="stat-label">测试中算法</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon size="48" color="#909399"><DataLine /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalPredictions }}</div>
              <div class="stat-label">总预测次数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 功能卡片区域 -->
    <div class="function-cards">
      <div class="flex-container">
        <!-- 数据管理卡片 -->
        <el-card 
          class="function-card flex-item" 
          :class="{ 'active': activeTab === 'data' }"
          @click="activeTab = 'data'"
        >
          <div class="card-content">
            <el-icon size="32" :color="activeTab === 'data' ? '#FF6B6B' : '#FF6B6B'"><DataBoard /></el-icon>
            <h3>数据管理</h3>
            <p>数据上传与申请</p>
          </div>
        </el-card>
        
        <!-- 算法组合器卡片 -->
        <el-card 
          class="function-card flex-item" 
          :class="{ 'active': activeTab === 'composer' }"
          @click="activeTab = 'composer'"
        >
          <div class="card-content">
            <el-icon size="32" :color="activeTab === 'composer' ? '#8A2BE2' : '#8A2BE2'"><Star /></el-icon>
            <h3>算法组合器</h3>
            <p>拖拽式算法构建</p>
          </div>
        </el-card>
        
        <!-- 算法上传卡片 -->
        <el-card 
          class="function-card flex-item" 
          :class="{ 'active': activeTab === 'upload' }"
          @click="activeTab = 'upload'"
        >
          <div class="card-content">
            <el-icon size="32" :color="activeTab === 'upload' ? '#409EFF' : '#409EFF'"><Upload /></el-icon>
            <h3>算法上传</h3>
            <p>上传新的风险算法</p>
          </div>
        </el-card>
        
        <!-- 算法管理卡片 -->
        <el-card 
          class="function-card flex-item" 
          :class="{ 'active': activeTab === 'manage' }"
          @click="activeTab = 'manage'"
        >
          <div class="card-content">
            <el-icon size="32" :color="activeTab === 'manage' ? '#67C23A' : '#67C23A'"><Setting /></el-icon>
            <h3>算法管理</h3>
            <p>管理已有算法</p>
          </div>
        </el-card>
        
        <!-- 算法测试卡片 -->
        <el-card 
          class="function-card flex-item" 
          :class="{ 'active': activeTab === 'test' }"
          @click="activeTab = 'test'"
        >
          <div class="card-content">
            <el-icon size="32" :color="activeTab === 'test' ? '#E6A23C' : '#E6A23C'"><Search /></el-icon>
            <h3>算法测试</h3>
            <p>测试算法性能</p>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 算法组合器内容 -->
      <div v-show="activeTab === 'composer'">
        <AlgorithmComposer />
      </div>
      
      <!-- 算法上传内容 -->
      <div v-show="activeTab === 'upload'">
        <AlgorithmUpload />
      </div>
      
      <!-- 算法管理内容 -->
      <div v-show="activeTab === 'manage'">
        <div class="placeholder-content">
          <h3>算法管理</h3>
          <p>算法管理功能开发中...</p>
        </div>
      </div>
      
      <!-- 算法测试内容 -->
      <div v-show="activeTab === 'test'">
        <div class="placeholder-content">
          <h3>算法测试</h3>
          <p>算法测试功能开发中...</p>
        </div>
      </div>
      
      <!-- 数据管理内容 -->
      <div v-show="activeTab === 'data'">
        <div class="data-management">
          <h3>数据管理</h3>
          
          <!-- 数据上传功能 -->
          <el-card class="data-upload-card">
            <template #header>
              <div class="card-header">
                <span>数据上传</span>
                <el-button type="primary" @click="downloadTemplate">下载数据模板</el-button>
              </div>
            </template>
            
            <div class="upload-section">
              <p>请先下载数据模板，填写数据后上传Excel或CSV文件</p>
              
              <el-upload
                class="upload-demo"
                drag
                action="#"
                :auto-upload="false"
                :on-change="handleFileChange"
                :file-list="fileList"
                accept=".xlsx,.xls,.csv"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  将Excel或CSV文件拖到此处，或<em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    只能上传xlsx/xls/csv文件，且不超过10MB
                  </div>
                </template>
              </el-upload>
              
              <div class="upload-actions" v-if="fileList.length > 0">
                <el-button type="primary" @click="handleUpload">上传数据</el-button>
                <el-button @click="fileList = []">清空文件</el-button>
              </div>
            </div>
          </el-card>
          
          <!-- 数据申请功能 -->
          <el-card class="data-request-card">
            <template #header>
              <div class="card-header">
                <span>数据申请</span>
              </div>
            </template>
            
            <div class="request-section">
              <p>如需访问系统核心数据，请向系统管理员提交申请</p>
              
              <el-form :model="requestForm" label-width="120px">
                <el-form-item label="申请数据类型">
                  <el-select v-model="requestForm.dataType" placeholder="请选择数据类型" style="width: 100%">
                    <el-option label="企业信用数据" value="enterprise" />
                    <el-option label="个人信用数据" value="personal" />
                    <el-option label="行业统计数据" value="industry" />
                    <el-option label="风险评估数据" value="risk" />
                    <el-option label="其他数据" value="other" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="申请用途">
                  <el-input
                    v-model="requestForm.purpose"
                    type="textarea"
                    :rows="3"
                    placeholder="请详细说明数据用途和研究目的"
                  />
                </el-form-item>
                
                <el-form-item label="申请期限">
                  <el-date-picker
                    v-model="requestForm.duration"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%"
                  />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="submitRequest">提交申请</el-button>
                  <el-button @click="resetRequestForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AlgorithmUpload from './components/AlgorithmUpload.vue'
import AlgorithmComposer from './components/AlgorithmComposer.vue'
import { Cpu, Check, Clock, DataLine, Star, Upload, Setting, Search, DataBoard, UploadFilled } from '@element-plus/icons-vue'

export default {
  name: 'ResearchDashboard',
  components: {
    AlgorithmUpload,
    AlgorithmComposer,
    Cpu,
    Check,
    Clock,
    DataLine,
    Star,
    Upload,
    Setting,
    Search,
    DataBoard,
    UploadFilled
  },
  setup() {
    const activeTab = ref('upload')
    
    const stats = ref({
      totalAlgorithms: 28,
      deployedAlgorithms: 15,
      testingAlgorithms: 5,
      totalPredictions: 125430
    })
    
    // 数据上传相关
    const fileList = ref([])
    
    // 数据申请表单
    const requestForm = reactive({
      dataType: '',
      purpose: '',
      duration: []
    })
    
    // 下载数据模板
    const downloadTemplate = () => {
      // 模拟下载Excel/CSV模板
      const templateData = [
        ['企业名称', '统一信用代码', '行业类型', '注册资本(万元)', '风险等级'],
        ['示例企业1', '91460000MA5TXXXXXX', '信息技术', '1000', '低风险'],
        ['示例企业2', '91460000MA5TYYYYYY', '金融服务', '5000', '中风险'],
        ['示例企业3', '91460000MA5TZZZZZZ', '制造业', '2000', '高风险']
      ]
      
      // 这里应该实现实际的Excel/CSV文件下载
      // 暂时用消息提示模拟
      ElMessage.success('数据模板下载成功！请按照模板格式填写数据')
      
      // 实际实现时可以使用第三方库如xlsx来生成Excel文件或使用其他方式生成CSV文件
      // import * as XLSX from 'xlsx'
      // const ws = XLSX.utils.aoa_to_sheet(templateData)
      // const wb = XLSX.utils.book_new()
      // XLSX.utils.book_append_sheet(wb, ws, '数据模板')
      // XLSX.writeFile(wb, '科研数据模板.xlsx')
    }
    
    // 处理文件选择
    const handleFileChange = (file, fileList) => {
      if (file.raw) {
        // 检查文件类型和大小
        const isExcel = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                       file.raw.type === 'application/vnd.ms-excel'
        const isCsv = file.raw.type === 'text/csv' || 
                     file.raw.type === 'application/csv' ||
                     file.name.toLowerCase().endsWith('.csv')
        const isSupported = isExcel || isCsv
        const isLt10M = file.raw.size / 1024 / 1024 < 10
        
        if (!isSupported) {
          ElMessage.error('只能上传Excel或CSV文件！')
          return false
        }
        if (!isLt10M) {
          ElMessage.error('文件大小不能超过10MB！')
          return false
        }
        
        ElMessage.success('文件选择成功，请点击上传按钮提交数据')
      }
    }
    
    // 处理数据上传
    const handleUpload = async () => {
      if (fileList.value.length === 0) {
        ElMessage.warning('请先选择要上传的文件')
        return
      }
      
      try {
        // 模拟上传过程
        ElMessage.info('正在上传数据...')
        
        // 这里应该实现实际的Excel/CSV文件解析和上传逻辑
        // 可以使用xlsx库解析Excel文件，使用papaparse库解析CSV文件
        // import * as XLSX from 'xlsx'
        // import Papa from 'papaparse'
        // const file = fileList.value[0].raw
        // const fileName = file.name.toLowerCase()
        // if (fileName.endsWith('.csv')) {
        //   // 使用PapaParse解析CSV文件
        //   const reader = new FileReader()
        //   reader.onload = (e) => {
        //     const csvData = Papa.parse(e.target.result, { header: true })
        //     // 处理CSV数据
        //   }
        //   reader.readAsText(file)
        // } else {
        //   // 使用xlsx库解析Excel文件
        //   const reader = new FileReader()
        //   reader.onload = (e) => {
        //     const data = new Uint8Array(e.target.result)
        //     const workbook = XLSX.read(data, { type: 'array' })
        //     // 处理Excel数据
        //   }
        //   reader.readAsArrayBuffer(file)
        // }
        
        // 模拟上传成功
        setTimeout(() => {
          ElMessage.success('数据上传成功！系统将自动进行数据验证和处理')
          fileList.value = []
        }, 2000)
        
      } catch (error) {
        ElMessage.error('数据上传失败：' + error.message)
      }
    }
    
    // 提交数据申请
    const submitRequest = async () => {
      if (!requestForm.dataType) {
        ElMessage.warning('请选择申请数据类型')
        return
      }
      if (!requestForm.purpose) {
        ElMessage.warning('请填写申请用途')
        return
      }
      
      try {
        await ElMessageBox.confirm(
          '确认提交数据申请吗？系统管理员将在3个工作日内处理您的申请。',
          '确认提交',
          {
            confirmButtonText: '确认提交',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 模拟提交申请
        ElMessage.success('数据申请提交成功！申请编号：RES' + Date.now())
        
        // 重置表单
        resetRequestForm()
        
      } catch (error) {
        // 用户取消提交
        ElMessage.info('已取消提交')
      }
    }
    
    // 重置申请表单
    const resetRequestForm = () => {
      requestForm.dataType = ''
      requestForm.purpose = ''
      requestForm.duration = []
    }
    
    return {
      activeTab,
      stats,
      fileList,
      requestForm,
      downloadTemplate,
      handleFileChange,
      handleUpload,
      submitRequest,
      resetRequestForm
    }
  }
}
</script>

<style scoped>
.research-dashboard {
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

.stats-overview {
  margin-bottom: 20px;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.function-cards {
  margin-bottom: 30px;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: space-between;
}

.flex-item {
  flex: 1;
  min-width: 180px;
  max-width: calc(20% - 12px);
}

.function-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 120px;
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
  height: 10px;
}


.card-content h3 {
  margin: 8px 0 6px;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.card-content p {
  color: #909399;
  font-size: 11px;
  line-height: 1.3;
}

.content-area {
  background: white;
  border-radius: 4px;
  padding: 20px;
}

.placeholder-content {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.placeholder-content h3 {
  margin-bottom: 15px;
  color: #606266;
}

/* 数据管理样式 */
.data-management {
  padding: 0;
}

.data-management h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

.data-upload-card,
.data-request-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.upload-section,
.request-section {
  padding: 20px 0;
}

.upload-section p,
.request-section p {
  color: #606266;
  margin-bottom: 20px;
  font-size: 14px;
}

.upload-demo {
  margin: 20px 0;
}

.upload-actions {
  margin-top: 20px;
  text-align: center;
}

.upload-actions .el-button {
  margin: 0 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .data-management h3 {
    font-size: 20px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .upload-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .upload-actions .el-button {
    margin: 5px 0;
  }
}
</style>