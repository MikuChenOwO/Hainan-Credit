<template>
  <div class="personal-dashboard">
    <!-- 欢迎区域 -->
    <el-card class="welcome-card">
      <div class="welcome-content">
        <h2>个人信用中心</h2>
        <p>基于AI技术的个人信用评估与风险预测</p>
      </div>
    </el-card>

    <!-- 功能卡片区域 -->
    <div class="function-cards">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card 
            class="function-card" 
            :class="{ 'active': activeTab === 'profile' }"
            @click="activeTab = 'profile'"
          >
            <div class="card-content">
              <el-icon size="48" :color="activeTab === 'profile' ? '#409EFF' : '#409EFF'"><User /></el-icon>
              <h3>用户画像</h3>
              <p>查看您的多维信用画像</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card 
            class="function-card" 
            :class="{ 'active': activeTab === 'risk' }"
            @click="activeTab = 'risk'"
          >
            <div class="card-content">
              <el-icon size="48" :color="activeTab === 'risk' ? '#E6A23C' : '#E6A23C'"><Warning /></el-icon>
              <h3>风险预测</h3>
              <p>进行信用风险评估</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card 
            class="function-card" 
            :class="{ 'active': activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            <div class="card-content">
              <el-icon size="48" :color="activeTab === 'history' ? '#67C23A' : '#67C23A'"><Clock /></el-icon>
              <h3>历史记录</h3>
              <p>查看评估历史记录</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 用户画像内容 -->
      <div v-show="activeTab === 'profile'">
        <UserProfile />
      </div>
      
      <!-- 风险预测内容 -->
      <div v-show="activeTab === 'risk'">
        <RiskPrediction />
      </div>
      
      <!-- 历史记录内容 -->
      <div v-show="activeTab === 'history'">
        <HistoryRecords />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import UserProfile from './components/UserProfile.vue'
import RiskPrediction from './components/RiskPrediction.vue'
import HistoryRecords from './components/HistoryRecords.vue'

export default {
  name: 'PersonalDashboard',
  components: {
    UserProfile,
    RiskPrediction,
    HistoryRecords
  },
  setup() {
    const activeTab = ref('profile')
    
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

.function-cards {
  margin-bottom: 20px;
}

.function-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 180px;
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
</style>