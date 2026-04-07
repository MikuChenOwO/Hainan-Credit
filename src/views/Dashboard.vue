<template>
  <div class="dashboard-container">
    <el-container>
      <el-aside :width="isCollapse ? '72px' : '260px'">
        <div class="logo">
          <h2 v-if="!isCollapse">信用风险系统</h2>
          <h2 v-else>信</h2>
        </div>

        <div v-if="businessLabel && !isCollapse" class="business-tag">
          <span>{{ businessLabel }}</span>
        </div>

        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          background-color="#10253f"
          text-color="#c7d2e2"
          active-text-color="#60a5fa"
          @select="handleMenuSelect"
        >
          <el-menu-item :index="dashboardRoute">
            <el-icon><component :is="dashboardIcon" /></el-icon>
            <span>{{ currentCenterLabel }}</span>
          </el-menu-item>

          <el-sub-menu v-if="sidebarFeatureItems.length" index="feature-group">
            <template #title>
              <el-icon><Grid /></el-icon>
              <span>业务菜单</span>
            </template>

            <el-menu-item
              v-for="item in sidebarFeatureItems"
              :key="item.key"
              :index="`feature:${item.key}`"
            >
              {{ item.label }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <div class="header-left">
            <el-button @click="toggleCollapse" circle>
              <el-icon><component :is="isCollapse ? Expand : Fold" /></el-icon>
            </el-button>
            <div class="header-text">
              <span class="breadcrumb">{{ currentPageTitle }}</span>
              <small v-if="activeFeatureLabel">{{ activeFeatureLabel }}</small>
            </div>
          </div>

          <div class="header-right">
            <div class="user-meta">
              <span class="username">欢迎，{{ displayName }}</span>
              <span v-if="businessLabel" class="business-name">{{ businessLabel }}</span>
            </div>
            <el-button @click="handleLogout" type="primary" link>退出登录</el-button>
          </div>
        </el-header>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  DataAnalysis,
  Expand,
  Fold,
  Grid,
  OfficeBuilding,
  School,
  User
} from '@element-plus/icons-vue'
import { getFeatureItems, getFeatureLabel, getUserTypeText } from '@/config/userAccess'
import {
  clearCurrentUserProfile,
  getCurrentUserProfile,
  getStoredActiveFeatureKey,
  setStoredActiveFeatureKey
} from '@/utils/auth'

const DASHBOARD_ICON_MAP = {
  personal: User,
  enterprise: OfficeBuilding,
  government: School,
  research: DataAnalysis
}

export default {
  name: 'Dashboard',
  components: {
    DataAnalysis,
    Expand,
    Fold,
    Grid,
    OfficeBuilding,
    School,
    User
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const isCollapse = ref(false)
    const userProfile = ref(null)
    const activeFeatureKey = ref('')

    const dashboardRoute = computed(() => `/dashboard/${userProfile.value?.userType || 'personal'}`)

    const currentCenterLabel = computed(() => {
      return userProfile.value ? `${getUserTypeText(userProfile.value.userType)}中心` : '信用风险系统'
    })

    const dashboardIcon = computed(() => DASHBOARD_ICON_MAP[userProfile.value?.userType] || User)

    const displayName = computed(() => {
      if (!userProfile.value) {
        return '用户'
      }

      return userProfile.value.realName || userProfile.value.username
    })

    const businessLabel = computed(() => userProfile.value?.businessLabel || '')

    const currentPageTitle = computed(() => {
      const labels = {
        personal: '个人信用中心',
        enterprise: '企业信用中心',
        government: '政府监管中心',
        research: '科研算法中心'
      }
      return labels[userProfile.value?.userType] || '信用风险系统'
    })

    const sidebarFeatureItems = computed(() => {
      if (!userProfile.value) {
        return []
      }

      const allItems = getFeatureItems(userProfile.value.userType)
      const featureKeys = userProfile.value.featureKeys?.length
        ? userProfile.value.featureKeys
        : allItems.map(item => item.key)

      return allItems.filter(item => featureKeys.includes(item.key))
    })

    const activeFeatureLabel = computed(() => {
      if (!userProfile.value || !activeFeatureKey.value) {
        return ''
      }
      return getFeatureLabel(userProfile.value.userType, activeFeatureKey.value)
    })

    const activeMenu = computed(() => {
      if (route.path === dashboardRoute.value && activeFeatureKey.value) {
        return `feature:${activeFeatureKey.value}`
      }
      return route.path
    })

    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value
    }

    const emitFeatureChange = featureKey => {
      activeFeatureKey.value = featureKey
      setStoredActiveFeatureKey(featureKey)
      window.dispatchEvent(
        new CustomEvent('dashboard-feature-change', {
          detail: { featureKey }
        })
      )
    }

    const handleMenuSelect = index => {
      if (index.startsWith('feature:')) {
        const featureKey = index.replace('feature:', '')
        emitFeatureChange(featureKey)

        if (route.path !== dashboardRoute.value) {
          router.push(dashboardRoute.value)
        }
        return
      }

      router.push(index)
    }

    const handleLogout = async () => {
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        clearCurrentUserProfile()
        router.push('/')
      } catch {
        // 用户取消退出
      }
    }

    onMounted(() => {
      userProfile.value = getCurrentUserProfile()

      if (!userProfile.value?.userType) {
        router.push('/login')
        return
      }

      if (route.path !== dashboardRoute.value) {
        router.push(dashboardRoute.value)
      }

      const storedFeatureKey = getStoredActiveFeatureKey()
      const availableKeys = sidebarFeatureItems.value.map(item => item.key)
      const initialFeatureKey = availableKeys.includes(storedFeatureKey)
        ? storedFeatureKey
        : availableKeys[0]

      if (initialFeatureKey) {
        emitFeatureChange(initialFeatureKey)
      }
    })

    return {
      activeFeatureLabel,
      activeMenu,
      businessLabel,
      currentCenterLabel,
      currentPageTitle,
      dashboardIcon,
      dashboardRoute,
      displayName,
      Expand,
      Fold,
      Grid,
      handleLogout,
      handleMenuSelect,
      isCollapse,
      sidebarFeatureItems,
      toggleCollapse
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-aside {
  background: linear-gradient(180deg, #10253f 0%, #0b1b2d 100%);
  transition: width 0.3s ease;
  overflow: hidden;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f8fafc;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  letter-spacing: 1px;
}

.business-tag {
  padding: 16px 18px 12px;
}

.business-tag span {
  display: inline-flex;
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(96, 165, 250, 0.14);
  color: #dbeafe;
  font-size: 12px;
  line-height: 1.5;
}

.el-menu {
  border: none;
}

.el-header {
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.breadcrumb {
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
}

.header-text small {
  color: #64748b;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.username {
  color: #1f2937;
  font-weight: 500;
}

.business-name {
  color: #64748b;
  font-size: 12px;
}

.el-main {
  padding: 20px;
  background: #f5f7fb;
}

@media (max-width: 768px) {
  .el-header {
    padding: 0 14px;
  }

  .header-right {
    gap: 10px;
  }

  .user-meta {
    display: none;
  }
}
</style>
