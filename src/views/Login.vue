<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>海南省信用风险预测系统</h1>
        <p>基于 AI 技术的智能信用评估与风险分析平台</p>
        <div v-if="targetUserType" class="user-type-indicator">
          <el-tag type="primary" size="large">
            {{ getUserTypeText(targetUserType) }}登录入口
          </el-tag>
        </div>
      </div>

      <el-alert
        v-if="targetUserType"
        class="login-alert"
        type="info"
        :closable="false"
        show-icon
        title="当前为定向登录入口，注册时会自动带入当前用户类型。"
      />

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            size="large"
            placeholder="请输入用户名"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item v-if="!targetUserType" prop="userType">
          <el-select
            v-model="loginForm.userType"
            size="large"
            placeholder="请选择用户类型"
            style="width: 100%"
          >
            <el-option
              v-for="item in USER_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" class="full-width" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>

        <div class="login-actions">
          <span class="action-text" @click="openRegisterDialog">注册账号</span>
          <span class="action-text" @click="openForgotPasswordDialog">忘记密码</span>
        </div>

        <el-form-item v-if="targetUserType">
          <el-button type="default" size="default" class="full-width" @click="goBackToHome">
            返回首页
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>技术支持：哈尔滨工程大学大数据与智能商务技术工信部重点实验室</p>
      </div>
    </div>

    <el-dialog
      v-model="registerDialogVisible"
      title="注册账号"
      width="680px"
      destroy-on-close
    >
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="110px"
      >
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="用户类型" prop="userType">
              <el-select
                v-model="registerForm.userType"
                placeholder="请选择用户类型"
                style="width: 100%"
                :disabled="Boolean(targetUserType)"
                @change="handleRegisterUserTypeChange"
              >
                <el-option
                  v-for="item in USER_TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="业务方案" prop="businessType">
              <el-select
                v-model="registerForm.businessType"
                placeholder="请选择业务方案"
                style="width: 100%"
              >
                <el-option
                  v-for="item in businessOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div v-if="selectedBusinessPreset" class="field-helper">
                {{ selectedBusinessPreset.description }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username" placeholder="用于登录的账号名" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="registerForm.realName" placeholder="请输入真实姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="登录密码" prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="至少 6 位"
                show-password
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="所属单位" prop="organization">
              <el-input
                v-model="registerForm.organization"
                :placeholder="organizationPlaceholder"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              v-if="registerForm.userType === 'enterprise'"
              label="行业类型"
              prop="industry"
            >
              <el-select
                v-model="registerForm.industry"
                placeholder="请选择行业类型"
                style="width: 100%"
              >
                <el-option
                  v-for="item in INDUSTRY_OPTIONS"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="registerForm.phone" placeholder="找回密码将使用此手机号" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="registerForm.email" placeholder="请输入联系邮箱" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="菜单预览">
          <div class="menu-preview">
            <div class="menu-preview-title">
              {{ selectedBusinessPreset?.label || '请选择业务方案' }}
            </div>
            <div class="menu-preview-desc">
              {{ selectedBusinessPreset?.description || '注册后将按这里的业务方案显示菜单。' }}
            </div>
            <div class="menu-tag-list">
              <el-tag
                v-for="item in selectedFeatureItems"
                :key="item.key"
                type="success"
                effect="plain"
              >
                {{ item.label }}
              </el-tag>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="registerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRegister">确认注册</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="forgotPasswordDialogVisible"
      title="忘记密码"
      width="520px"
      destroy-on-close
    >
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        title="当前为纯前端找回流程，请输入注册时填写的用户名、用户类型和手机号。"
      />

      <el-form
        ref="forgotPasswordFormRef"
        :model="forgotPasswordForm"
        :rules="forgotPasswordRules"
        label-width="100px"
        class="forgot-password-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="forgotPasswordForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="用户类型" prop="userType">
          <el-select
            v-model="forgotPasswordForm.userType"
            placeholder="请选择用户类型"
            style="width: 100%"
          >
            <el-option
              v-for="item in USER_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="forgotPasswordForm.phone" placeholder="请输入注册手机号" />
        </el-form-item>

        <el-form-item label="验证码" prop="verificationCode">
          <div class="verification-row">
            <el-input
              v-model="forgotPasswordForm.verificationCode"
              placeholder="请输入短信验证码"
            />
            <el-button
              type="primary"
              plain
              :disabled="verificationCountdown > 0"
              @click="sendVerificationCode"
            >
              {{ verificationCountdown > 0 ? `${verificationCountdown}s 后重发` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="forgotPasswordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="forgotPasswordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="forgotPasswordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleForgotPassword">重置密码</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import {
  FEATURE_LIBRARY,
  INDUSTRY_OPTIONS,
  USER_TYPE_OPTIONS,
  getBusinessPreset,
  getBusinessOptions,
  getDefaultFeature,
  getUserTypeText
} from '@/config/userAccess'
import {
  createDefaultProfile,
  findRegisteredUser,
  normalizeUserProfile,
  registerUser,
  setCurrentUserProfile,
  updateUserPassword
} from '@/utils/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()

    const loginFormRef = ref()
    const registerFormRef = ref()
    const forgotPasswordFormRef = ref()

    const targetUserType = ref('')
    const registerDialogVisible = ref(false)
    const forgotPasswordDialogVisible = ref(false)
    const sentVerificationCode = ref('')
    const verificationCountdown = ref(0)
    let countdownTimer = null

    const loginForm = reactive({
      username: '',
      password: '',
      userType: ''
    })

    const registerForm = reactive({
      userType: '',
      businessType: '',
      username: '',
      realName: '',
      password: '',
      confirmPassword: '',
      organization: '',
      industry: '',
      phone: '',
      email: ''
    })

    const forgotPasswordForm = reactive({
      username: '',
      userType: '',
      phone: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: ''
    })

    const businessOptions = computed(() => getBusinessOptions(registerForm.userType))
    const selectedBusinessPreset = computed(() =>
      getBusinessPreset(registerForm.userType, registerForm.businessType)
    )
    const selectedFeatureItems = computed(() => {
      if (!registerForm.userType || !selectedBusinessPreset.value) {
        return []
      }

      const featureKeys = selectedBusinessPreset.value.featureKeys || []
      const featureItems = FEATURE_LIBRARY[registerForm.userType] || []
      return featureItems.filter(item => featureKeys.includes(item.key))
    })

    const organizationPlaceholder = computed(() => {
      const placeholders = {
        personal: '例如：个人用户可填写所在单位或留空',
        enterprise: '例如：海南科技有限公司',
        government: '例如：海口市市场监督管理局',
        research: '例如：海南省金融科技实验室',
        admin: '例如：系统运维中心'
      }
      return placeholders[registerForm.userType] || '请输入所属单位'
    })

    const validatePassword = (_, value, callback) => {
      if (!value || value.length < 6) {
        callback(new Error('密码至少 6 位'))
        return
      }
      callback()
    }

    const validateRegisterConfirmPassword = (_, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
        return
      }
      if (value !== registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
        return
      }
      callback()
    }

    const validateOrganization = (_, value, callback) => {
      if (registerForm.userType === 'personal') {
        callback()
        return
      }

      if (!value) {
        callback(new Error('请输入所属单位'))
        return
      }

      callback()
    }

    const validateIndustry = (_, value, callback) => {
      if (registerForm.userType !== 'enterprise') {
        callback()
        return
      }

      if (!value) {
        callback(new Error('请选择行业类型'))
        return
      }

      callback()
    }

    const validateForgotConfirmPassword = (_, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
        return
      }
      if (value !== forgotPasswordForm.newPassword) {
        callback(new Error('两次输入的新密码不一致'))
        return
      }
      callback()
    }

    const validateVerificationCode = (_, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
        return
      }

      if (!sentVerificationCode.value) {
        callback(new Error('请先发送验证码'))
        return
      }

      if (value !== sentVerificationCode.value) {
        callback(new Error('验证码不正确'))
        return
      }

      callback()
    }

    const loginRules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }]
    }

    const registerRules = {
      userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
      businessType: [{ required: true, message: '请选择业务方案', trigger: 'change' }],
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      confirmPassword: [{ validator: validateRegisterConfirmPassword, trigger: 'blur' }],
      organization: [{ validator: validateOrganization, trigger: 'blur' }],
      industry: [{ validator: validateIndustry, trigger: 'change' }],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { min: 11, max: 11, message: '请输入 11 位手机号', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
      ]
    }

    const forgotPasswordRules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { min: 11, max: 11, message: '请输入 11 位手机号', trigger: 'blur' }
      ],
      verificationCode: [{ validator: validateVerificationCode, trigger: 'blur' }],
      newPassword: [{ validator: validatePassword, trigger: 'blur' }],
      confirmPassword: [{ validator: validateForgotConfirmPassword, trigger: 'blur' }]
    }

    const initializeRegisterForm = () => {
      Object.assign(registerForm, {
        userType: targetUserType.value || 'personal',
        businessType: '',
        username: '',
        realName: '',
        password: '',
        confirmPassword: '',
        organization: '',
        industry: '',
        phone: '',
        email: ''
      })

      const defaultPreset = getBusinessPreset(registerForm.userType, '')
      registerForm.businessType = defaultPreset?.value || ''
    }

    const initializeForgotPasswordForm = () => {
      Object.assign(forgotPasswordForm, {
        username: '',
        userType: targetUserType.value || loginForm.userType || 'personal',
        phone: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: ''
      })
      sentVerificationCode.value = ''
      verificationCountdown.value = 0
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }

    const sendVerificationCode = async () => {
      const phone = forgotPasswordForm.phone?.trim()

      if (!phone) {
        ElMessage.warning('请先输入手机号')
        return
      }

      if (!/^1\d{10}$/.test(phone)) {
        ElMessage.warning('请输入正确的 11 位手机号')
        return
      }

      sentVerificationCode.value = String(Math.floor(100000 + Math.random() * 900000))
      verificationCountdown.value = 60

      if (countdownTimer) {
        clearInterval(countdownTimer)
      }

      countdownTimer = setInterval(() => {
        verificationCountdown.value -= 1
        if (verificationCountdown.value <= 0) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }, 1000)

      ElMessage.success(`验证码已发送（演示验证码：${sentVerificationCode.value}）`)
    }

    const handleRegisterUserTypeChange = (userType) => {
      registerForm.industry = ''
      const defaultPreset = getBusinessPreset(userType, '')
      registerForm.businessType = defaultPreset?.value || ''
    }

    const handleLogin = async () => {
      if (!loginFormRef.value) {
        return
      }

      if (targetUserType.value) {
        loginForm.userType = targetUserType.value
      }

      try {
        await loginFormRef.value.validate()

        const registeredUser = findRegisteredUser(loginForm.username, loginForm.userType)
        if (registeredUser) {
          if (registeredUser.password !== loginForm.password) {
            ElMessage.error('密码不正确，请重试')
            return
          }

          const currentProfile = normalizeUserProfile(registeredUser)
          currentProfile.activeFeatureKey = getDefaultFeature(
            currentProfile.userType,
            currentProfile.featureKeys
          )
          setCurrentUserProfile(currentProfile)
          ElMessage.success(`登录成功，已加载 ${currentProfile.businessLabel}`)
        } else {
          const demoProfile = createDefaultProfile({
            userType: loginForm.userType,
            username: loginForm.username
          })
          setCurrentUserProfile(demoProfile)
          ElMessage.success('登录成功，当前使用默认演示菜单')
        }

        localStorage.removeItem('targetUserType')

        if (loginForm.userType === 'admin') {
          router.push('/admin')
        } else {
          router.push(`/dashboard/${loginForm.userType}`)
        }
      } catch {
        ElMessage.error('请先补全登录信息')
      }
    }

    const handleRegister = async () => {
      if (!registerFormRef.value) {
        return
      }

      try {
        await registerFormRef.value.validate()
        registerUser({ ...registerForm })

        loginForm.username = registerForm.username
        loginForm.password = registerForm.password
        loginForm.userType = registerForm.userType

        registerDialogVisible.value = false
        ElMessage.success('注册成功，请直接登录体验对应业务菜单')
      } catch (error) {
        if (error?.message) {
          ElMessage.error(error.message)
          return
        }
        ElMessage.error('请先补全注册信息')
      }
    }

    const handleForgotPassword = async () => {
      if (!forgotPasswordFormRef.value) {
        return
      }

      try {
        await forgotPasswordFormRef.value.validate()
        updateUserPassword({
          username: forgotPasswordForm.username,
          userType: forgotPasswordForm.userType,
          phone: forgotPasswordForm.phone,
          newPassword: forgotPasswordForm.newPassword
        })

        loginForm.username = forgotPasswordForm.username
        loginForm.userType = forgotPasswordForm.userType
        loginForm.password = forgotPasswordForm.newPassword

        forgotPasswordDialogVisible.value = false
        sentVerificationCode.value = ''
        ElMessage.success('密码已重置，请使用新密码登录')
      } catch (error) {
        if (error?.message) {
          ElMessage.error(error.message)
          return
        }
        ElMessage.error('请先补全找回密码信息')
      }
    }

    const openRegisterDialog = () => {
      initializeRegisterForm()
      registerDialogVisible.value = true
    }

    const openForgotPasswordDialog = () => {
      initializeForgotPasswordForm()
      forgotPasswordDialogVisible.value = true
    }

    const goBackToHome = () => {
      localStorage.removeItem('targetUserType')
      router.push('/')
    }

    onMounted(() => {
      const storedUserType = localStorage.getItem('targetUserType')
      if (storedUserType) {
        targetUserType.value = storedUserType
        loginForm.userType = storedUserType
      }
    })

    onBeforeUnmount(() => {
      if (countdownTimer) {
        clearInterval(countdownTimer)
      }
    })

    return {
      Lock,
      User,
      INDUSTRY_OPTIONS,
      USER_TYPE_OPTIONS,
      businessOptions,
      forgotPasswordDialogVisible,
      forgotPasswordForm,
      forgotPasswordFormRef,
      forgotPasswordRules,
      getUserTypeText,
      goBackToHome,
      handleForgotPassword,
      handleLogin,
      handleRegister,
      handleRegisterUserTypeChange,
      loginForm,
      loginFormRef,
      loginRules,
      openForgotPasswordDialog,
      openRegisterDialog,
      organizationPlaceholder,
      sendVerificationCode,
      registerDialogVisible,
      registerForm,
      registerFormRef,
      registerRules,
      selectedBusinessPreset,
      selectedFeatureItems,
      targetUserType,
      verificationCountdown
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), transparent 32%),
    radial-gradient(circle at right bottom, rgba(59, 130, 246, 0.22), transparent 28%),
    linear-gradient(135deg, #0f172a 0%, #102c57 55%, #1d4f91 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-box {
  width: 100%;
  max-width: 460px;
  padding: 36px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(12px);
}

.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.login-header h1 {
  color: #0f172a;
  font-size: 28px;
  margin-bottom: 10px;
}

.login-header p {
  color: #475569;
  line-height: 1.6;
}

.user-type-indicator {
  margin-top: 16px;
}

.login-alert {
  margin-bottom: 18px;
}

.login-form {
  margin-bottom: 12px;
}

.full-width {
  width: 100%;
}

.login-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 0 18px;
}

.action-text {
  color: #2563eb;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-text:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.login-footer {
  text-align: center;
  color: #64748b;
  font-size: 12px;
}

.field-helper {
  margin-top: 8px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.menu-preview {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #dbeafe;
}

.menu-preview-title {
  color: #0f172a;
  font-weight: 600;
  margin-bottom: 6px;
}

.menu-preview-desc {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 12px;
}

.menu-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.forgot-password-form {
  margin-top: 18px;
}

.verification-row {
  display: grid;
  grid-template-columns: 1fr 128px;
  gap: 10px;
  width: 100%;
}

@media (max-width: 768px) {
  .login-box {
    padding: 28px 20px;
    border-radius: 18px;
  }

  .login-header h1 {
    font-size: 22px;
  }

  .verification-row {
    grid-template-columns: 1fr;
  }
}
</style>