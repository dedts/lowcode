import Cookies from 'js-cookie'
import router from '@/router/index.js'
import { BIO } from './bio'

const TokenKey = 'x-sangon-token'
const CompanyId = 'x-sangon-company-id'
const User = 'x-sangon-user-id'
const AppId = 'x-sangon-app'
const platform = 'x-sangon-platform'
const domain = process.env.NODE_ENV === 'production' ? 'sangon.net' : 'localhost'
export function getPlatform() {
  return Cookies.get(platform)
}

export function setPlatform(token) {
  return Cookies.set(platform, token, { domain: domain })
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log(token)
  console.log(domain)
  return Cookies.set(TokenKey, token, { domain: domain })
}

export function removeToken() {
  return Cookies.remove(TokenKey, { domain: domain })
}

export function setUserId(user) {
  return Cookies.set(User, user, { domain: domain })
}

export function getUserId() {
  return Cookies.get(User)
}
export function removeUserId() {
  return Cookies.remove(User, { domain: domain })
}
export function setCompanyId(id) {
  return Cookies.set(CompanyId, id, { domain: domain })
}

export function getCompanyId() {
  const companyId = router.history.current.params.companyId
  return BIO.s62to10(companyId)
  // return Cookies.get(CompanyId)
}

export function removeCompanyId() {
  return Cookies.remove(CompanyId, { domain: domain })
}
export function setAppId(id) {
  return Cookies.set(AppId, id, { domain: domain })
}

export function getAppId() {
  return Cookies.get(AppId)
}
export function removeAppId() {
  return Cookies.remove(AppId, { domain: domain })
}

