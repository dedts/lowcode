import request from '@/util/request'

/*
*
* 设置 - 应用信息
*
* */
// 应用查询，应用统计信息
export function appInfo(data) {
  return request({
    url: '/app/info/' + data,
    method: 'get'
  })
}

// 应用编辑
export function appEdit(data) {
  return request({
    url: '/app/edit',
    method: 'post',
    data
  })
}

// 编辑角色
export function roleUpdate(data) {
  return request({
    url: '/api/role/update',
    method: 'post',
    data
  })
}

// 角色详情
export function findRoleInfo(data) {
  return request({
    url: '/api/role/findRole/info?roleId=' + data,
    method: 'get'
  })
}

// 查询部门以及用户
export function userAndDepartment(data) {
  return request({
    url: '/api/user/userAndDepartment',
    method: 'post',
    data
  })
}

// 批量更新角色权限
export function updateAuth(data) {
  return request({
    url: '/api/role/update/auth',
    method: 'post',
    data
  })
}
// 查询页面权限
export function authPageSearch(data) {
  return request({
    url: '/formPage/authPage/search',
    method: 'post',
    data
  })
}
// 查询表单权限
export function authFormSearch(data) {
  return request({
    url: '/formPage/authForm/search',
    method: 'post',
    data
  })
}

/*
*
* 设置 - 角色权限
*
* */
// 查询角色
export function roleSearch(data) {
  return request({
    url: '/api/role/search',
    method: 'post',
    data
  })
}
// 查询角色最新
export function roleSimpleSearch(data) {
  return request({
    url: '/api/role/simple/search',
    method: 'post',
    data
  })
}
// 添加角色
export function roleAdd(data) {
  return request({
    url: '/api/role/add',
    method: 'post',
    data
  })
}
// 删除角色
export function roleRemove(data) {
  return request({
    url: '/api/role/delete',
    method: 'post',
    data
  })
}
// 未分配列表
export function noRole(data) {
  return request({
    url: '/api/role/noRole',
    method: 'post',
    data
  })
}
