import {
  getBusinessPreset,
  getDefaultFeature,
  getDefaultFeatureKeys,
  getUserTypeText
} from '@/config/userAccess'

const STORAGE_KEYS = {
  registeredUsers: 'credit-risk-registered-users',
  currentUserProfile: 'credit-risk-current-user-profile',
  activeFeatureKey: 'credit-risk-active-feature-key'
}

const DEFAULT_PERSONAL_INFO = {
  name: '张三',
  gender: '未填写',
  age: 35,
  maritalStatus: '未填写',
  education: '本科',
  idNumber: '',
  phone: '',
  email: '',
  city: '',
  address: '',
  residenceStatus: '自有住房',
  occupation: '工程师',
  employer: '',
  jobTitle: '',
  workYears: 5,
  socialInsuranceYears: 5,
  providentFundStatus: '正常缴存',
  incomeType: '工资收入',
  income: 15000,
  otherIncome: 0,
  monthlyExpense: 6000,
  bankDeposit: 80000,
  investments: 60000,
  realEstateValue: 320000,
  vehicleValue: 40000,
  debt: 200000,
  assets: 500000,
  mortgageBalance: 180000,
  carLoanBalance: 0,
  consumerLoanBalance: 20000,
  creditCardUsed: 0,
  creditCardLimit: 50000,
  loanCount: 1,
  overdueCount: 0
}

const CREDIT_CODE_DIRECTORY = [
  {
    creditCode: '91460000MA5TXXXXXX',
    userType: 'enterprise',
    organization: '海南科技发展有限公司',
    realName: '李四',
    industry: '信息技术',
    phone: '13800000001',
    email: 'contact@hainantech.cn',
    address: '海南省海口市美兰区',
    businessType: 'enterprise-full'
  },
  {
    creditCode: '91460000GOV0000001',
    userType: 'government',
    organization: '海口市市场监督管理局',
    realName: '王敏',
    industry: '公共管理',
    phone: '13900000002',
    email: 'gov@hainan.gov.cn',
    address: '海南省海口市龙华区',
    businessType: 'government-supervision'
  },
  {
    creditCode: '91460000RES0000001',
    userType: 'research',
    organization: '海南省金融科技实验室',
    realName: '周航',
    industry: '科研服务',
    phone: '13700000003',
    email: 'research@hainan.edu.cn',
    address: '海南省海口市国家高新区',
    businessType: 'research-full'
  }
]

function safeParse(value, fallback) {
  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function normalizeCreditCode(value) {
  return (value || '').trim().toUpperCase().replace(/\s+/g, '')
}

export function createDefaultPersonalInfo(name = DEFAULT_PERSONAL_INFO.name) {
  return {
    ...DEFAULT_PERSONAL_INFO,
    name
  }
}

export function findCreditCodeProfile(userType, creditCode) {
  const normalizedCode = normalizeCreditCode(creditCode)
  if (!normalizedCode) {
    return null
  }

  return (
    CREDIT_CODE_DIRECTORY.find(
      item => item.userType === userType && item.creditCode === normalizedCode
    ) || null
  )
}

export function getRegisteredUsers() {
  return safeParse(localStorage.getItem(STORAGE_KEYS.registeredUsers), [])
}

export function saveRegisteredUsers(users) {
  localStorage.setItem(STORAGE_KEYS.registeredUsers, JSON.stringify(users))
}

export function findRegisteredUser(username, userType) {
  return getRegisteredUsers().find(
    item => item.username === username && item.userType === userType
  )
}

export function registerUser(form) {
  const existingUser = findRegisteredUser(form.username, form.userType)
  if (existingUser) {
    throw new Error('该用户名已存在，请更换后重试')
  }

  const preset = getBusinessPreset(form.userType, form.businessType)
  const featureKeys = preset?.featureKeys?.length
    ? [...preset.featureKeys]
    : getDefaultFeatureKeys(form.userType)

  const userRecord = {
    username: form.username,
    password: form.password,
    userType: form.userType,
    creditCode: normalizeCreditCode(form.creditCode),
    realName: form.realName,
    organization: form.organization,
    email: form.email,
    phone: form.phone,
    industry: form.industry || '',
    address: form.address || '',
    businessType: preset?.value || '',
    businessLabel: preset?.label || `${getUserTypeText(form.userType)}默认方案`,
    featureKeys,
    createdAt: new Date().toISOString()
  }

  const users = getRegisteredUsers()
  users.push(userRecord)
  saveRegisteredUsers(users)
  return userRecord
}

export function updateUserPassword({ username, userType, phone, newPassword }) {
  const users = getRegisteredUsers()
  const targetIndex = users.findIndex(
    item => item.username === username && item.userType === userType && item.phone === phone
  )

  if (targetIndex === -1) {
    throw new Error('未找到匹配账号，请检查用户名、用户类型和手机号码')
  }

  users[targetIndex] = {
    ...users[targetIndex],
    password: newPassword,
    updatedAt: new Date().toISOString()
  }

  saveRegisteredUsers(users)
  return users[targetIndex]
}

export function createDefaultProfile({ userType, username, realName, organization }) {
  const featureKeys = getDefaultFeatureKeys(userType)

  return {
    username,
    realName: realName || username,
    organization: organization || '',
    userType,
    creditCode: '',
    address: '',
    businessType: '',
    businessLabel: `${getUserTypeText(userType)}默认方案`,
    featureKeys,
    activeFeatureKey: getDefaultFeature(userType, featureKeys),
    personalInfo:
      userType === 'personal'
        ? createDefaultPersonalInfo(realName || username)
        : null
  }
}

export function normalizeUserProfile(userRecord) {
  const featureKeys = userRecord.featureKeys?.length
    ? [...userRecord.featureKeys]
    : getDefaultFeatureKeys(userRecord.userType)

  return {
    username: userRecord.username,
    realName: userRecord.realName || userRecord.username,
    organization: userRecord.organization || '',
    userType: userRecord.userType,
    creditCode: normalizeCreditCode(userRecord.creditCode),
    industry: userRecord.industry || '',
    phone: userRecord.phone || '',
    email: userRecord.email || '',
    address: userRecord.address || '',
    businessType: userRecord.businessType || '',
    businessLabel: userRecord.businessLabel || `${getUserTypeText(userRecord.userType)}默认方案`,
    featureKeys,
    activeFeatureKey: getDefaultFeature(userRecord.userType, featureKeys),
    personalInfo:
      userRecord.userType === 'personal'
        ? createDefaultPersonalInfo(userRecord.realName || userRecord.username)
        : null
  }
}

export function setCurrentUserProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.currentUserProfile, JSON.stringify(profile))
  localStorage.setItem('userType', profile.userType)
  localStorage.setItem('username', profile.username)
  if (profile.activeFeatureKey) {
    setStoredActiveFeatureKey(profile.activeFeatureKey)
  }
  window.dispatchEvent(new CustomEvent('session-profile-change', { detail: profile }))
}

export function getCurrentUserProfile() {
  const storedProfile = safeParse(
    localStorage.getItem(STORAGE_KEYS.currentUserProfile),
    null
  )

  if (storedProfile) {
    return storedProfile
  }

  const userType = localStorage.getItem('userType')
  const username = localStorage.getItem('username')

  if (!userType || !username) {
    return null
  }

  const fallbackProfile = createDefaultProfile({ userType, username })
  setCurrentUserProfile(fallbackProfile)
  return fallbackProfile
}

export function clearCurrentUserProfile() {
  localStorage.removeItem(STORAGE_KEYS.currentUserProfile)
  localStorage.removeItem(STORAGE_KEYS.activeFeatureKey)
  localStorage.removeItem('userType')
  localStorage.removeItem('username')
  localStorage.removeItem('targetUserType')
  window.dispatchEvent(new CustomEvent('session-profile-change', { detail: null }))
}

export function setStoredActiveFeatureKey(featureKey) {
  localStorage.setItem(STORAGE_KEYS.activeFeatureKey, featureKey)
}

export function getStoredActiveFeatureKey() {
  return localStorage.getItem(STORAGE_KEYS.activeFeatureKey) || ''
}
