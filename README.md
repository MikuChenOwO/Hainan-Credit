# 海南省信用风险预测系统
# 版权所有：哈尔滨工程大学大数据与智能商务技术工信部重点实验室，未经允许不得复制、使用。
## 项目概述

海南省信用风险预测系统是一个基于人工智能技术的智能信用评估与风险预测平台。该系统利用先进的AI算法，对海南省企业信用风险进行精准预测和实时监控，为政府监管部门、企业和研究机构提供科学的决策依据。

## 系统特色

- 🎯 **多角色智能分析**: 支持个人、企业、政府、研究机构四种用户角色
- 📊 **实时风险监控**: 基于ECharts的可视化风险分布地图
- 🤖 **AI驱动预测**: 集成机器学习算法进行信用风险评估
- 📈 **数据可视化**: 丰富的图表展示和数据分析功能
- 📱 **响应式设计**: 适配桌面端和移动端设备
- 🔒 **权限管理**: 基于角色的功能访问控制

## 功能特性

### 主要功能模块

1. **首页展示**
   - 海南省企业信用风险分布可视化地图
   - 实时风险统计数据展示
   - 风险等级分布统计图表

2. **用户角色系统**
   - **个人用户**: 个人信用查询、历史记录、风险预测
   - **企业用户**: 企业信用报告、财务分析、风险监控、风险预测
   - **政府监管**: 行业分析、风险监控、监管报告、精准推送
   - **科研人员**: 算法编排、算法上传、模型训练

3. **核心功能**
   - 基于AI的信用风险预测
   - 实时风险监控
   - 可视化数据分析
   - 地理位置风险分布展示
   - 行业风险分析

### 详细功能说明

#### 个人用户功能
- **个人信息管理**: 查看和编辑个人资料
- **信用查询**: 实时查询个人信用评分
- **历史记录**: 查看信用查询历史
- **风险预测**: 基于AI算法的个人信用风险预测

#### 企业用户功能
- **企业信用报告**: 生成详细的企业信用评估报告
- **财务分析**: 企业财务状况可视化分析
- **风险监控**: 实时监控企业信用风险变化
- **风险预测**: 基于历史数据的风险趋势预测

#### 政府监管功能
- **行业分析**: 按行业分类的风险统计分析
- **风险监控**: 区域风险实时监控
- **监管报告**: 自动生成监管报告
- **精准推送**: 定向推送风险预警信息

#### 科研人员功能
- **算法编排**: 拖拽式算法流程编排
- **算法上传**: 支持自定义算法上传
- **模型训练**: 在线模型训练和测试

## 技术架构

### 前端技术栈
- **Vue 3**: 现代化前端框架，使用Composition API
- **Vue Router**: 路由管理，支持动态路由和权限控制
- **Element Plus**: UI组件库，提供丰富的UI组件
- **ECharts/Vue-ECharts**: 数据可视化，支持多种图表类型和地图展示
- **Vite**: 构建工具，提供快速的开发体验

### 后端技术栈
- **SpringBoot**: 企业级Java框架，提供完整的微服务支持
- **Spring Security**: 安全认证与权限管理框架
- **Spring Data JPA**: 数据持久化ORM框架
- **MySQL**: 关系型数据库，存储业务数据
- **Redis**: 缓存数据库，提升系统性能
- **RESTful API**: 标准的REST接口设计

### 系统架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端应用层     │    │   后端服务层     │    │   数据服务层     │
│                 │    │                 │    │                 │
│ • Vue 3         │◄──►│ • SpringBoot    │◄──►│ • MySQL         │
│ • Element Plus  │    │ • Spring Security│    │ • Redis         │
│ • ECharts       │    │ • Spring Data JPA│    │ • 业务数据       │
│                 │    │ • RESTful API   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 系统截图

系统包含以下主要界面：
- 首页：信用风险分布地图及统计信息
- 登录界面：多角色身份认证
- 个人仪表板：个人信息及信用查询
- 企业仪表板：企业信用报告与分析
- 政府仪表板：监管数据分析
- 研究仪表板：算法开发与测试

## 安装部署

### 前端安装

```bash
# 克隆项目
git clone https://github.com/MikuChenOwO/Hainan-Credit
cd credit-risk-system

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 后端安装

```bash
# 进入SpringBoot项目目录
cd credit-risk-backend

# 使用Maven构建项目
mvn clean install

# 启动SpringBoot应用
mvn spring-boot:run

# 或者直接运行jar包
java -jar target/credit-risk-backend-1.0.0.jar
```

## 环境配置

### 前端环境要求
- Node.js >= 16.x
- npm 或 yarn

### 后端环境要求
- Java >= 11
- Maven >= 3.6
- MySQL >= 8.0
- Redis >= 6.0

### 数据库配置
1. 创建MySQL数据库：`credit_risk_system`
2. 导入数据库脚本：`database/schema.sql`
3. 配置Redis连接信息
4. 修改`application.yml`中的数据库连接配置

## 项目结构

### 前端项目结构
```
credit-risk-system/          # 前端项目根目录
├── src/                    # 前端源码
│   ├── composables/        # Vue组合式函数
│   │   └── useFeatureAccess.js  # 功能权限控制
│   ├── config/             # 配置文件
│   │   └── userAccess.js   # 用户权限配置
│   ├── map/                # 地图相关资源
│   │   └── NB-Map.svg      # 海南省地图SVG
│   ├── router/             # 路由配置
│   │   └── index.js        # 路由定义
│   ├── utils/              # 工具函数
│   │   └── auth.js         # 认证工具
│   ├── views/              # 页面组件
│   │   ├── admin/          # 管理员仪表板
│   │   │   └── AdminDashboard.vue
│   │   ├── enterprise/     # 企业仪表板
│   │   │   ├── components/ # 企业组件
│   │   │   └── EnterpriseDashboard.vue
│   │   ├── government/     # 政府仪表板
│   │   │   ├── components/ # 政府组件
│   │   │   └── GovernmentDashboard.vue
│   │   ├── personal/       # 个人仪表板
│   │   │   ├── components/ # 个人组件
│   │   │   └── PersonalDashboard.vue
│   │   ├── research/       # 研究仪表板
│   │   │   ├── components/ # 研究组件
│   │   │   └── ResearchDashboard.vue
│   │   ├── Dashboard.vue   # 主仪表板
│   │   ├── Home.vue        # 首页
│   │   └── Login.vue       # 登录页
│   ├── App.vue             # 根组件
│   └── main.js             # 应用入口
├── public/                 # 静态资源
├── dist/                   # 构建输出目录
├── package.json           # 前端依赖配置
├── index.html             # HTML入口文件
└── README.md              # 项目说明文档
```

### 后端项目结构
```
credit-risk-backend/        # SpringBoot后端项目
├── src/main/java/
│   └── com/creditrisk/
│       ├── controller/     # 控制器层
│       ├── service/        # 业务逻辑层
│       ├── repository/     # 数据访问层
│       ├── entity/         # 实体类
│       ├── dto/            # 数据传输对象
│       ├── config/         # 配置类
│       └── Application.java # 启动类
├── src/main/resources/
│   ├── application.yml     # 应用配置
│   └── static/            # 静态资源
├── src/test/java/         # 测试代码
├── database/              # 数据库脚本
│   ├── schema.sql         # 数据库建表脚本
│   └── data.sql           # 初始化数据
├── pom.xml               # Maven依赖配置
└── README.md             # 后端项目说明
```

## API接口

### 主要API接口

#### 认证相关接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/profile` - 获取用户信息
- `POST /api/auth/logout` - 用户登出

#### 企业数据接口
- `GET /api/enterprises` - 获取企业列表
- `GET /api/enterprises/{id}` - 获取企业详情
- `POST /api/enterprises` - 创建企业信息
- `PUT /api/enterprises/{id}` - 更新企业信息
- `GET /api/enterprises/risk-analysis` - 企业风险分析

#### 风险预测接口
- `POST /api/predictions/enterprise` - 企业风险预测
- `POST /api/predictions/personal` - 个人信用评估
- `GET /api/predictions/history` - 预测历史记录

#### 算法管理接口
- `GET /api/algorithms` - 获取算法列表
- `POST /api/algorithms` - 上传新算法
- `POST /api/algorithms/{id}/test` - 测试算法
- `PUT /api/algorithms/{id}/deploy` - 部署算法

#### 数据统计接口
- `GET /api/statistics/overview` - 系统概览统计
- `GET /api/statistics/risk-distribution` - 风险分布统计
- `GET /api/statistics/industry-analysis` - 行业分析数据

### API使用示例

```javascript
// 用户登录
fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'user@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => {
  // 保存token
  localStorage.setItem('token', data.token);
});

// 获取企业风险分析
fetch('/api/enterprises/risk-analysis', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(response => response.json())
.then(data => {
  // 处理风险分析数据
  console.log(data);
});
```

## 使用说明

1. 启动后端服务
2. 启动前端开发服务器
3. 访问 `http://localhost:5173` 进行使用
4. 根据不同角色登录系统使用相应功能

## 开发指南

### 前端开发
- **组件化开发**: 使用Vue 3单文件组件(SFC)模式
- **状态管理**: 使用Composition API进行状态管理
- **路由配置**: 基于角色的动态路由权限控制
- **UI组件**: 使用Element Plus组件库，保持界面一致性
- **数据可视化**: 集成ECharts进行图表展示和地图可视化
- **API调用**: 使用axios进行HTTP请求，统一错误处理

### 后端开发
- **框架选择**: SpringBoot 2.7+，提供完整的微服务支持
- **安全认证**: 集成Spring Security进行权限控制
- **数据持久化**: 使用Spring Data JPA进行数据库操作
- **API设计**: RESTful API规范，统一响应格式
- **缓存策略**: Redis缓存提升系统性能
- **事务管理**: Spring声明式事务管理
- **单元测试**: 使用JUnit和Mockito进行测试

### 数据库设计
- **关系型数据库**: MySQL 8.0+，支持事务和复杂查询
- **表结构设计**: 遵循数据库设计范式
- **索引优化**: 合理设计索引提升查询性能
- **数据备份**: 定期备份重要业务数据

### 代码规范
- **前端**: 遵循Vue 3官方代码风格指南
- **后端**: 遵循阿里巴巴Java开发手册
- **数据库**: 使用统一的命名规范和注释
- **提交信息**: 使用约定式提交(Conventional Commits)
- **文档**: 代码注释和API文档保持同步更新

## 项目特点

1. **多角色支持**: 支持个人、企业、政府、研究等不同用户角色
2. **实时可视化**: 基于ECharts的风险分布地图展示
3. **AI驱动**: 利用机器学习算法进行风险预测
4. **地理信息**: 结合地理位置的风险分析
5. **响应式设计**: 适配不同设备屏幕