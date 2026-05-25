<template>
  <div class="home-container">
    <!-- 头部导航 -->
    <header class="home-header">
      <div class="header-content">
        <div class="logo">
          <h1>海南省信用风险预测系统</h1>
          <p>智能信用评估 · 精准风险预测 · 科学监管决策</p>
        </div>
        <!--
        <nav class="nav-menu">
          <a href="#about" class="nav-link">系统介绍</a>
          <a href="#features" class="nav-link">功能特色</a>
          <a href="#statistics" class="nav-link">数据统计</a>
          <a href="#contact" class="nav-link">联系我们</a>
        </nav>
        -->
      </div>
    </header>

    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h2>基于AI技术的智能信用风险预测平台</h2>
          <p>利用先进的人工智能算法，对海南省企业信用风险进行精准预测和实时监控，为政府监管和企业决策提供科学依据。</p>
          
          <!-- 信用风险分布统计 - 扁平化设计 -->
          <div class="risk-stats-flat">
            <div class="risk-stats-header">
              <h4>信用风险分布统计</h4>
              <p>基于全省企业信用数据实时分析</p>
            </div>
            <div class="risk-levels-flat">
              <div class="risk-level-flat low-risk">
                <div class="level-info-flat">
                  <span class="level-label-flat">低风险</span>
                  <span class="level-count-flat">8,160家</span>
                  <span class="level-percent-flat">68%</span>
                </div>
                <div class="progress-bar-flat">
                  <div class="progress-fill-flat" style="width: 68%"></div>
                </div>
              </div>
              <div class="risk-level-flat medium-risk">
                <div class="level-info-flat">
                  <span class="level-label-flat">中风险</span>
                  <span class="level-count-flat">2,640家</span>
                  <span class="level-percent-flat">22%</span>
                </div>
                <div class="progress-bar-flat">
                  <div class="progress-fill-flat" style="width: 22%"></div>
                </div>
              </div>
              <div class="risk-level-flat high-risk">
                <div class="level-info-flat">
                  <span class="level-label-flat">高风险</span>
                  <span class="level-count-flat">1,200家</span>
                  <span class="level-percent-flat">10%</span>
                </div>
                <div class="progress-bar-flat">
                  <div class="progress-fill-flat" style="width: 10%"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">12,000+</div>
              <div class="stat-label">企业风险评估</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">98.5%</div>
              <div class="stat-label">预测准确率</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">风险预警</div>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="video-container">
            <div class="video-header">
              <div class="video-title">海南省信用风险分布</div>
            </div>
            
            <div class="video-wrapper">
              <video 
                id="mapVideo" 
                class="map-video"
                src="/mapvideo.mp4" 
                muted
                loop
                playsinline
                preload="auto">
                您的浏览器不支持视频播放
              </video>
            </div>
            

          </div>
        </div>
      </div>
    </section>

    <!-- 用户入口区域 -->
    <section class="user-entry-section">
      <div class="section-header">
        <h3>用户登录入口</h3>
        <p>选择您的用户类型进入系统</p>
      </div>
      
      <div class="user-cards">
        <div class="user-card personal-card" @click="goToLogin('personal')">
          <div class="card-icon">
            <el-icon size="48"><User /></el-icon>
          </div>
          <h4>个人用户</h4>
          <p>个人信用评估、风险预测、历史记录查询</p>
          <div class="card-stats">
            <span>服务用户：50,000+</span>
          </div>
          <el-button type="primary" class="entry-btn">进入个人中心</el-button>
        </div>

        <div class="user-card enterprise-card" @click="goToLogin('enterprise')">
          <div class="card-icon">
            <el-icon size="48"><OfficeBuilding /></el-icon>
          </div>
          <h4>企业用户</h4>
          <p>企业信用评估、财务分析、风险监控</p>
          <div class="card-stats">
            <span>服务企业：12,000+</span>
          </div>
          <el-button type="primary" class="entry-btn">进入企业中心</el-button>
        </div>

        <div class="user-card government-card" @click="goToLogin('government')">
          <div class="card-icon">
            <el-icon size="48"><School /></el-icon>
          </div>
          <h4>政府用户（内测）</h4>
          <p>风险监控、定向推送、监管报告</p>
          <div class="card-stats">
            <span>监管机构：50+</span>
          </div>
          <el-button type="primary" class="entry-btn">进入监管中心</el-button>
        </div>

        <div class="user-card research-card" @click="goToLogin('research')">
          <div class="card-icon">
            <el-icon size="48"><Reading /></el-icon>
          </div>
          <h4>科研用户（内测）</h4>
          <p>数据研究、模型分析、学术支持</p>
          <div class="card-stats">
            <span>合作机构：20+</span>
          </div>
          <el-button type="primary" class="entry-btn">进入科研中心</el-button>
        </div>

        <!-- 管理员入口 -->
        <div class="user-card admin-card" @click="goToLogin('admin')">
          <div class="card-icon">
            <el-icon size="48"><Setting /></el-icon>
          </div>
          <h4>系统管理员</h4>
          <p>系统配置、用户管理、数据监控、权限控制</p>
          <div class="card-stats">
            <span>系统维护：24/7</span>
          </div>
          <el-button type="primary" class="entry-btn">进入管理后台</el-button>
        </div>
      </div>
    </section>

    <!-- 系统介绍 -->
    <!--
    <section id="about" class="about-section">
      <div class="section-header">
        <h3>系统介绍</h3>
        <p>基于先进技术的信用风险预测解决方案</p>
      </div>
      
      <div class="about-content">
        <div class="about-item">
          <div class="about-icon">
            <el-icon><DataBoard /></el-icon>
          </div>
          <h5>多源数据整合</h5>
          <p>整合政务数据、金融数据、行为数据等多维度信息，构建全面的信用评估体系</p>
        </div>
        
        <div class="about-item">
          <div class="about-icon">
            <el-icon><Cpu /></el-icon>
          </div>
          <h5>AI算法驱动</h5>
          <p>运用机器学习、深度学习等先进算法，实现精准的风险预测和分类</p>
        </div>
        
        <div class="about-item">
          <div class="about-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <h5>实时监控预警</h5>
          <p>7×24小时实时风险监控，及时发现潜在风险并发出预警</p>
        </div>
        
        <div class="about-item">
          <div class="about-icon">
            <el-icon><Document /></el-icon>
          </div>
          <h5>科学决策支持</h5>
          <p>为政府监管、企业决策、个人理财提供科学的数据支持</p>
        </div>
      </div>
    </section>
    -->

    <!-- 功能特色 -->
    <!--
    <section id="features" class="features-section">
      <div class="section-header">
        <h3>功能特色</h3>
        <p>全方位的信用风险管理解决方案</p>
      </div>
      
      <div class="features-content">
        <div class="feature-item">
          <h5>智能风险评估</h5>
          <p>基于大数据和AI算法，实现精准的信用风险评估和预测</p>
        </div>
        
        <div class="feature-item">
          <h5>多维主体画像</h5>
          <p>构建个人、企业等多维度的信用画像，全面了解信用状况</p>
        </div>
        
        <div class="feature-item">
          <h5>实时风险监控</h5>
          <p>实时监控信用变化，及时发现风险并采取应对措施</p>
        </div>
        
        <div class="feature-item">
          <h5>定向信息推送</h5>
          <p>根据风险等级和行业特点，实现精准的信息推送服务</p>
        </div>
        
        <div class="feature-item">
          <h5>监管报告生成</h5>
          <p>自动化生成监管报告，提高监管效率和科学性</p>
        </div>
        
        <div class="feature-item">
          <h5>算法研发平台</h5>
          <p>为科研机构提供算法研发、测试和部署的平台支持</p>
        </div>
      </div>
    </section>
    -->

    <!-- 数据统计 -->
    <!--
    <section id="statistics" class="statistics-section">
      <div class="section-header">
        <h3>数据统计</h3>
        <p>系统运行成果展示</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">125,430</div>
          <div class="stat-label">累计风险评估</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">98.5%</div>
          <div class="stat-label">预测准确率</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">856</div>
          <div class="stat-label">成功风险预警</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">28</div>
          <div class="stat-label">核心算法模型</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">50+</div>
          <div class="stat-label">合作机构</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">99.9%</div>
          <div class="stat-label">系统可用性</div>
        </div>
      </div>
    </section>
    -->
    
    <!-- 页脚 -->
    <footer class="home-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h5>海南省信用风险预测系统</h5>
        </div>
        
        <div class="footer-section">
          <h6>联系我们</h6>
          <p>电话：0898-XXXXXXX</p>
          <p>邮箱：contact@hainan-credit.gov.cn</p>
          <p>地址：海南省三亚市</p>
        </div>
        
        <div class="footer-section">
          <h6>技术支持</h6>
          <p>哈尔滨工程大学大数据与智能商务技术工信部重点实验室</p>
          <p>版本：v2.1.0</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2024 海南省信用风险预测系统 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { Setting, User, OfficeBuilding, School, Reading } from '@element-plus/icons-vue'

export default {
   name: 'Home',
   components: {
     Setting,
     User,
     OfficeBuilding,
     School,
     Reading
   },
   setup() {
     const router = useRouter()
     
     const goToLogin = (userType) => {
       localStorage.setItem('targetUserType', userType)
       
       // 所有用户类型都跳转到登录页面进行身份验证
       router.push('/login')
     }
     
     // 视频控制功能
      const initVideoControls = () => {
        const videoElement = document.getElementById('mapVideo')
        
        if (!videoElement) return
       
       // 视频加载完成后自动播放
       videoElement.addEventListener('canplay', () => {
         // 尝试自动播放
         const playPromise = videoElement.play()
         if (playPromise !== undefined) {
           playPromise.catch(() => {
             // 自动播放被阻止，静默处理
           })
         }
       })
       
       // 视频循环播放
       videoElement.addEventListener('ended', () => {
         videoElement.currentTime = 0
         videoElement.play()
       })
     }
     
     onMounted(() => {
       // 初始化视频控制
       initVideoControls()
     })
     
     return {
       goToLogin
     }
   }
 }
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 头部导航 */
.home-header {
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

.logo h1 {
  font-size: 24px;
  color: #304156;
  margin-bottom: 5px;
}

.logo p {
  font-size: 14px;
  color: #909399;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #606266;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #409EFF;
}

/* 英雄区域 */
.hero-section {
  padding: 100px 0 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-text h2 {
  font-size: 25px;
  margin-bottom: 20px;
  line-height: 1.3;
}

.hero-text p {
  font-size: 18px;
  margin-bottom: 30px;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.risk-chart-placeholder {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 30px;
  backdrop-filter: blur(10px);
}

.chart-title {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.risk-level {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.risk-level:last-child {
  border-bottom: none;
}

.low-risk .level-percent { color: #67C23A; }
.medium-risk .level-percent { color: #E6A23C; }
.high-risk .level-percent { color: #F56C6C; }

/* 视频播放器样式 */
.video-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  height: 500px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.video-wrapper {
  flex: 1;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
}

.map-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.video-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.video-controls {
  display: flex;
  gap: 10px;
}

.play-btn, .pause-btn, .mute-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.play-btn:hover, .pause-btn:hover, .mute-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.video-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.video-info {
   font-size: 14px;
   color: rgba(255, 255, 255, 0.8);
 }
 
 .video-status {
   font-weight: 500;
 }

.map-controls {
  display: flex;
  gap: 8px;
}

.zoom-btn, .reset-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.zoom-btn:hover, .reset-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.map-wrapper {
  flex: 1;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SVG地图容器样式 */
.svg-map-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none; /* 防止触摸事件干扰 */
}

.svg-map-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.svg-map-wrapper svg {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  display: block !important;
  margin: 0 auto !important;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  transition: transform 0.3s ease;
  user-select: none; /* 防止文本选择 */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  pointer-events: all; /* 确保SVG可以接收鼠标事件 */
}

/* 确保SVG内部的元素可以正确接收事件 */
.svg-map-wrapper svg path,
.svg-map-wrapper svg polygon,
.svg-map-wrapper svg rect,
.svg-map-wrapper svg circle,
.svg-map-wrapper svg g {
  pointer-events: all;
}

.map-footer {
  margin-top: 10px;
}

/* 地图提示框 */
.map-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #777;
  border-radius: 6px;
  padding: 12px;
  color: #fff;
  font-size: 12px;
  line-height: 1.4;
  z-index: 1000;
  display: none;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.tooltip-city {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: #ffd700;
}

.tooltip-value {
  margin-bottom: 2px;
}

.tooltip-risk {
  color: #67C23A;
}

.map-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.low-risk { background-color: #67C23A; }
.legend-color.medium-risk { background-color: #E6A23C; }
.legend-color.high-risk { background-color: #F56C6C; }

/* 扁平化风险统计区域 */
.risk-stats-flat {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 25px 0;
  max-width: 500px;
}

.risk-stats-header h4 {
  font-size: 16px;
  margin-bottom: 5px;
  color: #fff;
  font-weight: 600;
}

.risk-stats-header p {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 15px;
}

.risk-levels-flat {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-level-flat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-info-flat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.level-label-flat {
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}

.level-count-flat {
  font-size: 12px;
  opacity: 0.7;
}

.level-percent-flat {
  font-size: 12px;
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.low-risk .level-percent-flat { color: #67C23A; }
.medium-risk .level-percent-flat { color: #E6A23C; }
.high-risk .level-percent-flat { color: #F56C6C; }

.progress-bar-flat {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill-flat {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.low-risk .progress-fill-flat { background-color: #67C23A; }
.medium-risk .progress-fill-flat { background-color: #E6A23C; }
.high-risk .progress-fill-flat { background-color: #F56C6C; }

/* 风险统计区域 */
.risk-stats-section {
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 0 20px;
}

.risk-stats-content {
  display: flex;
  justify-content: center;
}

.risk-stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 25px;
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 500px;
}

.risk-stat-header {
  text-align: center;
  margin-bottom: 25px;
}

.risk-stat-header h4 {
  font-size: 20px;
  margin-bottom: 8px;
  font-weight: 600;
}

.risk-stat-header p {
  font-size: 14px;
  opacity: 0.8;
}

.risk-levels {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.risk-level {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.level-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 100px;
}

.level-label {
  font-size: 14px;
  font-weight: 500;
}

.level-count {
  font-size: 12px;
  opacity: 0.8;
}

.level-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  max-width: 200px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.low-risk .progress-fill { background-color: #67C23A; }
.medium-risk .progress-fill { background-color: #E6A23C; }
.high-risk .progress-fill { background-color: #F56C6C; }

.level-percent {
  font-size: 14px;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}

/* 用户入口区域 */
.user-entry-section {
  padding: 20px 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 32px;
  color: #303133;
  margin-bottom: 10px;
}

.section-header p {
  font-size: 16px;
  color: #909399;
}

.user-cards {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.user-card {
  background: #fafafa;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  border: 1px solid #e6e6e6;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 所有用户卡片统一初始样式 - 深色主题 */
.user-card {
  border: 2px solid rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%);
}

.user-card .card-icon {
  color: rgba(0, 0, 0, 0.7);
}

.user-card h4 {
  color: rgba(0, 0, 0, 0.9);
}

.user-card p {
  color: rgba(0, 0, 0, 0.7);
}

.user-card .card-stats {
  color: rgba(0, 0, 0, 0.6);
}

/* 个人用户卡片悬停效果 - 白色变绿色 */
.user-card.personal-card:hover {
  border-color: #67C23A;
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.15) 0%, rgba(103, 194, 58, 0.05) 100%);
}

.user-card.personal-card:hover .card-icon {
  color: #67C23A;
}

.user-card.personal-card:hover h4 {
  color: #67C23A;
}

/* 企业用户卡片悬停效果 - 白色变蓝色 */
.user-card.enterprise-card:hover {
  border-color: #409EFF;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.15) 0%, rgba(64, 158, 255, 0.05) 100%);
}

.user-card.enterprise-card:hover .card-icon {
  color: #409EFF;
}

.user-card.enterprise-card:hover h4 {
  color: #409EFF;
}

/* 政府用户卡片悬停效果 - 白色变红色 */
.user-card.government-card:hover {
  border-color: #F56C6C;
  background: linear-gradient(135deg, rgba(245, 108, 108, 0.15) 0%, rgba(245, 108, 108, 0.05) 100%);
}

.user-card.government-card:hover .card-icon {
  color: #F56C6C;
}

.user-card.government-card:hover h4 {
  color: #F56C6C;
}

/* 科研用户卡片悬停效果 - 白色变紫色 */
.user-card.research-card:hover {
  border-color: #8A2BE2;
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.15) 0%, rgba(138, 43, 226, 0.05) 100%);
}

.user-card.research-card:hover .card-icon {
  color: #8A2BE2;
}

.user-card.research-card:hover h4 {
  color: #8A2BE2;
}

/* 管理员卡片悬停效果 - 白色变橙色 */
.user-card.admin-card:hover {
  border-color: #E6A23C;
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.15) 0%, rgba(230, 162, 60, 0.05) 100%);
}

.user-card.admin-card:hover .card-icon {
  color: #E6A23C;
}

.user-card.admin-card:hover h4 {
  color: #E6A23C;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-icon {
  margin-bottom: 15px;
  color: #409EFF;
}

.user-card h4 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 12px;
}

.user-card p {
  color: #606266;
  margin-bottom: 15px;
  line-height: 1.4;
  font-size: 14px;
  flex-grow: 1;
}

.card-stats {
  margin-bottom: 15px;
  color: #909399;
  font-size: 12px;
}

.entry-btn {
  width: 100%;
  font-size: 14px;
  padding: 8px 15px;
}

/* 其他区域样式 */
.about-section, .features-section, .statistics-section {
  padding: 80px 0;
  background: #f5f7fa;
}

.about-content, .features-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

.about-item, .feature-item {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.about-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 20px;
}

.about-item h5, .feature-item h5 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 15px;
}

.about-item p, .feature-item p {
  color: #606266;
  line-height: 1.6;
}

.stats-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.stat-card {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.stat-card .stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #409EFF;
  margin-bottom: 10px;
}

.stat-card .stat-label {
  color: #606266;
  font-size: 14px;
}

/* 页脚 */
.home-footer {
  background: #304156;
  color: white;
  padding: 30px 0 1px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 20px;
}

.footer-section h5, .footer-section h6 {
  margin-bottom: 15px;
  color: #67C23A;
}

.footer-section p {
  margin-bottom: 8px;
  opacity: 0.8;
  font-size: 14px;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.6;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .user-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .user-card {
    min-height: 200px;
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 20px;
  }
  
  .nav-menu {
    margin-top: 15px;
    gap: 20px;
  }
  
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .user-cards {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .user-card {
    min-height: 220px;
    padding: 20px;
  }
  
  .user-card h4 {
    font-size: 16px;
  }
  
  .user-card p {
    font-size: 13px;
  }
}
</style>
