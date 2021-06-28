import Vue from 'vue'
import Router from 'vue-router'

import DesignLayout from '@/views/DesignLayout/Layout'
Vue.use(Router)
export const constantRouterMap = [
  // 构建器路由
  {
    path: '/:appId/design',
    redirect: '/:appId/design/index',
    name: 'design',
    component: DesignLayout,
    meta: { platform: 'editor' },
    children: [
      {
        path: 'index',
        name: 'design-index',
        component: () => import('@/views/builder/Home.vue')
      },
      {
        path: 'function',
        name: 'design-function',
        component: () => import('@/views/function/functionlist.vue')
      },
      {
        path: 'workflow/workflowlist',
        name: 'design-workflowlist',
        component: () => import('@/views/workflow/workflowlist.vue')
      },
      {
        path: 'workflow/createworkflow',
        name: 'design-createworkflow',
        component: () => import('@/views/workflow/createworkflow.vue')
      },
      {
        path: 'workflow/workflowboard',
        name: 'design-workflowboard',
        component: () => import('@/views/workflow/workflowboard.vue')
      },
      {
        path: 'setting',
        name: 'design-setting',
        component: () => import('@/views/setting/index.vue')
      },
      {
        path: 'roleset',
        name: 'design-roleset',
        component: () => import('@/views/setting/roleset.vue')
      },
      {
        path: 'addrole',
        name: 'design-addrole',
        component: () => import('@/views/setting/addrole.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: '/:appId/design/index'
  }
]
export default new Router({
  routes: constantRouterMap
})

