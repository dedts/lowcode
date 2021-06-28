import request from '@/util/request'
// 获取用户列表
export function userSearchList(data) {
  return request({
    url: '/api/user/searchList',
    method: 'post',
    data
  })
}
// 获取部门
export function searchDepartments(data) {
  return request({
    url: '/api/department/searchDepartments?companyId=' + data.companyId,
    method: 'get'
  })
}
// 根据userId或部门id查询人员信息
export function searchMemberByDepartment(data) {
  return request({
    url: '/api/user/search/byDepartment',
    method: 'post',
    data
  })
}
