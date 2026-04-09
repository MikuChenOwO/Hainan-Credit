<template>
  <div class="algorithm-management">
    <!-- 算法管理头部 -->
    <div class="management-header">
      <div class="header-info">
        <h3>算法管理中心</h3>
        <p>管理已上传的算法模型，支持版本控制、部署管理和性能监控</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="openUploadDialog">
          <el-icon><Upload /></el-icon>
          上传新算法
        </el-button>
        <el-button @click="refreshAlgorithms">
          <el-icon><Refresh /></el-icon>
          刷新列表
        </el-button>
      </div>
    </div>

    <!-- 算法统计概览 -->
    <div class="stats-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <el-icon size="48" color="#409EFF"><Cpu /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ algorithmStats.total }}</div>
                <div class="stat-label">算法总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <el-icon size="48" color="#67C23A"><Check /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ algorithmStats.deployed }}</div>
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
                <div class="stat-value">{{ algorithmStats.testing }}</div>
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
                <div class="stat-value">{{ algorithmStats.accuracy }}%</div>
                <div class="stat-label">平均准确率</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 算法列表 -->
    <el-card class="algorithm-list-card">
      <template #header>
        <div class="list-header">
          <span>算法列表</span>
          <div class="list-actions">
            <el-input 
              v-model="searchKeyword" 
              placeholder="搜索算法名称或描述" 
              size="small" 
              style="width: 200px; margin-right: 10px;"
              prefix-icon="Search"
            />
            <el-select v-model="filterStatus" placeholder="状态筛选" size="small" style="width: 120px;">
              <el-option label="全部状态" value="all" />
              <el-option label="已部署" value="deployed" />
              <el-option label="测试中" value="testing" />
              <el-option label="开发中" value="developing" />
            </el-select>
          </div>
        </div>
      </template>

      <el-table :data="filteredAlgorithms" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="算法名称" width="200">
          <template #default="{ row }">
            <div class="algorithm-name">
              <el-icon><Cpu /></el-icon>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="type" label="算法类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getAlgorithmTypeTag(row.type)">{{ getAlgorithmTypeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="version" label="版本" width="100" />
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="accuracy" label="准确率" width="100">
          <template #default="{ row }">
            <span :class="{ 'high-accuracy': row.accuracy >= 90, 'medium-accuracy': row.accuracy >= 80 && row.accuracy < 90 }">
              {{ row.accuracy }}%
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="uploadTime" label="上传时间" width="180" />
        
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="viewAlgorithm(row)">查看</el-button>
            <el-button size="small" type="primary" @click="testAlgorithm(row)">测试</el-button>
            <el-button size="small" type="success" @click="deployAlgorithm(row)" v-if="row.status !== 'deployed'">部署</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 算法详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="算法详情" width="800px">
      <div v-if="selectedAlgorithm" class="algorithm-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="算法名称">{{ selectedAlgorithm.name }}</el-descriptions-item>
          <el-descriptions-item label="算法类型">{{ getAlgorithmTypeText(selectedAlgorithm.type) }}</el-descriptions-item>
          <el-descriptions-item label="版本号">{{ selectedAlgorithm.version }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTag(selectedAlgorithm.status)">{{ getStatusText(selectedAlgorithm.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="准确率">{{ selectedAlgorithm.accuracy }}%</el-descriptions-item>
          <el-descriptions-item label="上传时间">{{ selectedAlgorithm.uploadTime }}</el-descriptions-item>
          <el-descriptions-item label="适用场景" :span="2">
            <el-tag 
              v-for="scenario in selectedAlgorithm.scenarios" 
              :key="scenario" 
              style="margin-right: 5px;"
            >
              {{ scenario }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="算法描述" :span="2">{{ selectedAlgorithm.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Cpu, Check, Clock, DataLine, Upload, Refresh } from '@element-plus/icons-vue'

export default {
  name: 'AlgorithmManagement',
  components: {
    Cpu, Check, Clock, DataLine, Upload, Refresh
  },
  setup() {
    const loading = ref(false)
    const searchKeyword = ref('')
    const filterStatus = ref('all')
    const detailDialogVisible = ref(false)
    const selectedAlgorithm = ref(null)

    // 算法统计
    const algorithmStats = reactive({
      total: 0,
      deployed: 0,
      testing: 0,
      accuracy: 0
    })

    // 算法数据
    const algorithms = ref([
      {
        id: 1,
        name: 'XGBoost信用评分',
        type: 'ml',
        version: 'v1.2.0',
        status: 'deployed',
        accuracy: 92.5,
        uploadTime: '2024-01-15 10:30:00',
        scenarios: ['个人信用评估', '企业风险评估'],
        description: '基于XGBoost的集成学习算法，适用于信用评分场景'
      },
      {
        id: 2,
        name: 'LSTM风险预测',
        type: 'dl',
        version: 'v1.0.1',
        status: 'testing',
        accuracy: 88.3,
        uploadTime: '2024-01-14 14:20:00',
        scenarios: ['趋势预测', '风险预警'],
        description: '长短期记忆网络模型，用于时间序列风险预测'
      },
      {
        id: 3,
        name: '随机森林分类器',
        type: 'ml',
        version: 'v2.1.0',
        status: 'developing',
        accuracy: 85.7,
        uploadTime: '2024-01-13 09:15:00',
        scenarios: ['欺诈检测', '异常识别'],
        description: '随机森林算法，适用于分类和异常检测任务'
      }
    ])

    // 计算属性
    const filteredAlgorithms = computed(() => {
      return algorithms.value.filter(algorithm => {
        const matchesSearch = algorithm.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                           algorithm.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
        const matchesStatus = filterStatus.value === 'all' || algorithm.status === filterStatus.value
        return matchesSearch && matchesStatus
      })
    })

    // 方法
    const refreshAlgorithms = () => {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        loading.value = false
        ElMessage.success('算法列表已刷新')
      }, 1000)
    }

    const openUploadDialog = () => {
      ElMessage.info('跳转到算法上传页面')
    }

    const viewAlgorithm = (algorithm) => {
      selectedAlgorithm.value = algorithm
      detailDialogVisible.value = true
    }

    const testAlgorithm = (algorithm) => {
      ElMessage.info(`开始测试算法: ${algorithm.name}`)
    }

    const deployAlgorithm = (algorithm) => {
      ElMessageBox.confirm(`确定要部署算法"${algorithm.name}"吗？`, '部署确认', {
        confirmButtonText: '确定部署',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        algorithm.status = 'deployed'
        ElMessage.success('算法部署成功')
      })
    }

    const getAlgorithmTypeTag = (type) => {
      const typeMap = {
        'ml': 'primary',
        'dl': 'success',
        'statistical': 'warning',
        'llm': 'info',
        'ensemble': 'danger'
      }
      return typeMap[type] || 'info'
    }

    const getAlgorithmTypeText = (type) => {
      const textMap = {
        'ml': '机器学习',
        'dl': '深度学习',
        'statistical': '传统统计',
        'llm': '大语言模型',
        'ensemble': '集成学习'
      }
      return textMap[type] || '未知类型'
    }

    const getStatusTag = (status) => {
      const statusMap = {
        'deployed': 'success',
        'testing': 'warning',
        'developing': 'info'
      }
      return statusMap[status] || 'info'
    }

    const getStatusText = (status) => {
      const textMap = {
        'deployed': '已部署',
        'testing': '测试中',
        'developing': '开发中'
      }
      return textMap[status] || '未知状态'
    }

    // 初始化统计
    onMounted(() => {
      algorithmStats.total = algorithms.value.length
      algorithmStats.deployed = algorithms.value.filter(a => a.status === 'deployed').length
      algorithmStats.testing = algorithms.value.filter(a => a.status === 'testing').length
      algorithmStats.accuracy = Math.round(algorithms.value.reduce((sum, a) => sum + a.accuracy, 0) / algorithms.value.length)
    })

    return {
      loading,
      searchKeyword,
      filterStatus,
      algorithmStats,
      algorithms,
      filteredAlgorithms,
      detailDialogVisible,
      selectedAlgorithm,
      refreshAlgorithms,
      openUploadDialog,
      viewAlgorithm,
      testAlgorithm,
      deployAlgorithm,
      getAlgorithmTypeTag,
      getAlgorithmTypeText,
      getStatusTag,
      getStatusText
    }
  }
}
</script>

<style scoped>
.algorithm-management {
  padding: 20px;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-info h3 {
  margin: 0 0 8px 0;
  color: #303133;
}

.header-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.stats-overview {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-info {
  margin-left: 15px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.algorithm-list-card {
  border-radius: 8px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.algorithm-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.high-accuracy {
  color: #67C23A;
  font-weight: bold;
}

.medium-accuracy {
  color: #E6A23C;
  font-weight: bold;
}

.algorithm-detail {
  padding: 10px 0;
}
</style>