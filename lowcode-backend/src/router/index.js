import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
export const constantRouterMap = [
  // 白名单访问路径
  // { path: '/register', component: () => import('@/views/login/components/register'), hidden: true },
  // { path: '/setnewpsw', component: () => import('@/views/login/components/setnewpsw'), hidden: true },
  // { path: '/forgotpassword', component: () => import('@/views/login/components/forgotpassword'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { btnShow: true, avatarShow: false, infoShow: false }
    }]
  },
  // 登录，注册，找回密码
  {
    path: '/login',
    component: Layout,
    redirect: '/login/index',
    meta: { title: 'login', breadcrumb: true, btnShow: false, avatarShow: false, infoShow: false },
    children: [
      // 登录
      {
        path: 'index',
        name: 'login',
        component: () => import('@/views/login/index'),
        meta: { title: 'login', icon: 'login', btnShow: false, avatarShow: false, infoShow: false }
      },
      // 找回密码
      {
        path: 'password',
        name: 'password',
        component: () => import('@/views/login/password'),
        meta: { title: 'password', icon: 'password', btnShow: false, avatarShow: false, infoShow: false }
      },
      // 设置登录密码
      {
        path: 'setpassword',
        name: 'setpassword',
        component: () => import('@/views/login/setpassword'),
        meta: { title: 'setpassword', icon: 'setpassword', btnShow: false, avatarShow: false, infoShow: false }
      },
      // 注册
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/login/register'),
        meta: { title: 'register', icon: 'register', btnShow: false, avatarShow: false, infoShow: false }
      },
      // 注册-完善信息
      {
        path: 'registerend',
        name: 'registerend',
        component: () => import('@/views/login/registerend'),
        meta: { title: 'registerend', icon: 'registerend', btnShow: false, avatarShow: false, infoShow: false }
      }
    ]
  },
  // 邀请
  {
    path: '/invite',
    component: Layout,
    redirect: '/invite/accept',
    meta: { title: 'invite', breadcrumb: true },
    children: [
      // 接受
      {
        path: 'accept',
        name: 'accept',
        component: () => import('@/views/invite/accept'),
        meta: { title: 'accept', icon: '', btnShow: false, avatarShow: false, infoShow: false }
      }
    ]
  },
  // 创建公司
  {
    path: '/companycreate',
    component: Layout,
    redirect: '/companycreate/index',
    meta: { title: 'login', breadcrumb: true },
    children: [
      // 创建公司欢迎页
      {
        path: 'index',
        name: 'companycreate',
        component: () => import('@/views/companyCreate/index'),
        meta: { title: 'companycreate', icon: 'companycreate', btnShow: false, avatarShow: false, infoShow: false }
      },
      // 创建公司
      {
        path: 'create',
        name: 'create',
        component: () => import('@/views/companyCreate/companycreate.vue'),
        meta: { title: 'create', icon: 'create', btnShow: false, avatarShow: false, infoShow: false }
      }
    ]
  },
  // 消息
  {
    path: '/message',
    component: Layout,
    redirect: '/message/confirm',
    meta: {
      title: 'message',
      icon: 'message',
      breadcrumb: true
    },
    children: [
      {
        path: 'confirm',
        name: 'confirm',
        component: () => import('@/views/message/confirm'),
        meta: { title: 'confirm', icon: 'confirm', btnShow: false, avatarShow: true, infoShow: false }
      }
    ]
  },
  // 消息
  {
    path: '/loading',
    name: 'loading',
    component: () => import('@/views/companyInfo/builderLoading'),
    meta: { title: 'loading', icon: 'loading', breadcrumb: true }
  },
  // 公司信息
  {
    path: '/:companyId/company',
    component: Layout,
    redirect: '/company/index',
    meta: {
      title: 'company',
      icon: 'user',
      breadcrumb: true
    },
    children: [
      {
        path: 'index',
        name: 'companyInfo',
        component: () => import('@/views/companyInfo/index'),
        meta: { title: 'companyInfo', icon: 'userMenu', btnShow: false, avatarShow: true, infoShow: true }
      },
      {
        path: 'memberInfo',
        name: 'memberInfo',
        hidden: true,
        component: () => import('@/views/companyInfo/memberInfo'),
        meta: { title: 'memberInfo', icon: 'userMenu', btnShow: false, avatarShow: true, infoShow: true }
      },
      {
        path: 'memberEdit',
        name: 'memberEdit',
        hidden: true,
        component: () => import('@/views/companyInfo/memberEdit'),
        meta: { title: 'memberEdit', icon: 'userMenu', btnShow: false, avatarShow: true, infoShow: true }
      },
      // 创建应用模版
      {
        path: 'createapp',
        name: 'createapp',
        hidden: true,
        component: () => import('@/views/companyInfo/createapp'),
        meta: { title: 'createapp', icon: 'createapp', btnShow: false, avatarShow: true, infoShow: true }
      },
      // 创建应用
      {
        path: 'createstart',
        name: 'createstart',
        hidden: true,
        component: () => import('@/views/companyInfo/createstart'),
        meta: { title: 'createstart', icon: 'createstart', btnShow: false, avatarShow: true, infoShow: true }
      }
    ]
  }
]

export default new Router({
  routes: constantRouterMap
})
