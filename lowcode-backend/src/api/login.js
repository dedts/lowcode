import request from '@/utils/request'
// 登录
export function login(mobile, password) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data: {
      mobile,
      password
    }
  })
}
// 注册
export function register(data) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data
  })
}
// 发送短信验证码
export function sendMessage(data) {
  return request({
    url: '/api/user/sendMessage' + `?mobile=${data.mobile}&sendType=${data.sendType}`,
    method: 'get'
  })
}
// 发送短信验证验证码
export function checkMessageCode(data) {
  return request({
    url: '/api/user/checkMessageCode' + `?mobile=${data.mobile}&sendType=${data.sendType}&verifyCode=${data.verifyCode}`,
    method: 'get'
  })
}
// 修改密码
export function updatePassword(data) {
  return request({
    url: '/api/user/updatePassword',
    method: 'post',
    data
  })
}

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
 * 用户登出
 * @param token
 */
export function logout() {
  const data = {}
  return request({
    url: '/user/logout',
    method: 'post',
    data
  })
}

/**
 * 日志
 * @param token
 */
// export function logs(data) {
//   return request({
//     url: '/user/operation/logs',
//     method: 'post',
//     data
//   })
// }
