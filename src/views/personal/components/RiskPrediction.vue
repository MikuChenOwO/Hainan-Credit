<template>
  <div class="risk-prediction">
    <el-card class="input-card">
      <template #header>
        <div class="card-header">
          <span>风险预测输入</span>
          <div class="header-actions">
            <el-button type="primary" link @click="loadProfileData">从个人资料导入</el-button>
            <el-progress
              :percentage="dataCompletion"
              :status="dataCompletion >= 80 ? 'success' : dataCompletion >= 60 ? 'warning' : 'exception'"
              style="width: 200px;"
            />
          </div>
        </div>
      </template>

      <el-form :model="predictionForm" label-width="120px">
        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="身份与就业" name="basic">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="年龄">
                  <el-input-number v-model="predictionForm.age" :min="18" :max="80" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学历">
                  <el-select v-model="predictionForm.education" placeholder="请选择学历">
                    <el-option label="高中及以下" value="高中及以下" />
                    <el-option label="大专" value="大专" />
                    <el-option label="本科" value="本科" />
                    <el-option label="硕士及以上" value="硕士及以上" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="职业">
                  <el-input v-model="predictionForm.occupation" placeholder="请输入职业" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="工作年限">
                  <el-input-number v-model="predictionForm.workYears" :min="0" :max="60" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="社保年限">
                  <el-input-number v-model="predictionForm.socialInsuranceYears" :min="0" :max="60" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="公积金状态">
                  <el-select v-model="predictionForm.providentFundStatus">
                    <el-option label="正常缴存" value="正常缴存" />
                    <el-option label="未缴存" value="未缴存" />
                    <el-option label="停缴" value="停缴" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="收入与资产" name="asset">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="月固定收入">
                  <el-input-number v-model="predictionForm.income" :min="0" :step="1000" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="其他月收入">
                  <el-input-number v-model="predictionForm.otherIncome" :min="0" :step="500" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="月均支出">
                  <el-input-number v-model="predictionForm.monthlyExpense" :min="0" :step="500" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="银行存款">
                  <el-input-number v-model="predictionForm.bankDeposit" :min="0" :step="10000" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="理财/投资">
                  <el-input-number v-model="predictionForm.investments" :min="0" :step="10000" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="房产估值">
                  <el-input-number v-model="predictionForm.realEstateValue" :min="0" :step="10000" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="车辆估值">
                  <el-input-number v-model="predictionForm.vehicleValue" :min="0" :step="5000" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="资产合计">
                  <el-input-number :model-value="assetTotal" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="负债与信贷" name="credit">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="房贷余额">
                  <el-input-number v-model="predictionForm.mortgageBalance" :min="0" :step="10000" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="车贷余额">
                  <el-input-number v-model="predictionForm.carLoanBalance" :min="0" :step="5000" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="消费贷余额">
                  <el-input-number v-model="predictionForm.consumerLoanBalance" :min="0" :step="5000" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="信用卡已用">
                  <el-input-number v-model="predictionForm.creditCardUsed" :min="0" :step="1000" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="信用卡额度">
                  <el-input-number v-model="predictionForm.creditCardLimit" :min="0" :step="1000" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="负债合计">
                  <el-input-number :model-value="debtTotal" disabled />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="贷款笔数">
                  <el-input-number v-model="predictionForm.loanCount" :min="0" :max="99" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="近12月逾期">
                  <el-input-number v-model="predictionForm.overdueCount" :min="0" :max="99" />
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

    <el-card class="result-card" v-if="showResult">
      <template #header>
        <div class="card-header">
          <span>风险预测结果</span>
        </div>
      </template>

      <div class="result-content">
        <div class="risk-level">
          <div class="gauge-chart">
            <div id="gaugeChart" style="width: 300px; height: 200px;"></div>
          </div>
          <div class="risk-info">
            <h3 :style="{ color: riskColor }">{{ riskLevel }}</h3>
            <p>风险概率：{{ riskProbability }}%</p>
            <p>债务收入比：{{ debtIncomeRatio }}%</p>
            <p>预测时间：{{ predictionTime }}</p>
          </div>
        </div>

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
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { createDefaultPersonalInfo, getCurrentUserProfile } from '@/utils/auth'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const sumValues = (...values) => values.reduce((sum, value) => sum + Number(value || 0), 0)

const createDefaultPredictionForm = () => ({
  age: 30,
  education: '',
  occupation: '',
  workYears: 0,
  socialInsuranceYears: 0,
  providentFundStatus: '',
  income: 0,
  otherIncome: 0,
  monthlyExpense: 0,
  bankDeposit: 0,
  investments: 0,
  realEstateValue: 0,
  vehicleValue: 0,
  mortgageBalance: 0,
  carLoanBalance: 0,
  consumerLoanBalance: 0,
  creditCardUsed: 0,
  creditCardLimit: 0,
  loanCount: 0,
  overdueCount: 0
})

export default {
  name: 'RiskPrediction',
  setup() {
    const predictionForm = ref(createDefaultPredictionForm())
    const activeCollapse = ref(['basic', 'asset', 'credit'])
    const predicting = ref(false)
    const showResult = ref(false)
    const riskLevel = ref('')
    const riskProbability = ref(0)
    const predictionTime = ref('')
    const gaugeChart = ref(null)

    const assetTotal = computed(() =>
      sumValues(
        predictionForm.value.bankDeposit,
        predictionForm.value.investments,
        predictionForm.value.realEstateValue,
        predictionForm.value.vehicleValue
      )
    )

    const debtTotal = computed(() =>
      sumValues(
        predictionForm.value.mortgageBalance,
        predictionForm.value.carLoanBalance,
        predictionForm.value.consumerLoanBalance,
        predictionForm.value.creditCardUsed
      )
    )

    const monthlyIncomeTotal = computed(() =>
      sumValues(predictionForm.value.income, predictionForm.value.otherIncome)
    )

    const disposableIncome = computed(() =>
      Math.max(0, monthlyIncomeTotal.value - Number(predictionForm.value.monthlyExpense || 0))
    )

    const debtIncomeRatio = computed(() => {
      if (!monthlyIncomeTotal.value) {
        return debtTotal.value ? 100 : 0
      }
      return Math.round((debtTotal.value / (monthlyIncomeTotal.value * 12)) * 100)
    })

    const dataCompletion = computed(() => {
      const requiredFields = [
        'age',
        'education',
        'occupation',
        'workYears',
        'income',
        'monthlyExpense',
        'bankDeposit',
        'creditCardLimit',
        'loanCount',
        'overdueCount'
      ]
      const filledFields = requiredFields.filter(key => {
        const value = predictionForm.value[key]
        return value !== '' && value !== null && value !== undefined
      }).length
      return Math.round((filledFields / requiredFields.length) * 100)
    })

    const riskColor = computed(() => {
      const probability = riskProbability.value
      if (probability < 30) return '#67C23A'
      if (probability < 60) return '#E6A23C'
      return '#F56C6C'
    })

    const influencingFactors = computed(() => [
      {
        factor: '负债压力',
        impact: clamp(Math.round(debtIncomeRatio.value), 0, 100),
        suggestion: debtIncomeRatio.value > 50 ? '建议优先压降消费贷和信用卡已用额度' : '负债压力处于可控区间'
      },
      {
        factor: '收入结余',
        impact: clamp(Math.round(100 - disposableIncome.value / 300), 0, 100),
        suggestion: disposableIncome.value < monthlyIncomeTotal.value * 0.25 ? '建议控制月均支出，提高可支配收入' : '收入结余较稳定'
      },
      {
        factor: '信用记录',
        impact: clamp(Math.round(predictionForm.value.overdueCount * 18), 0, 100),
        suggestion: predictionForm.value.overdueCount > 0 ? '建议保持连续按时还款，降低逾期记录影响' : '近12月无逾期记录'
      },
      {
        factor: '工作稳定性',
        impact: clamp(Math.round(80 - predictionForm.value.workYears * 8 - predictionForm.value.socialInsuranceYears * 4), 0, 100),
        suggestion: predictionForm.value.workYears < 2 ? '建议补充稳定就业和社保缴存信息' : '工作稳定性对风险有正向作用'
      },
      {
        factor: '资产覆盖',
        impact: clamp(Math.round(100 - assetTotal.value / Math.max(debtTotal.value || 1, 1) * 30), 0, 100),
        suggestion: assetTotal.value < debtTotal.value ? '建议提高流动资产或降低负债余额' : '资产覆盖能力较好'
      }
    ])

    const riskSuggestions = computed(() => [
      {
        title: '财务结构优化',
        content: debtIncomeRatio.value > 50
          ? '当前债务收入比偏高，建议优先偿还高息消费贷和信用卡欠款。'
          : '当前债务收入比整体可控，可继续保持稳定还款节奏。'
      },
      {
        title: '现金流管理',
        content: disposableIncome.value < monthlyIncomeTotal.value * 0.25
          ? '建议梳理固定支出，提升月度结余能力，增强短期偿付安全垫。'
          : '月度结余表现较好，可适当增加应急储蓄或稳健型资产配置。'
      },
      {
        title: '信用记录维护',
        content: predictionForm.value.overdueCount > 0
          ? '建议设置还款提醒，保持连续按时还款，逐步修复逾期记录影响。'
          : '当前信用记录较好，继续保持按时还款和适度授信使用。'
      }
    ])

    const mapProfileToPrediction = profile => {
      const personalInfo = {
        ...createDefaultPersonalInfo(profile?.realName || profile?.username),
        ...(profile?.personalInfo || {})
      }

      return {
        ...createDefaultPredictionForm(),
        age: Number(personalInfo.age) || 30,
        education: personalInfo.education || '',
        occupation: personalInfo.occupation || '',
        workYears: Number(personalInfo.workYears) || 0,
        socialInsuranceYears: Number(personalInfo.socialInsuranceYears) || 0,
        providentFundStatus: personalInfo.providentFundStatus || '',
        income: Number(personalInfo.income) || 0,
        otherIncome: Number(personalInfo.otherIncome) || 0,
        monthlyExpense: Number(personalInfo.monthlyExpense) || 0,
        bankDeposit: Number(personalInfo.bankDeposit) || 0,
        investments: Number(personalInfo.investments) || 0,
        realEstateValue: Number(personalInfo.realEstateValue) || 0,
        vehicleValue: Number(personalInfo.vehicleValue) || 0,
        mortgageBalance: Number(personalInfo.mortgageBalance) || 0,
        carLoanBalance: Number(personalInfo.carLoanBalance) || 0,
        consumerLoanBalance: Number(personalInfo.consumerLoanBalance) || 0,
        creditCardUsed: Number(personalInfo.creditCardUsed) || 0,
        creditCardLimit: Number(personalInfo.creditCardLimit) || 0,
        loanCount: Number(personalInfo.loanCount) || 0,
        overdueCount: Number(personalInfo.overdueCount) || 0
      }
    }

    const loadProfileData = () => {
      const profile = getCurrentUserProfile()
      predictionForm.value = mapProfileToPrediction(profile)
      showResult.value = false
      ElMessage.success('已导入个人资料信息')
    }

    const initGaugeChart = () => {
      const chartDom = document.getElementById('gaugeChart')
      if (!chartDom) return

      gaugeChart.value?.dispose()
      gaugeChart.value = echarts.init(chartDom)
      gaugeChart.value.setOption({
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
            itemStyle: { color: 'auto' }
          },
          axisTick: { length: 12, lineStyle: { color: 'auto', width: 2 } },
          splitLine: { length: 20, lineStyle: { color: 'auto', width: 5 } },
          axisLabel: {
            color: '#464646',
            fontSize: 12,
            distance: -60,
            formatter(value) {
              if (value === 0) return '低风险'
              if (value === 50) return '中风险'
              if (value === 100) return '高风险'
              return ''
            }
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter(value) {
              return `${value}%`
            },
            color: 'auto'
          },
          data: [{ value: riskProbability.value, name: '风险概率' }]
        }]
      })
    }

    const calculateRiskProbability = () => {
      const debtPressure = clamp(debtIncomeRatio.value * 0.9, 0, 45)
      const overduePressure = clamp(predictionForm.value.overdueCount * 8, 0, 30)
      const loanPressure = clamp(predictionForm.value.loanCount * 3, 0, 18)
      const cashFlowPressure = clamp(28 - disposableIncome.value / 600, 0, 28)
      const stabilityRelief = clamp(predictionForm.value.workYears * 2 + predictionForm.value.socialInsuranceYears * 1.5, 0, 20)
      const assetRelief = clamp(assetTotal.value / Math.max(debtTotal.value || 1, 1) * 8, 0, 18)

      return clamp(
        Math.round(28 + debtPressure + overduePressure + loanPressure + cashFlowPressure - stabilityRelief - assetRelief),
        5,
        95
      )
    }

    const handlePredict = async () => {
      if (dataCompletion.value < 60) {
        ElMessage.warning('请完善更多数据以提高预测准确性')
        return
      }

      predicting.value = true
      await new Promise(resolve => setTimeout(resolve, 1200))

      riskProbability.value = calculateRiskProbability()

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
      nextTick(initGaugeChart)
    }

    const handleReset = () => {
      predictionForm.value = createDefaultPredictionForm()
      showResult.value = false
    }

    const handleResize = () => {
      gaugeChart.value?.resize()
    }

    onMounted(() => {
      loadProfileData()
      window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      gaugeChart.value?.dispose()
    })

    return {
      activeCollapse,
      assetTotal,
      dataCompletion,
      debtIncomeRatio,
      debtTotal,
      handlePredict,
      handleReset,
      influencingFactors,
      loadProfileData,
      predictionForm,
      predictionTime,
      predicting,
      riskColor,
      riskLevel,
      riskProbability,
      riskSuggestions,
      showResult
    }
  }
}
</script>

<style scoped>
.risk-prediction {
  padding: 0;
}

.input-card,
.result-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.input-card :deep(.el-input-number),
.input-card :deep(.el-select),
.input-card :deep(.el-input) {
  width: 100%;
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

.factors-analysis,
.suggestions {
  margin-bottom: 30px;
}

.factors-analysis h4,
.suggestions h4 {
  color: #303133;
  margin-bottom: 15px;
  font-size: 16px;
}
</style>
