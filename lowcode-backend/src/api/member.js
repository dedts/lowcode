import request from '@/utils/request'

// 查询成员详细信息
export function findUserInfo(data) {
  return request({
    url: '/api/user/findUserInfo',
    method: 'post',
    data
  })
}
// 查看邀请信息
export function findInvitation(data) {
  let url = ''
  if (data.invitationId && data.userId) {
    url = '/api/user/findInvitation?invitationId=' + data.invitationId + '&userId=' + data.userId
  }
  if (data.mobile) {
    url = '/api/user/findInvitation?mobile=' + data.mobile
  }
  return request({
    url: url,
    method: 'get'
  })
}
// 邀请信息操作
export function updateInvitation(data) {
  return request({
    url: '/api/user/updateInvitation',
    method: 'post',
    data
  })
}
// 添加成员
export function addUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}
// 编辑成员
export function userUpdate(data) {
  return request({
    url: '/api/user/update',
    method: 'post',
    data
  })
}
// 批量删除成员
export function batchDelete(data) {
  return request({
    url: '/api/user/batchDelete',
    method: 'post',
    data
  })
}
// 批量更新应用
export function batchAppUser(data) {
  return request({
    url: '/app/batchAppUser',
    method: 'post',
    data
  })
}
// 批量移动至部门
export function departmentUpdateUser(data) {
  return request({
    url: '/api/department/updateUser',
    method: 'post',
    data
  })
}
// 设置管理、删除成员
export function setAdminAndDelete(data) {
  return request({
    url: '/api/user/setAdminAndDelete',
    method: 'post',
    data
  })
}
// 通过部门查询公司下的员工
export function searchUserList(data) {
  return request({
    url: '/api/user/searchList',
    method: 'post',
    data
  })
}

// 发送短信前验证手机号
export function checkMobile(data) {
  return request({
    url: '/api/user/checkMobile?checkType=' + data.checkType + '&mobile=' + data.mobile,
    method: 'get',
    data
  })
}
