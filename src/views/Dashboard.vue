<template>
  <div class="dashboard-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '250px'">
        <div class="logo">
          <h2 v-if="!isCollapse">信用风险系统</h2>
          <h2 v-else>信</h2>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/dashboard/personal" v-if="userType === 'personal'">
            <el-icon><User /></el-icon>
            <span>个人信用中心</span>
          </el-menu-item>
          
          <el-menu-item index="/dashboard/enterprise" v-if="userType === 'enterprise'">
            <el-icon><OfficeBuilding /></el-icon>
            <span>企业信用中心</span>
          </el-menu-item>
          
          <el-menu-item index="/dashboard/government" v-if="userType === 'government'">
            <el-icon><School /></el-icon>
            <span>政府监管中心</span>
          </el-menu-item>
          
          <el-menu-item index="/dashboard/research" v-if="userType === 'research'">
            <el-icon><DataAnalysis /></el-icon>
            <span>科研算法中心</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-container>
        <!-- 头部 -->
        <el-header>
          <div class="header-left">
            <el-button @click="toggleCollapse" :icon="isCollapse ? 'Expand' : 'Fold'" circle />
            <span class="breadcrumb">{{ currentPageTitle }}</span>
          </div>
          
          <div class="header-right">
            <span class="username">欢迎，{{ username }}</span>
            <el-button @click="handleLogout" type="primary" link>退出登录</el-button>
          </div>
        </el-header>
        
        <!-- 内容区 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    const isCollapse = ref(false)
    const userType = ref('')
    const username = ref('')
    
    const pageTitles = {
      personal: '个人信用中心',
      enterprise: '企业信用中心', 
      government: '政府监管中心',
      research: '科研算法中心'
    }
    
    const currentPageTitle = computed(() => {
      const path = route.path
      if (path.includes('personal')) return pageTitles.personal
      if (path.includes('enterprise')) return pageTitles.enterprise
      if (path.includes('government')) return pageTitles.government
      if (path.includes('research')) return pageTitles.research
      return '信用风险系统'
    })
    
    const activeMenu = computed(() => route.path)
    
    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value
    }
    
    const handleLogout = async () => {
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        localStorage.removeItem('userType')
        localStorage.removeItem('username')
        router.push('/')
      } catch {
        // 用户取消退出
      }
    }
    
    onMounted(() => {
      userType.value = localStorage.getItem('userType') || ''
      username.value = localStorage.getItem('username') || '用户'
      
      // 如果没有登录信息，跳转到登录页
      if (!userType.value) {
        router.push('/login')
      } else {
        // 如果已登录但当前路径不是对应的用户仪表板，自动跳转到正确的路径
        const currentPath = route.path
        const expectedPath = `/dashboard/${userType.value}`
        
        // 修复：只有当当前路径不是预期的用户仪表板路径时才跳转
        if (currentPath !== expectedPath && !currentPath.includes(`/${userType.value}`)) {
          router.push(expectedPath)
        }
      }
    })
    
    return {
      isCollapse,
      userType,
      username,
      currentPageTitle,
      activeMenu,
      toggleCollapse,
      handleLogout
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
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-bottom: 1px solid #1f2d3d;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
}

.el-menu {
  border: none;
}

.el-header {
  background-color: white;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.breadcrumb {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  color: #606266;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>