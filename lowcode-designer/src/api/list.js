import request from '@/util/request'
// 获取页面详情
export function formPageGetDetail(templateDataId) {
  return request({
    url: `/formPage/fieldsDetail/${templateDataId}`,
    method: 'get'
  })
}
// 设置取消表头
export function formPageSetListHead(data) {
  return request({
    url: `/formPage/setListHead`,
    method: 'post',
    data

  })
}

// 设置取消预览
export function formPageSetPreview(data) {
  return request({
    url: `/formPage/setPreview`,
    method: 'post',
    data

  })
}
// 添加操作项
export function addOperation(data) {
  return request({
    url: '/formField/addOperation',
    method: 'post',
    data
  })
}
// 更新操作项
export function updateOperation(data) {
  return request({
    url: '/formField/updateOperation',
    method: 'post',
    data
  })
}
// 删除操作项
export function deleteOperation(dataKey) {
  return request({
    url: `/formField/deleteOperation?dataKey=${dataKey}`,
    method: 'get'
  })
}
// 获取操作项列表
export function getOperations(templateDataId) {
  return request({
    url: `/formField/getOperations?templateDataId=${templateDataId}`,
    method: 'get'
  })
}
// 添加操作资源项
export function addOperationResource(data) {
  return request({
    url: `/resource/addOperationConfig`,
    method: 'post',
    data
  })
}
//  编辑操作资源项
export function editOperationConfig(data) {
  return request({
    url: `/resource/editOperationConfig`,
    method: 'post',
    data
  })
}
// 操作资源项列表
export function queryOperationConfig(data) {
  return request({
    url: `/resource/queryOperationConfig`,
    method: 'post',
    data
  })
}
