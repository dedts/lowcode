<template>
  <div ref="login" class="loginWrap">
    <div class="login">
      <el-row class="loginList">
        <el-col><h3>登录我的账号</h3></el-col>
      </el-row>
      <el-form ref="ruleForm" :model="info" :rules="rules">
        <el-form-item prop="mobile">
          <el-input v-model="info.mobile" placeholder="手机号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="info.password" placeholder="登录密码" show-password />
        </el-form-item>
      </el-form>
      <div class="loginList">
        <el-button type="primary" class="btnLogin" @click="userLogin">
          登录
        </el-button>
      </div>
      <el-row>
        <el-col :span="12">
          <el-button type="text" class="btnText" @click="userRegister()">
            我要注册
          </el-button>
        </el-col>
        <el-col :span="12" align="right">
          <el-button type="text" class="btnText" @click="userForgetPassword()">
            忘记密码?
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { BIO } from '@/utils/bio'
export default {
  data() {
    return {
      info: {
        mobile: '',
        password: ''
      },
      rules: {
        mobile: [{ required: true, pattern: /^1[3-9](\d{9})$/, message: '请输入正确手机号码', trigger: ['change', 'blur'] }],
        password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }]
      }
    }
  },
  created() {
    const _this = this
    window.onkeydown = function(event) {
      if (event.code === 'Enter' && _this.$refs.login) {
        _this.userLogin()
      }
    }
  },
  methods: {
    // 找回密码
    userForgetPassword() {
      this.$router.push('../../login/password')
    },
    // 注册
    userRegister() {
      this.$router.push('../../login/register')
    },
    // 登录
    userLogin() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('Login', this.info).then(companyId => {
            const redirect = this.$route.query.redirect
            if (redirect) {
              if (redirect.startsWith('http')) {
                window.location.href = redirect
              }
            } else {
              const path = '/' + (companyId ? BIO.tenTo62(companyId) : -1) + '/company/index'
              this.$router.push({ path: path })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "login.css";
  /deep/.el-input--mini .el-input__inner { height:40px; line-height:40px; font-size:14px;}
</style>
