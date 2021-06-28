<template>
  <div>
    <el-select
      v-model="relatedChoiceValue"
      :multiple="widget.options.choiceType === 'multiple'"
      :placeholder="placeholder || widget.options.placeholder || '请选择'"
      :style="{width:width||'360px'}"
      :popper-class="widget.options.optionAdd?'myselect':''"
      filterable
      clearable
      collapse-tags
      @change="relatedChoiceChange"
    >
      <el-option
        v-for="item in relatedChoiceData"
        :key="item.mongoDataId"
        :label="relatedChoicePreview(item)"
        :value="item.mongoDataId">
        <span>{{ relatedChoicePreview(item) }}</span>
      </el-option>
      <el-button v-if="widget.options.optionAdd" style="width: 100%;position: absolute;bottom: 0;background-color:#fff;" type="text" @click="relatedChoiceAdd">{{ widget.options.optionAddBtnTxt ||'添加数据' }}</el-button>
    </el-select>
  </div>

</template>
<script>
import { getAppointData, formFieldList, getAllMenu } from '@/api/builder'
import { filterParameter, formatTime, unique } from '@/util/index.js'
import { searchMemberByDepartment } from '../../api/workflow'
export default {
  directives: {
    more: {
      // 指令的定义
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          const CONDITION = this.scrollHeight - Math.ceil(this.scrollTop) <= this.clientHeight
          if (CONDITION) {
            binding.value()
          }
        })
      }
    }
  },
  props: {
    widget: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: Array | String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    from: { // 调用的地方  preview 预览 relatedForm 关联表单组件 filterCondition 过滤器 addField  添加字段
      type: String,
      default: ''
    }
  },
  data() {
    return {
      relatedChoiceData: [],
      relatedChoiceValue: this.value,
      pageNow: 1,
      formList: [],
      fields: [...this.widget.options.field, 'mongoDataId'],
      memberList: [],
      total: 0,
      templateDataId: '',
      filterList: []
    }
  },
  watch: {
    'value': function(val) {
      this.relatedChoiceValue = val
    }
  },
  async mounted() {
    const res = await getAllMenu()
    const menuArr = res.body.filter(f => f.templateDataId === this.widget.options.formId)
    if (menuArr.length > 0) {
      this.templateDataId = menuArr[0].dataFromPage
    }
    await this.getFormList()
    await this.getRelatedChoiceData()
    if (this.formList.some(s => s.type === 'member')) {
      await this.getMemberList()
    }
    if (typeof this.relatedChoiceValue === 'string') {
      if (this.relatedChoiceValue) {
        await this.shouEditData()
      }
    } else if (Array.isArray(this.relatedChoiceValue)) {
      if (this.relatedChoiceValue.length) {
        await this.shouEditData()
      }
    }
    await this.relatedChoiceLoadMore()
  },
  methods: {
    async shouEditData() {
      const option = {
        appointFields: this.fields,
        mongoDataIds: []
      }
      if (typeof this.relatedChoiceValue === 'string') {
        option.mongoDataIds = [this.relatedChoiceValue]
      } else {
        option.mongoDataIds = this.relatedChoiceValue
      }
      const res = await getAppointData(option)
      res.body.forEach(item => this.relatedChoiceData.push(item))
      this.relatedChoiceData = unique(this.relatedChoiceData, 'mongoDataId')
      this.total = res.count
    },
    async getRelatedChoiceData() {
      if (this.from === 'preview') {
        return
      }
      this.filterList = []
      this.widget.options.field.forEach(item => {
        this.formList.forEach(f => {
          if (f.dataKey === item && f.type !== 'autonumber') {
            const obj = {
              connectionEnum: '||',
              conditionDtoList: [{
                comparisonOper: 'is_not_empty',
                connectionEnum: null,
                fieldId: item,
                valuesType: 0,
                fieldType: f.type,
                fieldValues: [],
                linkName: f.linkName
              }]
            }
            this.filterList.push(obj)
          }
        })
      })
      if (this.filterList.length > 0) {
        this.filterList[0].connectionEnum = null
      }
      const option = {
        templateDataId: this.templateDataId,
        appointFields: this.fields,
        filterList: this.widget.options.filterVisible ? filterParameter(this.widget.options.filter) : this.filterList,
        pageNow: this.pageNow,
        pageSize: 10
      }
      // console.log(this.widget.options)
      const res = await getAppointData(option)
      res.body.forEach(item => this.relatedChoiceData.push(item))
      this.relatedChoiceData = unique(this.relatedChoiceData, 'mongoDataId')
      this.total = res.count
    },
    // 获取templateDataId 对应的表单组件
    async getFormList() {
      const res = await formFieldList(this.templateDataId)
      res.body.forEach(item => {
        this.fields.forEach(f => {
          if (f === item.dataKey) {
            this.formList.push(item)
          }
        })
      })
    },
    // 获取templateDataId 对应的成员
    async getMemberList() {
      const resp = await searchMemberByDepartment({ userIds: [] })
      this.memberList = resp.body
    },

    async relatedChoiceLoadMore() {
      if (this.relatedChoiceData.length >= this.total) {
        return
      }
      this.pageNow++
      await this.getRelatedChoiceData()
      await this.relatedChoiceLoadMore()
    },
    // 格式化下拉框options展示
    relatedChoicePreview(data) {
      let text = ''
      const arr = []
      this.formList.forEach(item => {
        Object.keys(data).forEach(k => {
          if (k === '') {
            arr.push(data[k].slice(data[k].length - 5))
          }
          if (item.dataKey === k) {
            if (item.type === 'date') {
              if (data[k] !== '') {
                arr.push(formatTime(data[k], item.options.format))
              } else {
                arr.push('')
              }
            } else if (item.type === 'member') {
              if (data[k] && data[k].length) {
                const member = this.memberList.filter(f => f.userId === data[k][0])
                if (member.length) {
                  arr.push(member[0].name)
                }
              }
            } else {
              arr.push(data[k])
            }
          }
        })
      })
      if (arr.length > 1) {
        text = arr[0] + '（' + arr.slice(1).join(',') + '）'
      } else {
        text = arr[0]
      }
      // console.log(typeof text, text)
      return text
    },
    relatedChoiceAdd() {
      if (this.templateDataId === this.$route.params.id) {
        this.$message.error('请在当前表单添加数据')
        return
      }
      this.$router.push({ path: '/' + this.$route.params.appId + '/app/form/' + this.templateDataId })
    },
    async relatedChoiceChange(val) {
      this.$emit('input', val)
      this.$emit('change')
    }
  }
}

</script>
<style lang="scss" scoped>
  /*/deep/  .el-select{width: 100%}*/
  /deep/ .el-select-dropdown__list{padding-bottom: 28px !important;}
</style>
<style>
  .myselect ul{padding-bottom: 32px;}
</style>
