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
    realName: form.realName,
    organization: form.organization,
    email: form.email,
    phone: form.phone,
    industry: form.industry || '',
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
    throw new Error('未找到匹配账号，请检查用户名、用户类型和手机号')
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
    businessType: '',
    businessLabel: `${getUserTypeText(userType)}默认方案`,
    featureKeys,
    activeFeatureKey: getDefaultFeature(userType, featureKeys)
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
    industry: userRecord.industry || '',
    phone: userRecord.phone || '',
    email: userRecord.email || '',
    businessType: userRecord.businessType || '',
    businessLabel: userRecord.businessLabel || `${getUserTypeText(userRecord.userType)}默认方案`,
    featureKeys,
    activeFeatureKey: getDefaultFeature(userRecord.userType, featureKeys)
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
