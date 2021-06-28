import { getInfo, menu } from '@/api/login'
import { getToken, setCompanyId } from '@/util/auth'
import Add from '@/views/GeneratorTemplate/add'
import Index from '@/views/GeneratorTemplate/index'
import Layout from '@/views/GeneratorLayout/Layout'
import { BIO } from '@/util/bio.js'
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
          if (menu.length > 0) {
            const i = 0
            const appId = BIO.tenTo62(data.appId)
            // 页面类型   1详情页(普通页面） 2汇总页面 3超链
            menu.filter(i => i.parentTemplateDataId === '0').sort((a, b) => a.parentTemplateSort - b.parentTemplateSort).forEach(p => {
              const children = []
              let redirect = ''
              // 页面类型   1新增页 2列表页 3超链
              // 过滤出列表页面
              const childrenListDataArray = menu.filter(i => i.parentTemplateDataId === p.templateDataId && i.pageType == 2)
              // 过滤出详情页面
              const childrenAddDataArray = menu.filter(i => i.parentTemplateDataId === p.templateDataId && i.pageType == 1)
              if (childrenAddDataArray.length > 0) {
                const childrenAddData = childrenAddDataArray[0]
                if (redirect === '') {
                  redirect = '/' + appId + '/form/' + childrenAddData.templateDataId
                }
                // 构建详情页
                const childrenIAdd = {
                  path: 'form/' + childrenAddData.templateDataId,
                  name: childrenAddData.templateDataId,
                  component: Add,
                  meta: {
                    title: childrenAddData.pageTemplateName,
                    icon: 'userMenu'
                  }
                }
                children.push(childrenIAdd)
              }

              if (childrenListDataArray.length > 0) {
                const childrenListData = childrenListDataArray[0]
                redirect = '/' + appId + '/report/' + p.templateDataId
                // 构建列表页
                const childrenIndex = {
                  path: 'report/' + childrenListData.templateDataId,
                  name: childrenListData.templateDataId,
                  component: Index,
                  meta: {
                    title: childrenListData.pageTemplateName,
                    icon: 'userMenu'
                  }
                }
                children.push(childrenIndex)
              }
              const pRouter = {
                path: '/' + appId + '/app',
                component: Layout,
                name: p.templateDataId,
                redirect: redirect,
                meta: {
                  title: p.pageTemplateName,
                  icon: p.pageTemplateIcon !== undefined ? p.pageTemplateIcon : 'iconmenu_folder',
                  breadcrumb: true
                },
                children: children
              }
              parentRouter.push(pRouter)
            })
          }
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
            // commit('SET_FORM', root)
          } catch (e) {
            console.err(e)
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // menu
    // 获取用户信息
    Menu({ commit, state }) {
      return new Promise((resolve, reject) => {
        const token = getToken()
        const parentRouter = []
        menu(token).then(response => {
          const menu = response.body
          if (menu.length > 0) {
            const i = 0
            // 页面类型   1详情页(普通页面） 2汇总页面 3超链
            menu.filter(i => i.parentTemplateDataId === '0').forEach(p => {
              const children = []
              let redirect = ''
              // 页面类型   1新增页 2列表页 3超链
              const childrenListDataArray = menu.filter(i => i.parentTemplateDataId === p.templateDataId && i.pageType == 2)
              if (childrenListDataArray.length > 0) {
                const childrenListData = childrenListDataArray[0]
                redirect = '/report/' + p.templateDataId
                // 构建列表页
                const childrenIndex = {
                  path: 'report/' + childrenListData.templateDataId,
                  name: childrenListData.templateDataId,
                  component: Index,
                  meta: {
                    title: formatName(childrenListData.pageTemplateName),
                    icon: 'userMenu'
                  }
                }
                children.push(childrenIndex)
              }

              const childrenAddDataArray = menu.filter(i => i.parentTemplateDataId === p.templateDataId && i.pageType == 1)
              if (childrenAddDataArray.length > 0) {
                const childrenAddData = childrenAddDataArray[0]
                if (redirect === '') {
                  redirect = '/form/' + childrenAddData.templateDataId
                }
                // 构建列表页
                const childrenIAdd = {
                  path: 'form/' + childrenAddData.templateDataId,
                  name: childrenAddData.templateDataId,
                  component: Add,
                  meta: {
                    title: formatName(childrenAddData.pageTemplateName),
                    icon: 'userMenu'
                  }
                }
                children.push(childrenIAdd)
              }
              const pRouter = {
                path: '/app',
                component: Layout,
                name: p.templateDataId,
                redirect: redirect,
                meta: {
                  title: formatName(p.pageTemplateName),
                  icon: 'user',
                  breadcrumb: true
                },
                children: children
              }
              parentRouter.push(pRouter)
            })
          }
          commit('SET_PAGE', menu)
          commit('SET_MENU', parentRouter)
          resolve('success')
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
function formatName(name) {
  return name.length > 1 ? name.substring(0, 1) + '...' : name
}

export default user
