<template>
  <div class="industry-analysis">
    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="行业类型">
          <el-select v-model="filterForm.industry" placeholder="请选择行业" style="width: 200px">
            <el-option label="全部行业" value="" />
            <el-option label="信息技术" value="it" />
            <el-option label="金融服务" value="finance" />
            <el-option label="制造业" value="manufacturing" />
            <el-option label="批发零售" value="retail" />
            <el-option label="房地产" value="realestate" />
            <el-option label="交通运输" value="transportation" />
            <el-option label="医疗健康" value="healthcare" />
            <el-option label="教育培训" value="education" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            style="width: 300px"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 行业风险概览 -->
    <el-row :gutter="20" class="overview-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="color: #67C23A;">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ industryStats.avgRiskScore }}</div>
              <div class="stat-label">行业平均风险分</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="color: #E6A23C;">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ industryStats.highRiskCount }}</div>
              <div class="stat-label">高风险企业数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="color: #409EFF;">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ industryStats.riskTrend }}</div>
              <div class="stat-label">风险趋势</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="color: #909399;">
              <el-icon><DataAnalysis /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ industryStats.analysisCount }}</div>
              <div class="stat-label">分析企业数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 行业风险对比图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>行业风险对比</span>
          </template>
          <div id="industryComparisonChart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>风险趋势分析</span>
          </template>
          <div id="riskTrendChart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 行业详细分析 -->
    <el-card class="detail-card">
      <template #header>
        <span>行业详细分析</span>
      </template>
      
      <el-table :data="industryDetails" style="width: 100%">
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="enterpriseCount" label="企业数量" width="100" />
        <el-table-column prop="avgRiskScore" label="平均风险分" width="100">
          <template #default="{ row }">
            <el-tag :type="row.avgRiskScore < 40 ? 'success' : row.avgRiskScore < 60 ? 'warning' : 'danger'">
              {{ row.avgRiskScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="highRiskRatio" label="高风险比例" width="120">
          <template #default="{ row }">
            {{ row.highRiskRatio }}%
          </template>
        </el-table-column>
        <el-table-column prop="riskTrend" label="风险趋势" width="100">
          <template #default="{ row }">
            <el-tag :type="row.riskTrend === '上升' ? 'danger' : row.riskTrend === '下降' ? 'success' : 'warning'">
              {{ row.riskTrend }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mainRiskFactors" label="主要风险因素" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewIndustryDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 行业详情对话框 -->
    <el-dialog v-model="detailVisible" :title="currentIndustry ? `${currentIndustry.industry}行业分析` : '行业分析'" width="800px">
      <div v-if="currentIndustry">
        <el-descriptions title="行业概况" :column="2" border>
          <el-descriptions-item label="行业名称">{{ currentIndustry.industry }}</el-descriptions-item>
          <el-descriptions-item label="企业数量">{{ currentIndustry.enterpriseCount }} 家</el-descriptions-item>
          <el-descriptions-item label="平均风险分">
            <el-tag :type="currentIndustry.avgRiskScore < 40 ? 'success' : currentIndustry.avgRiskScore < 60 ? 'warning' : 'danger'">
              {{ currentIndustry.avgRiskScore }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="高风险比例">{{ currentIndustry.highRiskRatio }}%</el-descriptions-item>
        </el-descriptions>
        
        <el-divider />
        
        <h4>风险因素分析</h4>
        <el-table :data="currentIndustry.riskFactors" style="width: 100%; margin: 15px 0;">
          <el-table-column prop="factor" label="风险因素" width="200" />
          <el-table-column prop="score" label="平均得分" width="100">
            <template #default="{ row }">
              {{ row.score }}分
            </template>
          </el-table-column>
          <el-table-column prop="impact" label="影响程度">
            <template #default="{ row }">
              <el-progress 
                :percentage="row.impact" 
                :show-text="false"
                :color="row.impact > 70 ? '#F56C6C' : row.impact > 40 ? '#E6A23C' : '#67C23A'"
              />
            </template>
          </el-table-column>
          <el-table-column prop="description" label="风险描述" />
        </el-table>
        
        <h4>行业建议</h4>
        <el-collapse>
          <el-collapse-item 
            v-for="(suggestion, index) in currentIndustry.suggestions" 
            :key="index" 
            :title="suggestion.title"
          >
            <p>{{ suggestion.content }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'IndustryAnalysis',
  setup() {
    const filterForm = ref({
      industry: '',
      dateRange: ''
    })

    const industryStats = ref({
      avgRiskScore: 58,
      highRiskCount: 234,
      riskTrend: '稳定',
      analysisCount: 12543
    })

    const industryDetails = ref([
      {
        industry: '制造业',
        enterpriseCount: 2568,
        avgRiskScore: 65,
        highRiskRatio: 12.5,
        riskTrend: '上升',
        mainRiskFactors: '原材料成本上升，市场需求疲软',
        riskFactors: [
          { factor: '成本控制', score: 60, impact: 75, description: '原材料成本持续上涨' },
          { factor: '市场需求', score: 55, impact: 70, description: '市场需求增长放缓' },
          { factor: '技术创新', score: 70, impact: 60, description: '技术更新换代压力大' }
        ],
        suggestions: [
          { title: '成本优化', content: '建议加强供应链管理，优化成本结构' },
          { title: '市场拓展', content: '建议开拓新兴市场，降低单一市场依赖' }
        ]
      },
      {
        industry: '信息技术',
        enterpriseCount: 1896,
        avgRiskScore: 45,
        highRiskRatio: 8.2,
        riskTrend: '下降',
        mainRiskFactors: '技术迭代快，人才竞争激烈',
        riskFactors: [
          { factor: '技术迭代', score: 70, impact: 65, description: '技术更新速度快' },
          { factor: '人才竞争', score: 65, impact: 60, description: '高端人才竞争激烈' },
          { factor: '市场前景', score: 80, impact: 40, description: '行业发展前景良好' }
        ],
        suggestions: [
          { title: '人才培养', content: '建议加强人才培养和引进' },
          { title: '技术创新', content: '建议加大研发投入，保持技术领先' }
        ]
      },
      {
        industry: '金融业',
        enterpriseCount: 856,
        avgRiskScore: 55,
        highRiskRatio: 9.8,
        riskTrend: '稳定',
        mainRiskFactors: '监管政策变化，市场波动',
        riskFactors: [
          { factor: '政策监管', score: 65, impact: 70, description: '监管政策趋严' },
          { factor: '市场波动', score: 60, impact: 65, description: '金融市场波动较大' },
          { factor: '风险管理', score: 75, impact: 55, description: '风险管理能力较强' }
        ],
        suggestions: [
          { title: '合规管理', content: '建议加强合规体系建设' },
          { title: '风险控制', content: '建议完善风险管理机制' }
        ]
      }
    ])

    const detailVisible = ref(false)
    const currentIndustry = ref(null)

    const handleSearch = () => {
      // 模拟搜索逻辑
      console.log('搜索条件:', filterForm.value)
    }

    const handleReset = () => {
      filterForm.value = {
        industry: '',
        dateRange: ''
      }
    }

    const handleViewIndustryDetail = (row) => {
      currentIndustry.value = row
      detailVisible.value = true
    }

    const initCharts = () => {
      // 行业风险对比图
      const comparisonChartDom = document.getElementById('industryComparisonChart')
      if (comparisonChartDom) {
        const comparisonChart = echarts.init(comparisonChartDom)
        const comparisonOption = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['平均风险分', '高风险比例']
          },
          xAxis: {
            type: 'category',
            data: ['制造业', '信息技术', '金融业', '房地产业', '旅游业']
          },
          yAxis: [
            {
              type: 'value',
              name: '风险分',
              min: 0,
              max: 100
            },
            {
              type: 'value',
              name: '比例',
              min: 0,
              max: 20
            }
          ],
          series: [
            {
              name: '平均风险分',
              type: 'bar',
              data: [65, 45, 55, 70, 35],
              itemStyle: {
                color: function(params) {
                  const value = params.value
                  if (value < 40) return '#67C23A'
                  if (value < 60) return '#E6A23C'
                  return '#F56C6C'
                }
              }
            },
            {
              name: '高风险比例',
              type: 'line',
              yAxisIndex: 1,
              data: [12.5, 8.2, 9.8, 15.3, 6.5]
            }
          ]
        }
        comparisonChart.setOption(comparisonOption)
      }

      // 风险趋势分析图
      const trendChartDom = document.getElementById('riskTrendChart')
      if (trendChartDom) {
        const trendChart = echarts.init(trendChartDom)
        const trendOption = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['制造业', '信息技术', '金融业']
          },
          xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          },
          yAxis: {
            type: 'value',
            name: '风险分'
          },
          series: [
            {
              name: '制造业',
              type: 'line',
              data: [62, 63, 64, 65, 66, 65, 64, 65, 66, 67, 68, 69],
              smooth: true
            },
            {
              name: '信息技术',
              type: 'line',
              data: [50, 48, 47, 46, 45, 44, 43, 44, 45, 44, 43, 42],
              smooth: true
            },
            {
              name: '金融业',
              type: 'line',
              data: [55, 54, 55, 56, 55, 54, 55, 56, 55, 54, 55, 56],
              smooth: true
            }
          ]
        }
        trendChart.setOption(trendOption)
      }

      // 响应式调整
      window.addEventListener('resize', () => {
        if (comparisonChartDom) comparisonChart.resize()
        if (trendChartDom) trendChart.resize()
      })
    }

    onMounted(() => {
      setTimeout(initCharts, 100)
    })

    return {
      filterForm,
      industryStats,
      industryDetails,
      detailVisible,
      currentIndustry,
      handleSearch,
      handleReset,
      handleViewIndustryDetail
    }
  }
}
</script>

<style scoped>
.industry-analysis {
  padding: 0;
}

.filter-card {
  margin-bottom: 20px;
}

.overview-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 100px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
  height: 100%;
}

.stat-icon {
  font-size: 36px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.chart-row {
  margin-bottom: 20px;
}

.detail-card {
  margin-top: 20px;
}

h4 {
  color: #303133;
  margin: 15px 0 10px;
  font-size: 16px;
}
</style>