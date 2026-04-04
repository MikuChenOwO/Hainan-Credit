<template>
  <div class="algorithm-composer">
    <div class="composer-header">
      <h3>拖拽式算法组合器</h3>
      <p>通过拖拽组件快速构建新的信用风险算法</p>
    </div>

    <div class="composer-layout">
      <!-- 左侧算法组件库 -->
      <div class="component-library">
        <div class="library-header">
          <h4>算法组件库</h4>
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索算法组件" 
            size="small" 
            prefix-icon="Search"
          />
        </div>
        
        <div class="component-categories">
          <el-tabs v-model="activeCategory" type="card">
            <el-tab-pane label="数据预处理" name="preprocessing">
              <div class="components-list">
                <div 
                  v-for="component in filteredComponents.preprocessing" 
                  :key="component.id"
                  class="component-item"
                  draggable="true"
                  @dragstart="onDragStart(component)"
                >
                  <div class="component-icon">
                    <el-icon :size="20"><DataAnalysis /></el-icon>
                  </div>
                  <div class="component-info">
                    <div class="component-name">{{ component.name }}</div>
                    <div class="component-desc">{{ component.description }}</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="特征工程" name="feature">
              <div class="components-list">
                <div 
                  v-for="component in filteredComponents.feature" 
                  :key="component.id"
                  class="component-item"
                  draggable="true"
                  @dragstart="onDragStart(component)"
                >
                  <div class="component-icon">
                    <el-icon :size="20"><Star /></el-icon>
                  </div>
                  <div class="component-info">
                    <div class="component-name">{{ component.name }}</div>
                    <div class="component-desc">{{ component.description }}</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="模型算法" name="model">
              <div class="components-list">
                <div 
                  v-for="component in filteredComponents.model" 
                  :key="component.id"
                  class="component-item"
                  draggable="true"
                  @dragstart="onDragStart(component)"
                >
                  <div class="component-icon">
                    <el-icon :size="20"><Cpu /></el-icon>
                  </div>
                  <div class="component-info">
                    <div class="component-name">{{ component.name }}</div>
                    <div class="component-desc">{{ component.description }}</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="评估指标" name="evaluation">
              <div class="components-list">
                <div 
                  v-for="component in filteredComponents.evaluation" 
                  :key="component.id"
                  class="component-item"
                  draggable="true"
                  @dragstart="onDragStart(component)"
                >
                  <div class="component-icon">
                    <el-icon :size="20"><TrendCharts /></el-icon>
                  </div>
                  <div class="component-info">
                    <div class="component-name">{{ component.name }}</div>
                    <div class="component-desc">{{ component.description }}</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 右侧工作区 -->
      <div class="workspace">
        <div class="workspace-header">
          <h4>算法工作区</h4>
          <div class="workspace-actions">
            <el-button type="primary" @click="saveAlgorithm">
              <el-icon><DocumentAdd /></el-icon>
              保存算法
            </el-button>
            <el-button @click="clearWorkspace">
              <el-icon><Delete /></el-icon>
              清空工作区
            </el-button>
            <el-button @click="testAlgorithm">
              <el-icon><VideoPlay /></el-icon>
              测试运行
            </el-button>
          </div>
        </div>
        
        <div 
          class="workspace-area"
          @drop="onDrop"
          @dragover="onDragOver"
        >
          <div v-if="algorithmFlow.length === 0" class="empty-workspace">
            <el-icon size="64" color="#909399"><Plus /></el-icon>
            <p>拖拽算法组件到此处开始构建</p>
          </div>
          
          <div v-else class="algorithm-flow">
            <div 
              v-for="(node, index) in algorithmFlow" 
              :key="node.id"
              class="flow-node"
              :class="{ 'active-node': activeNodeIndex === index }"
              @click="selectNode(index)"
            >
              <div class="node-header">
                <div class="node-icon">
                  <el-icon :size="16">
                    <DataAnalysis v-if="node.category === 'preprocessing'" />
                    <Star v-else-if="node.category === 'feature'" />
                    <Cpu v-else-if="node.category === 'model'" />
                    <TrendCharts v-else-if="node.category === 'evaluation'" />
                  </el-icon>
                </div>
                <div class="node-name">{{ node.name }}</div>
                <div class="node-actions">
                  <el-button type="text" size="small" @click.stop="editNode(index)">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button type="text" size="small" @click.stop="removeNode(index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              
              <div class="node-content">
                <div class="node-desc">{{ node.description }}</div>
                <div class="node-params" v-if="node.parameters">
                  <div 
                    v-for="param in node.parameters" 
                    :key="param.name"
                    class="param-item"
                  >
                    <span class="param-name">{{ param.name }}:</span>
                    <span class="param-value">{{ param.value }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 连接线 -->
              <div v-if="index < algorithmFlow.length - 1" class="node-connector">
                <el-icon><ArrowDown /></el-icon>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 节点参数配置面板 -->
        <div v-if="activeNodeIndex !== null" class="parameter-panel">
          <div class="panel-header">
            <h5>参数配置</h5>
            <el-button type="text" @click="closeParameterPanel">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          
          <div class="panel-content">
            <el-form label-width="100px">
              <el-form-item 
                v-for="param in algorithmFlow[activeNodeIndex].parameters" 
                :key="param.name"
                :label="param.name"
              >
                <el-input 
                  v-if="param.type === 'text'" 
                  v-model="param.value" 
                  :placeholder="param.placeholder"
                />
                <el-input-number 
                  v-else-if="param.type === 'number'" 
                  v-model="param.value" 
                  :min="param.min" 
                  :max="param.max"
                />
                <el-select 
                  v-else-if="param.type === 'select'" 
                  v-model="param.value" 
                  :placeholder="param.placeholder"
                >
                  <el-option 
                    v-for="option in param.options" 
                    :key="option" 
                    :label="option" 
                    :value="option"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <!-- 算法测试结果对话框 -->
    <el-dialog 
      v-model="testResultVisible" 
      title="算法测试结果" 
      width="600px"
    >
      <div class="test-results">
        <h4>测试结果概览</h4>
        <div class="result-metrics">
          <div class="metric-item">
            <div class="metric-value">{{ testResults.accuracy }}%</div>
            <div class="metric-label">准确率</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ testResults.precision }}%</div>
            <div class="metric-label">精确率</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ testResults.recall }}%</div>
            <div class="metric-label">召回率</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ testResults.f1Score }}</div>
            <div class="metric-label">F1分数</div>
          </div>
        </div>
        
        <div class="result-chart">
          <div class="chart-placeholder">
            <el-icon size="48" color="#409EFF"><TrendCharts /></el-icon>
            <p>性能评估图表</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  DataAnalysis, 
  Cpu, 
  TrendCharts,
  Search,
  DocumentAdd,
  Delete,
  VideoPlay,
  Plus,
  Edit,
  ArrowDown,
  Close,
  Star
} from '@element-plus/icons-vue'

export default {
  name: 'AlgorithmComposer',
  components: {
    DataAnalysis,
    Cpu,
    TrendCharts,
    Search,
    DocumentAdd,
    Delete,
    VideoPlay,
    Plus,
    Edit,
    ArrowDown,
    Close,
    Star
  },
  setup() {
    // 搜索关键词
    const searchKeyword = ref('')
    
    // 当前激活的分类
    const activeCategory = ref('preprocessing')
    
    // 算法组件数据
    const algorithmComponents = reactive({
      preprocessing: [
        {
          id: 'data_clean',
          name: '数据清洗',
          description: '处理缺失值、异常值',
          category: 'preprocessing',
          parameters: [
            { name: '缺失值处理', type: 'select', value: '均值填充', options: ['均值填充', '中位数填充', '删除'] },
            { name: '异常值阈值', type: 'number', value: 3, min: 1, max: 5 }
          ]
        },
        {
          id: 'normalization',
          name: '数据标准化',
          description: 'Z-score标准化处理',
          category: 'preprocessing',
          parameters: [
            { name: '标准化方法', type: 'select', value: 'Z-score', options: ['Z-score', 'Min-Max'] }
          ]
        },
        {
          id: 'encoding',
          name: '特征编码',
          description: '类别特征编码处理',
          category: 'preprocessing',
          parameters: [
            { name: '编码方式', type: 'select', value: 'One-Hot', options: ['One-Hot', 'Label Encoding'] }
          ]
        }
      ],
      feature: [
        {
          id: 'pca',
          name: 'PCA降维',
          description: '主成分分析特征降维',
          category: 'feature',
          parameters: [
            { name: '主成分数量', type: 'number', value: 10, min: 1, max: 50 }
          ]
        },
        {
          id: 'feature_select',
          name: '特征选择',
          description: '基于重要性的特征选择',
          category: 'feature',
          parameters: [
            { name: '选择方法', type: 'select', value: '随机森林', options: ['随机森林', '相关系数', '方差选择'] },
            { name: '特征数量', type: 'number', value: 20, min: 5, max: 100 }
          ]
        }
      ],
      model: [
        {
          id: 'random_forest',
          name: '随机森林',
          description: '集成学习分类算法',
          category: 'model',
          parameters: [
            { name: '树的数量', type: 'number', value: 100, min: 10, max: 500 },
            { name: '最大深度', type: 'number', value: 10, min: 3, max: 20 }
          ]
        },
        {
          id: 'xgboost',
          name: 'XGBoost',
          description: '梯度提升决策树',
          category: 'model',
          parameters: [
            { name: '学习率', type: 'number', value: 0.1, min: 0.01, max: 0.3 },
            { name: '最大深度', type: 'number', value: 6, min: 3, max: 10 }
          ]
        },
        {
          id: 'logistic',
          name: '逻辑回归',
          description: '线性分类模型',
          category: 'model',
          parameters: [
            { name: '正则化参数', type: 'number', value: 1.0, min: 0.1, max: 10.0 }
          ]
        }
      ],
      evaluation: [
        {
          id: 'accuracy',
          name: '准确率评估',
          description: '计算分类准确率',
          category: 'evaluation'
        },
        {
          id: 'roc_auc',
          name: 'ROC曲线',
          description: '绘制ROC曲线计算AUC',
          category: 'evaluation'
        },
        {
          id: 'confusion_matrix',
          name: '混淆矩阵',
          description: '生成混淆矩阵分析',
          category: 'evaluation'
        }
      ]
    })

    // 算法流程
    const algorithmFlow = ref([])
    
    // 当前激活的节点索引
    const activeNodeIndex = ref(null)
    
    // 测试结果对话框
    const testResultVisible = ref(false)
    const testResults = ref({
      accuracy: 85.6,
      precision: 82.3,
      recall: 87.1,
      f1Score: 0.846
    })

    // 计算属性：过滤后的组件
    const filteredComponents = computed(() => {
      const result = {}
      Object.keys(algorithmComponents).forEach(category => {
        result[category] = algorithmComponents[category].filter(component =>
          component.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
          component.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
        )
      })
      return result
    })

    // 拖拽开始
    const onDragStart = (component) => {
      event.dataTransfer.setData('component', JSON.stringify(component))
    }

    // 拖拽经过
    const onDragOver = (event) => {
      event.preventDefault()
    }

    // 拖拽放置
    const onDrop = (event) => {
      event.preventDefault()
      const componentData = JSON.parse(event.dataTransfer.getData('component'))
      
      // 创建新的节点
      const newNode = {
        id: Date.now().toString(),
        ...componentData,
        parameters: componentData.parameters ? [...componentData.parameters] : []
      }
      
      algorithmFlow.value.push(newNode)
      ElMessage.success(`已添加 ${newNode.name} 组件`)
    }

    // 选择节点
    const selectNode = (index) => {
      activeNodeIndex.value = index
    }

    // 编辑节点
    const editNode = (index) => {
      activeNodeIndex.value = index
    }

    // 删除节点
    const removeNode = (index) => {
      algorithmFlow.value.splice(index, 1)
      if (activeNodeIndex.value === index) {
        activeNodeIndex.value = null
      }
      ElMessage.success('已删除组件')
    }

    // 关闭参数面板
    const closeParameterPanel = () => {
      activeNodeIndex.value = null
    }

    // 保存算法
    const saveAlgorithm = () => {
      if (algorithmFlow.value.length === 0) {
        ElMessage.warning('请先添加算法组件')
        return
      }
      ElMessage.success('算法已保存')
    }

    // 清空工作区
    const clearWorkspace = () => {
      algorithmFlow.value = []
      activeNodeIndex.value = null
      ElMessage.info('工作区已清空')
    }

    // 测试算法
    const testAlgorithm = () => {
      if (algorithmFlow.value.length === 0) {
        ElMessage.warning('请先构建算法流程')
        return
      }
      testResultVisible.value = true
      ElMessage.success('算法测试完成')
    }

    return {
      searchKeyword,
      activeCategory,
      algorithmComponents,
      algorithmFlow,
      activeNodeIndex,
      testResultVisible,
      testResults,
      filteredComponents,
      onDragStart,
      onDragOver,
      onDrop,
      selectNode,
      editNode,
      removeNode,
      closeParameterPanel,
      saveAlgorithm,
      clearWorkspace,
      testAlgorithm
    }
  }
}
</script>

<style scoped>
.algorithm-composer {
  padding: 20px;
  height: 100%;
}

.composer-header {
  margin-bottom: 30px;
  text-align: center;
}

.composer-header h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.composer-header p {
  color: #909399;
  font-size: 14px;
}

.composer-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  height: calc(100vh - 200px);
}

/* 左侧组件库 */
.component-library {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  overflow-y: auto;
}

.library-header {
  margin-bottom: 20px;
}

.library-header h4 {
  margin-bottom: 15px;
  color: #303133;
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  cursor: move;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.component-item:hover {
  border-color: #409EFF;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.component-icon {
  color: #409EFF;
}

.component-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.component-desc {
  font-size: 12px;
  color: #909399;
}

/* 右侧工作区 */
.workspace {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafafa;
}

.workspace-header h4 {
  color: #303133;
  margin: 0;
}

.workspace-actions {
  display: flex;
  gap: 10px;
}

.workspace-area {
  flex: 1;
  padding: 20px;
  min-height: 400px;
  overflow-y: auto;
}

.empty-workspace {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.empty-workspace p {
  margin-top: 15px;
}

/* 算法流程 */
.algorithm-flow {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.flow-node {
  background: #f8f9fa;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.flow-node.active-node {
  border-color: #409EFF;
  background: #f0f9ff;
}

.flow-node:hover {
  border-color: #409EFF;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.node-icon {
  color: #409EFF;
}

.node-name {
  flex: 1;
  font-weight: 600;
  color: #303133;
}

.node-actions {
  opacity: 0;
  transition: opacity 0.3s;
}

.flow-node:hover .node-actions {
  opacity: 1;
}

.node-content {
  margin-bottom: 10px;
}

.node-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.node-params {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.param-item {
  font-size: 12px;
  color: #909399;
}

.param-name {
  font-weight: 600;
  margin-right: 5px;
}

.node-connector {
  text-align: center;
  color: #409EFF;
  margin-top: 10px;
}

/* 参数配置面板 */
.parameter-panel {
  border-top: 1px solid #e4e7ed;
  background: #fafafa;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.panel-header h5 {
  margin: 0;
  color: #303133;
}

.panel-content {
  padding: 20px;
}

/* 测试结果 */
.test-results h4 {
  margin-bottom: 20px;
  color: #303133;
}

.result-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.metric-item {
  text-align: center;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.metric-label {
  font-size: 12px;
  color: #909399;
}

.chart-placeholder {
  text-align: center;
  padding: 40px;
  background: #f5f7fa;
  border-radius: 8px;
}

.chart-placeholder p {
  margin-top: 10px;
  color: #909399;
}

@media (max-width: 1200px) {
  .composer-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .component-library {
    max-height: 300px;
  }
  
  .result-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>