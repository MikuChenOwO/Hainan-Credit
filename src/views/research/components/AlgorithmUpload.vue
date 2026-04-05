<template>
  <div class="algorithm-upload">
    <!-- 算法上传表单 -->
    <el-card class="upload-card">
      <template #header>
        <span>算法上传</span>
      </template>
      
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="算法名称" prop="name">
              <el-input v-model="uploadForm.name" placeholder="请输入算法名称" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="算法类型" prop="type">
              <el-select v-model="uploadForm.type" placeholder="请选择算法类型">
                <el-option label="机器学习" value="ml" />
                <el-option label="深度学习" value="dl" />
                <el-option label="传统统计" value="statistical" />
                <el-option label="大语言模型" value="llm" />
                <el-option label="集成学习" value="ensemble" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="uploadForm.version" placeholder="如：v1.0.0" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="适用场景" prop="scenario">
              <el-select v-model="uploadForm.scenario" placeholder="请选择适用场景" multiple>
                <el-option label="个人信用评估" value="personal" />
                <el-option label="企业风险评估" value="enterprise" />
                <el-option label="行业风险分析" value="industry" />
                <el-option label="欺诈检测" value="fraud" />
                <el-option label="趋势预测" value="trend" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="算法描述" prop="description">
          <el-input
            v-model="uploadForm.description"
            type="textarea"
            :rows="3"
            placeholder="请详细描述算法原理、特点和适用条件"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="算法文件" prop="files">
          <el-upload
            class="upload-demo"
            drag
            multiple
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="fileList"
            action="/api/upload"
          >
            <el-icon class="el-icon--upload"><Upload /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 .py, .ipynb, .zip 格式文件，单个文件不超过 100MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="评估指标" prop="metrics">
          <div class="metrics-display">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="准确率 (ACC)">
                <el-tag type="success">0.85</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="精确率 (Precision)">
                <el-tag type="success">0.82</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="召回率 (Recall)">
                <el-tag type="warning">0.78</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="F1分数">
                <el-tag type="success">0.80</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="AUC值">
                <el-tag type="success">0.89</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="平均精度均值 (mAP)">
                <el-tag type="warning">0.75</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">提交算法</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 上传历史 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>上传历史</span>
          <span>共 {{ totalUploads }} 个算法</span>
        </div>
      </template>
      
      <el-table :data="uploadHistory" style="width: 100%">
        <el-table-column prop="name" label="算法名称" width="200" />
        <el-table-column prop="type" label="算法类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getAlgorithmTypeColor(row.type)">{{ getAlgorithmTypeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" width="180" />
        <el-table-column prop="fileCount" label="文件数" width="80" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetails(row)">查看</el-button>
            <el-button type="success" link @click="handleTestAlgorithm(row)">测试</el-button>
            <el-button type="warning" link @click="handleEditAlgorithm(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalUploads"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AlgorithmUpload',
  setup() {
    const uploadFormRef = ref()
    const uploadForm = ref({
      name: '',
      type: '',
      version: '',
      scenario: [],
      description: '',
      metrics: {}
    })

    const submitting = ref(false)
    const fileList = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalUploads = ref(0)

    const uploadRules = {
      name: [
        { required: true, message: '请输入算法名称', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择算法类型', trigger: 'change' }
      ],
      version: [
        { required: true, message: '请输入版本号', trigger: 'blur' }
      ]
    }

    // 模拟上传历史数据
    const uploadHistory = ref([
      {
        id: 1,
        name: 'XGBoost信用评分模型',
        type: 'ml',
        version: 'v1.2.0',
        status: 'deployed',
        uploadTime: '2024-01-15 14:30:25',
        fileCount: 3
      },
      {
        id: 2,
        name: 'LSTM时序预测算法',
        type: 'dl',
        version: 'v2.1.0',
        status: 'testing',
        uploadTime: '2024-01-14 10:15:30',
        fileCount: 5
      },
      {
        id: 3,
        name: '逻辑回归风险分类',
        type: 'statistical',
        version: 'v1.0.1',
        status: 'pending',
        uploadTime: '2024-01-13 16:45:12',
        fileCount: 2
      }
    ])

    const getAlgorithmTypeText = (type) => {
      const types = {
        ml: '机器学习',
        dl: '深度学习',
        statistical: '传统统计',
        llm: '大语言模型',
        ensemble: '集成学习'
      }
      return types[type] || '未知类型'
    }

    const getAlgorithmTypeColor = (type) => {
      const colors = {
        ml: 'success',
        dl: 'warning',
        statistical: 'info',
        llm: 'danger',
        ensemble: 'primary'
      }
      return colors[type] || 'info'
    }

    const getStatusText = (status) => {
      const statusMap = {
        pending: '待审核',
        testing: '测试中',
        deployed: '已部署',
        rejected: '已拒绝'
      }
      return statusMap[status] || '未知状态'
    }

    const getStatusType = (status) => {
      const types = {
        pending: 'warning',
        testing: 'primary',
        deployed: 'success',
        rejected: 'danger'
      }
      return types[status] || 'info'
    }

    const beforeUpload = (file) => {
      const isPython = file.name.endsWith('.py')
      const isNotebook = file.name.endsWith('.ipynb')
      const isZip = file.name.endsWith('.zip')
      const isLt100M = file.size / 1024 / 1024 < 100

      if (!isPython && !isNotebook && !isZip) {
        ElMessage.error('只能上传 Python 文件、Jupyter Notebook 或 ZIP 压缩包!')
        return false
      }
      if (!isLt100M) {
        ElMessage.error('文件大小不能超过 100MB!')
        return false
      }
      return true
    }

    const handleSuccess = (response, file, fileList) => {
      ElMessage.success('文件上传成功')
      fileList.value = fileList
    }

    const handleError = (error, file, fileList) => {
      ElMessage.error('文件上传失败')
    }



    const handleSubmit = async () => {
      if (!uploadFormRef.value) return

      try {
        await uploadFormRef.value.validate()
        
        if (fileList.value.length === 0) {
          ElMessage.warning('请上传算法文件')
          return
        }

        submitting.value = true
        
        // 模拟提交过程
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 添加到上传历史
        const newAlgorithm = {
          id: uploadHistory.value.length + 1,
          name: uploadForm.value.name,
          type: uploadForm.value.type,
          version: uploadForm.value.version,
          status: 'pending',
          uploadTime: new Date().toLocaleString('zh-CN'),
          fileCount: fileList.value.length
        }
        
        uploadHistory.value.unshift(newAlgorithm)
        totalUploads.value = uploadHistory.value.length
        
        ElMessage.success('算法提交成功，等待审核')
        handleReset()
      } catch (error) {
        ElMessage.error('请完善表单信息')
      } finally {
        submitting.value = false
      }
    }

    const handleReset = () => {
      uploadForm.value = {
        name: '',
        type: '',
        version: '',
        scenario: [],
        description: '',
        metrics: {}
      }
      fileList.value = []
    }

    const handleSaveDraft = () => {
      ElMessage.info('草稿保存成功')
    }

    const handleViewDetails = (row) => {
      ElMessage.info(`查看算法详情：${row.name}`)
    }

    const handleTestAlgorithm = (row) => {
      ElMessage.info(`开始测试算法：${row.name}`)
    }

    const handleEditAlgorithm = (row) => {
      ElMessage.info(`编辑算法：${row.name}`)
    }

    // 初始化数据
    totalUploads.value = uploadHistory.value.length

    return {
      uploadFormRef,
      uploadForm,
      submitting,
      fileList,
      currentPage,
      pageSize,
      totalUploads,
      uploadHistory,
      uploadRules,
      getAlgorithmTypeText,
      getAlgorithmTypeColor,
      getStatusText,
      getStatusType,
      beforeUpload,
      handleSuccess,
      handleError,
      handleSubmit,
      handleReset,
      handleSaveDraft,
      handleViewDetails,
      handleTestAlgorithm,
      handleEditAlgorithm
    }
  }
}
</script>

<style scoped>
.algorithm-upload {
  padding: 0;
}

.upload-card {
  margin-bottom: 20px;
}

.upload-demo {
  width: 100%;
}

.metrics-display {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 15px;
  background: #fafafa;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}






</style>