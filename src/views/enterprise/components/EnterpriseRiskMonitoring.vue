<template>
  <div class="enterprise-risk-monitoring">
    <div class="monitoring-header">
      <h3>企业风险监控</h3>
      <p>实时监控企业信用风险变化与预警</p>
    </div>

    <!-- 实时监控面板 -->
    <el-card class="real-time-panel">
      <template #header>
        <div class="panel-header">
          <span>实时监控面板</span>
          <div class="monitoring-status">
            <el-tag type="success" size="small">监控中</el-tag>
            <span class="update-time">最后更新：{{ lastUpdateTime }}</span>
          </div>
        </div>
      </template>
      
      <div class="monitoring-metrics">
        <div class="metric-card">
          <div class="metric-icon">
            <el-icon size="32" color="#67C23A"><CircleCheck /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ monitoringData.normalCount }}</div>
            <div class="metric-label">正常指标</div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">
            <el-icon size="32" color="#E6A23C"><Warning /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ monitoringData.warningCount }}</div>
            <div class="metric-label">预警指标</div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">
            <el-icon size="32" color="#F56C6C"><CloseBold /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ monitoringData.alertCount }}</div>
            <div class="metric-label">警报指标</div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">
            <el-icon size="32" color="#409EFF"><TrendCharts /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ monitoringData.totalMonitored }}</div>
            <div class="metric-label">监控总数</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 风险预警列表 -->
    <el-card class="warning-list-card">
      <template #header>
        <span>风险预警列表</span>
        <el-button type="primary" link @click="refreshWarnings">刷新</el-button>
      </template>
      
      <div class="warning-list">
        <div 
          v-for="warning in riskWarnings" 
          :key="warning.id" 
          class="warning-item"
          :class="warning.level"
        >
          <div class="warning-icon">
            <el-icon :size="20">
              <Warning v-if="warning.level === 'warning'" />
              <CloseBold v-else-if="warning.level === 'alert'" />
              <InfoFilled v-else />
            </el-icon>
          </div>
          
          <div class="warning-content">
            <div class="warning-title">{{ warning.title }}</div>
            <div class="warning-desc">{{ warning.description }}</div>
            <div class="warning-time">{{ warning.time }}</div>
          </div>
          
          <div class="warning-actions">
            <el-button type="text" @click="viewDetail(warning)">查看详情</el-button>
            <el-button type="text" @click="handleWarning(warning)">处理</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 风险趋势监控 -->
    <el-card class="trend-monitoring-card">
      <template #header>
        <span>风险趋势监控</span>
      </template>
      
      <div class="trend-content">
        <div class="trend-chart">
          <div class="chart-placeholder">
            <el-icon size="64" color="#409EFF"><DataAnalysis /></el-icon>
            <p>风险趋势实时监控图表</p>
          </div>
        </div>
        
        <div class="trend-stats">
          <h4>风险趋势分析</h4>
          <div class="trend-items">
            <div class="trend-item">
              <div class="trend-label">本周风险变化</div>
              <div class="trend-value positive">-3.2%</div>
              <div class="trend-desc">风险水平有所下降</div>
            </div>
            <div class="trend-item">
              <div class="trend-label">月度风险趋势</div>
              <div class="trend-value negative">+5.1%</div>
              <div class="trend-desc">需关注持续上升</div>
            </div>
            <div class="trend-item">
              <div class="trend-label">行业风险对比</div>
              <div class="trend-value normal">-2.3%</div>
              <div class="trend-desc">低于行业平均</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 关键指标监控 -->
    <el-card class="key-metrics-card">
      <template #header>
        <span>关键指标监控</span>
      </template>
      
      <div class="metrics-grid">
        <div 
          v-for="metric in keyMetrics" 
          :key="metric.id" 
          class="metric-item"
          :class="metric.status"
        >
          <div class="metric-header">
            <div class="metric-name">{{ metric.name }}</div>
            <el-tag :type="getMetricTagType(metric.status)" size="small">
              {{ metric.statusText }}
            </el-tag>
          </div>
          
          <div class="metric-value">{{ metric.currentValue }}</div>
          <div class="metric-range">
            正常范围：{{ metric.normalRange }}
          </div>
          
          <div class="metric-trend">
            <span class="trend-label">趋势：</span>
            <span 
              class="trend-value" 
              :class="{ 
                'positive': metric.trend > 0, 
                'negative': metric.trend < 0 
              }"
            >
              {{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%
            </span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 监控设置 -->
    <el-card class="settings-card">
      <template #header>
        <span>监控设置</span>
      </template>
      
      <div class="settings-content">
        <el-form label-width="120px">
          <el-form-item label="预警阈值">
            <el-slider 
              v-model="warningThreshold" 
              :min="50" 
              :max="90" 
              :step="5" 
              show-stops 
            />
            <span class="threshold-value">{{ warningThreshold }}%</span>
          </el-form-item>
          
          <el-form-item label="警报阈值">
            <el-slider 
              v-model="alertThreshold" 
              :min="70" 
              :max="95" 
              :step="5" 
              show-stops 
            />
            <span class="threshold-value">{{ alertThreshold }}%</span>
          </el-form-item>
          
          <el-form-item label="监控频率">
            <el-radio-group v-model="monitoringFrequency">
              <el-radio label="realtime">实时监控</el-radio>
              <el-radio label="hourly">每小时</el-radio>
              <el-radio label="daily">每日</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="通知方式">
            <el-checkbox-group v-model="notificationMethods">
              <el-checkbox label="email">邮件通知</el-checkbox>
              <el-checkbox label="sms">短信通知</el-checkbox>
              <el-checkbox label="push">推送通知</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        
        <div class="settings-actions">
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
          <el-button @click="resetSettings">重置</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  CircleCheck, 
  Warning, 
  CloseBold, 
  TrendCharts, 
  DataAnalysis,
  InfoFilled
} from '@element-plus/icons-vue'

export default {
  name: 'EnterpriseRiskMonitoring',
  components: {
    CircleCheck,
    Warning,
    CloseBold,
    TrendCharts,
    DataAnalysis,
    InfoFilled
  },
  setup() {
    // 监控数据
    const monitoringData = ref({
      normalCount: 18,
      warningCount: 3,
      alertCount: 1,
      totalMonitored: 22
    })

    // 风险预警列表
    const riskWarnings = ref([
      {
        id: 1,
        title: '资产负债率异常升高',
        description: '资产负债率从45%上升至52%，超出警戒线',
        time: '2024-01-15 14:30',
        level: 'alert'
      },
      {
        id: 2,
        title: '应收账款周转率下降',
        description: '应收账款周转率较上月下降15%',
        time: '2024-01-15 10:15',
        level: 'warning'
      },
      {
        id: 3,
        title: '行业政策风险提醒',
        description: '行业政策调整可能影响企业经营',
        time: '2024-01-14 16:45',
        level: 'info'
      }
    ])

    // 关键指标
    const keyMetrics = ref([
      {
        id: 1,
        name: '资产负债率',
        currentValue: '52%',
        normalRange: '<50%',
        status: 'alert',
        statusText: '警报',
        trend: 15.6
      },
      {
        id: 2,
        name: '流动比率',
        currentValue: '2.1',
        normalRange: '>1.5',
        status: 'normal',
        statusText: '正常',
        trend: -2.3
      },
      {
        id: 3,
        name: '净利率',
        currentValue: '15%',
        normalRange: '>10%',
        status: 'good',
        statusText: '良好',
        trend: 3.2
      },
      {
        id: 4,
        name: '应收账款周转率',
        currentValue: '6.2',
        normalRange: '>5.0',
        status: 'warning',
        statusText: '预警',
        trend: -8.7
      }
    ])

    // 监控设置
    const warningThreshold = ref(75)
    const alertThreshold = ref(85)
    const monitoringFrequency = ref('realtime')
    const notificationMethods = ref(['email', 'push'])

    // 更新时间
    const lastUpdateTime = ref('')

    // 方法
    const refreshWarnings = () => {
      ElMessage.success('预警列表已刷新')
      lastUpdateTime.value = new Date().toLocaleString('zh-CN')
    }

    const viewDetail = (warning) => {
      ElMessage.info(`查看预警详情：${warning.title}`)
    }

    const handleWarning = (warning) => {
      ElMessage.success(`已处理预警：${warning.title}`)
    }

    const getMetricTagType = (status) => {
      const typeMap = {
        'good': 'success',
        'normal': 'primary',
        'warning': 'warning',
        'alert': 'danger'
      }
      return typeMap[status] || 'info'
    }

    const saveSettings = () => {
      ElMessage.success('监控设置已保存')
    }

    const resetSettings = () => {
      warningThreshold.value = 75
      alertThreshold.value = 85
      monitoringFrequency.value = 'realtime'
      notificationMethods.value = ['email', 'push']
      ElMessage.info('设置已重置为默认值')
    }

    onMounted(() => {
      lastUpdateTime.value = new Date().toLocaleString('zh-CN')
    })

    return {
      monitoringData,
      riskWarnings,
      keyMetrics,
      warningThreshold,
      alertThreshold,
      monitoringFrequency,
      notificationMethods,
      lastUpdateTime,
      refreshWarnings,
      viewDetail,
      handleWarning,
      getMetricTagType,
      saveSettings,
      resetSettings
    }
  }
}
</script>

<style scoped>
.enterprise-risk-monitoring {
  padding: 20px;
}

.monitoring-header {
  margin-bottom: 30px;
  text-align: center;
}

.monitoring-header h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.monitoring-header p {
  color: #909399;
  font-size: 14px;
}

/* 实时监控面板 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.monitoring-status {
  display: flex;
  align-items: center;
  gap: 15px;
}

.update-time {
  font-size: 12px;
  color: #909399;
}

.monitoring-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  text-align: center;
}

.metric-icon {
  flex-shrink: 0;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.metric-label {
  font-size: 14px;
  color: #909399;
}

/* 风险预警列表 */
.warning-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background: #f5f7fa;
  transition: all 0.3s;
}

.warning-item.alert {
  background: #fef0f0;
  border-left: 4px solid #F56C6C;
}

.warning-item.warning {
  background: #fdf6ec;
  border-left: 4px solid #E6A23C;
}

.warning-item.info {
  background: #f0f9ff;
  border-left: 4px solid #409EFF;
}

.warning-icon {
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-weight: 600;
  margin-bottom: 5px;
  color: #303133;
}

.warning-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.warning-time {
  font-size: 12px;
  color: #909399;
}

.warning-actions {
  flex-shrink: 0;
}

/* 趋势监控 */
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

.trend-stats h4 {
  margin-bottom: 20px;
  color: #303133;
}

.trend-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.trend-item {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.trend-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.trend-value {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.trend-value.positive {
  color: #67C23A;
}

.trend-value.negative {
  color: #F56C6C;
}

.trend-value.normal {
  color: #409EFF;
}

.trend-desc {
  font-size: 12px;
  color: #909399;
}

/* 关键指标监控 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.metric-item {
  padding: 20px;
  border-radius: 8px;
  background: #f5f7fa;
}

.metric-item.alert {
  background: #fef0f0;
  border-left: 4px solid #F56C6C;
}

.metric-item.warning {
  background: #fdf6ec;
  border-left: 4px solid #E6A23C;
}

.metric-item.good {
  background: #f0f9ff;
  border-left: 4px solid #67C23A;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.metric-name {
  font-weight: 600;
  color: #303133;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.metric-range {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.metric-trend {
  font-size: 14px;
}

.trend-label {
  color: #606266;
}

/* 监控设置 */
.threshold-value {
  margin-left: 15px;
  color: #409EFF;
  font-weight: 600;
}

.settings-actions {
  text-align: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .monitoring-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .trend-content {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .warning-item {
    flex-direction: column;
    text-align: center;
  }
  
  .warning-actions {
    margin-top: 10px;
  }
}
</style>