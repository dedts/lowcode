import Cookies from 'js-cookie'
import router from '@/router/index'
import { BIO } from './bio'
import user from '@/store/modules/user'

const TokenKey = 'x-sangon-token'
const CompanyId = 'x-sangon-company-id'
const User = 'x-sangon-user-id'
const AppId = 'x-sangon-app'
const platform = 'x-sangon-platform'
export function getPlatform() {
  return Cookies.get(platform)
}

export function setPlatform(token) {
  return Cookies.set(platform, token)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserId(user) {
  return Cookies.set(User, user)
}

export function getUserId() {
  return Cookies.get(User)
}

export function setCompanyId(id) {
  return Cookies.set(CompanyId, id)
}

export function getCompanyId() {
  return user.state.activeCompanyId
}
export function setAppId(id) {
  return Cookies.set(AppId, id)
}

export function getAppId() {
  return BIO.s62to10(router.history.current.params.appId)
}

