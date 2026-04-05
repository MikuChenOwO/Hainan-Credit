<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>海南省信用风险预测系统</h1>
        <p>基于AI技术的智能信用评估与风险预测平台</p>
        <div v-if="targetUserType" class="user-type-indicator">
          <el-tag type="primary" size="large">
            {{ getUserTypeText(targetUserType) }}登录
          </el-tag>
        </div>
      </div>
      
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <!-- 企业用户专属：行业选择 -->
        <el-form-item prop="industry" v-if="loginForm.userType === 'enterprise'">
          <el-select v-model="loginForm.industry" placeholder="请选择行业类型" size="large" style="width: 100%">
            <el-option label="信息技术" value="信息技术" />
            <el-option label="金融服务" value="金融服务" />
            <el-option label="制造业" value="制造业" />
            <el-option label="旅游服务" value="旅游服务" />
            <el-option label="房地产" value="房地产" />
            <el-option label="医疗健康" value="医疗健康" />
            <el-option label="教育培训" value="教育培训" />
            <el-option label="批发零售" value="批发零售" />
            <el-option label="交通运输" value="交通运输" />
            <el-option label="农业" value="农业" />
            <el-option label="能源" value="能源" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        
        <el-form-item prop="userType" v-if="!targetUserType">
          <el-select v-model="loginForm.userType" placeholder="请选择用户类型" size="large" style="width: 100%">
            <el-option label="个人用户" value="personal" />
            <el-option label="企业用户" value="enterprise" />
            <el-option label="政府用户" value="government" />
            <el-option label="科研用户" value="research" />
            <el-option label="系统管理员" value="admin" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" size="large" style="width: 100%" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
        
        <el-form-item v-if="targetUserType">
          <el-button type="default" size="default" style="width: 100%" @click="goBackToHome">
            返回首页
          </el-button>
          <div class="login-actions">
            <span class="action-text" @click="goToRegister">注册账号</span>
            <span class="action-text" @click="goToForgotPassword">忘记密码</span>
          </div>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <p>技术支持：海南省金融科技实验室</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const loginFormRef = ref()
    const targetUserType = ref('')
    
    const loginForm = ref({
      username: '',
      password: '',
      userType: '',
      industry: ''
    })
    
    const loginRules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ],
      userType: [
        { required: true, message: '请选择用户类型', trigger: 'change' }
      ],
      industry: [
        { required: true, message: '请选择行业类型', trigger: 'change' }
      ]
    }
    
    const getUserTypeText = (type) => {
      const types = {
        personal: '个人用户',
        enterprise: '企业用户',
        government: '政府用户',
        research: '科研用户',
        admin: '系统管理员'
      }
      return types[type] || '用户'
    }
    
    const handleLogin = async () => {
      if (!loginFormRef.value) return
      
      try {
        // 如果有目标用户类型，自动设置
        if (targetUserType.value) {
          loginForm.value.userType = targetUserType.value
        }
        
        await loginFormRef.value.validate()
        
        // 模拟登录成功
        localStorage.setItem('userType', loginForm.value.userType)
        localStorage.setItem('username', loginForm.value.username)
        
        // 清除目标用户类型
        localStorage.removeItem('targetUserType')
        
        ElMessage.success('登录成功')
        
        // 根据用户类型跳转到不同页面
        if (loginForm.value.userType === 'admin') {
          router.push('/admin')
        } else {
          router.push(`/dashboard/${loginForm.value.userType}`)
        }
      } catch (error) {
        ElMessage.error('请完善登录信息')
      }
    }
    
    const goBackToHome = () => {
      localStorage.removeItem('targetUserType')
      router.push('/')
    }
    
    const goToRegister = () => {
      ElMessage.info('注册账号功能开发中...')
      // 这里可以跳转到注册页面
      // router.push('/register')
    }
    
    const goToForgotPassword = () => {
      ElMessage.info('忘记密码功能开发中...')
      // 这里可以跳转到忘记密码页面
      // router.push('/forgot-password')
    }
    
    onMounted(() => {
      // 从本地存储获取目标用户类型
      const storedUserType = localStorage.getItem('targetUserType')
      if (storedUserType) {
        targetUserType.value = storedUserType
        loginForm.value.userType = storedUserType
      }
    })
    
    return {
      loginFormRef,
      loginForm,
      loginRules,
      targetUserType,
      getUserTypeText,
      handleLogin,
      goBackToHome
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 10px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.login-form {
  margin-bottom: 20px;
}

.user-type-indicator {
  text-align: center;
  margin-top: 15px;
}

.login-footer {
  text-align: center;
  color: #999;
  font-size: 12px;
}

.login-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  width: 100%;
}

.action-text {
  font-size: 12px;
  color: #409eff;
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-text:hover {
  color: #66b1ff;
  text-decoration: underline;
}
</style>