<template>
  <div class="loginWrap">
    <div class="login">
      <el-row class="loginList">
        <el-col><h3>创建应用</h3><span class="sTit">选择创建「自定义应用」</span></el-col>
      </el-row>
      <el-row class="loginList">
        <el-col><el-input v-model.trim="appName" maxlength="15" show-word-limit placeholder="应用名称" size="small" /></el-col>
      </el-row>
      <el-row class="loginList">
        <el-col>
          <el-button type="primary" class="btnLogin" @click="createStartApp()">
            创建并开始<svg-icon icon-class="iconJt" class-name="btnIconStart" />
          </el-button>
        </el-col>
      </el-row>
      <el-row class="btnText">
        <el-col align="center">
          <el-button type="text" @click="createAppCancel()">
            取消
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { aplictionAdd } from '../../api/company'
import { BIO } from '@/utils/bio'
export default {
  data() {
    return {
      appName: ''
    }
  },
  computed: {
    companyId() {
      return this.$store.state.user.activeCompanyId
    }
  },
  methods: {
    // 创建并开始，跳转到构建器
    createStartApp() {
      if (!this.appName) {
        this.$message.error('请输入应用名称')
        return
      }
      const option = {
        name: this.appName,
        companyId: this.companyId
      }
      aplictionAdd(option).then(res => {
        window.location.href = process.env.VUE_APP_DESIGN_API + BIO.tenTo62(res.body) + '/design'
      })
    },
    createAppCancel() {
      const path = '/' + this.$route.params.companyId + '/company/createapp'
      this.$router.push({ path })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .login { margin:10% auto 0; width:474px; }
  .login h3 { margin-bottom:10px; font-size:34px; }
  .login .sTit { margin-bottom:10px; display:block; font-size:14px; color:rgba(0, 0, 0, 0.45); }
  .btnLogin { width:100%; height:35px; }
  .loginList { margin-top:16px; }
  .btnIconStart { margin-left:5px; }
  .btnText { margin-top:30px; }
</style>
