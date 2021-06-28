const components = {
  state: {
    // 关联组件，关联表单关联的表单的一级菜单id
    currentFormId: '',
    // 关联组件，关联表单关联的表单的详情页的字段
    currentFields: [],
    // 当前应用的所有的form，树形结构
    form: []
  },
  mutations: {
    SET_CURRENT_FORM_ID: (state, formId) => {
      state.currentFormId = formId
    },
    SET_CURRENT_FIELDS: (state, field) => {
      state.currentFields = field
    },
    SET_FORM: (state, form) => {
      state.form = form
    }
  }
}

export default components
