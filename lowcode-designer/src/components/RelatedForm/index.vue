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
            <i class="el-icon-delete red pt15" style="width: 40px;" />
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
              <div v-if="col.type ==='input'||col.type ==='textarea'">
                <el-input
                  v-if="col.type ==='input'||col.type ==='textarea'"
                  :placeholder="col.options.placeholder || ('请输入'+col.name)"
                  v-model="newRelatedFormData[index][col.dataKey]"
                  clearable></el-input>
              </div>
              <div v-else-if="col.type === 'number'">
                <el-row>
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
                      style="width:100%;"
                    />
                  </el-col>
                  <el-col :span="6" align="center">
                    <span v-if="col.options.unit !== ''" class="lh30"> {{ col.options.unit }}</span>
                  </el-col>
                </el-row>
              </div>
              <div v-else-if="col.type === 'imgupload' || col.type === 'fileupload'">
                <div class="upload-box">
                  <span v-if="newRelatedFormData[index][col.dataKey] && newRelatedFormData[index][col.dataKey].length" class="has-data">已选择 {{ newRelatedFormData[index][col.dataKey].length }} {{ col.type === 'imgupload'?'张图片':'个文件' }}</span>
                  <span v-else>{{ col.type === 'imgupload' ? '选择图片' : '选择文件' }}</span>
                  <i :class="[col.type === 'imgupload'?'el-icon-picture-outline':'iconattachment icon iconfont']"/>
                </div>
              </div>
              <div v-else-if="col.type === 'radio'">
                <el-select
                  v-model="newRelatedFormData[index][col.dataKey]"
                  :placeholder="col.options.placeholder || '请选择'"
                >
                  <el-option
                    v-for="item in col.options.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    clearable/>
                </el-select>
              </div>
              <div v-else-if="col.type === 'checkbox'">
                <el-select v-model="newRelatedFormData[index][col.dataKey]" :placeholder="col.options.placeholder || '请选择'" multiple collapse-tags>
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
                <el-switch v-model="newRelatedFormData[index][col.dataKey]"/>
              </div>
              <!--日期-->
              <div v-else-if="col.type === 'date'">
                <el-date-picker
                  v-model="newRelatedFormData[index][col.dataKey]"
                  :type="col.options.type"
                  :placeholder="col.options.placeholder || '请选择日期'"
                  style="width: 100%"
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
                />
              </div>
              <!--关联选项-->
              <div v-else-if="col.type === 'relatedChoice'">
                <relate-choice v-model="newRelatedFormData[index][col.dataKey]" :widget="col" width="100%" from="relatedForm"/>
              </div>
              <!-- 地理区域 -->
              <div v-else-if="col.type === 'cascader'">
                <province-city-county
                  :type="col.options.type"
                  v-model="newRelatedFormData[index][col.dataKey]"
                  :is-default="true"
                  :disabled="col.options.disabled"
                  from="generator"
                />
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import FmUpload from '../form/Upload'
import fileUpload from '../form/Upload/file'
import Member from '../member/index'
import ProvinceCityCounty from '../provinceCityCounty/index'
import relateChoice from '../relatedChoice'
import { formFieldList, getAllMenu } from '@/api/builder'
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
    relatedFormData: {
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
      type: String, // 预览：'preview'
      default: ''
    }
  },
  data() {
    return {
      mongoDataIds: this.value,
      newRelatedFormData: [], // 表格数据
      relatedFormHeader: [], // 表格标题
      templateDataId: '',
      formDateRules: {},
      screenWidth: 0
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
  async mounted() {
    this.screenWidth = document.querySelector('.box').clientWidth
    const res = await getAllMenu()
    this.templateDataId = res.body.filter(f => f.templateDataId === this.option.formId)[0].dataFromPage
    await this.getTableColumn()
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
    },
    // 新增一行空数据
    addFromDate() {
      if (this.from === 'preview') {
        this.$message.error('请前往生成器添加数据')
        return
      }
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
