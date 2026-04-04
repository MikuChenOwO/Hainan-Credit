import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboard.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    children: [
      {
        path: 'personal',
        name: 'PersonalDashboard',
        component: () => import('@/views/personal/PersonalDashboard.vue')
      },
      {
        path: 'enterprise',
        name: 'EnterpriseDashboard',
        component: () => import('@/views/enterprise/EnterpriseDashboard.vue')
      },
      {
        path: 'government',
        name: 'GovernmentDashboard',
        component: () => import('@/views/government/GovernmentDashboard.vue')
      },
      {
        path: 'research',
        name: 'ResearchDashboard',
        component: () => import('@/views/research/ResearchDashboard.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router