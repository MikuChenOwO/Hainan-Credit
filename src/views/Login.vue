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
          <el-button type="default" size="large" style="width: 100%" @click="goBackToHome">
            返回首页
          </el-button>
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
      userType: ''
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
</style>