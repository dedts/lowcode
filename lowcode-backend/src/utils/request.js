import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import router from '../router'
import { getToken } from '@/utils/auth'
import { BIO } from '@/utils/bio'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_GLOBAL_API // api 的 base_url
  // timeout: 20000 // 请求超时时间
})
// 认证失败重新登录
const jumpRoute = () => {
  Message.error('认证失败，请重新登录')
  store.dispatch('LogOut')
  router.replace({
    path: '/login',
    query: { redirect: router.currentRoute.fullPath }
  })
}
// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['x-sangon-token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      const arr = window.location.hash.split('/')
      if (arr.length > 0) {
        config.headers['x-sangon-company-id'] = BIO.s62to10(arr[1])
      }
    }
    config.headers['x-sangon-platform'] = 'platform'
    return config
  },
  error => {
    // Do something with request error
    // console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const resp = response.data
    if (response.status !== 200) {
      return Promise.reject('error')
    } else {
      if (resp.code === 200) {
        return resp
      } else if (resp.code === 401) {
        window.location.href = process.env.VUE_APP_COMPANY_API + 'login/index'
        return Promise.reject(resp)
      } else if (resp.code === 400 || resp.code === 500) {
        if (resp.message) {
          Message.error(resp.message)
        } else {
          Message.error('系统异常!')
        }
        return Promise.reject('error')
      } else {
        if (resp.message) {
          Message.error(resp.message)
        } else {
          Message.error('系统异常!')
        }
        return Promise.reject('error')
      }
    }
  },
  error => {
    /**
     * 400: '请求错误'
     * 401: '未授权，请登录'
     * 403: '拒绝访问'
     * 404: `请求地址出错: ${err.response.config.url}`
     * 408: '请求超时'
     * 500: '服务器内部错误'
     * 501: '服务未实现'
     * 502: '网关错误'
     * 503: '服务不可用'
     * 504: '网关超时'
     * 505: 'HTTP版本不受支持'
     */
    if (error && error.response) {
      if (error.response.status === 401) {
        jumpRoute()
      } else if (error.response.status === 408 || error.response.status === 504) {
        Message.error('网络异常，请检查您的网络！')
      } else {
        Message.error('服务维护中，请稍后再试')
      }
    }
    return Promise.reject(error.response)
  }
)

export default service
