<template>
  <div class="enterprise-risk-prediction">
    <div class="risk-header">
      <h3>企业信用风险预测</h3>
      <p>基于AI算法的企业信用风险评估与预测</p>
    </div>

    <!-- 风险等级展示 -->
    <el-card class="risk-level-card">
      <div class="risk-level-content">
        <div class="level-indicator">
          <div class="level-icon" :class="currentRiskLevel">
            <el-icon size="48"><Warning /></el-icon>
          </div>
          <div class="level-info">
            <h4>当前风险等级</h4>
            <div class="level-text" :class="currentRiskLevel">{{ riskLevelText }}</div>
            <div class="level-score">风险评分：{{ riskScore }}/100</div>
          </div>
        </div>
        
        <div class="risk-progress">
          <el-progress 
            :percentage="riskScore" 
            :color="riskColor" 
            :show-text="false" 
            :stroke-width="8" 
          />
          <div class="progress-labels">
            <span>低风险</span>
            <span>中风险</span>
            <span>高风险</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 风险因素分析 -->
    <el-card class="risk-factors-card">
      <template #header>
        <span>风险因素分析</span>
      </template>
      
      <div class="factors-list">
        <div 
          v-for="factor in riskFactors" 
          :key="factor.id" 
          class="factor-item"
          :class="{ 'high-risk': factor.riskLevel === 'high' }"
        >
          <div class="factor-info">
            <div class="factor-name">{{ factor.name }}</div>
            <div class="factor-desc">{{ factor.description }}</div>
          </div>
          <div class="factor-score">
            <el-tag :type="getRiskTagType(factor.riskLevel)">
              {{ factor.score }}/10
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 预测趋势 -->
    <el-card class="trend-card">
      <template #header>
        <span>风险趋势预测</span>
      </template>
      
      <div class="trend-content">
        <div class="trend-chart">
          <!-- 简化的趋势图 -->
          <div class="chart-placeholder">
            <el-icon size="64" color="#409EFF"><TrendCharts /></el-icon>
            <p>风险趋势图表展示区域</p>
          </div>
        </div>
        
        <div class="trend-analysis">
          <h4>趋势分析</h4>
          <p>根据历史数据分析，企业信用风险呈现稳定趋势，建议继续保持良好的经营状况。</p>
          
          <div class="trend-stats">
            <div class="stat-item">
              <span class="stat-label">上月风险评分</span>
              <span class="stat-value">78</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">变化趋势</span>
              <span class="stat-value positive">+2</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">预测下月</span>
              <span class="stat-value">80</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 风险建议 -->
    <el-card class="suggestion-card">
      <template #header>
        <span>风险控制建议</span>
      </template>
      
      <div class="suggestions">
        <div class="suggestion-item">
          <el-icon color="#67C23A"><CircleCheck /></el-icon>
          <span>加强财务透明度，定期更新财务报表</span>
        </div>
        <div class="suggestion-item">
          <el-icon color="#E6A23C"><Warning /></el-icon>
          <span>关注应收账款周转率，优化资金流动性</span>
        </div>
        <div class="suggestion-item">
          <el-icon color="#409EFF"><InfoFilled /></el-icon>
          <span>建立风险预警机制，及时发现潜在风险</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { 
  Warning, 
  TrendCharts, 
  CircleCheck, 
  InfoFilled 
} from '@element-plus/icons-vue'

export default {
  name: 'EnterpriseRiskPrediction',
  components: {
    Warning,
    TrendCharts,
    CircleCheck,
    InfoFilled
  },
  setup() {
    // 风险数据
    const riskScore = ref(82)
    const currentRiskLevel = ref('medium')
    
    // 风险因素数据
    const riskFactors = ref([
      {
        id: 1,
        name: '财务状况',
        description: '资产负债率、利润率等财务指标',
        score: 8,
        riskLevel: 'low'
      },
      {
        id: 2,
        name: '经营能力',
        description: '营业收入增长率、市场份额等',
        score: 7,
        riskLevel: 'medium'
      },
      {
        id: 3,
        name: '偿债能力',
        description: '流动比率、速动比率等',
        score: 6,
        riskLevel: 'medium'
      },
      {
        id: 4,
        name: '行业风险',
        description: '行业政策、市场竞争等外部因素',
        score: 5,
        riskLevel: 'high'
      }
    ])

    // 计算属性
    const riskLevelText = computed(() => {
      const levels = {
        low: '低风险',
        medium: '中风险',
        high: '高风险'
      }
      return levels[currentRiskLevel.value] || '未知'
    })

    const riskColor = computed(() => {
      if (riskScore.value >= 80) return '#67C23A'
      if (riskScore.value >= 60) return '#E6A23C'
      return '#F56C6C'
    })

    // 方法
    const getRiskTagType = (level) => {
      const types = {
        low: 'success',
        medium: 'warning',
        high: 'danger'
      }
      return types[level] || 'info'
    }

    return {
      riskScore,
      currentRiskLevel,
      riskFactors,
      riskLevelText,
      riskColor,
      getRiskTagType
    }
  }
}
</script>

<style scoped>
.enterprise-risk-prediction {
  padding: 20px;
}

.risk-header {
  margin-bottom: 30px;
  text-align: center;
}

.risk-header h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.risk-header p {
  color: #909399;
  font-size: 14px;
}

/* 风险等级卡片 */
.risk-level-card {
  margin-bottom: 20px;
}

.risk-level-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.level-indicator {
  display: flex;
  align-items: center;
  gap: 20px;
}

.level-icon {
  padding: 15px;
  border-radius: 50%;
  background: #f0f9ff;
}

.level-icon.low {
  background: #f0f9ff;
  color: #409EFF;
}

.level-icon.medium {
  background: #fdf6ec;
  color: #E6A23C;
}

.level-icon.high {
  background: #fef0f0;
  color: #F56C6C;
}

.level-info h4 {
  margin-bottom: 8px;
  color: #606266;
}

.level-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.level-text.low { color: #67C23A; }
.level-text.medium { color: #E6A23C; }
.level-text.high { color: #F56C6C; }

.level-score {
  color: #909399;
  font-size: 14px;
}

.risk-progress {
  flex: 1;
  max-width: 300px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

/* 风险因素 */
.factors-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.factor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background: #f5f7fa;
  transition: all 0.3s;
}

.factor-item.high-risk {
  background: #fef0f0;
  border-left: 4px solid #F56C6C;
}

.factor-info {
  flex: 1;
}

.factor-name {
  font-weight: 600;
  margin-bottom: 5px;
  color: #303133;
}

.factor-desc {
  font-size: 12px;
  color: #909399;
}

/* 趋势分析 */
.trend-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.chart-placeholder {
  text-align: center;
  padding: 40px;
  background: #f5f7fa;
  border-radius: 8px;
}

.chart-placeholder p {
  margin-top: 10px;
  color: #909399;
}

.trend-analysis h4 {
  margin-bottom: 15px;
  color: #303133;
}

.trend-analysis p {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}

.trend-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.stat-value.positive {
  color: #67C23A;
}

/* 建议列表 */
.suggestions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.suggestion-item span {
  color: #606266;
}

@media (max-width: 768px) {
  .risk-level-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .trend-content {
    grid-template-columns: 1fr;
  }
  
  .trend-stats {
    grid-template-columns: 1fr;
  }
}
</style>