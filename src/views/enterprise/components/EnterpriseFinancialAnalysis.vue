<template>
  <div class="enterprise-financial-analysis">
    <div class="analysis-header">
      <h3>企业财务分析</h3>
      <p>基于财务报表的智能分析与评估</p>
    </div>

    <!-- 财务概览 -->
    <el-card class="overview-card">
      <template #header>
        <span>财务概览</span>
        <el-button type="primary" link @click="uploadStatement">上传财务报表</el-button>
      </template>
      
      <div class="overview-content">
        <div class="financial-metrics">
          <div class="metric-item">
            <div class="metric-value">{{ financialData.totalAssets }}万元</div>
            <div class="metric-label">总资产</div>
            <div class="metric-change positive">+5.2%</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ financialData.totalRevenue }}万元</div>
            <div class="metric-label">营业收入</div>
            <div class="metric-change positive">+12.8%</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ financialData.netProfit }}万元</div>
            <div class="metric-label">净利润</div>
            <div class="metric-change positive">+8.3%</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ financialData.debtRatio }}%</div>
            <div class="metric-label">资产负债率</div>
            <div class="metric-change negative">-2.1%</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 财务指标分析 -->
    <el-card class="indicators-card">
      <template #header>
        <span>关键财务指标</span>
      </template>
      
      <div class="indicators-grid">
        <div 
          v-for="indicator in financialIndicators" 
          :key="indicator.id" 
          class="indicator-item"
          :class="getIndicatorClass(indicator)"
        >
          <div class="indicator-icon">
            <el-icon :size="24">
              <PieChart v-if="indicator.icon === 'PieChart'" />
              <Coin v-else-if="indicator.icon === 'Coin'" />
              <DataAnalysis v-else-if="indicator.icon === 'DataAnalysis'" />
              <Money v-else-if="indicator.icon === 'Money'" />
            </el-icon>
          </div>
          <div class="indicator-info">
            <div class="indicator-name">{{ indicator.name }}</div>
            <div class="indicator-value">{{ indicator.value }}</div>
            <div class="indicator-desc">{{ indicator.description }}</div>
          </div>
          <div class="indicator-status">
            <el-tag :type="getStatusType(indicator.status)" size="small">
              {{ indicator.status }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 盈利能力分析 -->
    <el-card class="profitability-card">
      <template #header>
        <span>盈利能力分析</span>
      </template>
      
      <div class="profitability-content">
        <div class="profit-chart">
          <div class="chart-placeholder">
            <el-icon size="64" color="#67C23A"><TrendCharts /></el-icon>
            <p>盈利能力趋势图表</p>
          </div>
        </div>
        
        <div class="profit-analysis">
          <h4>盈利能力评估</h4>
          <p>企业盈利能力表现良好，主要指标均优于行业平均水平。</p>
          
          <div class="profit-comparison">
            <div class="comparison-item">
              <span class="comparison-label">净利率</span>
              <div class="comparison-bar">
                <div class="bar-fill enterprise" :style="{ width: '15%' }">
                  <span>15%</span>
                </div>
                <div class="bar-fill industry" :style="{ width: '12%' }">
                  <span>12%</span>
                </div>
              </div>
            </div>
            <div class="comparison-item">
              <span class="comparison-label">ROE</span>
              <div class="comparison-bar">
                <div class="bar-fill enterprise" :style="{ width: '18%' }">
                  <span>18%</span>
                </div>
                <div class="bar-fill industry" :style="{ width: '15%' }">
                  <span>15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 偿债能力分析 -->
    <el-card class="solvency-card">
      <template #header>
        <span>偿债能力分析</span>
      </template>
      
      <div class="solvency-content">
        <div class="solvency-stats">
          <div class="stat-item">
            <div class="stat-value">{{ solvencyData.currentRatio }}</div>
            <div class="stat-label">流动比率</div>
            <div class="stat-assessment good">良好</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ solvencyData.quickRatio }}</div>
            <div class="stat-label">速动比率</div>
            <div class="stat-assessment normal">正常</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ solvencyData.interestCoverage }}倍</div>
            <div class="stat-label">利息保障倍数</div>
            <div class="stat-assessment good">良好</div>
          </div>
        </div>
        
        <div class="solvency-analysis">
          <h4>偿债能力评估</h4>
          <p>企业偿债能力较强，短期和长期偿债风险较低。</p>
          <ul class="analysis-points">
            <li>流动比率高于行业标准，短期偿债能力良好</li>
            <li>资产负债率控制在合理范围内</li>
            <li>利息保障倍数充足，财务费用负担合理</li>
          </ul>
        </div>
      </div>
    </el-card>

    <!-- 财务建议 -->
    <el-card class="financial-suggestion-card">
      <template #header>
        <span>财务优化建议</span>
      </template>
      
      <div class="suggestions">
        <div class="suggestion-item">
          <el-icon color="#67C23A"><CircleCheck /></el-icon>
          <span>优化应收账款管理，提高资金周转效率</span>
        </div>
        <div class="suggestion-item">
          <el-icon color="#E6A23C"><Warning /></el-icon>
          <span>关注存货周转率，避免资金占用过多</span>
        </div>
        <div class="suggestion-item">
          <el-icon color="#409EFF"><InfoFilled /></el-icon>
          <span>加强成本控制，提升盈利能力</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  TrendCharts, 
  CircleCheck, 
  InfoFilled, 
  Warning,
  Money,
  PieChart,
  DataAnalysis,
  Coin
} from '@element-plus/icons-vue'

export default {
  name: 'EnterpriseFinancialAnalysis',
  components: {
    TrendCharts,
    CircleCheck,
    InfoFilled,
    Warning,
    Money,
    PieChart,
    DataAnalysis,
    Coin
  },
  setup() {
    // 财务数据
    const financialData = ref({
      totalAssets: 12500,
      totalRevenue: 8500,
      netProfit: 1275,
      debtRatio: 45.2
    })

    // 财务指标
    const financialIndicators = ref([
      {
        id: 1,
        name: '毛利率',
        value: '32.5%',
        description: '高于行业平均28%',
        status: '优秀',
        icon: 'PieChart'
      },
      {
        id: 2,
        name: '净利率',
        value: '15.0%',
        description: '行业平均12%',
        status: '良好',
        icon: 'Coin'
      },
      {
        id: 3,
        name: '资产周转率',
        value: '0.68',
        description: '需要提升',
        status: '一般',
        icon: 'DataAnalysis'
      },
      {
        id: 4,
        name: 'ROE',
        value: '18.2%',
        description: '股东回报良好',
        status: '优秀',
        icon: 'Money'
      }
    ])

    // 偿债能力数据
    const solvencyData = ref({
      currentRatio: 2.1,
      quickRatio: 1.5,
      interestCoverage: 8.2
    })

    // 方法
    const uploadStatement = () => {
      ElMessage.info('财务报表上传功能开发中...')
    }

    const getIndicatorClass = (indicator) => {
      const statusMap = {
        '优秀': 'excellent',
        '良好': 'good',
        '一般': 'normal',
        '较差': 'poor'
      }
      return statusMap[indicator.status] || 'normal'
    }

    const getStatusType = (status) => {
      const typeMap = {
        '优秀': 'success',
        '良好': 'primary',
        '一般': 'warning',
        '较差': 'danger'
      }
      return typeMap[status] || 'info'
    }

    return {
      financialData,
      financialIndicators,
      solvencyData,
      uploadStatement,
      getIndicatorClass,
      getStatusType
    }
  }
}
</script>

<style scoped>
.enterprise-financial-analysis {
  padding: 20px;
}

.analysis-header {
  margin-bottom: 30px;
  text-align: center;
}

.analysis-header h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.analysis-header p {
  color: #909399;
  font-size: 14px;
}

/* 财务概览 */
.financial-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.metric-item {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.metric-change {
  font-size: 12px;
  font-weight: 600;
}

.metric-change.positive {
  color: #67C23A;
}

.metric-change.negative {
  color: #F56C6C;
}

/* 财务指标 */
.indicators-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.indicator-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background: #f5f7fa;
  transition: all 0.3s;
}

.indicator-item.excellent {
  background: #f0f9ff;
  border-left: 4px solid #67C23A;
}

.indicator-item.good {
  background: #f0f9ff;
  border-left: 4px solid #409EFF;
}

.indicator-item.normal {
  background: #fdf6ec;
  border-left: 4px solid #E6A23C;
}

.indicator-item.poor {
  background: #fef0f0;
  border-left: 4px solid #F56C6C;
}

.indicator-icon {
  color: #409EFF;
}

.indicator-info {
  flex: 1;
}

.indicator-name {
  font-weight: 600;
  margin-bottom: 5px;
  color: #303133;
}

.indicator-value {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.indicator-desc {
  font-size: 12px;
  color: #909399;
}

/* 盈利能力分析 */
.profitability-content {
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

.profit-analysis h4 {
  margin-bottom: 15px;
  color: #303133;
}

.profit-analysis p {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}

.profit-comparison {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.comparison-label {
  width: 80px;
  font-size: 14px;
  color: #606266;
}

.comparison-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bar-fill {
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
  font-size: 12px;
  color: white;
  transition: width 0.3s;
}

.bar-fill.enterprise {
  background: #409EFF;
}

.bar-fill.industry {
  background: #909399;
}

/* 偿债能力分析 */
.solvency-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.solvency-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-assessment {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.stat-assessment.good {
  background: #f0f9ff;
  color: #409EFF;
}

.stat-assessment.normal {
  background: #fdf6ec;
  color: #E6A23C;
}

.solvency-analysis h4 {
  margin-bottom: 15px;
  color: #303133;
}

.solvency-analysis p {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 15px;
}

.analysis-points {
  color: #606266;
  line-height: 1.6;
}

.analysis-points li {
  margin-bottom: 8px;
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
  .financial-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .indicators-grid {
    grid-template-columns: 1fr;
  }
  
  .profitability-content,
  .solvency-content {
    grid-template-columns: 1fr;
  }
}
</style>