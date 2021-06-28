// 插入变量所涉及方法
// 发送邮件 站内信 公用
import { formPageGetFields, formPageFixedFields } from '../../../api/builder'
export const insterJs = {
  data() {
    return {
      isEdit: false,
      formList: {
        code: [
          {
            label: '管理员用户的邮箱地址',
            value: '${lowcode.adminEmail}',
            id: 'lowcode.adminEmail'
          },
          {
            label: '登陆用户的邮箱地址',
            value: '${lowcode.loginEmail}',
            id: 'lowcode.loginEmail'
          }
        ],
        sys: [],
        form: []
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.formList.form = await this.getFields()
      this.formList.sys = await this.getFixedFields()
      if (Object.keys(this.editData).length) {
        this.isEdit = true
        // console.log(this.editData)
        // console.log(this.formData)
        // debugger
        this.formData = { ...this.formData, ...JSON.parse(JSON.stringify(this.editData)).actionParameter }
        // 把id换成对应的字段名
        const arr = [...this.formList.form, ...this.formList.sys, ...this.formList.code]
        // debugger
        arr.forEach(item => {
          if (this.formData.content) {
            const index = this.formData.content.indexOf('${' + item.id + '}')
            if (index !== -1) {
              this.formData.content = this.formData.content.replace('${' + item.id + '}', item.value)
            }
          }
        })
      }
    },
    // 获取表单字段
    async getFields() {
      const templateDataId = JSON.parse(localStorage.getItem('params')).formId
      if (this.flowType === 2) return [] // 定时任务 不需要以下操作
      const res = await formPageGetFields({ templateDataId })
      const body = res.body.filter(f=>!f.sysAdd)
      const arr = []
      if (body && body.length) {
        body.forEach(item => {
          // label 是下拉框中展示的数据
          // value 是选择后 富文本中展示的数据格式 可拼接 但必须是唯一值 不可重复
          // id  是提交给后台的数据格式 根据后台规定定义
          arr.push({
            label: `${item.name}`,
            value: '${' + item.linkName + '}',
            id: 'field_' + item.dataKey
          })
        })
      }
      return arr
    },
    // 获取系统字段
    async getFixedFields() {
      if (this.flowType === 2) return [] // 定时任务 不需要以下操作
      const res = await formPageFixedFields()
      const arr = []
      if (res.body && res.body.length) {
        res.body.forEach(item => {
          // label 是下拉框中展示的数据
          // value 是选择后 富文本中展示的数据格式 可拼接 但必须是唯一值 不可重复
          // id  是提交给后台的数据格式 根据后台规定定义
          arr.push({
            label: `${item.name}`,
            value: '${' + item.dataKey + '}',
            id: item.dataKey
          })
        })
      }
      return arr
    },
    txtChange() {
      const arr = [...this.formList.form, ...this.formList.sys, ...this.formList.code]
      this.content = this.formData.content
      let a = [] // 内容中一对{}中间的值
      let b = [] // a 数组中每个值 加${}
      if (this.formData.content) {
        a = this.formData.content.split('${')
        a.forEach((item, index) => {
          if (item.indexOf('}') === -1) {
            a[index] = ''
          }
        })
        a = a.filter(f => f !== '')
      }
      if (a.length) {
        b = a.map(item => item.split('}')[0])
        b = b.map(m => '${' + m + '}')
        // 将字段 改为id  作为上传数据
        arr.forEach(item => {
          b.forEach(bItem => {
            if (bItem === item.value) {
              this.content = this.content.replace(bItem, '${' + item.id + '}')
            }
          })
        })
      }
      const actionParameter = JSON.parse(JSON.stringify(this.formData))
      if (actionParameter.receiver) {
        actionParameter.receiver = actionParameter.receiver.join(',')
      }
      if (actionParameter.phoneTo) {
        actionParameter.phoneTo = actionParameter.phoneTo.join(',')
      }
      if (actionParameter.target) {
        actionParameter.target = actionParameter.target.join(',')
      }
      actionParameter.content = this.content
      return JSON.stringify(actionParameter)
    }
  }
}
