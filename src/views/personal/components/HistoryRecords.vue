<template>
  <div class="history-records">
    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        
        <el-form-item label="风险等级">
          <el-select v-model="filterForm.riskLevel" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option label="低风险" value="low" />
            <el-option label="中风险" value="medium" />
            <el-option label="高风险" value="high" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 历史记录列表 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>风险评估历史记录</span>
          <span>共 {{ totalRecords }} 条记录</span>
        </div>
      </template>
      
      <el-table :data="historyData" style="width: 100%">
        <el-table-column prop="date" label="评估时间" width="180" />
        <el-table-column prop="riskLevel" label="风险等级" width="120">
          <template #default="{ row }">
            <el-tag 
              :type="row.riskLevel === '低风险' ? 'success' : row.riskLevel === '中风险' ? 'warning' : 'danger'"
            >
              {{ row.riskLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="riskProbability" label="风险概率" width="120">
          <template #default="{ row }">
            {{ row.riskProbability }}%
          </template>
        </el-table-column>
        <el-table-column prop="mainFactor" label="主要影响因素" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalRecords"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="评估详情" width="800px">
      <div v-if="currentDetail">
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="评估时间">{{ currentDetail.date }}</el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="currentDetail.riskLevel === '低风险' ? 'success' : currentDetail.riskLevel === '中风险' ? 'warning' : 'danger'">
              {{ currentDetail.riskLevel }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="风险概率">{{ currentDetail.riskProbability }}%</el-descriptions-item>
          <el-descriptions-item label="主要因素">{{ currentDetail.mainFactor }}</el-descriptions-item>
        </el-descriptions>
        
        <el-divider />
        
        <h4>影响因素分析</h4>
        <el-table :data="currentDetail.factors" style="width: 100%; margin: 15px 0;">
          <el-table-column prop="factor" label="因素" width="200" />
          <el-table-column prop="score" label="得分" width="100">
            <template #default="{ row }">
              {{ row.score }}分
            </template>
          </el-table-column>
          <el-table-column prop="impact" label="影响程度">
            <template #default="{ row }">
              <el-progress 
                :percentage="row.impact" 
                :show-text="false"
                :color="row.impact > 70 ? '#F56C6C' : row.impact > 40 ? '#E6A23C' : '#67C23A'"
              />
            </template>
          </el-table-column>
        </el-table>
        
        <h4>改善建议</h4>
        <el-collapse>
          <el-collapse-item 
            v-for="(suggestion, index) in currentDetail.suggestions" 
            :key="index" 
            :title="suggestion.title"
          >
            <p>{{ suggestion.content }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'HistoryRecords',
  setup() {
    const filterForm = ref({
      dateRange: '',
      riskLevel: ''
    })

    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalRecords = ref(0)
    const historyData = ref([])
    const detailVisible = ref(false)
    const currentDetail = ref(null)

    // 模拟历史数据
    const mockHistoryData = [
      {
        id: 1,
        date: '2024-01-15 14:30:25',
        riskLevel: '低风险',
        riskProbability: 25,
        mainFactor: '收入稳定，负债率低',
        factors: [
          { factor: '收入稳定性', score: 85, impact: 30 },
          { factor: '负债水平', score: 90, impact: 25 },
          { factor: '信用历史', score: 88, impact: 20 },
          { factor: '资产状况', score: 82, impact: 15 }
        ],
        suggestions: [
          { title: '财务规划', content: '继续保持良好的财务习惯，适当增加投资。' },
          { title: '信用管理', content: '继续保持按时还款的良好习惯。' }
        ]
      },
      {
        id: 2,
        date: '2024-01-10 10:15:30',
        riskLevel: '中风险',
        riskProbability: 45,
        mainFactor: '负债率偏高，收入一般',
        factors: [
          { factor: '负债水平', score: 65, impact: 60 },
          { factor: '收入稳定性', score: 70, impact: 40 },
          { factor: '信用历史', score: 75, impact: 30 },
          { factor: '资产状况', score: 68, impact: 25 }
        ],
        suggestions: [
          { title: '债务优化', content: '建议减少不必要的负债，优化债务结构。' },
          { title: '收入提升', content: '考虑通过技能提升增加收入来源。' }
        ]
      },
      {
        id: 3,
        date: '2024-01-05 16:45:12',
        riskLevel: '高风险',
        riskProbability: 68,
        mainFactor: '逾期记录较多，负债过高',
        factors: [
          { factor: '信用历史', score: 55, impact: 75 },
          { factor: '负债水平', score: 60, impact: 70 },
          { factor: '收入稳定性', score: 65, impact: 50 },
          { factor: '资产状况', score: 58, impact: 35 }
        ],
        suggestions: [
          { title: '信用修复', content: '立即处理逾期记录，建立良好的还款习惯。' },
          { title: '债务重组', content: '考虑债务重组方案，降低还款压力。' },
          { title: '财务咨询', content: '建议寻求专业财务顾问的帮助。' }
        ]
      }
    ]

    const loadHistoryData = () => {
      // 模拟数据加载
      historyData.value = mockHistoryData
      totalRecords.value = mockHistoryData.length
    }

    const handleSearch = () => {
      loadHistoryData()
    }

    const handleReset = () => {
      filterForm.value = {
        dateRange: '',
        riskLevel: ''
      }
      loadHistoryData()
    }

    const handleViewDetail = (row) => {
      currentDetail.value = row
      detailVisible.value = true
    }

    onMounted(() => {
      loadHistoryData()
    })

    return {
      filterForm,
      currentPage,
      pageSize,
      totalRecords,
      historyData,
      detailVisible,
      currentDetail,
      handleSearch,
      handleReset,
      handleViewDetail
    }
  }
}
</script>

<style scoped>
.history-records {
  padding: 0;
}

.filter-card {
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

.el-descriptions {
  margin-bottom: 20px;
}

h4 {
  color: #303133;
  margin: 15px 0 10px;
  font-size: 16px;
}
</style>