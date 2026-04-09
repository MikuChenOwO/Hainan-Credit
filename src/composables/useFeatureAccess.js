import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getCurrentUserProfile, getStoredActiveFeatureKey, setStoredActiveFeatureKey } from '@/utils/auth'

export function useFeatureAccess(userType, allFeatures, fallbackFeatureKey = '') {
  const currentProfile = ref(null)
  const activeTab = ref(fallbackFeatureKey)

  const allowedFeatureItems = computed(() => {
    const allKeys = allFeatures.map(item => item.key)
    const featureKeys = currentProfile.value?.userType === userType
      ? currentProfile.value.featureKeys || allKeys
      : allKeys

    return allFeatures.filter(item => featureKeys.includes(item.key))
  })

  const ensureActiveFeature = (nextKey) => {
    const availableKeys = allowedFeatureItems.value.map(item => item.key)
    const targetKey = availableKeys.includes(nextKey)
      ? nextKey
      : (availableKeys[0] || fallbackFeatureKey)

    activeTab.value = targetKey

    if (targetKey) {
      setStoredActiveFeatureKey(targetKey)
    }
  }

  const syncProfile = () => {
    currentProfile.value = getCurrentUserProfile()
    ensureActiveFeature(getStoredActiveFeatureKey())
  }

  const handleFeatureChange = event => {
    ensureActiveFeature(event.detail?.featureKey || '')
  }

  watch(allowedFeatureItems, () => {
    ensureActiveFeature(activeTab.value)
  })

  onMounted(() => {
    syncProfile()
    window.addEventListener('dashboard-feature-change', handleFeatureChange)
    window.addEventListener('session-profile-change', syncProfile)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('dashboard-feature-change', handleFeatureChange)
    window.removeEventListener('session-profile-change', syncProfile)
  })

  return {
    activeTab,
    allowedFeatureItems,
    setActiveTab: ensureActiveFeature
  }
}
