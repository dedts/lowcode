<template>
  <div>
    <!--header-->
    <div class="notificationBox">
      <div class="backOperation" style="visibility: hidden">123</div>
      <div class="title">完成后跳转</div>
      <i class="el-icon-close rightIcon rightCloseBtn" @click="handleClose" />
    </div>
    <!--content-->
    <div v-if="showPage" class="drawer-body">
      <el-form ref="formData" :model="formData" :hide-required-asterisk="true">
        <div class="tipBox">
          <div class="tipTitle">是否跳转</div>
          <el-form-item :rules="[{required:true,message:'请选择是否跳转',trigger:['change']}]" prop="isJump">
            <el-radio-group v-model="formData.isJump" @change="isJumpChange">
              <el-radio :label="0">不跳转</el-radio>
              <el-radio :label="1">跳转</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-if="formData.isJump === 1" class="tipBox">
          <div class="tipTitle">跳转类型</div>
          <el-form-item :rules="[{required:true,message:'请选择跳转类型',trigger:['change']}]" prop="jumpType">
            <el-select v-model="formData.jumpType" clearable filterable @change="jumpChange">
              <el-option label="列表页" value="report"/>
              <el-option label="添加页" value="form"/>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="formData.isJump === 1" class="tipBox">
          <div class="tipTitle">跳转位置</div>
          <el-form-item :rules="[{required:true,message:'请选择跳转位置',trigger:['change']}]" prop="templateDataId">
            <el-select v-model="formData.templateDataId" clearable filterable @change="jumpChange">
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
            <el-checkbox v-model="formData.window" class="ml25">新窗口打开</el-checkbox>
          </el-form-item>
        </div>
        <div v-if="formData.jumpType && formData.isJump" class="tipBox">
          <div class="tipTitle">{{ formData.jumpType==='form'?'字段传参':'筛选过滤' }}</div>
          <el-form-item :rules="[{required:true,message:'请选择',trigger:['change']}]" prop="isFilter">
            <el-radio-group v-model="formData.isFilter">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <!--过滤条件 -->
        <div v-if="formData.templateDataId&&formData.isFilter&& formData.jumpType==='report'">
          <filter-condition :target-fields-list="targetFieldsList" :is-current-info="isCurrentInfo" :form-data="formData" :key="conditionKey" :target-form-page-id="templateDataIds.targetFormPageId" :current-form-page-id="templateDataIds.currentFormPageId" style="padding-left: 40px;"/>
        </div>
        <!--添加字段-->
        <div v-if="formData.templateDataId&&targetFieldsList.length&&formData.isFilter&&formData.jumpType==='form'">
          <div class="mt15" style="padding-left: 40px;">
            <div>选择字段添加</div>
            <add-field :target-fields-list="targetFieldsList.filter(f=>!f.sysAdd)" :is-edit="true" :is-current-info="isCurrentInfo" :current-fields-list="currentFieldsList" :template-data-ids="templateDataIds" :form="formData" :key="addFieldKey" from="redirectUrl" class="mt15"/>
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
import { ruleActionEdit } from '../../../api/workflow'
import addField from './addField'
import filterCondition from '../../../components/filterCondition/index'
import { inputInfo } from './getinputInfo'
import { filterParameter, showFilterCondition } from '../../../util'

export default {
  components: { addField, filterCondition },
  mixins: [inputInfo],
  props: {
    executionId: {
      type: String,
      default: ''
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {
        isJump: 0,
        jumpType: '',
        templateDataId: '',
        window: '',
        isFilter: '',
        pageData: [],
        workflowFilterDtoList: []
      },
      showPage: false,
      addFieldKey: 0,
      conditionKey: 0,
      flowType: JSON.parse(localStorage.getItem('params')).flowType
    }
  },
  computed: {
    isCurrentInfo() {
      return this.formData.templateDataId === this.templateDataIds.currentPageId
    }
  },
  async mounted() {
    await this.getAllMenuList()
    await this.getCurrentInfo()
    if (Object.keys(this.editData).length) {
      this.formData.isJump = this.editData.actionParameter.jumpUrl || this.editData.actionParameter.isJump
      this.formData.jumpType = this.editData.actionParameter.jumpType
      this.formData.window = !!this.editData.actionParameter.window
      this.formData.isFilter = this.editData.actionParameter.isFilter
      if (this.formData.isJump) {
        this.formData.templateDataId = this.menuList.filter(f => f.templateDataId === this.editData.actionParameter.location)[0].parentTemplateDataId
        await this.formNameChange(this.formData.templateDataId)
      }
      if (this.editData.actionParameter.pageData && this.editData.actionParameter.pageData.length) {
        this.formData.pageData = this.editData.actionParameter.pageData
      }
      if (this.editData.actionParameter.workflowFilterDtoList && this.editData.actionParameter.workflowFilterDtoList.length) {
        this.formData.workflowFilterDtoList = this.editData.actionParameter.workflowFilterDtoList
        showFilterCondition(this.formData.workflowFilterDtoList, this.currentFieldsList, this.targetFieldsList)
      }
    }
    this.showPage = true
  },
  methods: {
    isJumpChange(val) {
      if (!val) {
        this.formData.jumpType = ''
        this.formData.window = ''
        this.formData.isFilter = ''
        this.formData.pageData = []
        this.formData.workflowFilterDtoList = []
      }
    },
    async jumpChange() {
      if (this.formData.templateDataId && this.formData.jumpType === 'form') {
        this.formData.pageData = []
        this.addFieldKey++
        await this.formNameChange(this.formData.templateDataId)
      } else if (this.formData.templateDataId && this.formData.jumpType === 'report') {
        this.formData.workflowFilterDtoList = []
        this.conditionKey++
        await this.formNameChange(this.formData.templateDataId)
      }
    },
    save() {
      // 添加页
      if (this.formData.jumpType === 'form' && !this.formData.pageData.length && this.formData.isFilter) {
        return this.$message.error('至少添加一个字段')
      }
      // 列表页
      if (this.formData.jumpType === 'report' && !this.formData.workflowFilterDtoList.length && this.formData.isFilter) {
        return this.$message.error('至少添加一个字段')
      }
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const option = {
            ruleActionId: this.editData.ruleActionId,
            actionParameter: this.getActionParameter()
          }
          ruleActionEdit(option).then(res => {
            this.$emit('saveEnd')
          })
        }
      })
    },
    getActionParameter() {
      const actionParameter = {
        isJump: this.formData.isJump
      }
      if (this.formData.isJump) {
        actionParameter.window = this.formData.window ? 1 : 0
        actionParameter.jumpType = this.formData.jumpType
        actionParameter.isFilter = this.formData.isFilter
      }
      if (this.formData.jumpType === 'report') {
        actionParameter.location = this.templateDataIds.targetListPageId
      } else if (this.formData.jumpType === 'form') {
        actionParameter.location = this.templateDataIds.targetFormPageId
      }
      if (this.formData.pageData.length) {
        const pageData = []
        this.formData.pageData.forEach(item => {
          pageData.push({
            key: item.key,
            value: item.value,
            valuesType: item.valuesType
          })
        })
        actionParameter.pageData = pageData
      }
      if (this.formData.workflowFilterDtoList.length) {
        actionParameter.workflowFilterDtoList = filterParameter(this.formData.workflowFilterDtoList)
      }
      return JSON.stringify(actionParameter)
    },
    handleClose() {
      this.$emit('handleClose')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'style.scss';
  .tipTitle{line-height: 28px !important;}
</style>
