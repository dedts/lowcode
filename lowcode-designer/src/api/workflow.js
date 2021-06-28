import request from '@/util/request'
// 工作流列表
export function workflowList(data) {
  return request({
    url: '/workflow/groupList',
    method: 'post',
    data
  })
}
// 工作流操作列表
export function ruleList(data) {
  return request({
    url: '/rule/list',
    method: 'post',
    data
  })
}
// 操作项列表
export function executionList() {
  return request({
    url: '/execution/list',
    method: 'post'
  })
}
// 操作删除
export function ruleActionDelete(ruleActionId) {
  return request({
    url: `/ruleAction/delete/${ruleActionId}`,
    method: 'post'
  })
}
// 操作添加
export function ruleActionAdd(data) {
  return request({
    url: '/ruleAction/add',
    method: 'post',
    data
  })
}
// 添加新的操作
export function ruleSaveAction(data) {
  return request({
    url: '/rule/saveAction',
    method: 'post',
    data
  })
}
// 添加工作流
export function workflowAdd(data) {
  return request({
    url: '/workflow/add',
    method: 'post',
    data
  })
}
// 修改工作流
export function workflowUpdate(data) {
  return request({
    url: '/workflow/update',
    method: 'post',
    data
  })
}
// 禁用启用工作流
export function workflowDisable(data) {
  return request({
    url: '/workflow/disable/' + data,
    method: 'post'
  })
}
// 删除工作流
export function workflowDelete(flowId) {
  return request({
    url: `/workflow/delete/${flowId}`,
    method: 'get'
  })
}
// 编辑操作项
export function ruleActionEdit(data) {
  return request({
    url: '/ruleAction/edit',
    method: 'post',
    data
  })
}
//

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
//  添加操作条件
export function ruleConditionSave(data) {
  return request({
    url: '/ruleCondition/save',
    method: 'post',
    data
  })
}
//  添加操作条件
export function ruleConditionUpdate(data) {
  return request({
    url: '/ruleCondition/update',
    method: 'post',
    data
  })
}

//  添加操作条件
export function ruleConditionDelete(conditionId) {
  return request({
    url: '/ruleCondition/delete/' + conditionId,
    method: 'get'
  })
}

// 过滤器内可操作字段
export function getMatchFields(data) {
  return request({
    url: '/formField/getMatchFields',
    method: 'post',
    data
  })
}
