<template>
  <div class="loginWrap">
    <div class="login">
      <el-row class="companyInfo">
        <el-col :span="2" align="center">
          <i class="el-icon-warning-outline" />
        </el-col>
        <el-col :span="22">
          您收到「上海自来水公司」的邀请，将加入此公司，请确认您的个人信息是否正确。
        </el-col>
      </el-row>
      <el-row class="loginList">
        <el-col><h3>确认个人信息</h3></el-col>
      </el-row>
      <el-row class="loginList">
        <el-col><el-input v-model="userName" placeholder="用户名" maxlength="8" show-word-limit /></el-col>
      </el-row>
      <el-row class="loginList">
        <el-col>
          <el-select v-model="value" placeholder="请选择" class="selectSex">
            <el-option :value="true" label="男" />
            <el-option :value="false" label="女" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="loginList">
        <el-col><el-input v-model="userEmail" placeholder="邮箱" /></el-col>
      </el-row>
      <el-row class="loginList">
        <el-col>
          <el-button type="primary" class="btnLogin" @click="saveAndAdd()">
            保存并加入
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: '赵磊',
      userEmail: 'example@mail.com',
      value: null
    }
  },
  methods: {
    // 保存并加入
    saveAndAdd() {
      this.$router.push('../../login/setpassword')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .login { margin:10% auto 0; width:474px; }
  .login h3 { margin-bottom:10px; font-size:34px; }
  .btnLogin { width:100%; height: 40px; }
  .loginList { margin-top:16px; }
  .btnIconStart { margin-left:5px; }
  .btnText { margin-top:30px; }
  .el-icon-warning-outline { margin-top:5px; font-size:22px; color:#4557F6; }
  .companyInfo { margin-bottom:50px; padding:10px 0; line-height:20px; font-size:12px; border-radius:2px; color:rgba(0, 0, 0, 0.45); background:#F5F6FA;  }
  .selectSex { width:100%; }
</style>
