<template>
  <div class="admin-dashboard">
    <!-- 管理员头部 -->
    <div class="admin-header">
      <div class="header-content">
        <div class="header-left">
          <h1>系统管理后台</h1>
          <p>海南省信用风险预测系统 - 管理员控制面板</p>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="goBack">返回首页</el-button>
          <el-button type="warning" @click="logout">退出登录</el-button>
        </div>
      </div>
    </div>

    <!-- 管理功能区域 -->
    <div class="admin-content">
      <!-- 系统概览 -->
      <div class="overview-section">
        <h2>系统概览</h2>
        <div class="overview-cards">
          <div class="overview-card">
            <div class="card-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">62,070</div>
              <div class="card-label">总用户数</div>
            </div>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              <el-icon><OfficeBuilding /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">12,000</div>
              <div class="card-label">企业数量</div>
            </div>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">98.5%</div>
              <div class="card-label">预测准确率</div>
            </div>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-value">500+</div>
              <div class="card-label">风险预警</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 管理功能卡片 -->
      <div class="management-section">
        <h2>管理功能</h2>
        <div class="management-cards">
          <!-- 用户管理 -->
          <div class="management-card" @click="goToUserManagement">
            <div class="card-icon">
              <el-icon size="48"><User /></el-icon>
            </div>
            <h3>用户管理</h3>
            <p>管理用户账号、权限分配、登录记录</p>
            <div class="card-stats">
              <span>活跃用户：5,240</span>
            </div>
          </div>

          <!-- 数据管理 -->
          <div class="management-card" @click="goToDataManagement">
            <div class="card-icon">
              <el-icon size="48"><DataBoard /></el-icon>
            </div>
            <h3>数据管理</h3>
            <p>数据导入导出、质量监控、备份恢复</p>
            <div class="card-stats">
              <span>数据总量：2.5TB</span>
            </div>
          </div>

          <!-- 系统配置 -->
          <div class="management-card" @click="goToSystemConfig">
            <div class="card-icon">
              <el-icon size="48"><Setting /></el-icon>
            </div>
            <h3>系统配置</h3>
            <p>系统参数、功能开关、权限设置</p>
            <div class="card-stats">
              <span>配置项：128</span>
            </div>
          </div>

          <!-- 监控中心 -->
          <div class="management-card" @click="goToMonitoring">
            <div class="card-icon">
              <el-icon size="48"><Monitor /></el-icon>
            </div>
            <h3>监控中心</h3>
            <p>系统性能、安全监控、日志分析</p>
            <div class="card-stats">
              <span>正常运行：99.9%</span>
            </div>
          </div>

          <!-- 报表统计 -->
          <div class="management-card" @click="goToReports">
            <div class="card-icon">
              <el-icon size="48"><Document /></el-icon>
            </div>
            <h3>报表统计</h3>
            <p>生成报表、数据分析、统计图表</p>
            <div class="card-stats">
              <span>报表模板：25</span>
            </div>
          </div>

          <!-- 安全管理 -->
          <div class="management-card" @click="goToSecurity">
            <div class="card-icon">
              <el-icon size="48"><Lock /></el-icon>
            </div>
            <h3>安全管理</h3>
            <p>访问控制、审计日志、安全策略</p>
            <div class="card-stats">
              <span>安全事件：12</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="activity-section">
        <h2>最近活动</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="activity-content">
              <div class="activity-title">新用户注册</div>
              <div class="activity-desc">企业用户 "海南科技发展有限公司" 完成注册</div>
              <div class="activity-time">5分钟前</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="activity-content">
              <div class="activity-title">风险预警</div>
              <div class="activity-desc">检测到高风险企业 "东方贸易集团"</div>
              <div class="activity-time">15分钟前</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">
              <el-icon><DataBoard /></el-icon>
            </div>
            <div class="activity-content">
              <div class="activity-title">数据更新</div>
              <div class="activity-desc">完成今日企业信用数据同步</div>
              <div class="activity-time">1小时前</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  User, 
  OfficeBuilding, 
  Setting, 
  Warning, 
  DataBoard, 
  Monitor, 
  Document, 
  Lock,
  TrendCharts
} from '@element-plus/icons-vue'

export default {
  name: 'AdminDashboard',
  components: {
    User,
    OfficeBuilding,
    Setting,
    Warning,
    DataBoard,
    Monitor,
    Document,
    Lock,
    TrendCharts
  },
  setup() {
    const router = useRouter()

    const goBack = () => {
      router.push('/')
    }

    const logout = () => {
      ElMessage.success('已退出管理员登录')
      router.push('/')
    }

    const goToUserManagement = () => {
      ElMessage.info('跳转到用户管理页面')
      // router.push('/admin/users')
    }

    const goToDataManagement = () => {
      ElMessage.info('跳转到数据管理页面')
      // router.push('/admin/data')
    }

    const goToSystemConfig = () => {
      ElMessage.info('跳转到系统配置页面')
      // router.push('/admin/config')
    }

    const goToMonitoring = () => {
      ElMessage.info('跳转到监控中心页面')
      // router.push('/admin/monitoring')
    }

    const goToReports = () => {
      ElMessage.info('跳转到报表统计页面')
      // router.push('/admin/reports')
    }

    const goToSecurity = () => {
      ElMessage.info('跳转到安全管理页面')
      // router.push('/admin/security')
    }

    return {
      goBack,
      logout,
      goToUserManagement,
      goToDataManagement,
      goToSystemConfig,
      goToMonitoring,
      goToReports,
      goToSecurity
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.admin-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e6e6e6;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.header-left h1 {
  font-size: 24px;
  color: #304156;
  margin-bottom: 5px;
}

.header-left p {
  font-size: 14px;
  color: #909399;
}

.admin-content {
  max-width: 1200px;
  margin: 100px auto 50px;
  padding: 0 20px;
}

/* 系统概览 */
.overview-section {
  margin-bottom: 40px;
}

.overview-section h2 {
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: 600;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.overview-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.overview-card .card-icon {
  font-size: 32px;
  color: #67C23A;
}

.card-content .card-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
}

.card-content .card-label {
  font-size: 14px;
  opacity: 0.8;
}

/* 管理功能 */
.management-section {
  margin-bottom: 40px;
}

.management-section h2 {
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: 600;
}

.management-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.management-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.management-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.15);
}

.management-card .card-icon {
  color: #67C23A;
  margin-bottom: 15px;
}

.management-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: 600;
}

.management-card p {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 15px;
  line-height: 1.5;
}

.management-card .card-stats {
  font-size: 12px;
  opacity: 0.7;
}

/* 最近活动 */
.activity-section h2 {
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: 600;
}

.activity-list {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 20px;
  color: #67C23A;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}

.activity-desc {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 12px;
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 20px;
  }
  
  .admin-content {
    margin-top: 140px;
  }
  
  .overview-cards,
  .management-cards {
    grid-template-columns: 1fr;
  }
}
</style>