<template>
  <div class="risk-prediction">
    <!-- 输入表单区域 -->
    <el-card class="input-card">
      <template #header>
        <div class="card-header">
          <span>风险预测输入</span>
          <el-progress 
            :percentage="dataCompletion" 
            :status="dataCompletion >= 80 ? 'success' : dataCompletion >= 60 ? 'warning' : 'exception'"
            style="width: 200px;"
          />
        </div>
      </template>
      
      <el-form :model="predictionForm" label-width="120px">
        <!-- 基本信息 -->
        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="基本信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="年龄">
                  <el-input-number v-model="predictionForm.age" :min="18" :max="80" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="职业">
                  <el-select v-model="predictionForm.occupation" placeholder="请选择职业">
                    <el-option label="公务员" value="civil_servant" />
                    <el-option label="企业员工" value="employee" />
                    <el-option label="自由职业" value="freelancer" />
                    <el-option label="学生" value="student" />
                    <el-option label="其他" value="other" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="月收入">
                  <el-input-number v-model="predictionForm.income" :min="0" :step="1000" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          
          <!-- 财务数据 -->
          <el-collapse-item title="财务数据" name="financial">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="总资产">
                  <el-input-number v-model="predictionForm.assets" :min="0" :step="10000" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="总负债">
                  <el-input-number v-model="predictionForm.debt" :min="0" :step="10000" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="月还款额">
                  <el-input-number v-model="predictionForm.monthlyPayment" :min="0" :step="1000" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          
          <!-- 行为数据 -->
          <el-collapse-item title="行为数据" name="behavior">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="信用卡数量">
                  <el-input-number v-model="predictionForm.creditCards" :min="0" :max="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="贷款笔数">
                  <el-input-number v-model="predictionForm.loans" :min="0" :max="20" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="逾期次数">
                  <el-input-number v-model="predictionForm.overdueTimes" :min="0" :max="50" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        
        <el-form-item style="margin-top: 20px;">
          <el-button type="primary" @click="handlePredict" :loading="predicting">
            开始预测
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预测结果区域 -->
    <el-card class="result-card" v-if="showResult">
      <template #header>
        <div class="card-header">
          <span>风险预测结果</span>
        </div>
      </template>
      
      <div class="result-content">
        <!-- 风险等级展示 -->
        <div class="risk-level">
          <div class="gauge-chart">
            <div id="gaugeChart" style="width: 300px; height: 200px;"></div>
          </div>
          <div class="risk-info">
            <h3 :style="{ color: riskColor }">{{ riskLevel }}</h3>
            <p>风险概率：{{ riskProbability }}%</p>
            <p>预测时间：{{ predictionTime }}</p>
          </div>
        </div>
        
        <!-- 影响因素分析 -->
        <div class="factors-analysis">
          <h4>关键影响因素</h4>
          <el-table :data="influencingFactors" style="width: 100%">
            <el-table-column prop="factor" label="影响因素" />
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
        
        <!-- 建议措施 -->
        <div class="suggestions">
          <h4>风险改善建议</h4>
          <el-collapse>
            <el-collapse-item 
              v-for="(suggestion, index) in riskSuggestions" 
              :key="index" 
              :title="suggestion.title"
            >
              <p>{{ suggestion.content }}</p>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

export default {
  name: 'RiskPrediction',
  setup() {
    const predictionForm = ref({
      age: 30,
      occupation: '',
      income: 0,
      assets: 0,
      debt: 0,
      monthlyPayment: 0,
      creditCards: 0,
      loans: 0,
      overdueTimes: 0
    })

    const activeCollapse = ref(['basic', 'financial', 'behavior'])
    const predicting = ref(false)
    const showResult = ref(false)
    const riskLevel = ref('')
    const riskProbability = ref(0)
    const predictionTime = ref('')

    // 计算数据完整度
    const dataCompletion = computed(() => {
      const totalFields = 9
      const filledFields = Object.values(predictionForm.value).filter(value => 
        value !== '' && value !== 0 && value !== null && value !== undefined
      ).length
      return Math.round((filledFields / totalFields) * 100)
    })

    const riskColor = computed(() => {
      const probability = riskProbability.value
      if (probability < 30) return '#67C23A'
      if (probability < 60) return '#E6A23C'
      return '#F56C6C'
    })

    const influencingFactors = ref([
      { factor: '负债水平', impact: 75, suggestion: '建议减少负债，提高还款能力' },
      { factor: '收入稳定性', impact: 60, suggestion: '建议保持稳定收入来源' },
      { factor: '信用历史', impact: 45, suggestion: '建议按时还款，改善信用记录' },
      { factor: '资产状况', impact: 30, suggestion: '建议合理配置资产' }
    ])

    const riskSuggestions = ref([
      { 
        title: '财务规划建议', 
        content: '建议制定详细的财务规划，控制债务比例在合理范围内，提高储蓄率。'
      },
      { 
        title: '信用管理建议', 
        content: '建议按时还款，避免逾期，合理使用信用卡，保持良好的信用记录。'
      },
      { 
        title: '收入提升建议', 
        content: '建议通过技能提升或副业增加收入来源，提高还款能力。'
      }
    ])

    const initGaugeChart = () => {
      const chartDom = document.getElementById('gaugeChart')
      if (!chartDom) return
      
      const chart = echarts.init(chartDom)
      const option = {
        series: [{
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.3, '#67C23A'],
                [0.7, '#E6A23C'],
                [1, '#F56C6C']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 5
            }
          },
          axisLabel: {
            color: '#464646',
            fontSize: 12,
            distance: -60,
            formatter: function(value) {
              if (value === 0) return '低风险'
              if (value === 50) return '中风险'
              if (value === 100) return '高风险'
              return ''
            }
          },
          title: {
            offsetCenter: [0, '-20%'],
            fontSize: 14
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: function(value) {
              return value + '%'
            },
            color: 'auto'
          },
          data: [{
            value: riskProbability.value,
            name: '风险概率'
          }]
        }]
      }
      
      chart.setOption(option)
    }

    const handlePredict = async () => {
      if (dataCompletion.value < 50) {
        ElMessage.warning('请完善更多数据以提高预测准确性')
        return
      }

      predicting.value = true
      
      // 模拟预测过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 根据输入数据计算风险概率（简化逻辑）
      const riskScore = Math.min(
        (predictionForm.value.debt / (predictionForm.value.income * 12)) * 100,
        (predictionForm.value.overdueTimes * 10) + 20,
        100
      )
      
      riskProbability.value = Math.round(riskScore)
      
      if (riskProbability.value < 30) {
        riskLevel.value = '低风险'
      } else if (riskProbability.value < 60) {
        riskLevel.value = '中风险'
      } else {
        riskLevel.value = '高风险'
      }
      
      predictionTime.value = new Date().toLocaleString('zh-CN')
      showResult.value = true
      predicting.value = false
      
      // 初始化图表
      setTimeout(initGaugeChart, 100)
    }

    const handleReset = () => {
      predictionForm.value = {
        age: 30,
        occupation: '',
        income: 0,
        assets: 0,
        debt: 0,
        monthlyPayment: 0,
        creditCards: 0,
        loans: 0,
        overdueTimes: 0
      }
      showResult.value = false
    }

    onMounted(() => {
      // 初始化默认值
      predictionForm.value = {
        age: 35,
        occupation: 'employee',
        income: 15000,
        assets: 500000,
        debt: 200000,
        monthlyPayment: 5000,
        creditCards: 3,
        loans: 2,
        overdueTimes: 0
      }
    })

    return {
      predictionForm,
      activeCollapse,
      predicting,
      showResult,
      riskLevel,
      riskProbability,
      predictionTime,
      dataCompletion,
      riskColor,
      influencingFactors,
      riskSuggestions,
      handlePredict,
      handleReset
    }
  }
}
</script>

<style scoped>
.risk-prediction {
  padding: 0;
}

.input-card, .result-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.result-content {
  padding: 0 20px;
}

.risk-level {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 1px solid #e6e6e6;
}

.gauge-chart {
  flex-shrink: 0;
}

.risk-info {
  text-align: center;
}

.risk-info h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.risk-info p {
  color: #606266;
  margin: 5px 0;
}

.factors-analysis, .suggestions {
  margin-bottom: 30px;
}

.factors-analysis h4, .suggestions h4 {
  color: #303133;
  margin-bottom: 15px;
  font-size: 16px;
}
</style>