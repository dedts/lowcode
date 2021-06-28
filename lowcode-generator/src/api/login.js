import request from '@/util/request'

/**
 * 通过token获取用户信息
 * @param token
 */
export function getInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}
/**
 * 通过token获取用户信息
 * @param token
 */
export function menu() {
  return request({
    url: '/api/user/menu',
    method: 'get'
  })
}

