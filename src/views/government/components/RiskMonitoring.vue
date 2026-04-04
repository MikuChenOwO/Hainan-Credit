<template>
  <div class="risk-monitoring">
    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="行业类型">
          <el-select v-model="filterForm.industry" placeholder="全部行业" style="width: 180px">
            <el-option label="全部" value="" />
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
        
        <el-form-item label="风险等级">
          <el-select v-model="filterForm.riskLevel" placeholder="全部等级" style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="低风险" value="low" />
            <el-option label="中风险" value="medium" />
            <el-option label="高风险" value="high" />
            <el-option label="极高风险" value="critical" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="地区">
          <el-select v-model="filterForm.region" placeholder="全部地区" style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="海口市" value="haikou" />
            <el-option label="三亚市" value="sanya" />
            <el-option label="儋州市" value="danzhou" />
            <el-option label="琼海市" value="qionghai" />
            <el-option label="文昌市" value="wenchang" />
            <el-option label="万宁市" value="wanning" />
            <el-option label="东方市" value="dongfang" />
            <el-option label="五指山市" value="wuzhishan" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 风险企业列表 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>风险企业监控列表</span>
          <span>共 {{ totalEnterprises }} 家企业</span>
        </div>
      </template>
      
      <el-table :data="enterpriseList" style="width: 100%">
        <el-table-column prop="name" label="企业名称" width="200" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="region" label="地区" width="100" />
        <el-table-column prop="riskLevel" label="风险等级" width="120">
          <template #default="{ row }">
            <el-tag 
              :type="row.riskLevel === '低风险' ? 'success' : row.riskLevel === '中风险' ? 'warning' : 'danger'"
            >
              {{ row.riskLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="riskScore" label="风险分数" width="100">
          <template #default="{ row }">
            {{ row.riskScore }}
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdate" label="最后更新" width="180" />
        <el-table-column prop="mainRisk" label="主要风险" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row)">查看详情</el-button>
            <el-button type="warning" link @click="handleSendAlert(row)">发送预警</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalEnterprises"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 风险分布图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>风险等级分布</span>
          </template>
          <div id="riskDistributionChart" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>行业风险对比</span>
          </template>
          <div id="industryRiskChart" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="企业风险详情" width="900px">
      <div v-if="currentEnterprise">
        <el-descriptions title="基本信息" :column="3" border>
          <el-descriptions-item label="企业名称">{{ currentEnterprise.name }}</el-descriptions-item>
          <el-descriptions-item label="统一信用代码">{{ currentEnterprise.creditCode }}</el-descriptions-item>
          <el-descriptions-item label="行业类型">{{ currentEnterprise.industry }}</el-descriptions-item>
          <el-descriptions-item label="地区">{{ currentEnterprise.region }}</el-descriptions-item>
          <el-descriptions-item label="注册资本">{{ currentEnterprise.registeredCapital }}万元</el-descriptions-item>
          <el-descriptions-item label="成立时间">{{ currentEnterprise.establishDate }}</el-descriptions-item>
        </el-descriptions>
        
        <el-divider />
        
        <h4>风险分析</h4>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="risk-info-card">
              <div class="risk-level" :class="currentEnterprise.riskLevel">
                {{ currentEnterprise.riskLevel }}
              </div>
              <div class="risk-score">风险分数：{{ currentEnterprise.riskScore }}</div>
            </div>
          </el-col>
          <el-col :span="16">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="主要风险">{{ currentEnterprise.mainRisk }}</el-descriptions-item>
              <el-descriptions-item label="风险趋势">
                <el-tag :type="currentEnterprise.trend === '上升' ? 'danger' : currentEnterprise.trend === '下降' ? 'success' : 'warning'">
                  {{ currentEnterprise.trend }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="最后评估时间">{{ currentEnterprise.lastUpdate }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
        
        <el-divider />
        
        <h4>风险因素分析</h4>
        <el-table :data="currentEnterprise.riskFactors" style="width: 100%; margin: 15px 0;">
          <el-table-column prop="factor" label="风险因素" width="200" />
          <el-table-column prop="score" label="得分" width="100">
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
          <el-table-column prop="suggestion" label="改善建议" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'RiskMonitoring',
  setup() {
    const filterForm = ref({
      industry: '',
      riskLevel: '',
      region: ''
    })

    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalEnterprises = ref(0)
    const enterpriseList = ref([])
    const detailVisible = ref(false)
    const currentEnterprise = ref(null)

    // 模拟企业数据
    const mockEnterpriseData = [
      {
        id: 1,
        name: '海南科技有限公司',
        creditCode: '91460000MA5T123456',
        industry: '信息技术',
        region: '海口市',
        registeredCapital: 1000,
        establishDate: '2018-05-20',
        riskLevel: '中风险',
        riskScore: 65,
        mainRisk: '负债率偏高，现金流紧张',
        trend: '上升',
        lastUpdate: '2024-01-15 14:30:25',
        riskFactors: [
          { factor: '财务杠杆', score: 60, impact: 75, suggestion: '建议降低负债率' },
          { factor: '现金流', score: 55, impact: 70, suggestion: '建议改善现金流管理' },
          { factor: '盈利能力', score: 70, impact: 60, suggestion: '盈利能力良好' },
          { factor: '行业前景', score: 80, impact: 50, suggestion: '行业前景良好' }
        ]
      },
      {
        id: 2,
        name: '三亚旅游发展有限公司',
        creditCode: '91460000MA5T654321',
        industry: '旅游业',
        region: '三亚市',
        registeredCapital: 5000,
        establishDate: '2015-08-12',
        riskLevel: '低风险',
        riskScore: 35,
        mainRisk: '季节性波动较大',
        trend: '稳定',
        lastUpdate: '2024-01-14 10:15:30',
        riskFactors: [
          { factor: '财务杠杆', score: 85, impact: 30, suggestion: '财务状况良好' },
          { factor: '现金流', score: 80, impact: 35, suggestion: '现金流充足' },
          { factor: '盈利能力', score: 75, impact: 40, suggestion: '盈利能力稳定' },
          { factor: '行业前景', score: 70, impact: 45, suggestion: '行业前景稳定' }
        ]
      },
      {
        id: 3,
        name: '儋州制造实业有限公司',
        creditCode: '91460000MA5T789012',
        industry: '制造业',
        region: '儋州市',
        registeredCapital: 2000,
        establishDate: '2016-03-08',
        riskLevel: '高风险',
        riskScore: 78,
        mainRisk: '连续亏损，债务压力大',
        trend: '上升',
        lastUpdate: '2024-01-13 16:45:12',
        riskFactors: [
          { factor: '财务杠杆', score: 45, impact: 85, suggestion: '急需债务重组' },
          { factor: '现金流', score: 40, impact: 80, suggestion: '现金流严重不足' },
          { factor: '盈利能力', score: 35, impact: 75, suggestion: '连续亏损需关注' },
          { factor: '行业前景', score: 60, impact: 55, suggestion: '行业竞争激烈' }
        ]
      }
    ]

    const loadEnterpriseData = () => {
      enterpriseList.value = mockEnterpriseData
      totalEnterprises.value = mockEnterpriseData.length
    }

    const handleSearch = () => {
      loadEnterpriseData()
    }

    const handleReset = () => {
      filterForm.value = {
        industry: '',
        riskLevel: '',
        region: ''
      }
      loadEnterpriseData()
    }

    const handleViewDetail = (row) => {
      currentEnterprise.value = row
      detailVisible.value = true
    }

    const handleSendAlert = async (row) => {
      try {
        await ElMessageBox.confirm(`确定要向 ${row.name} 发送风险预警吗？`, '发送预警', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        ElMessage.success('预警信息已发送')
      } catch {
        // 用户取消发送
      }
    }

    const initCharts = () => {
      // 风险等级分布图
      const riskChartDom = document.getElementById('riskDistributionChart')
      if (riskChartDom) {
        const riskChart = echarts.init(riskChartDom)
        const riskOption = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [{
            name: '风险等级分布',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 856, name: '低风险' },
              { value: 234, name: '中风险' },
              { value: 89, name: '高风险' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        }
        riskChart.setOption(riskOption)
      }

      // 行业风险对比图
      const industryChartDom = document.getElementById('industryRiskChart')
      if (industryChartDom) {
        const industryChart = echarts.init(industryChartDom)
        const industryOption = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: ['制造业', '信息技术', '金融业', '房地产业', '旅游业']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [65, 45, 55, 70, 35],
            type: 'bar',
            itemStyle: {
              color: function(params) {
                const value = params.value
                if (value < 40) return '#67C23A'
                if (value < 60) return '#E6A23C'
                return '#F56C6C'
              }
            }
          }]
        }
        industryChart.setOption(industryOption)
      }

      // 响应式调整
      window.addEventListener('resize', () => {
        if (riskChartDom) riskChart.resize()
        if (industryChartDom) industryChart.resize()
      })
    }

    onMounted(() => {
      loadEnterpriseData()
      setTimeout(initCharts, 100)
    })

    return {
      filterForm,
      currentPage,
      pageSize,
      totalEnterprises,
      enterpriseList,
      detailVisible,
      currentEnterprise,
      handleSearch,
      handleReset,
      handleViewDetail,
      handleSendAlert
    }
  }
}
</script>

<style scoped>
.risk-monitoring {
  padding: 0;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.filter-form .el-form-item {
  margin-bottom: 0;
  margin-right: 0;
}

/* 确保下拉框宽度和选项显示 */
.filter-form .el-select {
  min-width: 150px;
}

.filter-form .el-select .el-input__inner {
  width: 100% !important;
  min-width: 150px;
}

/* 下拉框选项显示优化 */
.el-select-dropdown {
  min-width: 180px !important;
}

.el-select-dropdown__item {
  padding: 0 20px;
  height: 34px;
  line-height: 34px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-select-dropdown__item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
}

/* 选中项显示优化 */
.el-select .el-input__inner {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.chart-row {
  margin-top: 20px;
}

.risk-info-card {
  text-align: center;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

.risk-level {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.risk-level.低风险 {
  color: #67C23A;
}

.risk-level.中风险 {
  color: #E6A23C;
}

.risk-level.高风险 {
  color: #F56C6C;
}

.risk-score {
  color: #606266;
  font-size: 14px;
}

h4 {
  color: #303133;
  margin: 15px 0 10px;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-form {
    gap: 10px;
  }
  
  .filter-form .el-select {
    min-width: 140px;
  }
}

@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .filter-form .el-form-item {
    width: 100%;
  }
  
  .filter-form .el-select {
    width: 100% !important;
    min-width: auto;
  }
}
</style>