<template>
  <div class="personal-dashboard">
    <el-card class="welcome-card">
      <div class="welcome-content">
        <h2>个人信用中心</h2>
        <p>基于 AI 技术的个人信用评估与风险预测</p>
      </div>
    </el-card>

    <div class="content-area">
      <div v-show="activeTab === 'profile'">
        <UserProfile />
      </div>

      <div v-show="activeTab === 'risk'">
        <RiskPrediction />
      </div>

      <div v-show="activeTab === 'history'">
        <HistoryRecords />
      </div>
    </div>
  </div>
</template>

<script>
import UserProfile from './components/UserProfile.vue'
import RiskPrediction from './components/RiskPrediction.vue'
import HistoryRecords from './components/HistoryRecords.vue'
import { useFeatureAccess } from '@/composables/useFeatureAccess'
import { getFeatureItems } from '@/config/userAccess'

const PERSONAL_FEATURES = getFeatureItems('personal')

export default {
  name: 'PersonalDashboard',
  components: {
    HistoryRecords,
    RiskPrediction,
    UserProfile
  },
  setup() {
    const { activeTab } = useFeatureAccess(
      'personal',
      PERSONAL_FEATURES,
      'profile'
    )

    return {
      activeTab
    }
  }
}
</script>

<style scoped>
.personal-dashboard {
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

.content-area {
  background: white;
  border-radius: 4px;
  padding: 20px;
}
</style>
