import request from '@/util/request'
// 更新页面权限
export function authorityPageUpdate(data) {
  return request({
    url: '/api/authorityPage/update',
    method: 'post',
    data
  })
}
// 删除页面权限
export function authorityPageDelete(data) {
  return request({
    url: '/api/authorityPage/delete',
    method: 'post',
    data
  })
}
// 更新组件权限
export function authorityFormFieldUpdate(data) {
  return request({
    url: '/api/authorityFormField/update',
    method: 'post',
    data
  })
}
// 删除组件权限
export function authorityFormFieldDelete(data) {
  return request({
    url: '/api/authorityFormField/delete',
    method: 'post',
    data
  })
}
