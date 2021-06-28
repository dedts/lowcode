<template>
  <div class="loginWrap">
    <!-- 设置登录密码 -->
    <div class="login">
      <el-row class="loginList">
        <el-col><h3>设置登录密码</h3></el-col>
      </el-row>
      <el-form ref="ruleForm" :model="info" :rules="rules">
        <el-form-item prop="password">
          <el-input v-model="info.password" placeholder="请输入新密码" show-password />
        </el-form-item>
      </el-form>
      <el-row class="loginList">
        <el-col>
          <el-button type="primary" class="btnLogin" @click="setPassword()">
            完成
          </el-button>
        </el-col>
        <el-col class="mt20" align="center">
          <el-button type="text" @click="cencle">
            取消
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { updatePassword } from '../../api/login'
export default {

  data() {
    const password = function(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const num = /^[0-9]+$|^[a-zA-z]+$/
        const rag = /^[a-zA-Z0-9\-_~@#$%&!|`.,]{8,20}$/
        if (num.test(value)) {
          callback(new Error('不能是纯数字和纯英文'))
        } else if (!rag.test(value)) {
          callback(new Error('密码为8-20位数字、英文和特殊符号'))
        } else {
          callback()
        }
      }
    }
    return {
      info: {
        password: ''
      },
      rules: {
        password: [{ required: true, validator: password, trigger: ['blur'] }]
      },
      query: {}
    }
  },
  mounted() {
    this.query = this.$route.params
  },
  methods: {
    // 设置密码
    setPassword() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const option = {
            ...this.query,
            ...this.info
          }
          updatePassword(option).then(res => {
            this.$message.success(res.message)
            this.$router.push({ name: 'login' })
          })
        } else {
          return false
        }
      })
    },
    cencle() {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "login.css";
  .getYzm { height:40px; line-height:40px; cursor:pointer; font-size:14px; text-align:center; display:block; border:1px solid #DCDFE6; color:rgba(0, 0, 0, 0.65); }
  .el-icon-warning-outline { margin-right:5px; font-size:20px; color:#4c63ed; }
  /deep/.el-input--mini .el-input__inner { height:40px; line-height:40px; font-size:14px;}
</style>
