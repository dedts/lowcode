<template>
  <div>
    <!--header-->
    <div class="notificationBox">
      <div v-if="!isEdit" class="backOperation" @click="toOperation">
        <i class="el-icon-arrow-left"/>&nbsp;返回
      </div>
      <div v-else class="backOperation" style="visibility: hidden">123</div>
      <div class="title">{{ typeDesc }}记录</div>
      <i class="el-icon-close rightIcon rightCloseBtn" @click="handleClose" />
    </div>
    <!--content-->
    <div v-if="showPage" class="drawer-body">
      <el-form ref="formData" :model="formData">
        <!--选择表单-->
        <div class="tipBox">
          <div class="tipTitle">请选择一个表单</div>
          <el-form-item :rules="[{required:true,message:'请选择表单',trigger:['change','blur']}]" prop="templateDataId">
            <el-select ref="select" v-model="formData.templateDataId" clearable filterable @change="templateChange">
              <el-option
                v-for="item in inputList"
                :key="item.templateDataId"
                :label="item.pageTemplateName"
                :value="item.templateDataId"
              >
                <span v-if="item.templateDataId===templateDataIds.currentPageId">{{ item.pageTemplateName }}(当前表单)</span>
                <span v-else>{{ item.pageTemplateName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <!--过滤条件 -->
        <div v-if="formData.templateDataId && (type ==='updateData' || type ==='deleteData') ">
          <div class="mb15" style="padding-left: 40px;">设置条件</div>
          <filter-condition :target-fields-list="targetFieldsList" :target-form-page-id="templateDataIds.targetFormPageId" :is-current-info="isCurrentInfo" :form-data="formData" :current-form-page-id="templateDataIds.currentFormPageId" style="padding-left: 40px;" @clearValidate="clearValidate"/>
        </div>
        <!--添加字段-->
        <div v-if="formData.templateDataId&&targetFieldsList.length&&(type ==='addData'||type ==='updateData')">
          <div class="mt15" style="padding-left: 40px;">
            <div>选择字段添加</div>
            <add-field :target-fields-list="targetFieldsList" :is-current-info="isCurrentInfo" :is-edit="isEdit" :template-data-ids="templateDataIds" :is-init="addFieldInit" :form="formData" :key="addFieldKey" from="record" class="mt15 mr10"/>
          </div>
        </div>
      </el-form>
    </div>
    <!--footer-->
    <div class="footerBtn">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </div>
</template>
<script>
import { inputInfo } from './getinputInfo'
import addField from './addField'
import filterCondition from '@/components/filterCondition/index'
import { showFilterCondition, filterParameter } from '@/util/index'
import { save } from './operationSave'

export default {
  components: { addField, filterCondition },
  mixins: [inputInfo, save],
  props: {
    executionId: {
      type: String,
      default: ''
    },
    singleAddId: {
      type: String,
      default: ''
    },
    editData: {
      type: Object,
      default: () => {}
    },
    type: { // 操作类型  添加addData 更新 updateData 删除deleteData
      type: String,
      default: ''
    },
    ruleCondition: {
      type: Object,
      default: () => {}
    },
    flowType: { // 1 表单工作流 2 定时工作流
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formData: {
        templateDataId: '',
        pageData: [],
        workflowFilterDtoList: []
      },
      isEdit: false,
      addFieldKey: 0,
      showPage: false,
      addFieldInit: false
    }
  },
  computed: {
    isCurrentInfo() {
      return this.formData.templateDataId === this.templateDataIds.currentPageId
    },
    typeDesc() {
      let text = ''
      switch (this.type) {
        case 'addData':
          text = '添加'
          break
        case 'deleteData':
          text = '删除'
          break
        case 'updateData':
          text = '更新'
          break
      }
      return text
    }
  },
  async mounted() {
    await this.getAllMenuList()
    // if (this.flowType === 1) {
    //   await this.getCurrentInfo()
    // }

    // this.$refs.select.blur()
    if (Object.keys(this.editData).length) {
      // 编辑
      this.isEdit = true
      this.addFieldInit = false
      this.formData = this.editData.actionParameter
      this.formData.templateDataId = this.getInputInfo(this.editData.actionParameter.templateDataId).pageId
      await this.formNameChange(this.formData.templateDataId)
      if (this.type !== 'addData') {
        // 回显过滤器
        if (this.formData.workflowFilterDtoList && this.formData.workflowFilterDtoList.length) {
          this.formData.workflowFilterDtoList = showFilterCondition(this.formData.workflowFilterDtoList, this.currentFieldsList, this.targetFieldsList)
        }
      }
    }
    this.showPage = true
  },
  methods: {
    async templateChange(val) {
      if (val) {
        this.formData.pageData = []
        await this.formNameChange(this.formData.templateDataId)
        this.addFieldInit = true
        this.addFieldKey++
      }
    },
    save() {
      if ((!this.formData.pageData || !this.formData.pageData.length) && (this.type === 'addData' || this.type === 'updateData')) {
        return this.$message.error('至少添加一个字段')
      }
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const actionParameter = this.getActionParameter()
          if (this.isEdit) {
            this.edit(actionParameter)
          } else {
            if (this.singleAddId) {
              this.addSingle(actionParameter)
            } else {
              this.add(actionParameter)
            }
          }
        }
      })
    },
    getActionParameter() {
      const pageData = []
      if (this.formData.pageData) {
        this.formData.pageData.forEach(item => {
          pageData.push({
            key: item.key,
            value: item.value,
            valuesType: item.valuesType
          })
        })
      }

      const actionParameter = {
        templateDataId: this.templateDataIds.targetFormPageId
      }
      if (this.type === 'addData' || this.type === 'updateData') {
        actionParameter.pageData = pageData
      }
      if (this.formData.workflowFilterDtoList && this.formData.workflowFilterDtoList.length) {
        actionParameter.workflowFilterDtoList = filterParameter(this.formData.workflowFilterDtoList)
      }
      return JSON.stringify(actionParameter)
    },
    toOperation() {
      this.$emit('drawerSwitch', 'dataOperation')
    },
    // 为空 || 不为空取消filedValues的校验
    clearValidate(obj) {
      this.$refs.formData.clearValidate('workflowFilterDtoList.' + obj.sectionIndex + '.conditionDtoList.' + obj.rowIndex + '.fieldValues')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "style";
</style>
