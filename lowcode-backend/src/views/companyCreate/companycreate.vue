<template>
  <div class="companyWrap">
    <div class="login">
      <el-row class="loginList">
        <el-col><h3>创建公司</h3></el-col>
      </el-row>
      <el-row class="loginList">
        <el-col>
          <el-input v-model.trim="companyName" maxlength="30" placeholder="填写公司名称" />
        </el-col>
      </el-row>
      <el-row class="loginList">
        <el-col class="tac">
          <el-button type="primary" class="btnCreate" @click="companyCreate()">
            创建公司
          </el-button>
          <el-button type="text" @click="$router.go(-1)">
            取消
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { companyCreate } from '../../api/company'
import { BIO } from '../../utils/bio'

export default {
  data() {
    return {
      companyName: ''
    }
  },
  methods: {
    companyCreate() {
      if (!this.companyName) {
        this.$message.error('请输入公司名称')
        return
      }
      companyCreate({ name: this.companyName }).then(res => {
        this.$message.success('创建成功')
        const companyId = BIO.tenTo62(res.body)
        this.$router.push({ path: '/' + companyId + '/company/index' })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .login { margin:15vh auto 0; width:474px; }
  .login h3 { margin-bottom:30px; font-size:34px; }
  .btnCreate { width:100%; }
  .loginList { margin-top:16px; }
  .btnIconStart { margin-left:8px; margin-top:-10px; }
</style>
