import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from './lang' // Internationalization
import App from './App'
import store from './store'
import router from './router'
import VueClipboard from 'vue-clipboard2'
import '@/icons' // icon
import '@/permission' // permission control

/**
 * This project originally used easy-mock to simulate data,
 * but its official service is very unstable,
 * and you can build your own service if you need it.
 * So here I use Mock.js for local emulation,
 * it will intercept your request, so you won't see the request in the network.
 * If you remove `../mock` it will automatically request easy-mock data.
 */
// import '../mock' // simulation data
import './theme/element/index.css' // theme
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import '@/styles/index.scss' // global css

import 'babel-polyfill' // 兼容浏览器
Vue.use(preview)

Vue.use(VueClipboard)

require('es6-promise').polyfill()

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
  size: 'mini'
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
