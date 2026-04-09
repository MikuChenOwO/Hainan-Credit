export const USER_TYPE_OPTIONS = [
  { label: '个人用户', value: 'personal' },
  { label: '企业用户', value: 'enterprise' },
  { label: '政府用户', value: 'government' },
  { label: '科研用户', value: 'research' },
  { label: '系统管理员', value: 'admin' }
]

export const USER_TYPE_LABELS = USER_TYPE_OPTIONS.reduce((result, item) => {
  result[item.value] = item.label
  return result
}, {})

export const INDUSTRY_OPTIONS = [
  '信息技术',
  '金融服务',
  '制造业',
  '旅游服务',
  '房地产',
  '医疗健康',
  '教育培训',
  '批发零售',
  '交通运输',
  '农业',
  '能源',
  '其他'
]

export const FEATURE_LIBRARY = {
  personal: [
    { key: 'profile', label: '用户画像', description: '查看您的多维信用画像' },
    { key: 'risk', label: '风险预测', description: '进行信用风险评估' },
    { key: 'history', label: '历史记录', description: '查看评估历史记录' }
  ],
  enterprise: [
    { key: 'risk', label: '风险预测', description: '企业信用风险评估' },
    { key: 'finance', label: '财务分析', description: '财务报表分析' },
    { key: 'monitor', label: '风险监控', description: '实时风险监控' },
    { key: 'report', label: '信用报告', description: '生成信用报告' }
  ],
  government: [
    { key: 'monitor', label: '风险监控', description: '企业风险实时监控' },
    { key: 'push', label: '定向推送', description: '优质企业推荐' },
    { key: 'analysis', label: '行业分析', description: '行业风险分析' },
    { key: 'report', label: '监管报告', description: '生成监管报告' }
  ],
  research: [
    { key: 'data', label: '数据管理', description: '数据上传与申请' },
    { key: 'composer', label: '算法组合器', description: '拖拽式算法构建' },
    { key: 'upload', label: '算法上传', description: '上传新的风险算法' },
    { key: 'manage', label: '算法管理', description: '管理已有算法' },
    { key: 'test', label: '算法测试', description: '测试算法性能' }
  ],
  admin: [
    { key: 'users', label: '用户管理', description: '管理用户账号与权限' },
    { key: 'data', label: '数据管理', description: '管理系统数据与备份' },
    { key: 'system', label: '系统配置', description: '维护系统参数与功能开关' },
    { key: 'monitor', label: '监控中心', description: '查看运行状态和日志' }
  ]
}

export const BUSINESS_PRESETS = {
  personal: [
    {
      value: 'personal-basic',
      label: '个人基础服务',
      description: '适合普通个人用户，关注信用画像和基础风险评估。',
      featureKeys: ['profile', 'risk']
    },
    {
      value: 'personal-risk',
      label: '个人风控跟踪',
      description: '适合持续关注信用变化的用户，增加历史追踪能力。',
      featureKeys: ['risk', 'history']
    },
    {
      value: 'personal-full',
      label: '个人全量视图',
      description: '完整开放个人信用中心全部功能。',
      featureKeys: ['profile', 'risk', 'history']
    }
  ],
  enterprise: [
    {
      value: 'enterprise-finance',
      label: '融资风控方案',
      description: '聚焦授信评估、财务分析和信用报告。',
      featureKeys: ['risk', 'finance', 'report']
    },
    {
      value: 'enterprise-supply-chain',
      label: '供应链协同方案',
      description: '聚焦风险预警与上下游信用监控。',
      featureKeys: ['risk', 'monitor', 'report']
    },
    {
      value: 'enterprise-full',
      label: '企业综合经营方案',
      description: '开放企业信用中心全部核心菜单。',
      featureKeys: ['risk', 'finance', 'monitor', 'report']
    }
  ],
  government: [
    {
      value: 'government-supervision',
      label: '监管巡查方案',
      description: '以风险监控和监管报告为主。',
      featureKeys: ['monitor', 'report']
    },
    {
      value: 'government-industry',
      label: '产业治理方案',
      description: '侧重产业分析与企业定向推送。',
      featureKeys: ['push', 'analysis', 'report']
    },
    {
      value: 'government-full',
      label: '政府综合监管方案',
      description: '开放政府监管中心全部功能。',
      featureKeys: ['monitor', 'push', 'analysis', 'report']
    }
  ],
  research: [
    {
      value: 'research-data',
      label: '数据研究方案',
      description: '聚焦数据申请、数据上传与实验准备。',
      featureKeys: ['data', 'upload']
    },
    {
      value: 'research-model',
      label: '模型研发方案',
      description: '聚焦算法组合、上传、测试与管理。',
      featureKeys: ['composer', 'upload', 'manage', 'test']
    },
    {
      value: 'research-full',
      label: '科研全流程方案',
      description: '开放科研算法中心全部功能。',
      featureKeys: ['data', 'composer', 'upload', 'manage', 'test']
    }
  ],
  admin: [
    {
      value: 'admin-ops',
      label: '系统运维方案',
      description: '适合平台管理员，开放后台管理核心入口。',
      featureKeys: ['users', 'data', 'system', 'monitor']
    }
  ]
}

export function getUserTypeText(userType) {
  return USER_TYPE_LABELS[userType] || '用户'
}

export function getBusinessOptions(userType) {
  return BUSINESS_PRESETS[userType] || []
}

export function getFeatureItems(userType) {
  return FEATURE_LIBRARY[userType] || []
}

export function getBusinessPreset(userType, presetValue) {
  const options = getBusinessOptions(userType)
  if (!options.length) {
    return null
  }

  return options.find(item => item.value === presetValue) || options[0]
}

export function getDefaultFeatureKeys(userType) {
  return getFeatureItems(userType).map(item => item.key)
}

export function getFeatureLabel(userType, featureKey) {
  const feature = getFeatureItems(userType).find(item => item.key === featureKey)
  return feature?.label || '功能'
}

export function getDefaultFeature(userType, featureKeys = []) {
  const allowedKeys = featureKeys.length ? featureKeys : getDefaultFeatureKeys(userType)
  return allowedKeys[0] || ''
}
