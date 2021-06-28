import request from '@/util/request'

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

// 获取页面组件列表(最新版)
export function formFieldList(templateDataId) {
  return request({
    url: `/formField/list?templateDataId=${templateDataId}`,
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
// 自编号当前值获取
export function getPrefix(dataKey) {
  return request({
    url: `/formData/getPrefix?dataKey=${dataKey}`,
    method: 'get'
  })
}
