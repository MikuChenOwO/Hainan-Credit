<template>
  <div class="supervision-report">
    <!-- 报告生成配置 -->
    <el-card class="config-card">
      <template #header>
        <span>监管报告生成</span>
      </template>
      
      <el-form :model="reportConfig" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="报告类型">
              <el-select v-model="reportConfig.reportType" placeholder="请选择报告类型">
                <el-option label="月度风险报告" value="monthly" />
                <el-option label="季度分析报告" value="quarterly" />
                <el-option label="年度总结报告" value="annual" />
                <el-option label="专项检查报告" value="special" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="reportConfig.dateRange"
                :type="reportConfig.reportType === 'monthly' ? 'month' : reportConfig.reportType === 'quarterly' ? 'quarter' : 'year'"
                placeholder="选择时间"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="行业范围">
              <el-select v-model="reportConfig.industries" placeholder="请选择行业" multiple>
                <el-option label="制造业" value="manufacturing" />
                <el-option label="信息技术" value="it" />
                <el-option label="金融业" value="finance" />
                <el-option label="房地产业" value="real_estate" />
                <el-option label="旅游业" value="tourism" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="报告内容">
          <el-checkbox-group v-model="reportConfig.sections">
            <el-checkbox label="executiveSummary">执行摘要</el-checkbox>
            <el-checkbox label="riskOverview">风险概览</el-checkbox>
            <el-checkbox label="industryAnalysis">行业分析</el-checkbox>
            <el-checkbox label="enterpriseList">重点企业清单</el-checkbox>
            <el-checkbox label="trendAnalysis">趋势分析</el-checkbox>
            <el-checkbox label="recommendations">监管建议</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handlePreview" :loading="previewLoading">预览报告</el-button>
          <el-button @click="handleGenerate" :loading="generateLoading">生成报告</el-button>
          <el-button @click="handleExport">导出报告</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 报告预览 -->
    <el-card v-if="showPreview" class="preview-card">
      <template #header>
        <div class="card-header">
          <span>报告预览</span>
          <el-button type="primary" @click="handleGenerate">确认生成</el-button>
        </div>
      </template>
      
      <div class="report-preview">
        <h2>海南省企业信用风险监管报告</h2>
        <div class="report-meta">
          <p><strong>报告类型：</strong>{{ getReportTypeText(reportConfig.reportType) }}</p>
          <p><strong>时间范围：</strong>{{ reportConfig.dateRange || '未选择' }}</p>
          <p><strong>生成时间：</strong>{{ new Date().toLocaleString('zh-CN') }}</p>
        </div>
        
        <div v-if="reportConfig.sections.includes('executiveSummary')" class="report-section">
          <h3>一、执行摘要</h3>
          <p>本报告基于海南省信用风险预测系统数据，对选定时间段内企业信用风险状况进行全面分析...</p>
          <ul>
            <li>分析企业总数：{{ previewData.totalEnterprises }} 家</li>
            <li>高风险企业：{{ previewData.highRiskCount }} 家</li>
            <li>行业平均风险分：{{ previewData.avgRiskScore }}</li>
            <li>主要风险趋势：{{ previewData.riskTrend }}</li>
          </ul>
        </div>
        
        <div v-if="reportConfig.sections.includes('riskOverview')" class="report-section">
          <h3>二、风险概览</h3>
          <p>整体风险状况分析...</p>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-value" style="color: #67C23A;">{{ previewData.lowRiskRatio }}%</div>
                <div class="stat-label">低风险企业比例</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-value" style="color: #E6A23C;">{{ previewData.mediumRiskRatio }}%</div>
                <div class="stat-label">中风险企业比例</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-value" style="color: #F56C6C;">{{ previewData.highRiskRatio }}%</div>
                <div class="stat-label">高风险企业比例</div>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <div v-if="reportConfig.sections.includes('industryAnalysis')" class="report-section">
          <h3>三、行业分析</h3>
          <p>各行业风险状况对比分析...</p>
          <el-table :data="previewData.industryAnalysis" style="width: 100%">
            <el-table-column prop="industry" label="行业" />
            <el-table-column prop="enterpriseCount" label="企业数量" />
            <el-table-column prop="avgRiskScore" label="平均风险分" />
            <el-table-column prop="highRiskRatio" label="高风险比例" />
          </el-table>
        </div>
        
        <div v-if="reportConfig.sections.includes('recommendations')" class="report-section">
          <h3>四、监管建议</h3>
          <p>基于分析结果提出以下监管建议：</p>
          <ol>
            <li>加强对高风险行业的重点监管</li>
            <li>建立风险预警和快速响应机制</li>
            <li>推动企业信用修复和风险防控</li>
            <li>完善行业风险监测指标体系</li>
          </ol>
        </div>
      </div>
    </el-card>

    <!-- 报告历史 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>报告历史记录</span>
          <span>共 {{ totalReports }} 份报告</span>
        </div>
      </template>
      
      <el-table :data="reportHistory" style="width: 100%">
        <el-table-column prop="reportName" label="报告名称" width="200" />
        <el-table-column prop="reportType" label="报告类型" width="120">
          <template #default="{ row }">
            <el-tag>{{ getReportTypeText(row.reportType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dateRange" label="时间范围" width="150" />
        <el-table-column prop="generateTime" label="生成时间" width="180" />
        <el-table-column prop="fileSize" label="文件大小" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewReport(row)">查看</el-button>
            <el-button type="success" link @click="handleDownloadReport(row)">下载</el-button>
            <el-button type="danger" link @click="handleDeleteReport(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalReports"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'SupervisionReport',
  setup() {
    const reportConfig = ref({
      reportType: 'monthly',
      dateRange: '',
      industries: [],
      sections: ['executiveSummary', 'riskOverview', 'industryAnalysis', 'recommendations']
    })

    const previewLoading = ref(false)
    const generateLoading = ref(false)
    const showPreview = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalReports = ref(0)

    // 模拟预览数据
    const previewData = ref({
      totalEnterprises: 12543,
      highRiskCount: 234,
      avgRiskScore: 58,
      riskTrend: '稳定',
      lowRiskRatio: 68.2,
      mediumRiskRatio: 20.1,
      highRiskRatio: 11.7,
      industryAnalysis: [
        { industry: '制造业', enterpriseCount: 2568, avgRiskScore: 65, highRiskRatio: 12.5 },
        { industry: '信息技术', enterpriseCount: 1896, avgRiskScore: 45, highRiskRatio: 8.2 },
        { industry: '金融业', enterpriseCount: 856, avgRiskScore: 55, highRiskRatio: 9.8 }
      ]
    })

    // 模拟报告历史数据
    const reportHistory = ref([
      {
        id: 1,
        reportName: '2024年1月风险监管报告',
        reportType: 'monthly',
        dateRange: '2024年1月',
        generateTime: '2024-01-31 18:30:25',
        fileSize: '2.5MB'
      },
      {
        id: 2,
        reportName: '2023年第四季度分析报告',
        reportType: 'quarterly',
        dateRange: '2023年10月-12月',
        generateTime: '2024-01-15 14:20:30',
        fileSize: '5.8MB'
      },
      {
        id: 3,
        reportName: '2023年度信用风险总结报告',
        reportType: 'annual',
        dateRange: '2023年',
        generateTime: '2024-01-10 09:15:12',
        fileSize: '12.3MB'
      }
    ])

    const getReportTypeText = (type) => {
      const types = {
        monthly: '月度报告',
        quarterly: '季度报告',
        annual: '年度报告',
        special: '专项报告'
      }
      return types[type] || '未知类型'
    }

    const handlePreview = async () => {
      if (!reportConfig.value.dateRange) {
        ElMessage.warning('请选择时间范围')
        return
      }

      previewLoading.value = true
      
      try {
        // 模拟数据加载
        await new Promise(resolve => setTimeout(resolve, 1500))
        showPreview.value = true
      } catch (error) {
        ElMessage.error('预览失败')
      } finally {
        previewLoading.value = false
      }
    }

    const handleGenerate = async () => {
      generateLoading.value = true
      
      try {
        // 模拟报告生成过程
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // 添加到报告历史
        const newReport = {
          id: reportHistory.value.length + 1,
          reportName: `${reportConfig.value.dateRange}${getReportTypeText(reportConfig.value.reportType)}`,
          reportType: reportConfig.value.reportType,
          dateRange: reportConfig.value.dateRange,
          generateTime: new Date().toLocaleString('zh-CN'),
          fileSize: '3.2MB'
        }
        
        reportHistory.value.unshift(newReport)
        totalReports.value = reportHistory.value.length
        
        ElMessage.success('报告生成成功')
        showPreview.value = false
      } catch (error) {
        ElMessage.error('报告生成失败')
      } finally {
        generateLoading.value = false
      }
    }

    const handleExport = () => {
      ElMessage.info('导出功能开发中...')
    }

    const handleViewReport = (row) => {
      ElMessage.info(`查看报告：${row.reportName}`)
    }

    const handleDownloadReport = (row) => {
      ElMessage.success(`开始下载：${row.reportName}`)
    }

    const handleDeleteReport = async (row) => {
      try {
        await ElMessageBox.confirm(`确定要删除报告"${row.reportName}"吗？`, '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const index = reportHistory.value.findIndex(item => item.id === row.id)
        if (index !== -1) {
          reportHistory.value.splice(index, 1)
          totalReports.value = reportHistory.value.length
          ElMessage.success('报告删除成功')
        }
      } catch {
        // 用户取消删除
      }
    }

    // 初始化数据
    totalReports.value = reportHistory.value.length

    return {
      reportConfig,
      previewLoading,
      generateLoading,
      showPreview,
      currentPage,
      pageSize,
      totalReports,
      previewData,
      reportHistory,
      getReportTypeText,
      handlePreview,
      handleGenerate,
      handleExport,
      handleViewReport,
      handleDownloadReport,
      handleDeleteReport
    }
  }
}
</script>

<style scoped>
.supervision-report {
  padding: 0;
}

.config-card {
  margin-bottom: 20px;
}

.preview-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.report-preview {
  padding: 20px;
  background: #fafafa;
  border-radius: 4px;
}

.report-preview h2 {
  text-align: center;
  color: #303133;
  margin-bottom: 20px;
}

.report-meta {
  margin-bottom: 30px;
  padding: 15px;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #409EFF;
}

.report-meta p {
  margin: 5px 0;
}

.report-section {
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 4px;
}

.report-section h3 {
  color: #303133;
  margin-bottom: 15px;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 10px;
}

.report-section p {
  line-height: 1.6;
  margin-bottom: 15px;
}

.report-section ul, .report-section ol {
  margin-left: 20px;
  margin-bottom: 15px;
}

.report-section li {
  margin-bottom: 5px;
}

.stat-item {
  text-align: center;
  padding: 15px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 5px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>