import request from '@/util/request'

/**
 * 提交表单数据
 * @param data
 */
// 生成器 新增提交
export function formPageDataSubmit(data) {
  return request({
    url: `/formData/dataAdd`,
    method: 'post',
    data
  })
}

// 生成器 查询数据接口
export function formDataDataQuery(data) {
  return request({
    url: `/formData/dataQuery`,
    method: 'post',
    data
  })
}
// 获取组件详细信息
export function getOptions(data) {
  return request({
    url: `/formField/getOptions`,
    method: 'post',
    data
  })
}
// 生成器 删除数据接口
export function formDataDelete(data) {
  return request({
    url: `formData/dataDelete`,
    method: 'post',
    data
  })
}
// 生成器 编辑数据接口
export function formDataUpdate(data) {
  return request({
    url: `/formData/dataUpdate`,
    method: 'post',
    data
  })
}
// 生成器 复制数据接口
export function formDataCopy(data) {
  return request({
    url: `/formData/dataCopy`,
    method: 'post',
    data
  })
}

// 获取操作项列表
export function getOperations(templateDataId) {
  return request({
    url: `/formField/getOperations?templateDataId=${templateDataId}`,
    method: 'get'
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
//  自定义操作项触发工作流
export function customizeTrigger(data) {
  return request({
    url: `/formData/customizeTrigger?dataKey=${data.dataKey}&mongoDataId=${data.mongoDataId}`,
    method: 'get',
    data
  })
}
