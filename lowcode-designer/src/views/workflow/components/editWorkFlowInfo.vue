<template>
  <div>
    <div class="drawerHeader">
      工作流属性<i class="el-icon-close rightIcon" @click="handleClose"/>
    </div>
    <el-form ref="formData" :model="formData" :rules="fromRule" class="formBox" label-width="250px">
      <el-form-item label="工作流名称" prop="flowName">
        <el-input v-model="formData.flowName" placeholder="请填写" style="width: 300px;" clearable/>
      </el-form-item>
      <el-form-item label="开始日期和时间" prop="triggerAction">
        <el-date-picker
          v-model="formData.triggerAction"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          style="width: 300px;"
        />
      </el-form-item>
      <el-form-item label="运行" prop="executionCycle">
        <el-select v-model="formData.executionCycle" clearable>
          <el-option label="每天" value="daily"/>
          <el-option label="每周" value="weekly"/>
          <el-option label="每月" value="monthly"/>
          <el-option label="每年" value="yearly"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="footerBtn">
      <el-button type="primary" @click="saveEdit">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </div>
</template>
<script>
import { workflowUpdate } from '../../../api/workflow'
export default {
  name: 'EditWorkFlowInfo',
  props: {
  },
  data() {
    return {
      formData: {
        flowName: '',
        executionCycle: '',
        triggerAction: ''
      },
      fromRule: {
        triggerAction: [{ required: true, message: '开始日期不能为空', trigger: 'change' }],
        executionCycle: [{ required: true, message: '请选择运行时间', trigger: 'change' }],
        flowName: [{ required: true, message: '工作流名称不能为空', trigger: 'blur' }]
      },
      params: JSON.parse(localStorage.getItem('params'))
    }
  },
  mounted() {
    this.formData.flowName = this.params.workflowName
    this.formData.executionCycle = this.params.executionCycle
    this.formData.triggerAction = this.params.triggerAction
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    saveEdit() {
      const options = {
        ...this.formData,
        flowId: this.params.flowId
      }
      workflowUpdate(options).then(res => {
        const localData = {
          flowType: this.params.flowType,
          formName: this.params.formName,
          workflowName: options.flowName,
          triggerAction: options.triggerAction,
          executionCycle: options.executionCycle,
          flowId: this.params.flowId,
          formId: this.params.formId
        }
        localStorage.setItem('params', JSON.stringify(localData))
        this.$emit('saveEnd')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .drawerHeader {
    position: relative;
    height: 80px;
    line-height: 80px;
    padding: 0 12px;
    text-align: center;
    font-size: 20px;
    color: #232E37;
    margin-bottom: 40px;
    border-bottom: 1px solid #E8E8E8;
    .rightIcon {
      position: absolute;
      right: 25px;
      top: 30px;
      cursor: pointer;
    }
  }
  .formBox{
    padding: 0 40px;
    height: calc(100vh - 200px);
    overflow-y: scroll;
  }
  /deep/ .el-input__inner {
    width: 300px;
    height: 40px;
  }
  /deep/ .el-form-item__label {
    height: 40px;
    line-height: 40px;
    color: #232E37;
    font-size: 14px;
  }
  /deep/ .el-select {
    width: 300px;
  }
  .footerBtn {
    display: block;
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: absolute;
    bottom: 0;
    right: 0;
    border-top: 1px solid #E8E8E8;
    padding-right: 12px;
    text-align: right;
  }

</style>
