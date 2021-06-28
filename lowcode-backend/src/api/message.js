import request from '@/utils/request'

// 查询消息列表
export function messageMy() {
  return request({
    url: '/message/my',
    method: 'get'
  })
}
// 获取未读消息的数量
export function messageUnread() {
  return request({
    url: '/message/unRead',
    method: 'get'
  })
}

// 全度阅读站内信
export function messageReadAll() {
  return request({
    url: '/message/readAll',
    method: 'get'
  })
}

// 阅读站内信
export function messageRead(data) {
  return request({
    url: '/message/read',
    method: 'post',
    data
  })
}

