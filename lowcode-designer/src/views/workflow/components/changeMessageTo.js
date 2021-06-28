// 发送短信 发送邮件 和 站内信  公用 切换收信人
import { userSearchList, searchDepartments } from '../../../api/workflow'
import { getCompanyId } from '../../../util/auth'
export const CommomJs = {
  data() {
    return {
      loading: false,
      options: [],
      department: [],
      sysString: [
        {
          label: '管理员',
          value: '${adminId}'
        },
        {
          label: '创建者',
          value: '${creator}'
        },
        {
          label: '修改者',
          value: '${lastEditor}'
        }
      ],
      emailSys: [
        {
          label: '管理员用户的邮箱地址',
          value: '${lowcode.adminEmail}'
        },
        {
          label: '登陆用户的邮箱地址',
          value: '${lowcode.loginEmail}'
        }
      ],
      userTotal: 0,
      userSearch: {
        page: 1,
        size: 10,
        companyId: getCompanyId(),
        allData: true,
        userIds: [],
        likeName: ''
      },
      flowType: JSON.parse(localStorage.getItem('params')).flowType

    }
  },
  async mounted() {
    if (Object.keys(this.editData).length) {
      this.isEdit = true
      this.formData = this.editData.actionParameter
      let from = ''
      if (this.formData.receiver) {
        this.formData.receiver = this.formData.receiver.split(',')
        from = 'email'
      }
      if (this.formData.phoneTo) {
        this.formData.phoneTo = this.formData.phoneTo.split(',')
      }
      if (this.formData.target) {
        this.formData.target = this.formData.target.split(',')
      }
      if (this.formData.base === 'department') {
        await this.getDepartment()
        this.baseChange(this.formData.base, 1)
      } else if (this.formData.base === 'user') {
        this.userSearch.userIds = this.formData.target
        const { records } = await this.getUser(1)
        this.options = records
      } else if (this.formData.base === 'system') {
        this.baseChange(this.formData.base, 1,from)
      }
    }
  },
  methods: {
    // 切换用户分类
    baseChange(val, type, from) {
      // from 'email' 邮箱页面调用
      // type 1 初始化
      if (!type) {
        if (this.formData.target) {
          this.formData.target = []
        }
        if (this.formData.phoneTo) {
          this.formData.phoneTo = []
        }
        if (this.formData.receiver) {
          this.formData.receiver = []
        }
      }
      // debugger
      this.options = []
      if (val === 'department') {
        this.options = this.department
      } else if (val === 'system') {
        if (from === 'email') {
          if (this.flowType === 2) {
            this.options = [{
              label: '管理员用户的邮箱地址',
              value: '${lowcode.adminEmail}'
            }]
          } else {
            this.options = this.emailSys
          }
        } else {
          if (this.flowType === 2) {
            this.options = [{
              label: '管理员',
              value: '${adminId}'
            }]
          } else {
            this.options = this.sysString
          }
        }
      } else if (val === 'user') {
        this.selectInit()
      } else {
        this.options = []
      }
    },
    // 获取用户列表
    async getUserList(query) {
      this.loading = true
      this.userSearch.page = 1
      this.userSearch.likeName = query
      const { records, totalRecord } = await this.getUser()
      this.options = records
      this.userTotal = totalRecord
      this.loading = false
    },
    // 触发分页
    async pageChange() {
      if (this.options.length >= this.userTotal) return
      this.$set(this.userSearch, 'page', this.userSearch.page + 1)
      this.loading = true
      // 请求数据方法

      const { records } = await this.getUser()
      this.options = [
        ...this.options,
        ...records
      ]
      this.loading = false
    },
    // 用户下拉框
    async selectInit() {
      this.userSearch.page = 1
      this.userSearch.likeName = ''
      const { records, totalRecord } = await this.getUser()
      this.options = records
      this.userTotal = totalRecord
    },
    async getUser(type) {
      const params = {
        ...this.userSearch
      }
      if (!params.likeName) {
        delete params.likeName
      }
      if (type !== 1) {
        delete params.userIds
      }
      const res = await userSearchList(params)
      return res.body
    },
    // 获取部门列表
    async getDepartment() {
      const res = await searchDepartments({ companyId: getCompanyId() })
      this.department = res.body.data || []
    }
  }
}
