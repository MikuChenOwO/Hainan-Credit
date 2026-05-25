<template>
  <div class="user-profile">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-button type="primary" link @click="openEditDialog">编辑信息</el-button>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="8" v-for="item in basicInfoItems" :key="item.label">
          <div class="info-item">
            <label>{{ item.label }}：</label>
            <span>{{ item.value }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>工作与财务概览</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="8" v-for="item in financeInfoItems" :key="item.label">
          <div class="info-item">
            <label>{{ item.label }}：</label>
            <span>{{ item.value }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>联系与居住信息</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="8" v-for="item in extraInfoItems" :key="item.label">
          <div class="info-item">
            <label>{{ item.label }}：</label>
            <span>{{ item.value }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>多维信用画像</span>
        </div>
      </template>

      <div ref="radarChartRef" class="radar-chart"></div>
    </el-card>

    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>信用指标分析</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="6" v-for="item in creditMetrics" :key="item.label">
          <div class="metric-card">
            <div class="metric-value" :style="{ color: item.color }">{{ item.value }}</div>
            <div class="metric-label">{{ item.label }}</div>
            <div class="metric-desc">{{ item.desc }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      v-model="editDialogVisible"
      title="编辑个人详细信息"
      width="840px"
      destroy-on-close
    >
      <el-form :model="editForm" label-width="118px" class="profile-edit-form">
        <el-divider content-position="left">身份信息</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input v-model="editForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别">
              <el-select v-model="editForm.gender" style="width: 100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
                <el-option label="未填写" value="未填写" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄">
              <el-input-number v-model="editForm.age" :min="1" :max="120" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="婚姻状况">
              <el-select v-model="editForm.maritalStatus" style="width: 100%">
                <el-option label="未婚" value="未婚" />
                <el-option label="已婚" value="已婚" />
                <el-option label="离异" value="离异" />
                <el-option label="未填写" value="未填写" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学历">
              <el-select v-model="editForm.education" style="width: 100%">
                <el-option label="高中及以下" value="高中及以下" />
                <el-option label="大专" value="大专" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士及以上" value="硕士及以上" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码">
              <el-input v-model="editForm.idNumber" placeholder="可填写身份证后四位或完整证件号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">联系方式</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="手机号">
              <el-input v-model="editForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱">
              <el-input v-model="editForm.email" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="居住城市">
              <el-select
                v-model="editForm.city"
                filterable
                allow-create
                default-first-option
                style="width: 100%"
              >
                <el-option
                  v-for="city in cityOptions"
                  :key="city"
                  :label="city"
                  :value="city"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="16">
            <el-form-item label="居住地址">
              <el-input v-model="editForm.address" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="居住状态">
              <el-select v-model="editForm.residenceStatus" style="width: 100%">
                <el-option label="自有住房" value="自有住房" />
                <el-option label="租赁住房" value="租赁住房" />
                <el-option label="与家人同住" value="与家人同住" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">就业信息</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="职业">
              <el-input v-model="editForm.occupation" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工作单位">
              <el-input v-model="editForm.employer" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职位">
              <el-input v-model="editForm.jobTitle" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="工作年限">
              <el-input-number v-model="editForm.workYears" :min="0" :max="60" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="社保年限">
              <el-input-number v-model="editForm.socialInsuranceYears" :min="0" :max="60" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公积金状态">
              <el-select v-model="editForm.providentFundStatus" style="width: 100%">
                <el-option label="正常缴存" value="正常缴存" />
                <el-option label="未缴存" value="未缴存" />
                <el-option label="停缴" value="停缴" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">收入与支出</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="主要收入来源">
              <el-select v-model="editForm.incomeType" style="width: 100%">
                <el-option label="工资收入" value="工资收入" />
                <el-option label="经营收入" value="经营收入" />
                <el-option label="劳务收入" value="劳务收入" />
                <el-option label="退休金" value="退休金" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="月固定收入">
              <el-input-number v-model="editForm.income" :min="0" :step="500" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="其他月收入">
              <el-input-number v-model="editForm.otherIncome" :min="0" :step="500" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="月均支出">
              <el-input-number v-model="editForm.monthlyExpense" :min="0" :step="500" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可支配收入">
              <el-input-number :model-value="disposableIncome" disabled style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">资产明细</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="银行存款">
              <el-input-number v-model="editForm.bankDeposit" :min="0" :step="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="理财/投资">
              <el-input-number v-model="editForm.investments" :min="0" :step="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="房产估值">
              <el-input-number v-model="editForm.realEstateValue" :min="0" :step="10000" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="车辆估值">
              <el-input-number v-model="editForm.vehicleValue" :min="0" :step="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产合计">
              <el-input-number :model-value="editAssetTotal" disabled style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">负债与信贷记录</el-divider>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="房贷余额">
              <el-input-number v-model="editForm.mortgageBalance" :min="0" :step="10000" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车贷余额">
              <el-input-number v-model="editForm.carLoanBalance" :min="0" :step="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消费贷余额">
              <el-input-number v-model="editForm.consumerLoanBalance" :min="0" :step="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="信用卡已用">
              <el-input-number v-model="editForm.creditCardUsed" :min="0" :step="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="信用卡额度">
              <el-input-number v-model="editForm.creditCardLimit" :min="0" :step="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负债合计">
              <el-input-number :model-value="editDebtTotal" disabled style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="贷款笔数">
              <el-input-number v-model="editForm.loanCount" :min="0" :max="99" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="近12月逾期">
              <el-input-number v-model="editForm.overdueCount" :min="0" :max="99" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { createDefaultPersonalInfo, getCurrentUserProfile, setCurrentUserProfile } from '@/utils/auth'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const money = value => `${Number(value || 0).toLocaleString()}元`
const months = value => `${Number(value || 0).toLocaleString()}元/月`
const text = value => value || '未填写'
const sumValues = (...values) => values.reduce((sum, value) => sum + Number(value || 0), 0)

const CITY_OPTIONS = [
  '北京市',
  '天津市',
  '上海市',
  '重庆市',
  '石家庄市',
  '太原市',
  '呼和浩特市',
  '沈阳市',
  '大连市',
  '长春市',
  '哈尔滨市',
  '南京市',
  '苏州市',
  '杭州市',
  '宁波市',
  '合肥市',
  '福州市',
  '厦门市',
  '南昌市',
  '济南市',
  '青岛市',
  '郑州市',
  '武汉市',
  '长沙市',
  '广州市',
  '深圳市',
  '珠海市',
  '佛山市',
  '南宁市',
  '桂林市',
  '海口市',
  '三亚市',
  '儋州市',
  '成都市',
  '绵阳市',
  '贵阳市',
  '昆明市',
  '拉萨市',
  '西安市',
  '兰州市',
  '西宁市',
  '银川市',
  '乌鲁木齐市',
  '香港特别行政区',
  '澳门特别行政区',
  '台北市'
]

export default {
  name: 'UserProfile',
  setup() {
    const radarChartRef = ref(null)
    const editDialogVisible = ref(false)
    const currentProfile = ref(null)
    const chartInstance = ref(null)

    const userInfo = reactive(createDefaultPersonalInfo())
    const editForm = reactive(createDefaultPersonalInfo())

    const getAssetTotal = source => {
      const detailedTotal = sumValues(
        source.bankDeposit,
        source.investments,
        source.realEstateValue,
        source.vehicleValue
      )
      return detailedTotal || Number(source.assets || 0)
    }

    const getDebtTotal = source => {
      const detailedTotal = sumValues(
        source.mortgageBalance,
        source.carLoanBalance,
        source.consumerLoanBalance,
        source.creditCardUsed
      )
      return detailedTotal || Number(source.debt || 0)
    }

    const editAssetTotal = computed(() => getAssetTotal(editForm))
    const editDebtTotal = computed(() => getDebtTotal(editForm))
    const disposableIncome = computed(() =>
      Math.max(0, sumValues(editForm.income, editForm.otherIncome) - Number(editForm.monthlyExpense || 0))
    )

    const getMergedPersonalInfo = profile => ({
      ...createDefaultPersonalInfo(profile?.realName || profile?.username),
      ...(profile?.personalInfo || {})
    })

    const basicInfoItems = computed(() => [
      { label: '姓名', value: text(userInfo.name) },
      { label: '性别', value: text(userInfo.gender) },
      { label: '年龄', value: `${Number(userInfo.age || 0)}岁` },
      { label: '婚姻状况', value: text(userInfo.maritalStatus) },
      { label: '学历', value: text(userInfo.education) },
      { label: '证件号码', value: text(userInfo.idNumber) }
    ])

    const financeInfoItems = computed(() => [
      { label: '职业', value: text(userInfo.occupation) },
      { label: '工作单位', value: text(userInfo.employer) },
      { label: '职位', value: text(userInfo.jobTitle) },
      { label: '主要收入来源', value: text(userInfo.incomeType) },
      { label: '月固定收入', value: months(userInfo.income) },
      { label: '其他月收入', value: months(userInfo.otherIncome) },
      { label: '月均支出', value: months(userInfo.monthlyExpense) },
      { label: '可支配收入', value: months(Math.max(0, sumValues(userInfo.income, userInfo.otherIncome) - Number(userInfo.monthlyExpense || 0))) },
      { label: '资产合计', value: money(getAssetTotal(userInfo)) },
      { label: '负债合计', value: money(getDebtTotal(userInfo)) },
      { label: '信用卡额度', value: money(userInfo.creditCardLimit) },
      { label: '贷款笔数', value: `${Number(userInfo.loanCount || 0)}笔` },
      { label: '近12月逾期', value: `${Number(userInfo.overdueCount || 0)}次` }
    ])

    const extraInfoItems = computed(() => [
      { label: '手机号', value: text(userInfo.phone) },
      { label: '邮箱', value: text(userInfo.email) },
      { label: '居住城市', value: text(userInfo.city) },
      { label: '居住地址', value: text(userInfo.address) },
      { label: '居住状态', value: text(userInfo.residenceStatus) },
      { label: '工作年限', value: `${Number(userInfo.workYears || 0)}年` },
      { label: '社保年限', value: `${Number(userInfo.socialInsuranceYears || 0)}年` },
      { label: '公积金状态', value: text(userInfo.providentFundStatus) }
    ])

    const syncFromSession = () => {
      const profile = getCurrentUserProfile()
      currentProfile.value = profile
      const personalInfo = getMergedPersonalInfo(profile)
      Object.assign(userInfo, personalInfo)
      if (!editDialogVisible.value) {
        Object.assign(editForm, personalInfo)
      }
      nextTick(updateRadarChart)
    }

    const scoreSet = computed(() => {
      const repayment = clamp(
        Math.round(58 + sumValues(userInfo.income, userInfo.otherIncome) / 1800 + getAssetTotal(userInfo) / 50000 - getDebtTotal(userInfo) / 12000 - userInfo.overdueCount * 8),
        20,
        100
      )
      const stability = clamp(
        Math.round(50 + userInfo.workYears * 4 + userInfo.socialInsuranceYears * 3 + (userInfo.providentFundStatus === '正常缴存' ? 8 : 0)),
        20,
        100
      )
      const debtLevel = clamp(
        Math.round(90 - getDebtTotal(userInfo) / 5000 - userInfo.loanCount * 3 + getAssetTotal(userInfo) / 80000),
        20,
        100
      )
      const creditHistory = clamp(Math.round(88 - userInfo.overdueCount * 9 + userInfo.creditCardLimit / 20000), 20, 100)
      const consumption = clamp(Math.round(78 - userInfo.monthlyExpense / 3000 + sumValues(userInfo.income, userInfo.otherIncome) / 3500), 20, 100)
      const assetStatus = clamp(Math.round(55 + getAssetTotal(userInfo) / 25000 - getDebtTotal(userInfo) / 30000), 20, 100)

      return { repayment, stability, debtLevel, creditHistory, consumption, assetStatus }
    })

    const creditMetrics = computed(() => [
      { label: '还款能力', value: `${scoreSet.value.repayment}分`, desc: scoreSet.value.repayment >= 80 ? '优秀' : scoreSet.value.repayment >= 60 ? '良好' : '需关注', color: '#67C23A' },
      { label: '工作稳定', value: `${scoreSet.value.stability}分`, desc: scoreSet.value.stability >= 75 ? '稳定' : '待观察', color: '#409EFF' },
      { label: '负债水平', value: `${scoreSet.value.debtLevel}分`, desc: scoreSet.value.debtLevel >= 70 ? '正常' : '偏高', color: '#E6A23C' },
      { label: '信用历史', value: `${scoreSet.value.creditHistory}分`, desc: scoreSet.value.creditHistory >= 85 ? '优秀' : '良好', color: '#67C23A' }
    ])

    const radarValues = computed(() => [
      scoreSet.value.repayment,
      scoreSet.value.consumption,
      scoreSet.value.debtLevel,
      scoreSet.value.creditHistory,
      scoreSet.value.stability,
      scoreSet.value.assetStatus
    ])

    const openEditDialog = () => {
      Object.assign(editForm, userInfo)
      editDialogVisible.value = true
    }

    const toNumber = value => Number(value) || 0

    const saveProfile = () => {
      const nextPersonalInfo = {
        name: editForm.name,
        gender: editForm.gender,
        age: toNumber(editForm.age),
        maritalStatus: editForm.maritalStatus,
        education: editForm.education,
        idNumber: editForm.idNumber,
        phone: editForm.phone,
        email: editForm.email,
        city: editForm.city,
        address: editForm.address,
        residenceStatus: editForm.residenceStatus,
        occupation: editForm.occupation,
        employer: editForm.employer,
        jobTitle: editForm.jobTitle,
        workYears: toNumber(editForm.workYears),
        socialInsuranceYears: toNumber(editForm.socialInsuranceYears),
        providentFundStatus: editForm.providentFundStatus,
        incomeType: editForm.incomeType,
        income: toNumber(editForm.income),
        otherIncome: toNumber(editForm.otherIncome),
        monthlyExpense: toNumber(editForm.monthlyExpense),
        bankDeposit: toNumber(editForm.bankDeposit),
        investments: toNumber(editForm.investments),
        realEstateValue: toNumber(editForm.realEstateValue),
        vehicleValue: toNumber(editForm.vehicleValue),
        assets: editAssetTotal.value,
        mortgageBalance: toNumber(editForm.mortgageBalance),
        carLoanBalance: toNumber(editForm.carLoanBalance),
        consumerLoanBalance: toNumber(editForm.consumerLoanBalance),
        creditCardUsed: toNumber(editForm.creditCardUsed),
        debt: editDebtTotal.value,
        creditCardLimit: toNumber(editForm.creditCardLimit),
        loanCount: toNumber(editForm.loanCount),
        overdueCount: toNumber(editForm.overdueCount)
      }

      const nextProfile = {
        ...(currentProfile.value || {}),
        userType: currentProfile.value?.userType || 'personal',
        username: currentProfile.value?.username || nextPersonalInfo.name,
        realName: nextPersonalInfo.name,
        phone: nextPersonalInfo.phone,
        email: nextPersonalInfo.email,
        address: nextPersonalInfo.address,
        personalInfo: nextPersonalInfo
      }

      setCurrentUserProfile(nextProfile)
      Object.assign(userInfo, nextPersonalInfo)
      editDialogVisible.value = false
      nextTick(updateRadarChart)
      ElMessage.success('个人详细信息已更新')
    }

    const updateRadarChart = () => {
      const chartDom = radarChartRef.value
      if (!chartDom) {
        return
      }

      if (!chartInstance.value) {
        chartInstance.value = echarts.init(chartDom)
      }

      chartInstance.value.setOption({
        tooltip: {},
        radar: {
          indicator: [
            { name: '还款能力', max: 100 },
            { name: '消费习惯', max: 100 },
            { name: '负债水平', max: 100 },
            { name: '信用历史', max: 100 },
            { name: '工作稳定', max: 100 },
            { name: '资产状况', max: 100 }
          ]
        },
        series: [
          {
            type: 'radar',
            data: [
              {
                value: radarValues.value,
                name: '信用画像',
                areaStyle: { opacity: 0.2 }
              }
            ]
          }
        ]
      })
    }

    const handleResize = () => {
      chartInstance.value?.resize()
    }

    onMounted(() => {
      syncFromSession()
      window.addEventListener('resize', handleResize)
      window.addEventListener('session-profile-change', syncFromSession)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('session-profile-change', syncFromSession)
      chartInstance.value?.dispose()
    })

    return {
      basicInfoItems,
      cityOptions: CITY_OPTIONS,
      creditMetrics,
      disposableIncome,
      editDialogVisible,
      editAssetTotal,
      editDebtTotal,
      editForm,
      extraInfoItems,
      financeInfoItems,
      openEditDialog,
      radarChartRef,
      saveProfile,
      userInfo
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 0;
}

.profile-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 16px;
}

.info-item {
  min-height: 24px;
  margin-bottom: 15px;
  line-height: 1.6;
}

.info-item label {
  font-weight: 600;
  color: #606266;
  margin-right: 10px;
}

.info-item span {
  color: #303133;
  word-break: break-word;
}

.profile-edit-form :deep(.el-input-number) {
  width: 100%;
}

.radar-chart {
  width: 100%;
  height: 400px;
  padding: 10px 0;
}

.metric-card {
  text-align: center;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: #fafafa;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.metric-desc {
  font-size: 12px;
  color: #909399;
}
</style>
