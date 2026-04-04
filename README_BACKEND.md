# 海南省信用风险预测系统 - 后端API方案

## 概述

为了解决前端地图显示问题，我们实现了一个基于pyecharts的后端API方案。该方案通过后端生成精确的地图配置，前端只需调用API获取配置并渲染图表。

## 项目结构

```
backend/
├── app.py                 # Flask后端主应用
├── requirements.txt       # Python依赖包
├── start_backend.py       # 后端启动脚本
└── README_BACKEND.md      # 本说明文档
```

## 快速开始

### 1. 启动后端服务

#### 方法一：使用启动脚本（推荐）

```bash
# 进入backend目录
cd backend

# 运行启动脚本
python start_backend.py
```

#### 方法二：手动启动

```bash
# 进入backend目录
cd backend

# 安装依赖
pip install -r requirements.txt

# 启动Flask应用
python app.py
```

### 2. 验证后端服务

后端服务启动后，访问以下URL验证服务是否正常：

- **健康检查**: http://localhost:5000/api/health
- **地图API**: http://localhost:5000/api/map/hainan

### 3. 启动前端服务

```bash
# 在项目根目录启动前端
npm run dev
```

前端将自动连接到后端API获取地图配置。

## API接口说明

### 1. 健康检查接口

**URL**: `GET /api/health`

**响应示例**:
```json
{
  "status": "healthy",
  "message": "Backend API is running"
}
```

### 2. 海南省地图配置接口

**URL**: `GET /api/map/hainan`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "title": {"text": "海南省企业信用风险分布"},
    "tooltip": {...},
    "series": [...],
    "visualMap": {...}
  }
}
```

## 技术特点

### 后端优势

1. **精确的地图数据**: 使用pyecharts内置的海南省地图，确保地理数据准确
2. **专业的图表配置**: 利用pyecharts丰富的配置选项，生成专业的地图
3. **灵活的数据处理**: 后端可以轻松处理复杂的数据逻辑和计算

### 前端改进

1. **简化前端代码**: 前端只需调用API，无需处理复杂的地图配置
2. **错误处理机制**: 包含完整的错误处理和备用方案
3. **响应式设计**: 保持原有的响应式特性

## 错误处理

系统包含完整的错误处理机制：

1. **后端不可用**: 前端会自动使用内置的备用地图
2. **网络错误**: 显示友好的错误提示信息
3. **数据异常**: 提供降级方案确保系统可用

## 开发说明

### 扩展新的地图类型

要添加新的地图类型，只需在后端添加新的API接口：

```python
@app.route('/api/map/<map_type>', methods=['GET'])
def get_map_config(map_type):
    if map_type == 'hainan':
        return get_hainan_map_option()
    elif map_type == 'other':
        return get_other_map_option()
    # ...
```

### 自定义数据源

可以修改`get_hainan_map_option()`函数来连接真实的数据源：

```python
def get_hainan_map_option():
    # 从数据库获取真实数据
    real_data = get_data_from_database()
    
    # 使用真实数据生成地图配置
    return generate_map_config(real_data)
```

## 故障排除

### 常见问题

1. **端口占用**: 如果5000端口被占用，可以修改`app.py`中的端口号
2. **依赖安装失败**: 尝试使用`pip install --upgrade pip`升级pip
3. **跨域问题**: 已配置CORS，确保前端可以正常访问后端API

### 日志查看

后端服务会在控制台输出详细的日志信息，包括：
- 服务启动状态
- API请求日志
- 错误信息

## 性能优化建议

1. **缓存机制**: 对不经常变化的地图配置添加缓存
2. **CDN加速**: 对静态资源使用CDN加速
3. **数据库优化**: 对大数据量的查询进行优化

## 部署说明

### 生产环境部署

1. 使用Gunicorn或uWSGI部署Flask应用
2. 配置Nginx反向代理
3. 设置环境变量和生产配置

### Docker部署

可以创建Dockerfile进行容器化部署：

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## 联系我们

如有问题或建议，请联系技术支持团队。