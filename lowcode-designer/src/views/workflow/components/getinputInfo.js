// 获取应用的所有表单 和  表单的字段
//  用于 数据操作模块  添加 删除 更新 锁定记录
import { getAllMenu, formPageGetFields, formFieldList } from '@/api/builder'
import { getComparisonOpers } from '../../../util/index'
export const inputInfo = {
  data() {
    return {
      inputList: [], // 表单列表
      menuList: [],
      targetFieldsList: [], // 目标字段列表
      currentFieldsList: [], //  当前字段列表
      templateDataIds: {
        currentPageId: JSON.parse(localStorage.getItem('params')).formId, // 当前表单的页面id
        currentListPageId: '',
        currentFormPageId: '',
        targetPageId: '',
        targetListPageId: '',
        targetFormPageId: ''
      }

    }
  },
  mounted() {

  },
  methods: {
    // 获取所有表单
    async getAllMenuList() {
      const res = await getAllMenu()
      this.menuList = res.body
      this.inputList = this.menuList.filter(f => f.pageType === 0)
      if (this.flowType === 1) {
        this.templateDataIds.currentListPageId = this.getInputInfo(this.templateDataIds.currentPageId).listPageId
        this.templateDataIds.currentFormPageId = this.getInputInfo(this.templateDataIds.currentPageId).formPageId
      }
    },
    // 获取 菜单相关页面id
    getInputInfo(val) {
      const dataFromPage = this.menuList.filter(f => f.templateDataId === val)[0].dataFromPage
      const arr = this.menuList.filter(f => f.dataFromPage === dataFromPage)
      return {
        pageId: arr.filter(f => f.pageType === 0)[0].templateDataId,
        listPageId: arr.filter(f => f.pageType === 2)[0].templateDataId,
        formPageId: arr.filter(f => f.pageType === 1)[0].templateDataId
      }
    },
    // 获取组件设置
    async getInputConfig(val) {
      const res = await formFieldList(val)
      const formList = res.body.filter(f => !f.sysAdd && f.type !== 'grid')
      return formList
    },
    // 获取当前表单 相关信息
    async getCurrentInfo() {
      const option = {
        templateDataId: ''
      }
      if (this.flowType === 2) {
        option.templateDataId = this.formData.templateDataId
      } else {
        option.templateDataId = this.templateDataIds.currentPageId
      }
      const res = await formPageGetFields(option)
      this.currentFieldsList = res.body
      this.currentFieldsList.forEach(item => {
        this.$set(item, 'isShowTip', false)
      })
    },
    // 获取表单对应的字段
    async formNameChange(val) {
      const option = {
        templateDataId: val
      }
      // console.log('option=>',option)
      this.templateDataIds.targetPageId = val
      const inputInfo = this.getInputInfo(val)
      this.templateDataIds.targetFormPageId = inputInfo.formPageId
      this.templateDataIds.targetListPageId = inputInfo.listPageId
      const res = await formPageGetFields(option)
      const formList = await this.getInputConfig(this.templateDataIds.targetFormPageId)
      let targetFieldsList = res.body
      if (!targetFieldsList.length) {
        this.$message.error('目标表单无字段可选')
        return
      }
      targetFieldsList = targetFieldsList.filter(f => f.type !== 'grid' && f.type !== 'relatedForm' && f.type !== 'html')
      targetFieldsList.forEach(item => {
        this.$set(item, 'isShowTip', true)
        item.comparisonOpersArr = item.comparisonOpers.split(',') // 下拉框条件
        item.comparisonOpersArr.forEach((m, i) => {
          item.comparisonOpersArr[i] = {
            label: getComparisonOpers(m),
            value: m
          }
        })
        formList.forEach(f => {
          if (item.dataKey === f.dataKey) {
            this.$set(item, 'options', f.options)
          }
        })
      })
      this.targetFieldsList = [
        {
          label: '',
          fieldsType: 'fields',
          options: targetFieldsList.filter(f => !f.sysAdd)
        },
        {
          label: '',
          fieldsType: 'sys',
          options: targetFieldsList.filter(f => f.sysAdd)
        }
      ]
    }
  }
}
