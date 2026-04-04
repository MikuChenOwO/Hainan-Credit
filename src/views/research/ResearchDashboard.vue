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
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="function-card" @click="activeTab = 'composer'">
            <div class="card-content">
              <el-icon size="48" color="#8A2BE2"><Star /></el-icon>
              <h3>算法组合器</h3>
              <p>拖拽式算法构建</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="function-card" @click="activeTab = 'upload'">
            <div class="card-content">
              <el-icon size="48" color="#409EFF"><Upload /></el-icon>
              <h3>算法上传</h3>
              <p>上传新的风险算法</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="function-card" @click="activeTab = 'manage'">
            <div class="card-content">
              <el-icon size="48" color="#67C23A"><Setting /></el-icon>
              <h3>算法管理</h3>
              <p>管理已有算法</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="function-card" @click="activeTab = 'test'">
            <div class="card-content">
              <el-icon size="48" color="#E6A23C"><Search /></el-icon>
              <h3>算法测试</h3>
              <p>测试算法性能</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <el-tabs v-model="activeTab" type="card">
        <!-- 算法组合器标签页 -->
        <el-tab-pane label="算法组合器" name="composer">
          <AlgorithmComposer />
        </el-tab-pane>
        
        <!-- 算法上传标签页 -->
        <el-tab-pane label="算法上传" name="upload">
          <AlgorithmUpload />
        </el-tab-pane>
        
        <!-- 算法管理标签页 -->
        <el-tab-pane label="算法管理" name="manage">
          <div class="placeholder-content">
            <h3>算法管理</h3>
            <p>算法管理功能开发中...</p>
          </div>
        </el-tab-pane>
        
        <!-- 算法测试标签页 -->
        <el-tab-pane label="算法测试" name="test">
          <div class="placeholder-content">
            <h3>算法测试</h3>
            <p>算法测试功能开发中...</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import AlgorithmUpload from './components/AlgorithmUpload.vue'
import AlgorithmComposer from './components/AlgorithmComposer.vue'
import { Cpu, Check, Clock, DataLine, Star, Upload, Setting, Search } from '@element-plus/icons-vue'

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
    Search
  },
  setup() {
    const activeTab = ref('upload')
    
    const stats = ref({
      totalAlgorithms: 28,
      deployedAlgorithms: 15,
      testingAlgorithms: 5,
      totalPredictions: 125430
    })
    
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

.placeholder-content {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.placeholder-content h3 {
  margin-bottom: 15px;
  color: #606266;
}
</style>