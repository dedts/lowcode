import { getInfo } from '@/api/login'
import { getToken, setCompanyId } from '@/util/auth'
const user = {
  state: {
    state: {
      token: getToken(),
      name: '',
      avatar: '',
      roles: [],
      userId: '',
      activeCompanyId: '',
      menu: [],
      page: [],
      appStatus: 0,
      roleList: []
    }
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
    SET_MENU: (state, menu) => {
      state.menu = menu
    },
    SET_PAGE: (state, menu) => {
      state.page = menu
    },
    SET_APP_STATUS: (state, appStatus) => {
      state.appStatus = appStatus
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles || []
    },
    SET_ID: (state, id) => {
      state.userId = id
    },
    SET_COMPANYID: (state, companyId) => {
      state.activeCompanyId = companyId
    },
    SET_ROLELIST: (state, roleList) => {
      state.roleList = roleList
    }
  },
  actions: {
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const token = getToken()
        const parentRouter = []
        getInfo(token).then(response => {
          const data = response.body
          setCompanyId(data.lastCompanyId)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.headPortrait)
          commit('SET_ID', data.id)
          commit('SET_COMPANYID', data.companyId)
          commit('SET_ROLELIST', data.roleList)
          commit('SET_APP_STATUS', data.appStatus)
          const menu = data.menu
          commit('SET_PAGE', menu)
          commit('SET_MENU', parentRouter)
          try {
            const root = menu.filter(item => item.parentTemplateDataId === '0').map(item => {
              const child = menu.filter(i => i.parentTemplateDataId === item.templateDataId).map(i => {
                return {
                  pageTemplateId: i.templateDataId,
                  pageTemplateName: i.pageTemplateName,
                  pageType: i.pageType
                }
              })
              return {
                pageTemplateId: item.templateDataId,
                pageTemplateName: item.pageTemplateName,
                child: child
              }
            })
            commit('SET_FORM', root)
          } catch (e) {
            console.err(e)
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default user
