<template>
  <div class="targeted-push">
    <!-- 推送配置 -->
    <el-card class="config-card">
      <template #header>
        <span>定向推送配置</span>
      </template>
      
      <el-form :model="pushConfig" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="推送类型">
              <el-select v-model="pushConfig.pushType" placeholder="请选择推送类型">
                <el-option label="优质企业推荐" value="recommend" />
                <el-option label="风险预警通知" value="warning" />
                <el-option label="政策信息推送" value="policy" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="目标行业">
              <el-select v-model="pushConfig.industry" placeholder="请选择行业" multiple>
                <el-option label="制造业" value="manufacturing" />
                <el-option label="信息技术" value="it" />
                <el-option label="金融业" value="finance" />
                <el-option label="房地产业" value="real_estate" />
                <el-option label="旅游业" value="tourism" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="风险等级">
              <el-select v-model="pushConfig.riskLevel" placeholder="请选择风险等级" multiple>
                <el-option label="低风险" value="low" />
                <el-option label="中风险" value="medium" />
                <el-option label="高风险" value="high" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="推送内容">
          <el-input
            v-model="pushConfig.content"
            type="textarea"
            :rows="4"
            placeholder="请输入推送内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handlePreview">预览推送</el-button>
          <el-button @click="handleSendPush" :loading="sending">立即推送</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 推送历史 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>推送历史记录</span>
          <span>共 {{ totalPushes }} 条推送记录</span>
        </div>
      </template>
      
      <el-table :data="pushHistory" style="width: 100%">
        <el-table-column prop="pushTime" label="推送时间" width="180" />
        <el-table-column prop="pushType" label="推送类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.pushType === 'recommend' ? 'success' : row.pushType === 'warning' ? 'danger' : 'primary'">
              {{ getPushTypeText(row.pushType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="targetCount" label="目标企业数" width="120" />
        <el-table-column prop="successCount" label="成功推送" width="120" />
        <el-table-column prop="content" label="推送内容" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetails(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalPushes"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" title="推送预览" width="600px">
      <div class="preview-content">
        <h4>推送内容预览</h4>
        <div class="preview-card">
          <p>{{ pushConfig.content }}</p>
          <div class="preview-info">
            <p><strong>推送类型：</strong>{{ getPushTypeText(pushConfig.pushType) }}</p>
            <p><strong>目标行业：</strong>{{ pushConfig.industry.join(', ') }}</p>
            <p><strong>风险等级：</strong>{{ pushConfig.riskLevel.join(', ') }}</p>
            <p><strong>预计推送企业数：</strong>{{ estimatedCount }} 家</p>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="previewVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmSend">确认推送</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'TargetedPush',
  setup() {
    const pushConfig = ref({
      pushType: 'recommend',
      industry: [],
      riskLevel: [],
      content: ''
    })

    const sending = ref(false)
    const previewVisible = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalPushes = ref(0)

    // 模拟推送历史数据
    const pushHistory = ref([
      {
        id: 1,
        pushTime: '2024-01-15 14:30:25',
        pushType: 'recommend',
        targetCount: 156,
        successCount: 150,
        content: '优质企业推荐：基于信用评估结果，以下企业具有良好的发展潜力...'
      },
      {
        id: 2,
        pushTime: '2024-01-14 10:15:30',
        pushType: 'warning',
        targetCount: 23,
        successCount: 22,
        content: '风险预警通知：以下企业存在较高的信用风险，请关注...'
      },
      {
        id: 3,
        pushTime: '2024-01-13 16:45:12',
        pushType: 'policy',
        targetCount: 856,
        successCount: 845,
        content: '政策信息推送：最新金融支持政策解读...'
      }
    ])

    const estimatedCount = computed(() => {
      // 简单估算推送企业数
      let count = 100
      if (pushConfig.value.industry.length > 0) count += 50
      if (pushConfig.value.riskLevel.length > 0) count += 30
      return count
    })

    const getPushTypeText = (type) => {
      const types = {
        recommend: '优质企业推荐',
        warning: '风险预警通知',
        policy: '政策信息推送'
      }
      return types[type] || '未知类型'
    }

    const handlePreview = () => {
      if (!pushConfig.value.content) {
        ElMessage.warning('请输入推送内容')
        return
      }
      previewVisible.value = true
    }

    const handleConfirmSend = async () => {
      sending.value = true
      
      try {
        // 模拟推送过程
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 添加到推送历史
        const newPush = {
          id: pushHistory.value.length + 1,
          pushTime: new Date().toLocaleString('zh-CN'),
          pushType: pushConfig.value.pushType,
          targetCount: estimatedCount.value,
          successCount: estimatedCount.value - 5, // 模拟少量失败
          content: pushConfig.value.content
        }
        
        pushHistory.value.unshift(newPush)
        totalPushes.value = pushHistory.value.length
        
        ElMessage.success(`推送成功，成功推送 ${newPush.successCount} 家企业`)
        previewVisible.value = false
        
        // 重置表单
        pushConfig.value = {
          pushType: 'recommend',
          industry: [],
          riskLevel: [],
          content: ''
        }
      } catch (error) {
        ElMessage.error('推送失败')
      } finally {
        sending.value = false
      }
    }

    const handleSendPush = async () => {
      if (!pushConfig.value.content) {
        ElMessage.warning('请输入推送内容')
        return
      }
      
      try {
        await ElMessageBox.confirm(`确定要推送这条信息吗？预计推送 ${estimatedCount.value} 家企业`, '确认推送', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await handleConfirmSend()
      } catch {
        // 用户取消推送
      }
    }

    const handleViewDetails = (row) => {
      ElMessage.info(`查看推送详情：${row.content.substring(0, 50)}...`)
    }

    // 初始化数据
    totalPushes.value = pushHistory.value.length

    return {
      pushConfig,
      sending,
      previewVisible,
      currentPage,
      pageSize,
      totalPushes,
      pushHistory,
      estimatedCount,
      getPushTypeText,
      handlePreview,
      handleSendPush,
      handleViewDetails,
      handleConfirmSend
    }
  }
}
</script>

<style scoped>
.targeted-push {
  padding: 0;
}

.config-card {
  margin-bottom: 20px;
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

.preview-content h4 {
  color: #303133;
  margin-bottom: 15px;
}

.preview-card {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 20px;
  background: #fafafa;
}

.preview-card p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.preview-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e6e6e6;
}

.preview-info p {
  margin: 5px 0;
  font-size: 14px;
}
</style>