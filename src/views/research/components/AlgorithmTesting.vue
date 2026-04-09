<template>
  <div class="algorithm-testing">
    <!-- 测试环境头部 -->
    <div class="testing-header">
      <div class="header-info">
        <h3>算法测试环境</h3>
        <p>在线测试算法性能，支持多种测试数据集和评估指标</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="startNewTest">
          <el-icon><VideoPlay /></el-icon>
          开始新测试
        </el-button>
        <el-button @click="exportTestResults">
          <el-icon><Download /></el-icon>
          导出结果
        </el-button>
      </div>
    </div>

    <!-- 测试配置区域 -->
    <el-card class="test-config-card">
      <template #header>
        <span>测试配置</span>
      </template>
      
      <el-form :model="testConfig" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择算法">
              <el-select v-model="testConfig.algorithmId" placeholder="请选择要测试的算法" style="width: 100%;">
                <el-option 
                  v-for="algorithm in availableAlgorithms" 
                  :key="algorithm.id" 
                  :label="algorithm.name" 
                  :value="algorithm.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试数据集">
              <el-select v-model="testConfig.datasetId" placeholder="请选择测试数据集" style="width: 100%;">
                <el-option 
                  v-for="dataset in testDatasets" 
                  :key="dataset.id" 
                  :label="dataset.name" 
                  :value="dataset.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="测试类型">
              <el-radio-group v-model="testConfig.testType">
                <el-radio label="accuracy">准确率测试</el-radio>
                <el-radio label="performance">性能测试</el-radio>
                <el-radio label="stress">压力测试</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="样本数量">
              <el-slider 
                v-model="testConfig.sampleSize" 
                :min="100" 
                :max="10000" 
                :step="100" 
                show-stops
                show-input
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="评估指标">
          <el-checkbox-group v-model="testConfig.metrics">
            <el-checkbox label="accuracy">准确率</el-checkbox>
            <el-checkbox label="precision">精确率</el-checkbox>
            <el-checkbox label="recall">召回率</el-checkbox>
            <el-checkbox label="f1">F1分数</el-checkbox>
            <el-checkbox label="auc">AUC</el-checkbox>
            <el-checkbox label="runtime">运行时间</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      
      <div class="config-actions">
        <el-button type="primary" @click="runTest" :loading="testing">
          <el-icon><VideoPlay /></el-icon>
          开始测试
        </el-button>
        <el-button @click="resetConfig">重置配置</el-button>
      </div>
    </el-card>

    <!-- 测试结果展示 -->
    <div v-if="testResults" class="test-results">
      <el-card class="results-card">
        <template #header>
          <span>测试结果</span>
        </template>
        
        <!-- 结果概览 -->
        <div class="results-overview">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="result-metric">
                <div class="metric-value">{{ testResults.accuracy }}%</div>
                <div class="metric-label">准确率</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="result-metric">
                <div class="metric-value">{{ testResults.precision }}%</div>
                <div class="metric-label">精确率</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="result-metric">
                <div class="metric-value">{{ testResults.recall }}%</div>
                <div class="metric-label">召回率</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="result-metric">
                <div class="metric-value">{{ testResults.runtime }}ms</div>
                <div class="metric-label">平均运行时间</div>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <!-- 详细指标 -->
        <div class="detailed-metrics">
          <h4>详细评估指标</h4>
          <el-table :data="[testResults]" border style="width: 100%; margin-top: 15px;">
            <el-table-column prop="accuracy" label="准确率" width="100" />
            <el-table-column prop="precision" label="精确率" width="100" />
            <el-table-column prop="recall" label="召回率" width="100" />
            <el-table-column prop="f1" label="F1分数" width="100" />
            <el-table-column prop="auc" label="AUC" width="100" />
            <el-table-column prop="runtime" label="运行时间(ms)" width="120" />
          </el-table>
        </div>
        
        <!-- 混淆矩阵 -->
        <div class="confusion-matrix">
          <h4>混淆矩阵</h4>
          <div class="matrix-container">
            <table class="matrix-table">
              <tr>
                <th></th>
                <th>预测正类</th>
                <th>预测负类</th>
              </tr>
              <tr>
                <th>实际正类</th>
                <td class="tp">{{ testResults.confusionMatrix.tp }}</td>
                <td class="fn">{{ testResults.confusionMatrix.fn }}</td>
              </tr>
              <tr>
                <th>实际负类</th>
                <td class="fp">{{ testResults.confusionMatrix.fp }}</td>
                <td class="tn">{{ testResults.confusionMatrix.tn }}</td>
              </tr>
            </table>
          </div>
        </div>
        
        <!-- 性能图表 -->
        <div class="performance-chart">
          <h4>性能趋势</h4>
          <div class="chart-container">
            <!-- 这里可以集成ECharts图表 -->
            <div class="chart-placeholder">
              <el-icon :size="48" color="#409EFF"><TrendCharts /></el-icon>
              <p>性能趋势图表区域</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 测试历史 -->
    <el-card class="test-history-card">
      <template #header>
        <span>测试历史记录</span>
      </template>
      
      <el-table :data="testHistory" style="width: 100%">
        <el-table-column prop="algorithmName" label="算法名称" width="200" />
        <el-table-column prop="datasetName" label="测试数据集" width="150" />
        <el-table-column prop="testType" label="测试类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTestTypeTag(row.testType)">{{ getTestTypeText(row.testType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="accuracy" label="准确率" width="100">
          <template #default="{ row }">
            <span :class="{ 'high-accuracy': row.accuracy >= 90 }">{{ row.accuracy }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="testTime" label="测试时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="viewTestDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { VideoPlay, Download, TrendCharts } from '@element-plus/icons-vue'

export default {
  name: 'AlgorithmTesting',
  components: {
    VideoPlay, Download, TrendCharts
  },
  setup() {
    const testing = ref(false)
    const testResults = ref(null)

    // 测试配置
    const testConfig = reactive({
      algorithmId: '',
      datasetId: '',
      testType: 'accuracy',
      sampleSize: 1000,
      metrics: ['accuracy', 'precision', 'recall', 'f1', 'auc', 'runtime']
    })

    // 可用算法
    const availableAlgorithms = ref([
      { id: 1, name: 'XGBoost信用评分' },
      { id: 2, name: 'LSTM风险预测' },
      { id: 3, name: '随机森林分类器' }
    ])

    // 测试数据集
    const testDatasets = ref([
      { id: 1, name: '企业信用数据集' },
      { id: 2, name: '个人信用数据集' },
      { id: 3, name: '行业风险数据集' },
      { id: 4, name: '欺诈检测数据集' }
    ])

    // 测试历史
    const testHistory = ref([
      {
        id: 1,
        algorithmName: 'XGBoost信用评分',
        datasetName: '企业信用数据集',
        testType: 'accuracy',
        accuracy: 92.5,
        testTime: '2024-01-15 14:30:00'
      },
      {
        id: 2,
        algorithmName: 'LSTM风险预测',
        datasetName: '行业风险数据集',
        testType: 'performance',
        accuracy: 88.3,
        testTime: '2024-01-14 10:15:00'
      },
      {
        id: 3,
        algorithmName: '随机森林分类器',
        datasetName: '欺诈检测数据集',
        testType: 'stress',
        accuracy: 85.7,
        testTime: '2024-01-13 16:20:00'
      }
    ])

    // 方法
    const startNewTest = () => {
      testConfig.algorithmId = ''
      testConfig.datasetId = ''
      testConfig.testType = 'accuracy'
      testConfig.sampleSize = 1000
      testConfig.metrics = ['accuracy', 'precision', 'recall', 'f1', 'auc', 'runtime']
      testResults.value = null
      ElMessage.info('已重置测试配置')
    }

    const runTest = () => {
      if (!testConfig.algorithmId || !testConfig.datasetId) {
        ElMessage.warning('请选择算法和测试数据集')
        return
      }

      testing.value = true
      
      // 模拟测试过程
      setTimeout(() => {
        testing.value = false
        
        // 生成测试结果
        testResults.value = {
          accuracy: Math.random() * 10 + 85, // 85-95%
          precision: Math.random() * 10 + 83,
          recall: Math.random() * 10 + 82,
          f1: Math.random() * 10 + 84,
          auc: Math.random() * 10 + 86,
          runtime: Math.random() * 50 + 100, // 100-150ms
          confusionMatrix: {
            tp: Math.floor(Math.random() * 100 + 400),
            fn: Math.floor(Math.random() * 50 + 20),
            fp: Math.floor(Math.random() * 30 + 10),
            tn: Math.floor(Math.random() * 200 + 300)
          }
        }

        // 添加到历史记录
        const algorithm = availableAlgorithms.value.find(a => a.id === testConfig.algorithmId)
        const dataset = testDatasets.value.find(d => d.id === testConfig.datasetId)
        
        testHistory.value.unshift({
          id: Date.now(),
          algorithmName: algorithm.name,
          datasetName: dataset.name,
          testType: testConfig.testType,
          accuracy: testResults.value.accuracy.toFixed(1),
          testTime: new Date().toLocaleString()
        })

        ElMessage.success('测试完成')
      }, 2000)
    }

    const resetConfig = () => {
      testConfig.algorithmId = ''
      testConfig.datasetId = ''
      testConfig.testType = 'accuracy'
      testConfig.sampleSize = 1000
      testConfig.metrics = ['accuracy', 'precision', 'recall', 'f1', 'auc', 'runtime']
    }

    const exportTestResults = () => {
      if (!testResults.value) {
        ElMessage.warning('暂无测试结果可导出')
        return
      }
      ElMessage.info('导出测试结果功能开发中...')
    }

    const viewTestDetail = (test) => {
      ElMessage.info(`查看测试详情: ${test.algorithmName}`)
    }

    const getTestTypeTag = (type) => {
      const typeMap = {
        'accuracy': 'primary',
        'performance': 'success',
        'stress': 'warning'
      }
      return typeMap[type] || 'info'
    }

    const getTestTypeText = (type) => {
      const textMap = {
        'accuracy': '准确率测试',
        'performance': '性能测试',
        'stress': '压力测试'
      }
      return textMap[type] || '未知类型'
    }

    onMounted(() => {
      // 初始化默认选择
      if (availableAlgorithms.value.length > 0) {
        testConfig.algorithmId = availableAlgorithms.value[0].id
      }
      if (testDatasets.value.length > 0) {
        testConfig.datasetId = testDatasets.value[0].id
      }
    })

    return {
      testing,
      testConfig,
      testResults,
      availableAlgorithms,
      testDatasets,
      testHistory,
      startNewTest,
      runTest,
      resetConfig,
      exportTestResults,
      viewTestDetail,
      getTestTypeTag,
      getTestTypeText
    }
  }
}
</script>

<style scoped>
.algorithm-testing {
  padding: 20px;
}

.testing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-info h3 {
  margin: 0 0 8px 0;
  color: #303133;
}

.header-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.test-config-card,
.results-card,
.test-history-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.config-actions {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.results-overview {
  margin-bottom: 20px;
}

.result-metric {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  color: #909399;
}

.detailed-metrics,
.confusion-matrix,
.performance-chart {
  margin-bottom: 30px;
}

.matrix-container {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.matrix-table {
  border-collapse: collapse;
  text-align: center;
}

.matrix-table th,
.matrix-table td {
  border: 1px solid #e4e7ed;
  padding: 10px 15px;
}

.matrix-table th {
  background: #f5f7fa;
  font-weight: 600;
}

.matrix-table .tp {
  background: #f0f9ff;
  color: #409EFF;
}

.matrix-table .fn {
  background: #fef0f0;
  color: #F56C6C;
}

.matrix-table .fp {
  background: #fef6ec;
  color: #E6A23C;
}

.matrix-table .tn {
  background: #f0f9eb;
  color: #67C23A;
}

.chart-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 15px;
}

.chart-placeholder {
  text-align: center;
  color: #909399;
}

.high-accuracy {
  color: #67C23A;
  font-weight: bold;
}
</style>