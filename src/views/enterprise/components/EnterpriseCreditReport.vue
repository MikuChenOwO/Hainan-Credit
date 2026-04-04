<template>
  <div class="enterprise-credit-report">
    <div class="report-header">
      <h3>企业信用报告</h3>
      <p>企业信用状况全面分析与评估报告</p>
    </div>

    <!-- 报告概览 -->
    <el-card class="report-overview">
      <div class="overview-content">
        <div class="report-info">
          <div class="info-item">
            <label>报告编号：</label>
            <span>{{ reportData.reportNo }}</span>
          </div>
          <div class="info-item">
            <label>生成时间：</label>
            <span>{{ reportData.generateTime }}</span>
          </div>
          <div class="info-item">
            <label>报告有效期：</label>
            <span>{{ reportData.validity }}</span>
          </div>
        </div>
        
        <div class="report-actions">
          <el-button type="primary" @click="generateReport">
            <el-icon><DocumentAdd /></el-icon>
            生成新报告
          </el-button>
          <el-button @click="exportReport">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
          <el-button @click="printReport">
            <el-icon><Printer /></el-icon>
            打印报告
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 信用评分概览 -->
    <el-card class="credit-score-card">
      <template #header>
        <span>信用评分概览</span>
      </template>
      
      <div class="score-content">
        <div class="main-score">
          <div class="score-circle">
            <div class="score-value">{{ reportData.creditScore }}</div>
            <div class="score-label">信用评分</div>
          </div>
          <div class="score-details">
            <div class="score-level">
              <el-tag :type="getScoreTagType(reportData.scoreLevel)" size="large">
                {{ reportData.scoreLevel }}
              </el-tag>
            </div>
            <div class="score-comparison">
              <span>行业平均：{{ reportData.industryAverage }}</span>
              <span class="comparison-diff positive">+{{ reportData.scoreDifference }}</span>
            </div>
          </div>
        </div>
        
        <div class="dimension-scores">
          <div 
            v-for="dimension in reportData.dimensions" 
            :key="dimension.id" 
            class="dimension-item"
          >
            <div class="dimension-name">{{ dimension.name }}</div>
            <div class="dimension-score">
              <el-progress 
                :percentage="dimension.score" 
                :color="getDimensionColor(dimension.score)"
                :show-text="false"
                :stroke-width="8"
              />
              <span class="score-text">{{ dimension.score }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 报告内容 -->
    <el-card class="report-content-card">
      <template #header>
        <span>报告内容</span>
      </template>
      
      <el-collapse v-model="activeSections">
        <!-- 基本信息 -->
        <el-collapse-item title="企业基本信息" name="basic">
          <div class="section-content">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="企业名称">{{ reportData.basicInfo.name }}</el-descriptions-item>
              <el-descriptions-item label="统一信用代码">{{ reportData.basicInfo.creditCode }}</el-descriptions-item>
              <el-descriptions-item label="法定代表人">{{ reportData.basicInfo.legalPerson }}</el-descriptions-item>
              <el-descriptions-item label="注册资本">{{ reportData.basicInfo.registeredCapital }}万元</el-descriptions-item>
              <el-descriptions-item label="成立日期">{{ reportData.basicInfo.establishDate }}</el-descriptions-item>
              <el-descriptions-item label="行业类型">{{ reportData.basicInfo.industry }}</el-descriptions-item>
              <el-descriptions-item label="企业地址" :span="2">{{ reportData.basicInfo.address }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-collapse-item>
        
        <!-- 财务状况 -->
        <el-collapse-item title="财务状况分析" name="financial">
          <div class="section-content">
            <h4>财务指标分析</h4>
            <div class="financial-metrics">
              <div class="metric-row">
                <span class="metric-name">总资产</span>
                <span class="metric-value">{{ reportData.financialInfo.totalAssets }}万元</span>
                <span class="metric-trend positive">+5.2%</span>
              </div>
              <div class="metric-row">
                <span class="metric-name">营业收入</span>
                <span class="metric-value">{{ reportData.financialInfo.totalRevenue }}万元</span>
                <span class="metric-trend positive">+12.8%</span>
              </div>
              <div class="metric-row">
                <span class="metric-name">净利润</span>
                <span class="metric-value">{{ reportData.financialInfo.netProfit }}万元</span>
                <span class="metric-trend positive">+8.3%</span>
              </div>
              <div class="metric-row">
                <span class="metric-name">资产负债率</span>
                <span class="metric-value">{{ reportData.financialInfo.debtRatio }}%</span>
                <span class="metric-trend negative">+2.1%</span>
              </div>
            </div>
            
            <h4>财务分析结论</h4>
            <p>{{ reportData.financialInfo.conclusion }}</p>
          </div>
        </el-collapse-item>
        
        <!-- 经营状况 -->
        <el-collapse-item title="经营状况评估" name="operation">
          <div class="section-content">
            <h4>经营能力指标</h4>
            <div class="operation-metrics">
              <div 
                v-for="metric in reportData.operationInfo.metrics" 
                :key="metric.id" 
                class="operation-metric"
              >
                <div class="metric-header">
                  <span class="metric-name">{{ metric.name }}</span>
                  <el-tag :type="getMetricTagType(metric.status)" size="small">
                    {{ metric.status }}
                  </el-tag>
                </div>
                <div class="metric-value">{{ metric.value }}</div>
                <div class="metric-desc">{{ metric.description }}</div>
              </div>
            </div>
            
            <h4>经营分析结论</h4>
            <p>{{ reportData.operationInfo.conclusion }}</p>
          </div>
        </el-collapse-item>
        
        <!-- 风险分析 -->
        <el-collapse-item title="风险分析" name="risk">
          <div class="section-content">
            <h4>风险因素评估</h4>
            <div class="risk-factors">
              <div 
                v-for="factor in reportData.riskInfo.factors" 
                :key="factor.id" 
                class="risk-factor"
                :class="factor.level"
              >
                <div class="factor-info">
                  <div class="factor-name">{{ factor.name }}</div>
                  <div class="factor-desc">{{ factor.description }}</div>
                </div>
                <div class="factor-level">
                  <el-tag :type="getRiskTagType(factor.level)">
                    {{ factor.levelText }}
                  </el-tag>
                </div>
              </div>
            </div>
            
            <h4>风险控制建议</h4>
            <ul class="risk-suggestions">
              <li v-for="suggestion in reportData.riskInfo.suggestions" :key="suggestion">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </el-collapse-item>
        
        <!-- 信用历史 -->
        <el-collapse-item title="信用历史记录" name="history">
          <div class="section-content">
            <h4>信用评分历史</h4>
            <div class="score-history">
              <div class="history-chart">
                <div class="chart-placeholder">
                  <el-icon size="64" color="#409EFF"><TrendCharts /></el-icon>
                  <p>信用评分历史趋势图</p>
                </div>
              </div>
              
              <div class="history-stats">
                <div class="stat-item">
                  <span class="stat-label">最高评分</span>
                  <span class="stat-value">85</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">最低评分</span>
                  <span class="stat-value">72</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">平均评分</span>
                  <span class="stat-value">78</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">趋势</span>
                  <span class="stat-value positive">上升</span>
                </div>
              </div>
            </div>
            
            <h4>重要事件记录</h4>
            <div class="event-timeline">
              <div 
                v-for="event in reportData.historyInfo.events" 
                :key="event.id" 
                class="event-item"
              >
                <div class="event-time">{{ event.time }}</div>
                <div class="event-content">{{ event.content }}</div>
                <div class="event-impact">
                  <el-tag :type="getEventTagType(event.impact)" size="small">
                    {{ event.impact }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!-- 报告结论 -->
    <el-card class="conclusion-card">
      <template #header>
        <span>报告结论</span>
      </template>
      
      <div class="conclusion-content">
        <div class="final-rating">
          <h4>最终信用评级：{{ reportData.finalRating }}</h4>
          <p>{{ reportData.conclusion }}</p>
        </div>
        
        <div class="recommendations">
          <h4>信用提升建议</h4>
          <ul>
            <li v-for="recommendation in reportData.recommendations" :key="recommendation">
              {{ recommendation }}
            </li>
          </ul>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  DocumentAdd, 
  Download, 
  Printer, 
  TrendCharts 
} from '@element-plus/icons-vue'

export default {
  name: 'EnterpriseCreditReport',
  components: {
    DocumentAdd,
    Download,
    Printer,
    TrendCharts
  },
  setup() {
    // 激活的章节
    const activeSections = ref(['basic', 'financial', 'operation', 'risk', 'history'])

    // 报告数据
    const reportData = ref({
      reportNo: 'CR20240115001',
      generateTime: '2024-01-15 10:30:00',
      validity: '2024-04-15',
      creditScore: 82,
      scoreLevel: '良好',
      industryAverage: 75,
      scoreDifference: 7,
      
      dimensions: [
        { id: 1, name: '财务状况', score: 85 },
        { id: 2, name: '经营能力', score: 78 },
        { id: 3, name: '偿债能力', score: 80 },
        { id: 4, name: '行业地位', score: 75 },
        { id: 5, name: '信用历史', score: 82 }
      ],
      
      basicInfo: {
        name: '海南科技有限公司',
        creditCode: '91460000MA5TXXXXXX',
        legalPerson: '张三',
        registeredCapital: 1000,
        establishDate: '2018-05-20',
        industry: '信息技术服务',
        address: '海南省海口市美兰区海府路88号'
      },
      
      financialInfo: {
        totalAssets: 12500,
        totalRevenue: 8500,
        netProfit: 1275,
        debtRatio: 45.2,
        conclusion: '企业财务状况整体良好，盈利能力稳定，资产负债结构合理。'
      },
      
      operationInfo: {
        metrics: [
          {
            id: 1,
            name: '营业收入增长率',
            value: '12.8%',
            status: '良好',
            description: '高于行业平均8%'
          },
          {
            id: 2,
            name: '市场份额',
            value: '15.2%',
            status: '优秀',
            description: '区域市场领先'
          },
          {
            id: 3,
            name: '客户满意度',
            value: '92%',
            status: '优秀',
            description: '客户评价良好'
          }
        ],
        conclusion: '企业经营能力较强，市场地位稳固，发展前景良好。'
      },
      
      riskInfo: {
        factors: [
          {
            id: 1,
            name: '财务风险',
            description: '资产负债率控制良好',
            level: 'low',
            levelText: '低风险'
          },
          {
            id: 2,
            name: '经营风险',
            description: '市场竞争加剧',
            level: 'medium',
            levelText: '中风险'
          },
          {
            id: 3,
            name: '行业风险',
            description: '政策变化影响',
            level: 'medium',
            levelText: '中风险'
          }
        ],
        suggestions: [
          '加强应收账款管理，提高资金周转效率',
          '关注行业政策变化，及时调整经营策略',
          '建立风险预警机制，防范潜在风险'
        ]
      },
      
      historyInfo: {
        events: [
          {
            id: 1,
            time: '2023-12-20',
            content: '完成重大项目交付',
            impact: '正面'
          },
          {
            id: 2,
            time: '2023-11-15',
            content: '获得高新技术企业认证',
            impact: '正面'
          },
          {
            id: 3,
            time: '2023-10-08',
            content: '完成新一轮融资',
            impact: '正面'
          }
        ]
      },
      
      finalRating: 'BBB+',
      conclusion: '企业信用状况良好，具备较强的偿债能力和经营能力，信用风险可控。',
      recommendations: [
        '继续保持良好的财务透明度',
        '加强应收账款管理',
        '关注行业政策变化',
        '定期更新信用报告'
      ]
    })

    // 方法
    const generateReport = () => {
      ElMessage.success('正在生成新的信用报告...')
    }

    const exportReport = () => {
      ElMessage.success('信用报告导出成功')
    }

    const printReport = () => {
      ElMessage.info('准备打印信用报告')
    }

    const getScoreTagType = (level) => {
      const typeMap = {
        '优秀': 'success',
        '良好': 'primary',
        '一般': 'warning',
        '较差': 'danger'
      }
      return typeMap[level] || 'info'
    }

    const getDimensionColor = (score) => {
      if (score >= 80) return '#67C23A'
      if (score >= 60) return '#E6A23C'
      return '#F56C6C'
    }

    const getMetricTagType = (status) => {
      const typeMap = {
        '优秀': 'success',
        '良好': 'primary',
        '一般': 'warning'
      }
      return typeMap[status] || 'info'
    }

    const getRiskTagType = (level) => {
      const typeMap = {
        'low': 'success',
        'medium': 'warning',
        'high': 'danger'
      }
      return typeMap[level] || 'info'
    }

    const getEventTagType = (impact) => {
      return impact === '正面' ? 'success' : 'info'
    }

    return {
      activeSections,
      reportData,
      generateReport,
      exportReport,
      printReport,
      getScoreTagType,
      getDimensionColor,
      getMetricTagType,
      getRiskTagType,
      getEventTagType
    }
  }
}
</script>

<style scoped>
.enterprise-credit-report {
  padding: 20px;
}

.report-header {
  margin-bottom: 30px;
  text-align: center;
}

.report-header h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.report-header p {
  color: #909399;
  font-size: 14px;
}

/* 报告概览 */
.overview-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-info {
  display: flex;
  gap: 30px;
}

.info-item label {
  font-weight: 600;
  color: #606266;
  margin-right: 8px;
}

.info-item span {
  color: #303133;
}

.report-actions {
  display: flex;
  gap: 10px;
}

/* 信用评分 */
.score-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
}

.main-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.score-circle {
  text-align: center;
  padding: 30px;
  background: #f0f9ff;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.score-value {
  font-size: 36px;
  font-weight: bold;
  color: #409EFF;
}

.score-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.score-details {
  text-align: center;
}

.score-level {
  margin-bottom: 10px;
}

.score-comparison {
  font-size: 14px;
  color: #606266;
}

.comparison-diff {
  margin-left: 10px;
  font-weight: 600;
}

.comparison-diff.positive {
  color: #67C23A;
}

.dimension-scores {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dimension-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.dimension-name {
  width: 100px;
  font-size: 14px;
  color: #606266;
}

.dimension-score {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-text {
  width: 40px;
  text-align: right;
  font-weight: 600;
  color: #303133;
}

/* 报告内容 */
.section-content {
  padding: 20px 0;
}

.section-content h4 {
  margin-bottom: 15px;
  color: #303133;
}

.financial-metrics,
.operation-metrics,
.risk-factors {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.metric-name {
  color: #606266;
}

.metric-value {
  font-weight: 600;
  color: #303133;
}

.metric-trend {
  font-size: 12px;
  font-weight: 600;
}

.metric-trend.positive {
  color: #67C23A;
}

.metric-trend.negative {
  color: #F56C6C;
}

.operation-metric {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.risk-factor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.risk-factor.high {
  background: #fef0f0;
}

.risk-factor.medium {
  background: #fdf6ec;
}

.risk-suggestions {
  color: #606266;
  line-height: 1.6;
}

.risk-suggestions li {
  margin-bottom: 8px;
}

/* 信用历史 */
.score-history {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 20px;
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

.history-stats {
  display: grid;
  grid-template-columns: 1fr;
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

.event-timeline {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.event-time {
  width: 100px;
  font-size: 12px;
  color: #909399;
}

.event-content {
  flex: 1;
  color: #606266;
}

/* 报告结论 */
.conclusion-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.final-rating h4 {
  color: #409EFF;
  margin-bottom: 15px;
}

.final-rating p {
  color: #606266;
  line-height: 1.6;
}

.recommendations h4 {
  margin-bottom: 15px;
  color: #303133;
}

.recommendations ul {
  color: #606266;
  line-height: 1.6;
}

.recommendations li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .overview-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .report-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .score-content {
    grid-template-columns: 1fr;
  }
  
  .score-history {
    grid-template-columns: 1fr;
  }
  
  .conclusion-content {
    grid-template-columns: 1fr;
  }
}
</style>