import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { BIO } from '@/utils/bio'
NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = ['/login/index', '/login/password', '/login/setpassword', '/login/register', '/login/registerend', '/dashboard', '/invite/accept'] // 不重定向白名单
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (whiteList.indexOf(to.path) !== -1) {
    if (getToken() && to.path === '/invite/accept') {
      await store.dispatch('GetInfo')
    }
    next()
    NProgress.done()
  } else {
    if (getToken()) {
      try {
        if (to.path === '/login/index') {
          const info = await store.dispatch('GetInfo')
          const companyId = info.lastCompanyId
          const path = '/' + (companyId ? BIO.tenTo62(companyId) : -1) + '/company/index'
          next({ path: path })
        } else {
          await store.dispatch('GetInfo')
          await store.dispatch('getUnreadNum')
          await store.dispatch('getMessageLists')
          next()
        }

        NProgress.done()
      } catch (e) {
        // token无效
        next({ path: '/login/index' })
        NProgress.done()
      }
    } else {
      console.log(1)
      next({ path: '/login/index' })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
