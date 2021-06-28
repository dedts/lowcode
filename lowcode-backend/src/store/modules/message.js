import { messageMy, messageUnread } from '../../api/message'
import { getToken } from '@/utils/auth'
const message = {
  state: {
    messageList: [],
    unread: 0
  },
  mutations: {
    SET_MESSAGELIST: (state, messageList) => {
      state.messageList = messageList
    },
    SET_UNREAD: (state, unread) => {
      state.unread = unread
    }
  },

  actions: {
    // 获取消息列表
    getMessageLists({ commit }) {
      return new Promise((resolve, reject) => {
        if (getToken()) {
          messageMy().then(response => {
            response.body.forEach(item => {
              if (item.type === 'app') {
                item.bgc = item.icon.split(':')[0]
                item.tip = item.icon.split(':')[1]
              }
            })
            commit('SET_MESSAGELIST', response.body)
            resolve()
          }).catch(error => {
            reject(error)
          })
        } else {
          commit('SET_MESSAGELIST', [])
          resolve()
        }
      })
    },
    getUnreadNum({ commit }) {
      // 若用户未登录不用请求，会产生死循环
      return new Promise((resolve, reject) => {
        if (getToken()) {
          messageUnread().then(response => {
            commit('SET_UNREAD', response.body)
            resolve()
          }).catch(error => {
            reject(error)
          })
        } else {
          commit('SET_UNREAD', 0)
          resolve()
        }
      })
    }
  }
}

export default message
