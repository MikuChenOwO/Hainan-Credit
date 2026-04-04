<template>
  <div class="government-dashboard">
    <!-- 欢迎区域 -->
    <el-card class="welcome-card">
      <div class="welcome-content">
        <h2>政府监管中心</h2>
        <p>企业信用风险监控与定向推送管理平台</p>
      </div>
    </el-card>

    <!-- 统计概览 -->
    <el-row :gutter="20" class="stats-overview">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon size="48" color="#67C23A"><TrendCharts /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalEnterprises }}</div>
              <div class="stat-label">监管企业总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon size="48" color="#E6A23C"><Warning /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.highRiskEnterprises }}</div>
              <div class="stat-label">高风险企业</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon size="48" color="#409EFF"><Promotion /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pushedEnterprises }}</div>
              <div class="stat-label">已推送企业</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon size="48" color="#909399"><Bell /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.alertsToday }}</div>
              <div class="stat-label">今日预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 功能卡片区域 -->
    <div class="function-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="function-card" @click="activeTab = 'monitor'">
            <div class="card-content">
              <el-icon size="48" color="#409EFF"><Monitor /></el-icon>
              <h3>风险监控</h3>
              <p>企业风险实时监控</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="function-card" @click="activeTab = 'push'">
            <div class="card-content">
              <el-icon size="48" color="#67C23A"><Promotion /></el-icon>
              <h3>定向推送</h3>
              <p>优质企业推荐</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="function-card" @click="activeTab = 'analysis'">
            <div class="card-content">
              <el-icon size="48" color="#E6A23C"><DataAnalysis /></el-icon>
              <h3>行业分析</h3>
              <p>行业风险分析</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="function-card" @click="activeTab = 'report'">
            <div class="card-content">
              <el-icon size="48" color="#909399"><Document /></el-icon>
              <h3>监管报告</h3>
              <p>生成监管报告</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <el-tabs v-model="activeTab" type="card">
        <!-- 风险监控标签页 -->
        <el-tab-pane label="风险监控" name="monitor">
          <RiskMonitoring />
        </el-tab-pane>
        
        <!-- 定向推送标签页 -->
        <el-tab-pane label="定向推送" name="push">
          <TargetedPush />
        </el-tab-pane>
        
        <!-- 行业分析标签页 -->
        <el-tab-pane label="行业分析" name="analysis">
          <IndustryAnalysis />
        </el-tab-pane>
        
        <!-- 监管报告标签页 -->
        <el-tab-pane label="监管报告" name="report">
          <SupervisionReport />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import RiskMonitoring from './components/RiskMonitoring.vue'
import TargetedPush from './components/TargetedPush.vue'
import IndustryAnalysis from './components/IndustryAnalysis.vue'
import SupervisionReport from './components/SupervisionReport.vue'

export default {
  name: 'GovernmentDashboard',
  components: {
    RiskMonitoring,
    TargetedPush,
    IndustryAnalysis,
    SupervisionReport
  },
  setup() {
    const activeTab = ref('monitor')
    
    const stats = ref({
      totalEnterprises: 12543,
      highRiskEnterprises: 234,
      pushedEnterprises: 856,
      alertsToday: 12
    })
    
    return {
      activeTab,
      stats
    }
  }
}
</script>

<style scoped>
.government-dashboard {
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
</style>