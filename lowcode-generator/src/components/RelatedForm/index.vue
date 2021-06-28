<template>
  <div>
    <!-- 分页/区段/关联表单/html/富文本 无需关联-->
    <div style="overflow-x: scroll;" class="box" >
      <!-- 表头-->
      <div :style="{width:tabelWidth}" class="header">
        <div style="width: 40px;position: absolute;">&nbsp;</div>
        <div style="margin-left: 40px;width: 100%;">
          <div v-for="col in relatedFormHeader" :key="col.dataKey" :style="{width:(100/relatedFormHeader.length)+'%'}" class="tableCell">
            <span>{{ col.name }} </span>
            <span class="red">{{ col.options.required?'*':'' }}</span>
          </div>
        </div>
      </div>
      <!--无数据状态-->
      <div v-if="!newRelatedFormData.length" :style="{width:tabelWidth}" class="tablEempty" >暂无数据</div>
      <!-- 每一行-->
      <el-form v-for="(item,index) in newRelatedFormData" :key="index" :model="newRelatedFormData[index]" :ref="'fromData'+index" :rules="rules" :style="{width:tabelWidth}" class="tableRow">
        <div style="display: flex;justify-content: flex-start;">
          <div style="width: 40px;text-align: center;border-bottom: 1px solid #efefef">
            <i class="el-icon-delete red pt15" style="width: 40px;" @click="deleteRelatedFormData(index,item.mongoDataId)"/>
          </div>
          <div
            v-for="col in relatedFormHeader"
            :key="col.dataKey"
            :style="{width:(100/relatedFormHeader.length)+'%'}"
            class="tableCell"
            style="border-bottom: 1px solid #efefef"
          >
            <el-form-item :prop="col.dataKey">
              <div v-if="col.type ==='autonumber'" class="autoNumber">
                <span v-if="!edit"> {{ Number(initValues) + index + 1 }} </span>
                <span v-if="edit"> {{ newRelatedFormData[index][col.dataKey] }} </span>
                <span v-if="edit && !newRelatedFormData[index][col.dataKey]"> {{ Number(initValues) + index + 1 }} </span>
              </div>
              <div v-if="col.type ==='input' || col.type ==='textarea'">
                <el-input
                  v-if="col.type ==='input' || col.type ==='textarea'"
                  :placeholder="col.options.placeholder || ('请输入'+col.name)"
                  v-model="newRelatedFormData[index][col.dataKey]"
                  clearable
                  @change="refreshRelatedFormData(index,newRelatedFormData[index], col)"/>
              </div>
              <div v-else-if="col.type === 'number'">
                <el-row :gutter="2">
                  <el-col :span="18">
                    <el-input-number
                      v-model="newRelatedFormData[index][col.dataKey]"
                      :step="col.options.step"
                      :controls="false"
                      :placeholder="col.options.placeholder|| ('请输入'+col.name)"
                      :disabled="!edit || col.options.disabled"
                      :min="col.options.numericalRange ? col.options.min : -Infinity"
                      :max="col.options.numericalRange ? col.options.max : Infinity"
                      :precision="col.options.integer ? 0 : col.options.float"
                      @change="refreshRelatedFormData(index,newRelatedFormData[index], col)"
                    />
                  </el-col>
                  <el-col :span="6">
                    <div v-if="col.options.unit !== ''" :title="col.options.unit" class="ml5" style="white-space:nowrap;overflow: hidden"> {{ col.options.unit }}</div>
                  </el-col>
                </el-row>
              </div>
              <div v-else-if="col.type === 'imgupload' || col.type === 'fileupload'">
                <div class="upload-box" @click="formImgDialogOpen(newRelatedFormData[index][col.dataKey], col,newRelatedFormData[index],index)">
                  <span v-if="newRelatedFormData[index][col.dataKey] && newRelatedFormData[index][col.dataKey].length" class="has-data">已选择 {{ newRelatedFormData[index][col.dataKey].length }} {{ col.type === 'imgupload'?'张图片':'个文件' }}</span>
                  <span v-else>{{ col.type === 'imgupload' ? '选择图片' : '选择文件' }}</span>
                  <i :class="[col.type === 'imgupload'?'el-icon-picture-outline':'iconattachment icon iconfont']"/>
                </div>
              </div>
              <div v-else-if="col.type === 'radio'">
                <el-select
                  v-model="newRelatedFormData[index][col.dataKey]"
                  :placeholder="col.options.placeholder || '请选择'"
                  @change="refreshRelatedFormData(index, newRelatedFormData[index], col)">
                  <el-option
                    v-for="item in col.options.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    clearable/>
                </el-select>
              </div>
              <div v-else-if="col.type === 'checkbox'">
                <el-select v-model="newRelatedFormData[index][col.dataKey]" :placeholder="col.options.placeholder || '请选择'" multiple collapse-tags @change="refreshRelatedFormData(index, newRelatedFormData[index], col)">
                  <el-option
                    v-for="item in col.options.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    clearable
                  />
                </el-select>
              </div>
              <div v-else-if="col.type === 'switch'">
                <el-switch v-model="newRelatedFormData[index][col.dataKey]" @change="refreshRelatedFormData(index,newRelatedFormData[index], col)"/>
              </div>
              <!--日期-->
              <div v-else-if="col.type === 'date'">
                <el-date-picker
                  v-model="newRelatedFormData[index][col.dataKey]"
                  :type="col.options.type"
                  :placeholder="col.options.placeholder || '请选择日期'"
                  style="width: 100%"
                  @change="refreshRelatedFormData(index, newRelatedFormData[index], col)"
                />
              </div>
              <!-- 成员 -->
              <div v-else-if="col.type === 'member'">
                <member
                  v-model="newRelatedFormData[index][col.dataKey]"
                  :member-range="col.options.memberRange"
                  :disabled="col.options.disabled"
                  :multiple="col.options.multiple"
                  :placeholder="col.options.placeholder || ('请选择'+col.name) "
                  @change="refreshRelatedFormData(index, newRelatedFormData[index], col)"
                />
              </div>
              <!--关联选项-->
              <div v-else-if="col.type === 'relatedChoice'">
                <relate-choice v-model="newRelatedFormData[index][col.dataKey]" :widget="col" width="100%" from="relatedForm" @change="refreshRelatedFormData(index, newRelatedFormData[index], col)"/>
              </div>
              <!-- 地理区域 -->
              <div v-else-if="col.type === 'cascader'">
                <province-city-county
                  :type="col.options.type"
                  v-model="newRelatedFormData[index][col.dataKey]"
                  :is-default="true"
                  :disabled="col.options.disabled"
                  from="generator"
                  @change="refreshRelatedFormData(index, newRelatedFormData[index], col)"
                />
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <!--todo ------------------------------- 弹窗-------------------------------->
    <el-dialog
      :title="relatedFormDialog.info.name"
      :visible.sync="relatedFormDialog.dialogVisible"
      width="50%">
      <span>
        <fm-upload
          v-if="relatedFormDialog.info.type === 'imgupload'"
          v-model="relatedFormDialog.dataModel"
          :multiple="relatedFormDialog.info.options.multiple"
          :limit="relatedFormDialog.info.options.limit"
          :file-size="relatedFormDialog.info.options.fileSize"
          :key="relatedFormDialog.row.mongoDataId"
        />
        <file-upload
          v-if="relatedFormDialog.info.type === 'fileupload'"
          v-model="relatedFormDialog.dataModel"
          :multiple="relatedFormDialog.info.options.multiple"
          :limit="relatedFormDialog.info.options.limit"
          :file-size="relatedFormDialog.info.options.fileSize"
          :key="relatedFormDialog.row.mongoDataId"/>
      </span>
      <span v-if="relatedFormDialog.info.type === 'imgupload'"> 最多可上传 {{ relatedFormDialog.info.options.limit }}张图片 ，且每张图片小于{{ relatedFormDialog.info.options.fileSize }}MB </span>
      <span v-if="relatedFormDialog.info.type === 'fileupload'"> 最多可上传 {{ relatedFormDialog.info.options.limit }}个文件 ，且每个文件小于{{ relatedFormDialog.info.options.fileSize }}MB </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="comfirmAddImg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import FmUpload from '../form/Upload'
import fileUpload from '../form/Upload/file'
import Member from '../member/index'
import ProvinceCityCounty from '../provinceCityCounty/index'
import relateChoice from '../relatedChoice'
import { formFieldList, getAppointData } from '@/api/builder'
import { formDataDelete, formPageDataSubmit, formDataUpdate } from '@/api/list'
import { EventBus } from '@/util/event-bus.js'
import { searchMemberByDepartment } from '@/api/workflow'
import { setFormFieldMapper, setCurFieldSubs, replaceKeyWord, generateInitData, setGenerateFormFieldMapper } from '@/util/expression'
import { getPrefix } from '@/api/builder'
export default {
  components: {
    FmUpload,
    Member,
    ProvinceCityCounty,
    fileUpload,
    relateChoice
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    edit: {
      type: Boolean,
      default: true
    },
    option: {
      type: Object,
      default: () => {}
    },
    from: {
      type: String, //  新增'add' 编辑：'edit'
      default: ''
    }
  },
  data() {
    return {
      mongoDataIds: this.value,
      newRelatedFormData: [], // 表格数据
      relatedFormHeader: [], // 表格标题
      relatedFormDialog: {
        // name: '',
        dialogVisible: false,
        dataModel: [],
        row: {},
        // action: '#'
        info: {
          options: {}
        }
      },
      templateDataId: '',
      formDateRules: {},
      // isSubmit: true, // 当前数据是否能提交到后台 true 是 false 否
      showWarm: false, // 是否显示提示文字 true 显示 false 不显示
      // todo  -----------------------重构表单---------------------------------------
      rules: {},
      screenWidth: 0,
      initValues: Infinity
    }
  },
  computed: {
    tabelWidth() {
      if (200 * (this.relatedFormHeader.length) + 40 < this.screenWidth) {
        return this.screenWidth + 'px'
      } else {
        return 200 * (this.relatedFormHeader.length) + 40 + 'px'
      }
    }
  },
  watch: {
    'mongoDataIds': {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  async mounted() {
    this.screenWidth = document.querySelector('.box').clientWidth
    this.templateDataId = this.$store.state.user.page.filter(f => f.templateDataId === this.option.formId)[0].dataFromPage
    await this.getTableColumn()
    // console.log(this.relatedFormHeader)
    await this.dealMemberData()
    setFormFieldMapper(this.relatedFormHeader, this.relatedFormHeader, true, 'relatedForm')
    generateInitData(this.relatedFormHeader, 'relatedForm')
    this.setFieldSubs()
    this.initExpression()

    if (this.mongoDataIds.length) {
      const fieldIds = this.relatedFormHeader.map(item => item.dataKey)
      fieldIds.push('mongoDataId')
      const options = {
        appointFields: fieldIds,
        mongoDataIds: this.mongoDataIds
      }
      getAppointData(options).then(res => {
        this.newRelatedFormData = res.body
        this.newRelatedFormData.forEach(item => {
          item.isSubmit = true
          Object.keys(item).forEach(cItem => {
            this.relatedFormHeader.forEach(sItem => {
              if (sItem.dataKey === cItem && sItem.type === 'switch') {
                item[cItem] = !!item[cItem]
              }
            })
          })
        })
      })
    }
  },
  methods: {
    // 获取表头
    async getTableColumn() {
      const res = await formFieldList([this.templateDataId])
      this.formDateRules = {}
      res.body.map(m => {
        const dataKey = m.dataKey
        this.formDateRules[dataKey] = m.options
      })
      this.option.header.forEach(item => {
        res.body.forEach(cItem => {
          if (cItem.dataKey === item.dataKey) {
            this.relatedFormHeader.push(cItem)
          }
        })
      })
      this.relatedFormHeader.forEach(item => {
        this.rules[item.dataKey] = item.rules.map(item => {
          if (item.pattern) {
            return { ...item, pattern: eval(item.pattern) }
          } else {
            return { ...item }
          }
        })
      })
      this.relatedFormHeaderCopy = JSON.parse(JSON.stringify(this.relatedFormHeader))
      this.relatedFormHeaderCopy.filter(f => {
        if (f.type === 'autonumber') {
          getPrefix(f.dataKey).then(res => {
            this.initValues = res.body
          })
        }
      })
    },
    // 打开上传图片、文件弹框
    formImgDialogOpen(dataModel, info, row, index) {
      this.relatedFormDialog.row = row
      this.relatedFormDialog.info = info
      this.relatedFormDialog.dataModel = dataModel || []
      this.relatedFormDialog.dialogVisible = true
      this.$set(this.relatedFormDialog, 'rowIndex', index)
    },
    // 删除关联表单行
    deleteRelatedFormData(index, mongoDataId) {
      if (!mongoDataId) {
        this.newRelatedFormData.splice(index, 1)
        EventBus.$emit('isSubmit', this.newRelatedFormData)
        return
      }
      const data = [{
        templateDataId: this.templateDataId,
        mongoDataId: mongoDataId
      }]
      formDataDelete(data).then((res) => {
        if (res.code === 200) {
          this.$message.success('删除成功！')
          this.newRelatedFormData = this.newRelatedFormData.filter(item => item.mongoDataId !== mongoDataId)
          EventBus.$emit('isSubmit', this.newRelatedFormData)
          this.formatMongoDataId()
        }
      })
    },
    // 新增一行空数据
    addFromDate() {
      // console.log(this.relatedFormHeader)
      if (this.option.maxSize <= this.newRelatedFormData.length) {
        this.$message.error('最多' + this.option.maxSize + '项')
        return
      }
      if (!this.relatedFormHeader.length) {
        this.$message.error('请先设置表头')
        return
      }
      let obj = {}
      this.relatedFormHeader.map(m => obj[m.dataKey] = m.options.defaultValue)
      obj.isSubmit = false
      this.newRelatedFormData.push(obj)
      // console.log(this.newRelatedFormData)
      EventBus.$emit('isSubmit', this.newRelatedFormData)
      this.$nextTick(() => {
        this.$refs['fromData' + (this.newRelatedFormData.length - 1)][0].validate(async(valid) => {
          if (valid) {
            const dataKeyArr = this.relatedFormHeader.filter(f => f.type === 'switch')
            Object.keys(obj).forEach(cItem => {
              dataKeyArr.forEach(sItem => {
                if (sItem.dataKey === cItem) {
                  obj[cItem] = obj[cItem] ? 1 : 0
                }
              })
            })
            obj = this.fomtterUploadData(obj)
            const data = [{
              templateDataId: this.templateDataId,
              pageData: obj
            }]
            this.addNewFormData(data, this.newRelatedFormData.length - 1)
          } else {
            this.newRelatedFormData[this.newRelatedFormData.length - 1].isSubmit = false
            EventBus.$emit('isSubmit', this.newRelatedFormData)
          }
        })
      })
    },
    // 关联表单--后台新增一条数据
    addNewFormData(data, index) {
      const json = { pageDatas: data, dataFrom: this.$route.params.id }
      formPageDataSubmit(json).then(res => {
        if (res.code === 200) {
          this.newRelatedFormData[index].mongoDataId = res.body.mogoDataId[0]
          this.formatMongoDataId()
          this.newRelatedFormData[index].isSubmit = true
          EventBus.$emit('isSubmit', this.newRelatedFormData)
        } else {
          this.newRelatedFormData[index].isSubmit = false
          EventBus.$emit('isSubmit', this.newRelatedFormData)
        }
      })
    },
    // 修改关联表单数据
    async refreshRelatedFormData(index, row, col) {
      // console.log('表单：', this.newRelatedFormData)
      // console.log(col)
      if (col.subs.length) {
        if (col.type === 'member' || col.type === 'date' || col.type === 'relatedChoice') {
          setGenerateFormFieldMapper(row, col)
        } else {
          setGenerateFormFieldMapper(row)
        }
        // 通知订阅者更新数据
        col.subs.forEach(item => {
          const curExpressionData = this.relatedFormHeader.filter(m => m.dataKey === item)[0].options.expressionData
          row[item] = eval(replaceKeyWord(curExpressionData, item))
        })
      }
      this.$refs['fromData' + index][0].validate(async(valid) => {
        if (valid) {
          let pageData = JSON.parse(JSON.stringify(row))
          delete pageData['_id']
          // delete pageData['mongoDataId']
          const dataKeyArr = this.relatedFormHeader.filter(f => f.type === 'switch')
          Object.keys(pageData).forEach(cItem => {
            dataKeyArr.forEach(sItem => {
              if (sItem.dataKey === cItem) {
                pageData[cItem] = pageData[cItem] ? 1 : 0
              }
            })
          })
          pageData = this.fomtterUploadData(pageData)
          const data = [{
            templateDataId: this.templateDataId,
            mongoDataId: row.mongoDataId,
            pageData: pageData
          }]
          if (!row.mongoDataId) {
            this.addNewFormData(data, index)
          } else {
            const res = await formDataUpdate(data)
            if (res.code === 200) {
              this.newRelatedFormData[index].isSubmit = true
              EventBus.$emit('isSubmit', this.newRelatedFormData)
            } else {
              this.newRelatedFormData[index].isSubmit = false
              EventBus.$emit('isSubmit', this.newRelatedFormData)
            }
            this.formatMongoDataId()
          }
        } else {
          this.newRelatedFormData[index].isSubmit = false
          EventBus.$emit('isSubmit', this.newRelatedFormData)
        }
      })
    },
    // 上传图片成功
    async comfirmAddImg() {
      this.relatedFormDialog.dialogVisible = false
      const dataKey = this.relatedFormDialog.info.dataKey
      this.$set(this.relatedFormDialog.row, dataKey, this.relatedFormDialog.dataModel)
      const col = this.relatedFormHeader.find(f => f.dataKey === dataKey)
      await this.refreshRelatedFormData(this.relatedFormDialog.rowIndex, this.relatedFormDialog.row, col)
      this.cancelDialog()
    },
    // 整理数据
    formatMongoDataId() {
      this.mongoDataIds = this.newRelatedFormData.map(m => m.mongoDataId)
    },
    // 弹框取消按钮
    cancelDialog() {
      this.relatedFormDialog.dialogVisible = false
    },
    // 文件，成员，日期格式处理
    fomtterUploadData(data) {
      const models = JSON.parse(JSON.stringify(data))
      // 处理 文件 数据
      const fileDataKeys = this.relatedFormHeader.filter(f => f.type === 'fileupload').map(m => m.dataKey)
      if (fileDataKeys.length) {
        fileDataKeys.forEach(item => {
          if (models[item]) {
            models[item].forEach(cItem => {
              delete cItem.uid
              delete cItem.status
            })
          }
        })
      }
      // 处理成员数据
      const memberList = this.relatedFormHeader.filter(f => f.type === 'member')
      if (memberList.length) {
        memberList.forEach(item => {
          if (!item.options.multiple && models[item.dataKey]) {
            models[item.dataKey] = [models[item.dataKey]]
          }
        })
      }
      // 处理日期
      const dateKeys = this.relatedFormHeader.filter(f => f.type === 'date').map(m => m.dataKey)
      if (dateKeys.length) {
        dateKeys.forEach(item => {
          if (models[item]) {
            models[item] = new Date(models[item]).toJSON()
          }
        })
      }
      return models
    },
    //  todo--------------处理表达式---------------------------
    // 处理成员数据
    async dealMemberData() {
      const compsArr = this.relatedFormHeader.filter(m => m.type === 'member')
      if (compsArr.length) {
        const results = await searchMemberByDepartment({ departmentIds: [], userIds: [] })
        compsArr.forEach(item => {
          item.options.memberData = results.body
        })
      }
    },
    // 设置字段的订阅者
    setFieldSubs() {
      this.relatedFormHeader.forEach(m => {
        m.subs = setCurFieldSubs(this.relatedFormHeader, m.dataKey, 'relatedForm')
      })
    },
    // 初始化表达式数据
    initExpression() {
      this.relatedFormHeader.forEach(m => {
        if (m.options && m.options.expressionData) {
          m.options.defaultValue = eval(replaceKeyWord(m.options.expressionData, m.dataKey))
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .upload-box{display: flex;justify-content: space-between;border:1px solid #dedede;height: 28px;line-height:28px;padding:0 10px; color:#b7bcc5;background: #FFFFFF;}
  .has-data{color:#606266;}
  .el-icon-picture-outline{font-size:16px;line-height:28px;}
  .el-dialog__body{padding:10px 20px !important;}
  .lh30 { line-height:30px; }
  /deep/ .el-form-item--mini.el-form-item{margin-bottom: 8px;}
  .header{display: flex;background-color: #EBEEF5;justify-content: flex-start;}
  .tableCell{min-width: 200px;padding:6px 10px;font-size: 12px;display: inline-block}
  .tablEempty{sheight: 60px;text-align: center;color: #909399;font-size: 12px;border-bottom: 1px solid #efefef;line-height: 60px;}
  .el-icon-delete{visibility: hidden}
  .tableRow:hover .el-icon-delete{visibility: unset}
</style>
