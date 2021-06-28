import request from '@/util/request'
// 新建菜单/表单
export function menuAdd(data) {
  return request({
    url: '/menu/add',
    method: 'post',
    data
  })
}
// 菜单列表
export function formPageList(data) {
  return request({
    url: '/formPage/list',
    method: 'post',
    data
  })
}
// 菜单列表最新
export function getAllMenu() {
  return request({
    url: '/menu/allList',
    method: 'get'
  })
}
// 获取表单字段列表
export function formPageGetFields(data) {
  let url = `/formPage/getFields?templateDataId=${data.templateDataId}`
  if (data.needHead) {
    url += `&needHead=${data.needHead}`
  }
  if (data.needPreview) {
    url += `&needPreview=${data.needPreview}`
  }

  return request({
    url: url,
    method: 'get'
  })
}
// 获取系统字段
export function formPageFixedFields() {
  return request({
    url: '/formPage/fixedFields',
    method: 'get'
  })
}
// 页面基本属性修改
export function formPageUpdate(data) {
  return request({
    url: '/formPage/update',
    method: 'post',
    data
  })
}
// 页面基本属性添加
export function formPageAdd(data) {
  return request({
    url: '/formPage/add',
    method: 'post',
    data
  })
}
// 查询角色
export function roleSearch(data) {
  return request({
    url: '/api/role/search',
    method: 'post',
    data
  })
}// 查询角色最新
export function roleSimpleSearch(data) {
  return request({
    url: '/api/role/simple/search',
    method: 'post',
    data
  })
}
// 页面组件编辑
export function formPageFieldsAdd(data) {
  return request({
    url: '/formPage/fieldsAdd',
    method: 'post',
    data
  })
}
// 单组件添加更新接口最新
export function formFieldAdd(data) {
  return request({
    url: '/formField/add',
    method: 'post',
    data
  })
}
// 页面组件列表接口
export function formPageFieldsDetail(pageTemplateId) {
  return request({
    url: `/formPage/fieldsDetail/${pageTemplateId}`,
    method: 'get'
  })
}
// 获取页面组件列表(最新版)
export function formFieldList(templateDataId) {
  return request({
    url: `/formField/list?templateDataId=${templateDataId}`,
    method: 'get'
  })
}
// 删除组件
export function formFieldDelete(dataKey) {
  return request({
    url: `/formField/delete?dataKey=${dataKey}`,
    method: 'get'
  })
}
// 组件属性更新
export function updateOptions(data) {
  return request({
    url: '/formField/updateOptions',
    method: 'post',
    data
  })
}
// 移动组件
export function formFieldMove(data) {
  return request({
    url: '/formField/move',
    method: 'post',
    data
  })
}
// 互换组件
export function formFieldExchange(data) {
  return request({
    url: `/formField/exchange?dataKey=${data.dataKey}&exchangeDataKey=${data.exchangeDataKey}`,
    method: 'get',
    data
  })
}
// 版本提交
export function formPagePublish(appId) {
  return request({
    url: `/formPage/publish/${appId}`,
    method: 'get'
  })
}
// 版本提交
export function aliyunsts(appId) {
  return request({
    url: '/aliyun/sts',
    method: 'get'
  })
}
// 指定字段的数据获取
// https://wiki2.huberbuy.com/pages/viewpage.action?pageId=4358509
export function getAppointData(data) {
  return request({
    url: '/formData/getAppointData',
    method: 'post',
    data
  })
}
// 移动菜单
export function menuMove(data) {
  return request({
    url: '/menu/move',
    method: 'post',
    data
  })
}
//  互换菜单
export function menuExchange(data) {
  return request({
    url: `/menu/exchange?templateDataId=${data.templateDataId}&exchangeTemplateDataId=${data.exchangeTemplateDataId}`,
    method: 'get',
    data
  })
}
