<template>
  <div class="government-dashboard">

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

    <div class="content-area">
      <div v-show="activeTab === 'monitor'">
        <RiskMonitoring />
      </div>

      <div v-show="activeTab === 'push'">
        <TargetedPush />
      </div>

      <div v-show="activeTab === 'analysis'">
        <IndustryAnalysis />
      </div>

      <div v-show="activeTab === 'report'">
        <SupervisionReport />
      </div>
    </div>
  </div>
</template>

<script>
import { Bell, Promotion, TrendCharts, Warning } from '@element-plus/icons-vue'
import RiskMonitoring from './components/RiskMonitoring.vue'
import TargetedPush from './components/TargetedPush.vue'
import IndustryAnalysis from './components/IndustryAnalysis.vue'
import SupervisionReport from './components/SupervisionReport.vue'
import { useFeatureAccess } from '@/composables/useFeatureAccess'
import { getFeatureItems } from '@/config/userAccess'

const GOVERNMENT_FEATURES = getFeatureItems('government')

export default {
  name: 'GovernmentDashboard',
  components: {
    Bell,
    IndustryAnalysis,
    Promotion,
    RiskMonitoring,
    SupervisionReport,
    TargetedPush,
    TrendCharts,
    Warning
  },
  setup() {
    const { activeTab } = useFeatureAccess(
      'government',
      GOVERNMENT_FEATURES,
      'monitor'
    )

    const stats = {
      totalEnterprises: 12543,
      highRiskEnterprises: 234,
      pushedEnterprises: 856,
      alertsToday: 12
    }

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

.content-area {
  background: white;
  border-radius: 4px;
  padding: 20px;
}
</style>