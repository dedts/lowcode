<template>
  <div class="createWorkFlowBox">
    <div class="addContainer">
      <div class="formTitle">对表单中的任意活动运行工作流</div>
      <el-form ref="ruleForm" :model="formData" :rules="rules" class="tac">
        <el-form-item
          label="开始日期和时间"
          required
        >
          <div style="display: flex;justify-content: space-between;">
            <div>
              <el-form-item prop="date">
                <el-date-picker
                  v-model="formData.date"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  style="width: 160px;"
                />
              </el-form-item>
            </div>
            <div>
              <el-form-item prop="time">
                <el-time-picker
                  v-model="formData.time"
                  format="HH:mm:ss"
                  placeholder="选择时间"
                  style="width: 160px;"
                />
              </el-form-item>
            </div>
          </div>

        </el-form-item>
        <el-form-item
          label="运行"
          prop="interval"
          required
        >
          <el-select v-model="formData.interval" class="w330">
            <el-option label="每天" value="daily"/>
            <el-option label="每周" value="weekly"/>
            <el-option label="每月" value="monthly"/>
            <el-option label="每年" value="yearly"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="工作流名称"
          required
        >
          <span class="inline w330">
            <el-form-item prop="workflowName">
              <el-input v-model="formData.workflowName" width="100%" placeholder="请填写"/>
            </el-form-item>
          </span>
        </el-form-item>
        <el-button type="primary" @click="toWorkFlowBoard">创建工作流</el-button>
        <div>
          <el-button type="text" @click="goBack">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { workflowAdd } from '@/api/workflow'
import { formatDate } from '@/util/function'
import { BIO } from '@/util/bio.js'
import { getAppId } from '@/util/auth.js'
export default {
  data() {
    return {
      formData: {
        date: '',
        time: '',
        interval: 'daily',
        workflowName: ''
      },
      rules: {
        date: [{ type: 'date', required: true, message: '开始日期不能为空', trigger: 'change' }],
        time: [{ required: true, message: '时间不能为空', trigger: 'change' }],
        workflowName: { required: true, message: '工作流名称不能为空', trigger: 'blur' }
      }
    }
  },
  mounted() {},
  methods: {
    toWorkFlowBoard() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const jsonData = {
            flowName: this.formData.workflowName,
            flowType: 2,
            triggerAction: formatDate(this.formData.date, 'yyyy-MM-dd') + ' ' + formatDate(this.formData.time, 'HH:mm:ss'),
            executionCycle: this.formData.interval
          }
          workflowAdd(jsonData).then(res => {
            const params = {
              flowType: 2,
              flowId: res.body,
              executionCycle: this.formData.interval,
              workflowName: this.formData.workflowName,
              triggerAction: formatDate(this.formData.date, 'yyyy-MM-dd') + ' ' + formatDate(this.formData.time, 'HH:mm:ss')
            }
            localStorage.setItem('params', JSON.stringify(params))
            this.$router.push({ path: '/' + BIO.tenTo62(getAppId()) + '/design/workflow/workflowboard?from=timing' })
          })
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.createWorkFlowBox {
  height: 100vh;
  overflow: hidden;
  .addContainer {
    width: 530px;
    height: 410px;
    padding: 12px;
    margin: calc(50vh - 205px) auto;
    .formTitle {
      font-size: 30px;
      text-align: center;
      color: #232E37;
      margin-bottom: 56px;
    }
  }
}
.center {
  margin: 24px auto;
}
.w330 {
  width: 330px;
}
/deep/ .el-form-item__label {
  width: 160px;
  margin-right: 6px;
  text-align: left;
  color: #232E37;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}
/deep/ .el-input__inner {
  height: 40px;
}
</style>
