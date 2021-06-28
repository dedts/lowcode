import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/GeneratorLayout/Layout'
// import DesignLayout from '@/views/DesignLayout/Layout'
Vue.use(Router)
// 解决跳转到同一个路由报错的问题
// 获取原型对象上的push函数
const originalPush = Router.prototype.push
// 修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export const constantRouterMap = [
  {
    path: '/:appId/app',
    component: Layout,
    redirect: '/:appId/app/dashboard',
    name: 'app-Dashboard',
    hidden: true,
    meta: { platform: 'application', menu: false, infoShow: true },
    children: [
      {
        path: 'dashboard',
        name: 'app-dashboard',
        component: () => import('@/views/GeneratorDashboard/index.vue'),
        meta: { infoShow: true }
      },
      {
        path: 'form/:id',
        name: 'app-form',
        component: () => import('@/views/GeneratorTemplate/add.vue'),
        meta: { infoShow: true }
      },
      {
        path: 'report/:id',
        name: 'app-report',
        component: () => import('@/views/GeneratorTemplate/index.vue'),
        meta: { infoShow: true }
      },
      {
        path: 'edit/:id/:dataid',
        name: 'app-edit',
        component: () => import('@/views/GeneratorTemplate/edit.vue'),
        meta: { infoShow: true }
      },
      {
        path: 'copy/:id/:dataid',
        name: 'app-copy',
        component: () => import('@/views/GeneratorTemplate/edit.vue'),
        meta: { infoShow: true }
      }
    ]
  }
]
export default new Router({
  routes: constantRouterMap
})

