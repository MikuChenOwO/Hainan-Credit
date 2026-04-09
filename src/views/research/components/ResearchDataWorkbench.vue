<template>
  <div class="workbench">
    <section class="hero">
      <div>
        <p class="eyebrow">Research Data Hub</p>
        <h3>科研数据管理工作台</h3>
        <p>在此模块进行科研数据的管理，包括官方目录、申请中心和自主上传。</p>
      </div>
      <div class="actions">
        <el-button plain type="primary" @click="scrollTo('catalog')">官方目录</el-button>
        <el-button plain type="primary" @click="scrollTo('request')">申请中心</el-button>
        <el-button plain type="primary" @click="scrollTo('upload')">自主上传</el-button>
      </div>
    </section>

    <section class="stats">
      <div class="stat"><span>官方数据</span><strong>{{ datasets.length }}</strong></div>
      <div class="stat"><span>公开访问</span><strong>{{ publicDatasets.length }}</strong></div>
      <div class="stat"><span>申请访问</span><strong>{{ restrictedDatasets.length }}</strong></div>
      <div class="stat"><span>我的申请</span><strong>{{ requestHistory.length }}</strong></div>
    </section>

    <section ref="catalogRef" class="panel">
      <div class="header">
        <div>
          <p class="eyebrow dark">Catalog</p>
          <h4>官方数据目录</h4>
        </div>
        <div class="tools">
          <el-input v-model="keyword" clearable placeholder="搜索名称或用途" class="search">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
          <el-select v-model="category" class="filter">
            <el-option label="全部分类" value="all" />
            <el-option label="企业信用" value="enterprise" />
            <el-option label="行业景气" value="industry" />
            <el-option label="监管事件" value="regulatory" />
            <el-option label="宏观因子" value="macro" />
          </el-select>
        </div>
      </div>

      <div class="grid">
        <div class="list">
          <article v-for="item in filteredDatasets" :key="item.id" :class="['card', { active: activeDatasetId === item.id }]" @click="activeDatasetId = item.id">
            <div class="card-head">
              <strong>{{ item.name }}</strong>
              <el-tag :type="item.tagType" effect="light">{{ item.accessMode === 'public' ? '公开' : '申请' }}</el-tag>
            </div>
            <p>{{ item.description }}</p>
            <div class="tags">
              <el-tag v-for="field in item.fields.slice(0, 4)" :key="field" size="small" effect="plain">{{ field }}</el-tag>
            </div>
            <div class="actions top-gap">
              <el-button v-if="item.accessMode === 'public'" type="primary" plain size="small" @click.stop="downloadDataset(item, 'csv')">下载 CSV</el-button>
              <el-button v-if="item.accessMode === 'public'" size="small" @click.stop="downloadDataset(item, 'json')">下载 JSON</el-button>
              <el-button v-else type="warning" size="small" @click.stop="openRequestDialog(item)">申请访问</el-button>
            </div>
          </article>
          <el-empty v-if="!filteredDatasets.length" description="没有匹配的数据包" />
        </div>

        <div class="preview">
          <template v-if="activeDataset">
            <div class="header compact">
              <div>
                <p class="eyebrow dark">Preview</p>
                <h4>{{ activeDataset.name }}</h4>
              </div>
              <el-tag :type="activeDataset.accessMode === 'public' ? 'success' : 'warning'">
                {{ activeDataset.accessMode === 'public' ? '公开访问' : '申请访问' }}
              </el-tag>
            </div>
            <p>{{ activeDataset.useCase }}</p>
            <el-alert v-if="activeDataset.accessMode !== 'public'" class="top-gap" type="warning" :closable="false" title="该数据包不提供直接下载，请通过申请流程获取权限。" />
            <div class="stats mini">
              <div class="stat"><span>最近更新</span><strong>{{ activeDataset.updatedAt }}</strong></div>
              <div class="stat"><span>字段数量</span><strong>{{ activeDataset.fields.length }}</strong></div>
            </div>
            <el-table :data="activeDataset.previewRows" border stripe class="top-gap">
              <el-table-column v-for="field in activeDataset.fields" :key="field" :prop="field" :label="field" min-width="120" show-overflow-tooltip />
            </el-table>
          </template>
          <el-empty v-else description="请先选择一个数据包" />
        </div>
      </div>
    </section>

    <div class="dual">
      <section ref="requestRef" class="panel">
        <div class="header">
          <div>
            <p class="eyebrow dark">Request Center</p>
            <h4>申请中心</h4>
          </div>
          <el-button type="warning" plain @click="openRequestDialog()">发起申请</el-button>
        </div>

        <div class="tip-box">
          <strong>{{ activeRestrictedDataset?.name || '暂无受限数据' }}</strong>
          <p>当前申请记录只存在于本次前端运行会话中，后续可以直接把下面的 mock service 替换成真实接口。</p>
        </div>

        <div class="top-gap">
          <div class="header compact">
            <h4>申请记录</h4>
            <el-tag effect="plain">{{ requestHistory.length }} 条</el-tag>
          </div>
          <div v-if="requestHistory.length" class="list">
            <article v-for="item in requestHistory" :key="item.id" class="card plain">
              <div class="card-head">
                <strong>{{ item.datasetName }}</strong>
                <el-tag :type="getRequestStatusType(item.status)">{{ getRequestStatusText(item.status) }}</el-tag>
              </div>
              <p>{{ item.purpose }}</p>
              <small>{{ item.applicant }} · {{ item.submittedAt }}</small>
            </article>
          </div>
          <el-empty v-else description="还没有申请记录" />
        </div>
      </section>

      <section ref="uploadRef" class="panel">
        <div class="header">
          <div>
            <p class="eyebrow dark">Upload Space</p>
            <h4>自主上传</h4>
          </div>
          <div class="actions">
            <el-button plain @click="downloadGeneralTemplate">通用模板</el-button>
            <el-button plain @click="downloadUploadGuide">接入说明</el-button>
          </div>
        </div>

        <el-upload drag multiple :auto-upload="false" :show-file-list="false" :on-change="handleFileChange">
          <el-icon class="upload-icon"><UploadFilled /></el-icon>
          <div class="el-upload__text">拖拽文件到这里，或 <em>点击选择文件</em></div>
          <template #tip><div class="el-upload__tip">支持 CSV、JSON、Excel，单个文件不超过 20MB。</div></template>
        </el-upload>

        <div class="top-gap">
          <div class="header compact">
            <h4>待上传队列</h4>
            <div class="actions">
              <el-button size="small" @click="clearUploadQueue">清空</el-button>
              <el-button size="small" type="primary" @click="confirmUpload">确认上传</el-button>
            </div>
          </div>
          <div v-if="uploadQueue.length" class="list">
            <article v-for="item in uploadQueue" :key="item.uid" class="card plain">
              <div class="card-head">
                <strong>{{ item.name }}</strong>
                <el-button link type="danger" @click="removeQueuedFile(item.uid)">移除</el-button>
              </div>
              <p>{{ formatFileSize(item.size) }} · {{ item.extension.toUpperCase() }}</p>
            </article>
          </div>
          <el-empty v-else description="暂无待上传文件" />
        </div>

        <div class="top-gap">
          <div class="header compact">
            <h4>上传预览</h4>
            <el-icon><Document /></el-icon>
          </div>
          <template v-if="uploadPreview.fileName">
            <el-alert v-if="uploadPreview.message" type="info" :closable="false" :title="uploadPreview.message" />
            <div v-if="uploadPreview.columns.length" class="tags top-gap">
              <el-tag v-for="field in uploadPreview.columns" :key="field" size="small" effect="plain">{{ field }}</el-tag>
            </div>
            <el-table v-if="uploadPreview.rows.length" :data="uploadPreview.rows" border stripe class="top-gap">
              <el-table-column v-for="field in uploadPreview.columns" :key="field" :prop="field" :label="field" min-width="120" show-overflow-tooltip />
            </el-table>
          </template>
          <el-empty v-else description="上传后这里会显示字段与样本预览" />
        </div>
      </section>
    </div>

    <el-dialog v-model="requestDialogVisible" title="向管理员申请数据" width="640px" destroy-on-close>
      <el-form ref="requestFormRef" :model="requestForm" :rules="requestRules" label-width="90px">
        <el-form-item label="数据包" prop="datasetId">
          <el-select v-model="requestForm.datasetId" placeholder="请选择数据包">
            <el-option v-for="item in restrictedDatasets" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="研究用途" prop="purpose"><el-input v-model="requestForm.purpose" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="申请范围" prop="requestedScope"><el-input v-model="requestForm.requestedScope" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="使用期限" prop="duration">
          <el-date-picker v-model="requestForm.duration" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="导出格式" prop="format">
          <el-radio-group v-model="requestForm.format">
            <el-radio label="CSV">CSV</el-radio>
            <el-radio label="Excel">Excel</el-radio>
            <el-radio label="JSON">JSON</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="requestDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRequest">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Search, UploadFilled } from '@element-plus/icons-vue'
import { getCurrentUserProfile } from '@/utils/auth'

const requestStore = new Map()
const uploadStore = new Map()
const DATASETS = [
  { id: 'hn-enterprise-credit', name: '海南省企业信用联合样本', tagType: 'primary', category: 'enterprise', accessMode: 'restricted', frequency: '月度', rowCount: '12,400+', updatedAt: '2026-04-01', description: '覆盖工商、涉税、司法、履约等多源脱敏企业特征。', useCase: '企业违约预测、授信评分、区域企业画像', fields: ['企业名称', '统一信用代码', '行业', '区域', '风险评分'], previewRows: [{ 企业名称: '海口智数科技', 统一信用代码: '91460000HNA10001', 行业: '信息技术', 区域: '海口市', 风险评分: 82 }, { 企业名称: '三亚文旅发展', 统一信用代码: '91460000HNA10002', 行业: '旅游服务', 区域: '三亚市', 风险评分: 74 }] },
  { id: 'hn-industry-risk-index', name: '行业风险景气指数', tagType: 'success', category: 'industry', accessMode: 'public', frequency: '月度', rowCount: '36 个月', updatedAt: '2026-03-31', description: '行业景气、偿债压力和波动指标的公开样本。', useCase: '行业景气分析、行业轮动、宏观传导研究', fields: ['月份', '行业', '景气指数', '偿债压力', '波动指数'], previewRows: [{ 月份: '2026-03', 行业: '制造业', 景气指数: 0.82, 偿债压力: 0.36, 波动指数: 0.29 }, { 月份: '2026-03', 行业: '旅游服务', 景气指数: 0.74, 偿债压力: 0.43, 波动指数: 0.38 }] },
  { id: 'hn-regulatory-events', name: '监管事件标签样本', tagType: 'warning', category: 'regulatory', accessMode: 'restricted', frequency: '季度', rowCount: '4,800+', updatedAt: '2026-03-15', description: '用于事件识别和弱监督训练的监管样本。', useCase: '事件检测、处罚预测、监管语义研究', fields: ['事件编号', '主体类型', '事件标签', '发生日期', '处置状态'], previewRows: [{ 事件编号: 'EVT-2026-001', 主体类型: '企业', 事件标签: '异常经营', 发生日期: '2026-01-15', 处置状态: '已结案' }, { 事件编号: 'EVT-2026-014', 主体类型: '企业', 事件标签: '行政处罚', 发生日期: '2026-02-03', 处置状态: '跟进中' }] },
  { id: 'hn-macro-factors', name: '区域宏观经济因子库', tagType: 'info', category: 'macro', accessMode: 'public', frequency: '季度', rowCount: '18 区县', updatedAt: '2026-03-20', description: '地区 GDP、消费、投资、就业等公开因子库。', useCase: '区域信用环境建模、宏观因子融合', fields: ['地区', '季度', 'GDP增速', '固定投资增速', '就业指数'], previewRows: [{ 地区: '海口市', 季度: '2026Q1', GDP增速: '6.1%', 固定投资增速: '4.8%', 就业指数: 102.4 }, { 地区: '三亚市', 季度: '2026Q1', GDP增速: '5.4%', 固定投资增速: '5.2%', 就业指数: 101.1 }] }
]

const cloneList = list => list.map(item => ({ ...item }))
const getProfileKey = (profile = {}) => `${profile.userType || 'guest'}:${profile.username || 'anonymous'}`
const toCsv = (rows, fields) => [fields.join(','), ...rows.map(row => fields.map(field => `\"${String(row[field] ?? '').replace(/\"/g, '\"\"')}\"`).join(','))].join('\\n')
const triggerDownload = (filename, content, mimeType) => { const blob = new Blob([content], { type: mimeType }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url) }

const service = {
  async listRequests(profile) { return cloneList(requestStore.get(getProfileKey(profile)) || []) },
  async createRequest(profile, record) { const key = getProfileKey(profile); const next = [{ ...record }, ...(requestStore.get(key) || [])]; requestStore.set(key, next); return cloneList(next) },
  async listUploads(profile) { return cloneList(uploadStore.get(getProfileKey(profile)) || []) },
  async createUploads(profile, records) { const key = getProfileKey(profile); const next = records.map(item => ({ ...item })).concat(uploadStore.get(key) || []); uploadStore.set(key, next); return cloneList(next) }
}

export default {
  name: 'ResearchDataWorkbench',
  components: { Document, Search, UploadFilled },
  setup() {
    const catalogRef = ref(null)
    const requestRef = ref(null)
    const uploadRef = ref(null)
    const requestFormRef = ref(null)
    const datasets = ref(DATASETS)
    const activeDatasetId = ref(DATASETS[0].id)
    const keyword = ref('')
    const category = ref('all')
    const uploadQueue = ref([])
    const uploadHistory = ref([])
    const requestHistory = ref([])
    const requestDialogVisible = ref(false)
    const uploadPreview = reactive({ fileName: '', fileType: '', columns: [], rows: [], message: '' })
    const requestForm = reactive({ datasetId: DATASETS.find(item => item.accessMode === 'restricted')?.id || '', purpose: '', requestedScope: '', duration: [], format: 'CSV' })
    const requestRules = { datasetId: [{ required: true, message: '请选择需要申请的数据包', trigger: 'change' }], purpose: [{ required: true, message: '请填写研究用途', trigger: 'blur' }], requestedScope: [{ required: true, message: '请填写申请范围', trigger: 'blur' }], duration: [{ required: true, message: '请选择使用期限', trigger: 'change' }] }

    const filteredDatasets = computed(() => datasets.value.filter(item => (category.value === 'all' || item.category === category.value) && (!keyword.value.trim() || `${item.name}${item.description}${item.useCase}`.toLowerCase().includes(keyword.value.trim().toLowerCase()))))
    const activeDataset = computed(() => datasets.value.find(item => item.id === activeDatasetId.value) || filteredDatasets.value[0] || null)
    const publicDatasets = computed(() => datasets.value.filter(item => item.accessMode === 'public'))
    const restrictedDatasets = computed(() => datasets.value.filter(item => item.accessMode !== 'public'))
    const activeRestrictedDataset = computed(() => activeDataset.value?.accessMode !== 'public' ? activeDataset.value : restrictedDatasets.value[0] || null)
    const getProfile = () => getCurrentUserProfile() || { userType: 'research', username: 'anonymous' }

    const hydrate = async () => { const profile = getProfile(); uploadHistory.value = await service.listUploads(profile); requestHistory.value = await service.listRequests(profile) }
    const handleSessionProfileChange = () => { hydrate() }
    const scrollTo = key => ({ catalog: catalogRef.value, request: requestRef.value, upload: uploadRef.value }[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    const formatFileSize = size => size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1024 / 1024).toFixed(2)} MB`
    const getUploadStatusText = status => ({ processing: '校验中', ready: '可用', failed: '失败' }[status] || '处理中')
    const getUploadStatusType = status => ({ processing: 'warning', ready: 'success', failed: 'danger' }[status] || 'info')
    const getRequestStatusText = status => ({ pending: '待审批', approved: '已通过', rejected: '已驳回' }[status] || '处理中')
    const getRequestStatusType = status => ({ pending: 'warning', approved: 'success', rejected: 'danger' }[status] || 'info')

    const downloadDataset = (dataset, format) => {
      const name = dataset.name.replace(/\\s+/g, '-')
      if (format === 'json') triggerDownload(`${name}.json`, JSON.stringify(dataset.previewRows, null, 2), 'application/json;charset=utf-8')
      else triggerDownload(`${name}.csv`, toCsv(dataset.previewRows, dataset.fields), 'text/csv;charset=utf-8')
      ElMessage.success(`${dataset.name} 已开始下载`)
    }
    const downloadGeneralTemplate = () => { const rows = [{ 样本ID: 'SAMPLE-001', 主体名称: '示例企业A', 观察期: '2026-03', 特征1: '0.82', 特征2: '145', 标签: '0' }]; triggerDownload('科研数据通用模板.csv', toCsv(rows, ['样本ID', '主体名称', '观察期', '特征1', '特征2', '标签']), 'text/csv;charset=utf-8'); ElMessage.success('通用模板已下载') }
    const downloadUploadGuide = () => { triggerDownload('科研数据接入说明.txt', ['科研数据接入说明', '', '1. 推荐优先上传 CSV 或 JSON。', '2. Excel 文件当前版本仅做基础接入。', '3. 涉及敏感字段请先脱敏。'].join('\\n'), 'text/plain;charset=utf-8'); ElMessage.success('接入说明已下载') }
    const parseCsvPreview = text => { const lines = text.split(/\\r?\\n/).filter(Boolean); if (!lines.length) return { columns: [], rows: [] }; const columns = lines[0].split(',').map(item => item.replace(/^\"|\"$/g, '').trim()); const rows = lines.slice(1, 6).map(line => { const values = line.split(',').map(item => item.replace(/^\"|\"$/g, '').trim()); return columns.reduce((result, column, index) => ({ ...result, [column]: values[index] || '' }), {}) }); return { columns, rows } }
    const parseJsonPreview = text => { const parsed = JSON.parse(text); const rows = (Array.isArray(parsed) ? parsed : [parsed]).slice(0, 5); return { columns: rows.length ? Object.keys(rows[0]) : [], rows } }
    const fillUploadPreview = async rawFile => { Object.assign(uploadPreview, { fileName: rawFile.name, fileType: rawFile.name.split('.').pop().toUpperCase(), columns: [], rows: [], message: '正在生成预览...' }); if (rawFile.name.toLowerCase().endsWith('.csv')) { const { columns, rows } = parseCsvPreview(await rawFile.text()); uploadPreview.columns = columns; uploadPreview.rows = rows; uploadPreview.message = rows.length ? '' : 'CSV 文件为空。'; return } if (rawFile.name.toLowerCase().endsWith('.json')) { try { const { columns, rows } = parseJsonPreview(await rawFile.text()); uploadPreview.columns = columns; uploadPreview.rows = rows; uploadPreview.message = rows.length ? '' : 'JSON 文件内容为空。' } catch { uploadPreview.message = 'JSON 解析失败，请检查文件格式。' } return } uploadPreview.message = '当前版本仅对 CSV 和 JSON 提供即时预览，Excel 文件会进入上传队列。' }
    const handleFileChange = async file => { const rawFile = file.raw; if (!rawFile) return false; const extension = rawFile.name.split('.').pop().toLowerCase(); if (!['csv', 'json', 'xlsx', 'xls'].includes(extension)) { ElMessage.error('仅支持上传 CSV、JSON 和 Excel 文件'); return false } if (rawFile.size / 1024 / 1024 >= 20) { ElMessage.error('文件大小不能超过 20MB'); return false } uploadQueue.value = [...uploadQueue.value, { uid: file.uid, name: rawFile.name, size: rawFile.size, extension, raw: rawFile }]; await fillUploadPreview(rawFile); ElMessage.success(`${rawFile.name} 已加入上传队列`); return true }
    const removeQueuedFile = uid => { uploadQueue.value = uploadQueue.value.filter(item => item.uid !== uid); if (!uploadQueue.value.length) Object.assign(uploadPreview, { fileName: '', fileType: '', columns: [], rows: [], message: '' }) }
    const clearUploadQueue = () => { uploadQueue.value = []; Object.assign(uploadPreview, { fileName: '', fileType: '', columns: [], rows: [], message: '' }) }
    const confirmUpload = async () => { if (!uploadQueue.value.length) { ElMessage.warning('请先选择待上传文件'); return } const count = uploadQueue.value.length; const records = uploadQueue.value.map(file => ({ batchId: `UP-${Date.now()}-${String(file.uid).slice(-4)}`, fileName: file.name, fileType: file.extension.toUpperCase(), uploadedAt: new Date().toLocaleString('zh-CN'), status: 'processing' })); uploadHistory.value = await service.createUploads(getProfile(), records); clearUploadQueue(); ElMessage.success(`已提交 ${count} 个文件`) }
    const openRequestDialog = dataset => { const target = dataset?.accessMode === 'public' ? restrictedDatasets.value[0] : dataset || activeRestrictedDataset.value; requestForm.datasetId = target?.id || restrictedDatasets.value[0]?.id || ''; requestForm.requestedScope = target ? `申请访问 ${target.name} 的研究样本与字段明细` : ''; requestDialogVisible.value = true }
    const submitRequest = async () => { if (!requestFormRef.value) return; try { await requestFormRef.value.validate(); const dataset = datasets.value.find(item => item.id === requestForm.datasetId); const profile = getProfile(); const record = { id: `REQ-${Date.now()}`, datasetName: dataset?.name || '未命名数据包', applicant: profile?.realName || profile?.username || '科研用户', purpose: requestForm.purpose, requestedScope: requestForm.requestedScope, duration: requestForm.duration, format: requestForm.format, status: 'pending', submittedAt: new Date().toLocaleString('zh-CN') }; requestHistory.value = await service.createRequest(profile, record); requestDialogVisible.value = false; requestForm.purpose = ''; requestForm.requestedScope = ''; requestForm.duration = []; requestForm.format = 'CSV'; ElMessage.success('申请已提交') } catch { ElMessage.error('请先完善申请信息') } }

    onMounted(() => { hydrate(); window.addEventListener('session-profile-change', handleSessionProfileChange) })
    onBeforeUnmount(() => { window.removeEventListener('session-profile-change', handleSessionProfileChange) })

    return { activeDataset, activeDatasetId, activeRestrictedDataset, category, catalogRef, datasets, downloadDataset, downloadGeneralTemplate, downloadUploadGuide, filteredDatasets, formatFileSize, getRequestStatusText, getRequestStatusType, getUploadStatusText, getUploadStatusType, handleFileChange, keyword, openRequestDialog, publicDatasets, removeQueuedFile, requestDialogVisible, requestForm, requestFormRef, requestHistory, requestRef, requestRules, restrictedDatasets, scrollTo, submitRequest, uploadHistory, uploadPreview, uploadQueue, uploadRef, clearUploadQueue, confirmUpload }
  }
}
</script>

<style scoped>
.workbench {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #0f172a;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(135deg, #0f172a 0%, #12325f 58%, #184887 100%);
  color: #f8fafc;
}

.hero h3 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
}

.hero p {
  margin: 0;
  line-height: 1.7;
  opacity: 0.9;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #93c5fd;
}

.eyebrow.dark {
  color: #2563eb;
}

.actions, .tools, .tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stats.mini {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 20px;
  gap: 12px;
}

.stat, .panel, .card, .preview, .tip-box {
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #fff;
}

.stat {
  text-align: center;
}

.stat span {
  display: block;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 13px;
}

.stat strong {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
}

.panel {
  padding: 28px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.header.compact {
  margin-bottom: 16px;
}

.header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.search {
  width: 240px;
}

.filter {
  width: 140px;
}

.grid, .dual {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.1fr);
  gap: 20px;
}

.dual {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.list {
  display: grid;
  gap: 16px;
}

.card {
  background: linear-gradient(180deg, #fff, #f8fbff);
  cursor: pointer;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.card.plain {
  cursor: default;
  background: #fff;
}

.card.plain:hover {
  transform: none;
}

.card.active {
  border-color: #3b82f6;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.15);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.card-head strong {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.card p {
  margin: 0 0 12px 0;
  line-height: 1.6;
  color: #64748b;
  font-size: 14px;
}

.chip-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}

.chip {
  padding: 6px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
}

.top-gap {
  margin-top: 20px;
}

.tip-box {
  background: #fff7ed;
  border-color: #fed7aa;
}

.tip-box strong {
  display: block;
  margin-bottom: 8px;
  color: #c2410c;
}

.tip-box p {
  margin: 0;
  color: #7c2d12;
  font-size: 14px;
  line-height: 1.5;
}

.upload-icon {
  font-size: 48px;
  color: #2563eb;
}

small {
  color: #94a3b8;
  font-size: 12px;
}

@media (max-width: 1280px) {
  .grid, .dual, .stats, .stats.mini {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .hero, .header, .card-head {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search, .filter {
    width: 100%;
  }
  
  .hero {
    padding: 24px;
    text-align: center;
  }
  
  .hero .actions {
    justify-content: center;
  }
}
</style>