import router from './router'
import { getPlatform, getAppId } from '@/util/auth'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/util/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = [] // 不重定向白名单
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    // const designToFlag = to.path.indexOf('/design/index')
    // const designFromFlag = from.path.indexOf('/design/index')
    const appToFlag = to.path.indexOf('/app/dashboard')
    const appFromFlag = from.path.indexOf('/app/dashboard')
    if ((to.path.slice(-3) === 'app' || appToFlag !== -1) && (from.path !== '/' && from.path.slice(-3) !== 'app' && appFromFlag === -1)) {
      localStorage.setItem('refresh', '1')
    } else {
      localStorage.setItem('refresh', '0')
    }
    if (getToken()) {
      try {
        // const info = await store.dispatch('GetInfo')
        await store.dispatch('GetInfo')
        if (to.matched.length === 0) {
          next({ path: '/' })
        } else {
          next()
        }
      } catch (e) {
        console.log(e)
        jumpToLogin(to)
      }
    } else {
      jumpToLogin(to)
    }
  }
})
function jumpToLogin(to) {
  if (process.env.NODE_ENV === 'production') {
    // 生产环境
    // platform和appid是编辑器和构建器必须的参数，若没有则登录完不用redirect
    if (getPlatform() && getAppId()) {
      window.location.href = process.env.VUE_APP_COMPANY_API + 'login/index?redirect=' + encodeURIComponent(process.env.VUE_APP_COMPANY_API + to.path)
    } else {
      window.location.href = process.env.VUE_APP_COMPANY_API + 'login/index'
    }
  } else if (process.env.NODE_ENV === 'development') {
    // 测试环境
    if (getPlatform() && getAppId()) {
      window.location.href = process.env.VUE_APP_COMPANY_API + 'login/index?redirect=' + encodeURIComponent(process.env.VUE_APP_GENERATOR_API + to.path)
    } else {
      window.location.href = process.env.VUE_APP_COMPANY_API + 'login/index'
    }
  }
}
router.afterEach(() => {
  NProgress.done() // 结束Progress
})
