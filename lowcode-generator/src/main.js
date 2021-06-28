import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
/** antd */
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)
/** element */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, { zIndex: 300, size: 'mini' })

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import '@/permission' // permission control
import '@/components/expression/fnexp/index' // 函数全局注册
import VueEditor from 'vue2-editor'
Vue.use(VueEditor)

import selfDirective from '@/directive'
Vue.use(selfDirective)

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
Vue.use(contentmenu)

Vue.locale('en-US', { ...enLocale })
Vue.locale('zh-CN', { ...zhLocale })
Vue.config.lang = 'en-US'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
// 计算精度处理
import * as math from 'mathjs'
window.math = math
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import '@/styles/index.scss' // global css

import 'babel-polyfill' // 兼容浏览器
Vue.use(preview)

import FormMaking from './index'
Vue.use(FormMaking)

import 'moment/locale/zh-cn'

import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodemirror)
window.throwError = function(params, errorMessage) {
  let errorFlag = false
  if (params === undefined) {
    errorFlag = true
  }
  if (params instanceof Array) {
    if (params.findIndex(item => item === undefined) >= 0) {
      this.errorFlag = true
    }
  }
  if (errorFlag) {
    const error = errorMessage || '参数错误'
    try {
      throw new Error(error)
    } catch (e) {
      throw e
    }
  }
}
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
