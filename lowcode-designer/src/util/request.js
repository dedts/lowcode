import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { getAppId, getToken, getPlatform, getCompanyId } from '@/util/auth.js'
import { BIO } from './bio'
const request = axios.create({
  baseURL: process.env.VUE_APP_GLOBAL_API,
  withCredentials: false
})

request.interceptors.request.use(
  config => {
    config.headers['x-sangon-token'] = getToken()
    const arr = window.location.hash.split('/')
    if (arr.length > 0) {
      config.headers['x-sangon-app'] = BIO.s62to10(arr[1])
    }
    if (window.location.href.indexOf('/design') > 0) {
      config.headers['x-sangon-platform'] = 'editor'
    } else {
      config.headers['x-sangon-platform'] = 'application'
    }
    return config
  },
  error => {
    return Promise.reject(new Error(error).message)
  }
)

request.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      return Promise.reject('error')
    } else {
      if (response.data.code !== 200) {
        if (response.data.code === 401) {
          window.location.href = process.env.VUE_APP_COMPANY_API + 'login/index?redirect=' + encodeURIComponent(window.location.href)
          return Promise.reject('重新登录')
        } else {
          if (response.data.message) {
            Message.error(response.data.message)
          } else {
            Message.error('网络出错')
          }
          return Promise.reject('error')
        }
      }
      return response.data
    }
  },
  error => {
    return Promise.reject(new Error(error).message)
  }
)

export default request
