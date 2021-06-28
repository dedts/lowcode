<template>
  <div class="operationWrap">
    <div class="notificationBox">
      <div v-if="!isEdit" class="backOperation" @click="toOperation">
        <i class="el-icon-arrow-left"/>&nbsp;返回
      </div>
      <div v-else class="backOperation" style="visibility: hidden">123</div>
      <div class="title">{{ type==='actionable'?'可操作':'不可操作' }}</div>
      <i class="el-icon-close rightIcon rightCloseBtn" @click="handleClose" />
    </div>
    <!-- 可操作，不可操作 -->
    <el-form v-if="isPage" ref="formData" :model="formData" label-position="left" class="formBox" style="padding-right: 0;">
      <!-- 选择表单 -->
      <el-form-item :rules="[{ required: true, message: '请选择表单', trigger: ['blur', 'change']}]" prop="templateDataId" label-width="100px" label="选择表单">
        <el-select ref="select" v-model="formData.templateDataId" filterable placeholder="请选择" @change="templateChange">
          <el-option
            v-for="item in inputList"
            :key="item.templateDataId"
            :label="item.pageTemplateName"
            :value="item.templateDataId">
            <span v-if="item.templateDataId === templateDataIds.currentPageId">{{ item.pageTemplateName }}(当前表单)</span>
            <span v-else>{{ item.pageTemplateName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 设置条件 -->
      <el-form-item v-if="formData.templateDataId && formData.templateDataId !== templateDataIds.currentPageId" label-width="100px" label="设置条件">
        <el-radio-group v-model="formData.logicalOper">
          <el-radio label="always">无条件</el-radio>
          <el-radio label="condition">配置条件</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 过滤器 -->
      <filter-condition v-if="formData.templateDataId !== templateDataIds.currentPageId && formData.logicalOper === 'condition'" :form-data="formData" :target-fields-list="targetFieldsList" :target-form-page-id="templateDataIds.targetFormPageId" :current-form-page-id="templateDataIds.currentFormPageId" class="mb20" @clearValidate="clearValidate"/>
      <!-- 选择字段 -->
      <el-form-item :rules="[{ required: true, message: '请选择字段', trigger: ['blur', 'change']}]" prop="dataKeys" label-width="100px" label="选择字段">
        <el-select v-model="formData.dataKeys" multiple placeholder="请选择">
          <el-option
            v-for="item in selectFields"
            :key="item.dataKey"
            :label="item.name"
            :value="item.dataKey">
            <div class="flex-between">
              <span>{{ item.name }}</span>
              <span class="inline ml30" style="color: #8492a6; font-size: 12px">{{ showFieldType(item) }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- footer 保存，取消 -->
    <div class="footerBtn">
      <el-button type="primary" @click="saveOperation">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </div>
</template>
<script>
import FilterCondition from '@/components/filterCondition/index'
import { inputInfo } from '@/views/workflow/components/getinputInfo.js'
import { showFilterCondition, filterParameter,showFieldTypeDesc } from '@/util/index.js'
import { save } from './operationSave'

export default {
  name: 'FieldOperation',
  components: {
    FilterCondition
  },
  mixins: [inputInfo, save],
  props: {
    type: { // 不可操作 'disable'  可操作 'actionable'
      type: String,
      default: ''
    },
    // 操作，不可操作ID
    executionId: {
      type: String,
      default: ''
    },
    // 操作 - 设置条件
    ruleCondition: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 单条操作Id
    singleAddId: {
      type: String,
      default: ''
    },
    editData: {
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
      // 设置条件
      logicalOper: 'always',
      formData: {
        templateDataId: '', // 选择的表单
        logicalOper: 'always', // 其他表单的选择条件
        workflowFilterDtoList: [], // 过滤器
        dataKeys: [] // 选择字段
      },
      isEdit: false, // 编辑操作
      isPage: false
    }
  },
  computed: {
    selectFields() {
      let arr = []
      const obj = this.targetFieldsList.find(f => f.fieldsType === 'fields')
      if (obj) {
        arr = obj.options
      }

      return arr
    }
  },
  async mounted() {
    await this.getAllMenuList()
    if (this.flowType === 1) {
      await this.getCurrentInfo()
    }
    await this.init()
    this.isPage = true
  },
  methods: {
    async init() {
      // this.$refs.select.blur()
      if (Object.keys(this.editData).length) {
        this.isEdit = true
        this.formData = {
          templateDataId: this.getInputInfo(this.editData.actionParameter.templateDataId).pageId, // 选择的表单
          logicalOper: this.editData.actionParameter.logicalOper, // 其他表单的选择条件
          workflowFilterDtoList: this.editData.actionParameter.workflowFilterDtoList, // 过滤器
          dataKeys: this.editData.actionParameter.dataKeys // 选择字段
        }
        await this.formNameChange(this.formData.templateDataId)
        // 回显过滤
        showFilterCondition(this.formData.workflowFilterDtoList, this.currentFieldsList, this.targetFieldsList)
      }
    },
    async templateChange(val) {
      this.formData.workflowFilterDtoList = []
      this.formData.logicalOper = 'always'
      this.formData.dataKeys = []
      await this.formNameChange(this.formData.templateDataId)
      if (this.flowType === 2) {
        await this.getCurrentInfo()
      }
    },
    // 返回上一级可操作，不可操作 fieldPermissions
    toOperation() {
      this.$emit('drawerSwitch', 'fieldPermissions')
    },
    // 为空 || 不为空取消filedValues的校验
    clearValidate(obj) {
      this.$refs.formData.clearValidate('workflowFilterDtoList.' + obj.sectionIndex + '.conditionDtoList.' + obj.rowIndex + '.fieldValues')
    },
    // 保存
    saveOperation() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          const actionParameter = this.getActionParameter()
          // debugger
          if (this.isEdit) {
            // 编辑操作
            this.edit(actionParameter)
          } else {
            if (this.singleAddId) {
              // 添加一条
              this.addSingle(actionParameter)
            } else {
              // 添加操作
              this.add(actionParameter)
            }
          }
        } else {
          return false
        }
      })
    },
    // 参数数据处理
    getActionParameter() {
      const actionParameter = {
        templateDataId: this.templateDataIds.targetFormPageId, // 表单ID
        logicalOper: this.formData.logicalOper, // 条件
        dataKeys: this.formData.dataKeys, // 选择当前表单字段
        workflowFilterDtoList: filterParameter(this.formData.workflowFilterDtoList) // 过滤器
      }
      return JSON.stringify(actionParameter)
    },
    showFieldType: showFieldTypeDesc
  }
}
</script>
<style lang="scss" scoped>
@import "style";
/deep/ .el-divider--horizontal{margin: 12px 0}
/deep/ .el-dropdown-menu--mini .el-dropdown-menu__item{padding: 0 24px;}
/deep/ .el-radio-group { margin-top:5px; }
</style>
