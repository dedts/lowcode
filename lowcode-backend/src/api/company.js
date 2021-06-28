import request from '@/utils/request'
// 解散公司
export function companyDismiss(data) {
  return request({
    url: '/company/dismiss',
    method: 'post',
    data
  })
}

// 更新公司
export function companyUpdate(data) {
  return request({
    url: '/company/update',
    method: 'post',
    data
  })
}
// 切换公司
export function companyChange(data) {
  return request({
    url: '/company/change/' + data.companyId,
    method: 'get'
  })
}
// 创建公司
export function companyCreate(data) {
  return request({
    url: '/company/create',
    method: 'post',
    data
  })
}

// 公司列表
export function companyList(data) {
  let url = '/company/my'
  if (data) {
    url = '/company/my?companyId=' + data.companyId
  }
  return request({
    url: url,
    method: 'get'
  })
}
// 删除部门
export function departmentDelete(data) {
  return request({
    url: '/api/department/delete?id=' + data.id + '&companyId=' + data.companyId,
    method: 'get'
  })
}
// 查询公司下的部门
export function searchDepartments(data) {
  return request({
    url: '/api/department/searchDepartments?companyId=' + data.companyId,
    method: 'get'
  })
}
// 添加部门
export function departmentAdd(data) {
  return request({
    url: '/api/department/add',
    method: 'post',
    data
  })
}
// 编辑部门
export function departmentUpdate(data) {
  return request({
    url: '/api/department/update',
    method: 'post',
    data
  })
}
//
// // 应用已发布列表
// export function selectAplictionList(data) {
//   return request({
//     url: '/app/selectList',
//     method: 'post',
//     data
//   })
// }
// 应用列表
export function aplictionList(data) {
  let url = '/app/list/' + data.companyId
  if (data.userId) {
    url = '/app/list/' + data.companyId + '/' + data.userId
  }
  return request({
    url: url,
    method: 'get'
  })
}
// 应用列表删除
export function aplictionDelete(data) {
  return request({
    url: '/app/del',
    method: 'post',
    data
  })
}
// 应用新增
export function aplictionAdd(data) {
  return request({
    url: '/app/add',
    method: 'post',
    data
  })
}
// 应用编辑
export function aplictionEdit(data) {
  return request({
    url: '/app/edit',
    method: 'post',
    data
  })
}
