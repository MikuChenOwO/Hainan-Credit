<template>
  <div class="user-profile">
    <!-- 基本信息卡片 -->
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="info-item">
            <label>姓名：</label>
            <span>{{ userInfo.name }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <label>年龄：</label>
            <span>{{ userInfo.age }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <label>职业：</label>
            <span>{{ userInfo.occupation }}</span>
          </div>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="info-item">
            <label>收入：</label>
            <span>{{ userInfo.income }}元/月</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <label>负债：</label>
            <span>{{ userInfo.debt }}元</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <label>资产：</label>
            <span>{{ userInfo.assets }}元</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 信用评分雷达图 -->
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>多维信用画像</span>
        </div>
      </template>
      
      <div class="radar-chart">
        <div id="radarChart" style="width: 100%; height: 400px;"></div>
      </div>
    </el-card>

    <!-- 信用指标分布 -->
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>信用指标分析</span>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in creditMetrics" :key="index">
          <div class="metric-card">
            <div class="metric-value" :style="{ color: item.color }">{{ item.value }}</div>
            <div class="metric-label">{{ item.label }}</div>
            <div class="metric-desc">{{ item.desc }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'UserProfile',
  setup() {
    const userInfo = ref({
      name: '张三',
      age: 35,
      occupation: '工程师',
      income: 15000,
      debt: 200000,
      assets: 500000
    })

    const creditMetrics = ref([
      { label: '还款能力', value: '85分', desc: '良好', color: '#67C23A' },
      { label: '消费习惯', value: '78分', desc: '良好', color: '#67C23A' },
      { label: '负债水平', value: '65分', desc: '中等', color: '#E6A23C' },
      { label: '信用历史', value: '92分', desc: '优秀', color: '#67C23A' }
    ])

    const initRadarChart = () => {
      const chartDom = document.getElementById('radarChart')
      if (!chartDom) return
      
      const chart = echarts.init(chartDom)
      const option = {
        tooltip: {},
        radar: {
          indicator: [
            { name: '还款能力', max: 100 },
            { name: '消费习惯', max: 100 },
            { name: '负债水平', max: 100 },
            { name: '信用历史', max: 100 },
            { name: '收入稳定性', max: 100 },
            { name: '资产状况', max: 100 }
          ]
        },
        series: [{
          type: 'radar',
          data: [{
            value: [85, 78, 65, 92, 80, 75],
            name: '信用画像',
            areaStyle: {}
          }]
        }]
      }
      
      chart.setOption(option)
      
      // 响应式调整
      window.addEventListener('resize', () => {
        chart.resize()
      })
    }

    onMounted(() => {
      setTimeout(initRadarChart, 100)
    })

    return {
      userInfo,
      creditMetrics
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 0;
}

.profile-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: 600;
  font-size: 16px;
}

.info-item {
  margin-bottom: 15px;
}

.info-item label {
  font-weight: 600;
  color: #606266;
  margin-right: 10px;
}

.info-item span {
  color: #303133;
}

.metric-card {
  text-align: center;
  padding: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: #fafafa;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.metric-desc {
  font-size: 12px;
  color: #909399;
}

.radar-chart {
  padding: 20px 0;
}
</style>