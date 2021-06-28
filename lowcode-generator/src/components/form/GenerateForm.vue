<template>
  <!-- 预览表单 -->
  <div>
    <el-form
      ref="generateForm"
      :class="{[data.config.customClass]: data.config.customClass?true: false,'no-label-form': data.config.labelWidth == 0}"
      :size="data.config.size"
      :model="models"
      :rules="rules"
      :label-position="data.config.labelPosition"
      :disabled="!edit"
      :label-width="data.config.labelWidth + 'px'"
      label-suffix=":">
      <span v-if="data.list.length <= 0" style="height:100px; line-height:100px; display:block; text-align:center; color:#cccccc;">创建表单后预览</span>
      <template v-for="item in data.list">
        <generate-col-item
          v-if="item.type == 'grid'"
          v-show="item.isPageShow"
          :key="item.key"
          :model.sync="models"
          :rules="rules"
          :element="item"
          :blanks="blanks"
          :operation="operation"
          :display="displayFields"
          :edit="edit"
          @input-change="onInputChange"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"/>
          </template>
        </generate-col-item>
        <generate-form-item
          v-else
          v-show="item.isPageShow"
          :rules="rules"
          :key="item.key"
          :models.sync="models"
          :widget="item"
          :blanks="blanks"
          :display="displayFields"
          :edit="edit"
          :operation="operation"
          @input-change="onInputChange"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"/>
          </template>
        </generate-form-item>
      </template>
    </el-form>
    <el-row class="mt30 mb20">
      <el-col :span="12" align="left">
        <template v-if="pageNowIndex.length > 1">
          <el-button v-if="pageNow !== 0" type="primary" style="margin-right:20px;" @click="pagePrve">上一页</el-button>
          <el-button v-if="pageNow !== pageNowIndex.length-1" type="primary" @click="pageNext">下一页</el-button>
        </template>
        <template v-else>&nbsp;</template>
      </el-col>
      <el-col v-if="pageNowIndex.length > 1" :span="12" align="right">
        <!-- 有分页-->
        <template v-if="operation === 'add'&& pageNow === pageNowIndex.length-1">
          <el-button type="primary" style="margin-right:20px;" @click="handleSubmit"><i class="el-icon-check"/>&nbsp;&nbsp;提交</el-button>
          <el-button @click="handleReset"><i class="el-icon-set-up"/>&nbsp;&nbsp;重置</el-button>
        </template>
        <template v-else-if="operation === 'edit'&& pageNow === pageNowIndex.length-1">
          <el-button type="primary" style="margin-right:20px;" @click="handleSubmitEdit"><i class="el-icon-check"/>&nbsp;&nbsp;提交</el-button>
          <el-button @click="goBackList"><i class="el-icon-close"/>&nbsp;&nbsp;取消</el-button>
        </template>
        <template v-else>&nbsp;</template>
      </el-col>
      <el-col v-else :span="12" align="right">
        <template v-if="operation === 'add'">
          <el-button v-preventReClick type="primary" style="margin-right:20px;" @click="handleSubmit"><i class="el-icon-check"/>&nbsp;&nbsp;提交</el-button>
          <el-button @click="handleReset"><i class="el-icon-set-up"/>&nbsp;&nbsp;重置</el-button>
        </template>
        <template v-else-if="operation === 'edit'">
          <el-button type="primary" style="margin-right:20px;" @click="handleSubmitEdit"><i class="el-icon-check"/>&nbsp;&nbsp;提交</el-button>
          <el-button @click="goBackList"><i class="el-icon-close"/>&nbsp;&nbsp;取消</el-button>
        </template>
        <template v-else>&nbsp;</template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem'
import GenerateColItem from './GenerateColItem'
import { formPageDataSubmit, formDataUpdate } from '@/api/list'
import { EventBus } from '@/util/event-bus.js'
import { generateFormWorkflow } from './generateFormWorkflow'
import { setFormFieldMapper, setCurFieldSubs, replaceKeyWord, generateInitData } from '@/util/expression'
import { formFieldList, getPrefix } from '@/api/builder'
import { searchMemberByDepartment } from '@/api/workflow'

export default {
  name: 'FmGenerateForm',
  components: {
    GenerateFormItem,
    GenerateColItem
  },
  mixins: [generateFormWorkflow],
  props: {
    data: {
      type: Object,
      default: () => ({
        'list': [],
        'config': {
          'labelWidth': 100,
          'labelPosition': 'top',
          'size': 'small',
          'customClass': ''
        }
      })
    },
    value: {
      type: Object,
      default: () => ({})
    },
    edit: {
      type: Boolean,
      default: true
    },
    operation: { // add '新增' edit:'编辑'
      type: String,
      default: ''
    },
    from: { // choice 关联选项
      type: String,
      default: ''
    },
    addTemplateDataId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      curItemDataKey: '',
      expressionMap: [],
      models: {},
      rules: {},
      blanks: [],
      displayFields: {},
      dataBindFields: [],
      formValue: this.value,
      pageNow: 0, // 分页当前页
      pageNowIndex: [], // 每一页的下标数组
      templateDataId: '',
      appId: '',
      hrefSubmit: '',
      mongoDataId: '',
      paging: { // 分页
        page: this.$route.query.page,
        size: this.$route.query.size
      },
      isSubmit: true,
      formPageGetFields: [],
      childMongoDataIdsDataKey: []
    }
  },
  provide() {
    return {
      expressionMap: () => this.expressionMap,
      setCurItem: this.setCurItem
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.models = { ...this.models, ...val }
      }
    },
    data: {
      deep: true,
      handler(val) {
        this._initForm()
        this.childMongoDataIds = []
        this.data.list[0].columns.list.forEach(item => {
          if (item.type === 'relatedForm') {
            this.childMongoDataIdsDataKey.push(item.dataKey)
          }
        })
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.formValue = { ...val }
        this.$nextTick(() => {
          this.validateCascader()
        })
      }
    }
  },
  async created() {
    this.templateDataId = this.addTemplateDataId || this.$route.params.id
    await this.getFields()
    await this.dealMemberData()
    setFormFieldMapper(this.data.list, this.formPageGetFields, true)
    generateInitData(this.data.list)
    this.setFieldSubs()
    this.initExpression()
    this.dataPaging()
  },
  mounted() {
    this.templateDataId = this.addTemplateDataId || this.$route.params.id
    this.init()
    EventBus.$on('isSubmit', (data) => {
      this.isSubmit = data.every(e => e.isSubmit)
    })
  },
  methods: {
    // 处理成员和自编号数据
    async dealMemberData() {
      const compsArr = this.data.list.reduce((result, item) => {
        if (item.type === 'grid') {
          result.push(...item.columns.list)
        }
        return result
      }, [])
      const memberCompsArr = compsArr.filter(m => m.type === 'member')
      const autoNumberCompsArr = compsArr.filter(m => m.type === 'autonumber')
      if (memberCompsArr.length) {
        const results = await searchMemberByDepartment({ departmentIds: [], userIds: [] })
        memberCompsArr.forEach(item => {
          item.options.memberData = results.body
        })
      }
      // if (this.operation === 'add' || window.location.href.indexOf('add') > 0 || window.location.href.indexOf('copy') > 0) {
      if (autoNumberCompsArr.length) {
        const requests = []
        autoNumberCompsArr.forEach(m => {
          requests.push(getPrefix(m.dataKey))
        })
        const results = await Promise.all(requests)
        results.forEach((n, index) => {
          if (this.operation === 'add' || window.location.href.indexOf('add') > 0 || window.location.href.indexOf('copy') > 0) {
            results[index].body !== '' && (autoNumberCompsArr[index].options.autoNumberValue = parseInt(results[index].body) + 1)
          } else {
            results[index].body !== '' && (autoNumberCompsArr[index].options.autoNumberValue = parseInt(results[index].body))
          }
        })
      }
      // }
    },
    // 获取表单字段列表
    async getFields() {
      const data = {
        templateDataId: this.templateDataId
      }
      const res = await formFieldList(data.templateDataId)
      this.formPageGetFields = res.body
      const choiceArr = this.formPageGetFields.filter(f => f.type === 'relatedChoice').map(m => {
        return this.$store.state.user.page.filter(f => f.templateDataId === m.options.formId)[0].dataFromPage
      })
      // console.log(this.formPageGetFields, 'this.formPageGetFields')
      // this.formPageGetFields.forEach(item => {
      //   if (item.type === 'autonumber') {
      //     this.activeInitValue = item.initValue
      //   }
      // })
      const promiseArr = []
      choiceArr.forEach(item => {
        promiseArr.push(formFieldList(item))
      })

      const resp = await Promise.all(promiseArr)
      const member = await searchMemberByDepartment({ departmentIds: [], userIds: [] })
      resp.forEach(item => {
        this.formPageGetFields.forEach(c => {
          if (c.type === 'relatedChoice') {
            c.options.field = c.options.field.map(h => {
              const header = item.body.filter(f => f.dataKey === h)[0]
              if (header && header.type === 'member') {
                header.options.memberData = member.body
              }
              return header
            })
          }
        })
      })
    },

    init() {
      // 详情页ID和dataFromPage是同一个ID,列表传过来的ID是dataFromPage
      // this.templateDataId = this.$route.params.id
      // 应用ID
      this.appId = this.$route.params.appId
      // 数据ID
      this.mongoDataId = this.$route.params.dataid
      // console.log(this.$refs.generateForm)
    },
    // 初始化表达式数据
    initExpression() {
      const compsArr = []
      this.data.list.forEach(item => {
        item.type === 'grid' && compsArr.push(...item.columns.list)
      })
      compsArr.forEach(m => {
        if (m.options && m.options.expressionData) {
          m.options.defaultValue = eval(replaceKeyWord(m.options.expressionData, m.dataKey))
          // setFormFieldMapper(this.data.list, this.formPageGetFields)
          this.expressionMap.push({
            dataKey: m.dataKey,
            expressionData: m.options.expressionData
          })
        }
      })
    },
    // todo -- 分页 --
    // 分页 - 数组
    dataPaging() {
      this.data.list.forEach((item, index) => {
        if (item.type === 'paging') {
          this.pageNowIndex.push(index)
        }
      })
      // 边界处理
      if (this.pageNowIndex.slice(-1) !== this.data.list.length - 1) {
        this.pageNowIndex.push(this.data.list.length)
      }
      this.getPagingDataResult(this.pageNow)
    },
    // 分页 - 获取当前页数据
    getPagingDataResult(pageIndex) {
      let startIndex = 0
      let endIndex = 0
      if (pageIndex <= 0) {
        startIndex = this.pageNowIndex[0] // 4
      } else {
        startIndex = this.pageNowIndex[pageIndex - 1] // 4
        endIndex = this.pageNowIndex[pageIndex] // 6
      }
      this.data.list.forEach((item, index) => {
        this.$set(item, 'isPageShow', false)
        if (endIndex) { // 不是第一页
          if (startIndex < index && index < endIndex) {
            item.isPageShow = true
          }
        } else {
          if (index < startIndex) {
            item.isPageShow = true
          }
        }
      })
      this._initForm()
    },
    // 上一页
    pagePrve() {
      this.pageNow--
      if (this.pageNow <= 0) {
        this.pageNow = 0
      }
      this.getPagingDataResult(this.pageNow)
    },
    // 下一页
    pageNext() {
      this.pageNow++
      if (this.pageNow > this.pageNowIndex.length - 1) {
        this.pageNow = this.pageNowIndex.length - 1
      }
      this.getPagingDataResult(this.pageNow)
    },
    _initForm() {
      if (Object.keys(this.data).length) {
        this.generateModel(this.data.list)
      } else {
        this.generateModel([])
      }
    },
    // 设置字段的订阅者
    setFieldSubs() {
      const compsArr = []
      this.data.list.forEach(item => {
        item.type === 'grid' && compsArr.push(...item.columns.list)
      })
      compsArr.forEach(m => {
        m.subs = setCurFieldSubs(this.data.list, m.dataKey)
      })
    },
    generateModel(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          this.displayFields[genList[i].dataKey] = !genList[i].options.hidden

          genList[i].columns && [genList[i].columns].forEach(item => {
            this.generateModel(item.list)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach(item => {
            this.generateModel(item.list)
          })

          this.displayFields[genList[i].dataKey] = !genList[i].options.hidden
        } else {
          if (Object.keys(this.formValue).indexOf(genList[i].dataKey) >= 0) {
            // 处理老版本没有dataBind值的情况，默认绑定数据
            if (Object.keys(genList[i].options).indexOf('dataBind') < 0 || genList[i].options.dataBind) {
              this.models[genList[i].dataKey] = this.formValue[genList[i].dataKey]
              this.dataBindFields.push(genList[i].dataKey)
            }

            this.displayFields[genList[i].dataKey] = !genList[i].options.hidden

            if (genList[i].type === 'blank') {
              this.blanks.push({
                name: genList[i].dataKey
              })
            }
          } else {
            if (genList[i].type === 'blank') {
              // bound the default value
              if (Object.keys(genList[i].options).indexOf('dataBind') < 0 || genList[i].options.dataBind) {
                this.models[genList[i].dataKey] = genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : [])
                this.dataBindFields.push(genList[i].dataKey)
              }
              this.displayFields[genList[i].dataKey] = !genList[i].options.hidden

              this.blanks.push({
                name: genList[i].dataKey
              })
            } else {
              if (Object.keys(genList[i].options).indexOf('dataBind') < 0 || genList[i].options.dataBind) {
                this.models[genList[i].dataKey] = genList[i].type === 'table' ? [] : genList[i].type == 'cascader' && !genList[i].options.defaultValue.length ? [] : genList[i].options.defaultValue
                this.dataBindFields.push(genList[i].dataKey)
              }
              this.displayFields[genList[i].dataKey] = !genList[i].options.hidden
            }
          }

          genList[i].tableColumns && genList[i].tableColumns.length && genList[i].tableColumns.forEach(item => {
            if (item.type === 'blank') {
              this.blanks.push({
                name: item.dataKey
              })
            }
          })

          if (this.rules[genList[i].dataKey]) {
            this.rules[genList[i].dataKey] = [
              // ...this.rules[genList[i].dataKey],
              ...genList[i].rules.map(item => {
                if (item.pattern) {
                  return { ...item, pattern: eval(item.pattern) }
                } else {
                  return { ...item }
                }
              })]
          } else {
            this.rules[genList[i].dataKey] = [
              ...genList[i].rules.map(item => {
                if (item.pattern) {
                  return { ...item, pattern: eval(item.pattern) }
                } else {
                  return { ...item }
                }
              })]
          }
        }
      }
    },
    // _setDisabled(genList, fields, disabled) {
    //   for (let i = 0; i < genList.length; i++) {
    //     if (genList[i].type === 'grid') {
    //       [genList[i].columns].forEach(item => {
    //         this._setDisabled(item.list, fields, disabled)
    //       })
    //     } else if (genList[i].type === 'tabs') {
    //       genList[i].tabs.forEach(item => {
    //         this._setDisabled(item.list, fields, disabled)
    //       })
    //     } else {
    //       if (fields.indexOf(genList[i].dataKey) >= 0) {
    //         this.$set(genList[i].options, 'disabled', disabled)
    //       }
    //     }
    //   }
    // },
    // 设置当前操作的组件dataKey
    setCurItem(dataKey) {
      this.curItemDataKey = dataKey
    },
    // 地理区域组件验证
    validateCascader() {
      const props = this.data.list.reduce((result, item) => {
        if (item.type === 'grid') {
          result.push(...item.columns.list)
        }
        return result
      }, []).filter(m => (m.type === 'cascader' || m.type === 'editor' || m.type === 'relatedChoice') && this.curItemDataKey === m.dataKey)
      props.forEach(n => {
        this.$refs.generateForm.clearValidate(n.dataKey)
        this.$refs.generateForm.validateField(n.dataKey)
      })
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            const resData = {}
            Object.keys(this.models).forEach(key => {
              if (this.displayFields[key] && this.dataBindFields.indexOf(key) >= 0) {
                resData[key] = this.models[key]
              }
            })
            // console.log('resData=>', resData)
            resolve(JSON.parse(JSON.stringify(resData)))
          } else {
            reject(new Error(this.$t('fm.message.validError')).message)
          }
        })
      })
    },
    fomtterUploadData(data) {
      const models = JSON.parse(JSON.stringify(data))
      // 处理 文件 数据
      const fileDataKeys = this.formPageGetFields.filter(f => f.type === 'fileupload').map(m => m.dataKey)
      if (fileDataKeys.length) {
        fileDataKeys.forEach(item => {
          models[item].forEach(cItem => {
            delete cItem.uid
            delete cItem.status
          })
        })
      }
      // 处理成员数据
      const memberList = this.formPageGetFields.filter(f => f.type === 'member')
      if (memberList.length) {
        memberList.forEach(item => {
          if (!item.options.multiple) {
            if (models[item.dataKey]) {
              models[item.dataKey] = [models[item.dataKey]]
            }
          }
        })
      }
      // 处理日期
      const dateKeys = this.formPageGetFields.filter(f => f.type === 'date').map(m => m.dataKey)
      if (dateKeys.length) {
        dateKeys.forEach(item => {
          if (models[item]) {
            models[item] = new Date(models[item]).toJSON()
          }
        })
      }
      // console.log(models);
      return models
    },

    onInputChange(value, field, type) {
      if (type === 'fileupload' || type === 'imgupload') {
        if (this.models[field].length) {
          this.$refs.generateForm.clearValidate(field)
        }
      }
      this.$emit('on-change', field, value, this.models)
      this.$emit(`on-${field}-change`, value)
    },
    display(fields) {
      // Object.keys(this.displayFields).forEach(key => {
      //   if (fields.indexOf(key) >= 0) {
      //     this.$set(this.displayFields, key, true)
      //   }
      // })
      // this.displayFields = { ...this.displayFields }
    },
    hide(fields) {
      // Object.keys(this.displayFields).forEach(key => {
      //   if (fields.indexOf(key) >= 0) {
      //     this.$set(this.displayFields, key, false)
      //   }
      // })
      // this.displayFields = { ...this.displayFields }
    },
    disabled(fields, disabled) {
      // this._setDisabled(this.data.list, fields, disabled)
    },
    setData(value) {
      // this.models = { ...this.models, ...value }
    },
    // todo ------ 提交数据 ------
    async handleSubmit() {
      if (!this.isSubmit) return this.$message.error('请完善关联表格')
      this.getData().then(data => {
        // console.log(data)
        let index = -1
        Object.values(data).forEach((item, dIndex) => {
          (item instanceof Array) && item[0] === '11' && (index = dIndex)
        })
        if (index !== -1) {
          data[Object.keys(data)[index]] = []
        }
        data = this.fomtterUploadData(data)
        const childMongoDataIds = new Set()
        this.childMongoDataIdsDataKey.forEach(item => {
          data[item] && data[item].forEach(cItem => {
            childMongoDataIds.add(cItem)
          })
        })
        const json = { pageDatas: [{ templateDataId: this.templateDataId, pageData: data, childMongoDataIds: Array.from(childMongoDataIds) }] }
        formPageDataSubmit(json).then(resp => {
          this.handleReset()
          // 工作流处理
          const locationHost = window.location.host
          this.$emit('submit')
          this.generateFormResp(resp.body, this.appId, locationHost, '保存成功', this.init)
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // todo ------ 重置 ------
    handleReset() {
      this.$emit('updateKey')
    },
    // todo ------ 取消 ------
    goBackList() {
      this.$emit('goBackList')
    },
    // todo ------ 编辑 & 复制 ------
    handleSubmitEdit() {
      // if (!this.isSubmit) return this.$message.error('请完善关联表格')
      this.getData().then(data => {
        let index = -1
        Object.values(data).forEach((item, dIndex) => {
          (item instanceof Array) && item[0] === '11' && (index = dIndex)
        })
        if (index !== -1) {
          data[Object.keys(data)[index]] = []
        }
        data = this.fomtterUploadData(data)
        const childMongoDataIds = new Set()
        this.childMongoDataIdsDataKey.forEach(item => {
          data[item] && data[item].forEach(cItem => {
            childMongoDataIds.add(cItem)
          })
        })
        // 编辑 - 应用表单数据更新
        if (window.location.href.indexOf('edit') > 0) {
          const json = { templateDataId: this.templateDataId, mongoDataId: this.mongoDataId, pageData: data, childMongoDataIds: childMongoDataIds }
          formDataUpdate([json]).then(resp => {
            // 工作流处理
            const locationHost = window.location.host
            this.generateFormResp(resp.body, this.appId, locationHost, '保存成功', this.init)
          }).catch(err => {
            console.log(err)
          })
        } else if (window.location.href.indexOf('copy') > 0) {
          // 复制
          const json = { pageDatas: [{ templateDataId: this.templateDataId, pageData: data, childMongoDataIds: this.childMongoDataIds }] }
          formPageDataSubmit(json).then(resp => {
            // 工作流处理
            const locationHost = window.location.host
            this.generateFormResp(resp.body, this.appId, locationHost, '保存成功', this.init)
          }).catch(err => {
            console.log(err)
          })
        }
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
</style>
