<template>
  <div class="loginWrap">
    <div class="login">
      <el-row class="loginList">
        <el-col><h3>完善信息</h3></el-col>
      </el-row>
      <el-form ref="registerEndForm" :model="registerEndForm" :rules="registerEndRules">
        <el-form-item prop="name">
          <el-input v-model.trim="registerEndForm.name" auto-complete="off" type="text" placeholder="姓名" />
        </el-form-item>
        <el-form-item prop="sex">
          <el-select v-model="registerEndForm.sex" placeholder="选择性别" style="width: 100%;">
            <el-option :value="true" label="男" />
            <el-option :value="false" label="女" />
          </el-select>
        </el-form-item>
        <!--<el-form-item prop="email">-->
        <!--<el-input v-model="registerEndForm.email" auto-complete="off" type="text" placeholder="填写邮箱" />-->
        <!--</el-form-item>-->
      </el-form>
      <el-row class="loginList">
        <el-col>
          <el-button type="primary" class="btnLogin" @click="registerEnd()">
            注册
          </el-button>
        </el-col>
      </el-row>
      <el-row class="mt30">
        <el-col align="center">
          <el-button type="text" @click="registerCancel()">
            取消
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { BIO } from '../../utils/bio'

export default {

  data() {
    return {
      registerForm: {},
      registerEndForm: {
        name: '',
        sex: null
        // email: null
      },
      registerEndRules: {
        name: [{ required: true, pattern: /^([\u4e00-\u9fa5][\u4e00-\u9fa5\-_~]{1,9})$|^([a-zA-Z][a-zA-Z\-_~]{2,19})$/,
          message: '请输入正确姓名', trigger: ['change', 'blur'] }],
        email: [{ pattern: /^([a-zA-Z]|[0-9])(\w|\-|\.)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱', trigger: ['change', 'blur'] }]
      }
    }
  },
  mounted() {
    this.registerForm = JSON.parse(localStorage.getItem('registerForm'))
  },
  methods: {
    registerEnd() {
      this.$refs['registerEndForm'].validate((valid) => {
        if (valid) {
          const option = {
            ...this.registerForm,
            ...this.registerEndForm
          }
          this.$store.dispatch('register', option).then(data => {
            if (data.companyId === '-1') {
              const path = '/-1/company/index'
              this.$router.push({ path })
            } else {
              const path = '/' + BIO.tenTo62(data.companyId) + '/company/index'
              this.$router.push({ path })
            }
          })
        } else {
          return false
        }
      })
    },
    // 取消
    registerCancel() {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "login.css";
  /deep/.el-input--mini .el-input__inner { height:40px; line-height:40px; font-size:14px;}
</style>
