<template>
  <div class="research-dashboard">

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

    <div class="content-area">
      <div v-show="activeTab === 'composer'">
        <AlgorithmComposer />
      </div>

      <div v-show="activeTab === 'upload'">
        <AlgorithmUpload />
      </div>

      <div v-show="activeTab === 'manage'">
        <AlgorithmManagement />
      </div>

      <div v-show="activeTab === 'test'">
        <AlgorithmTesting />
      </div>

      <div v-show="activeTab === 'data'">
        <ResearchDataWorkbench />
      </div>
    </div>
  </div>
</template>

<script>
import { Check, Clock, Cpu, DataLine } from '@element-plus/icons-vue'
import AlgorithmUpload from './components/AlgorithmUpload.vue'
import AlgorithmComposer from './components/AlgorithmComposer.vue'
import AlgorithmManagement from './components/AlgorithmManagement.vue'
import AlgorithmTesting from './components/AlgorithmTesting.vue'
import ResearchDataWorkbench from './components/ResearchDataWorkbench.vue'
import { useFeatureAccess } from '@/composables/useFeatureAccess'
import { getFeatureItems } from '@/config/userAccess'

const RESEARCH_FEATURES = getFeatureItems('research')

export default {
  name: 'ResearchDashboard',
  components: {
    AlgorithmComposer,
    AlgorithmUpload,
    AlgorithmManagement,
    AlgorithmTesting,
    Check,
    Clock,
    Cpu,
    DataLine,
    ResearchDataWorkbench
  },
  setup() {
    const { activeTab } = useFeatureAccess('research', RESEARCH_FEATURES, 'upload')

    const stats = {
      totalAlgorithms: 28,
      deployedAlgorithms: 15,
      testingAlgorithms: 5,
      totalPredictions: 125430
    }

    return {
      activeTab,
      stats
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

@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 16px;
  }
}
</style>