<template>
  <div class="operationWrap">
    <div class="notificationBox">
      <div v-if="!isEdit" class="backOperation" @click="toOperation">
        <i class="el-icon-arrow-left"/>&nbsp;返回
      </div>
      <div v-else class="backOperation" style="visibility: hidden">123</div>
      <div class="title">{{ type==='lockData'?'锁定':'解锁' }}</div>
      <i class="el-icon-close rightIcon rightCloseBtn" @click="handleClose" />
    </div>
    <el-form v-if="isPage" ref="formData" :model="formData" :hide-required-asterisk="true" label-position="left" class="formBox" style="padding-right: 0;">
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
        <!--authority  解锁:all,锁定 true:creator 锁定 false:admin -->
        <el-checkbox v-if="type==='lockData'" v-model="formData.authority" class="ml25">创建者可删改</el-checkbox>
      </el-form-item>
      <!-- 过滤器 -->
      <div v-if="formData.templateDataId && templateDataIds.currentPageId!==formData.templateDataId">
        <div class="mb15" style="color: #232E37;">设置条件</div>
        <filter-condition v-if="formData.templateDataId && templateDataIds.currentPageId!==formData.templateDataId" :form-data="formData" :target-fields-list="targetFieldsList" :target-form-page-id="templateDataIds.targetFormPageId" :current-form-page-id="templateDataIds.currentFormPageId" :key="conditionKey" class="mb20" @clearValidate="clearValidate"/>
      </div>
    </el-form>

    <!-- footer 保存，取消 -->
    <div class="footerBtn">
      <el-button type="primary" @click="saveOperation">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </div>
</template>
<script>
// import { ruleSaveAction, ruleActionEdit, ruleActionAdd } from '@/api/workflow'
import FilterCondition from '@/components/filterCondition/index'
import { inputInfo } from '@/views/workflow/components/getinputInfo.js'
import { showFilterCondition, filterParameter } from '@/util/index.js'
import { save } from './operationSave'
export default {
  name: 'FieldOperation',
  components: {
    FilterCondition
  },
  mixins: [inputInfo, save],
  props: {
    type: { // 锁定 'lockData'  解锁 'unlockData'
      type: String,
      default: ''
    },
    executionId: { // 类型Id
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
        authority: false,
        templateDataId: '', // 选择的表单
        logicalOper: 'always', // 其他表单的选择条件
        workflowFilterDtoList: [] // 过滤器
      },
      isEdit: false, // 编辑操作
      isPage: false,
      conditionKey: 0
    }
  },
  computed: {
    authority() {
      let text = ''
      if (this.type === 'unlockData') {
        text = 'all'
      } else {
        text = this.formData.authority ? 'creator' : 'admin'
      }
      return text
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
          authority: this.editData.actionParameter.authority === 'creator',
          workflowFilterDtoList: this.editData.actionParameter.workflowFilterDtoList // 过滤器
        }
        await this.formNameChange(this.formData.templateDataId)
        if (this.formData.workflowFilterDtoList) {
          // 回显过滤
          showFilterCondition(this.formData.workflowFilterDtoList, this.currentFieldsList, this.targetFieldsList)
        }
      }
    },
    async templateChange(val) {
      this.formData.workflowFilterDtoList = []
      await this.formNameChange(this.formData.templateDataId)
      // console.log(this.targetFieldsList);
      // debugger
      // this.conditionKey++
    },
    // 返回上一级
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
        authority: this.authority,
        workflowFilterDtoList: filterParameter(this.formData.workflowFilterDtoList) // 过滤器
      }
      return JSON.stringify(actionParameter)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "style";
  /deep/ .el-divider--horizontal{margin: 12px 0}
  /deep/ .el-dropdown-menu--mini .el-dropdown-menu__item{padding: 0 24px;}
  /deep/ .el-radio-group { margin-top:5px; }
</style>
