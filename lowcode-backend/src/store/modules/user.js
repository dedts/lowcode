import { login, getInfo, register } from '@/api/login'
import { getToken, setToken, removeToken, setUserId, setCompanyId } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userId: '',
    activeCompanyId: '',
    ow: '',
    lumbarAdmin: '',
    code: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ID: (state, id) => {
      state.userId = id
    },
    SET_COMPANYID: (state, companyId) => {
      state.activeCompanyId = companyId
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const mobile = userInfo.mobile.trim()
      return new Promise((resolve, reject) => {
        // debugger
        login(mobile, userInfo.password).then(response => {
          // console.log(response)
          if (response) {
            const data = response.body
            setToken(data.token)
            setUserId(data.userId)
            setCompanyId(data.companyId)
            commit('SET_TOKEN', data.token)
            commit('SET_ID', data.userId)
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.headPortrait)
            commit('SET_COMPANYID', data.companyId)
            resolve(data.companyId)
          }
        }).catch(error => {
          console.log(error)
        })
      })
    },
    // 注册
    register({ commit }, data) {
      return new Promise((resolve, reject) => {
        register(data).then(response => {
          // console.log(response)
          if (response) {
            const data = response.body
            setToken(data.token)
            setUserId(data.userId)
            commit('SET_NAME', data.name)
            commit('SET_TOKEN', data.token)
            commit('SET_ID', data.userId)
            resolve(data)
          }
        }).catch(error => {
          console.log(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          if (response.code === 200) {
            const data = response.body
            setCompanyId(data.lastCompanyId)
            commit('SET_COMPANYID', data.lastCompanyId)
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.headPortrait)
            commit('SET_ID', data.id)
            resolve(data)
          } else {
            removeToken()
            reject(response)
          }
        }).catch(error => {
          removeToken()
          reject(error)
        })
      })
    },

    // 登出
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout().then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
