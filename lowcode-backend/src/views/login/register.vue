<template>
  <div class="loginWrap">
    <div class="login">
      <el-row class="loginList">
        <el-col><h3>注册</h3></el-col>
      </el-row>
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules">
        <el-form-item prop="mobile">
          <el-input v-model.trim="registerForm.mobile" placeholder="手机号" />
        </el-form-item>
        <el-form-item prop="verifyCode">
          <el-row>
            <el-col>
              <el-input v-model.trim="registerForm.verifyCode" placeholder="验证码">
                <i v-show="!isGetCode" slot="suffix" class="el-input__icon getYzm" @click="getCode">获取验证码</i>
                <i v-show="isGetCode" slot="suffix" class="el-input__icon getYzm">{{ countdown }}秒后可再次获取</i>
              </el-input>
            </el-col>
            <!--<el-col :span="8">-->
            <!--<span v-show="!isGetCode" class="getYzm" @click="getCode">获取验证码</span>-->
            <!--<span v-show="isGetCode" class="getYzm">{{ countdown }}秒后可再次获取</span>-->
            <!--</el-col>-->
          </el-row>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" :type="inputText" auto-complete="off" placeholder="设置登录密码" @focus="inputText='password'" />
        </el-form-item>
      </el-form>
      <el-row class="loginList">
        <el-col>
          <el-button type="primary" class="btnLogin" @click="nextStep()">
            继续<svg-icon icon-class="iconJt" class-name="ml5" />
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button type="text" class="btnText" @click="loginUser()">
            已有账号，立即登录
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { sendMessage, checkMessageCode } from '../../api/login'
import { findInvitation } from '../../api/member'
import { setUserId } from '../../utils/auth'
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
      inputText: 'text',
      isGetCode: false,
      countdown: null, // 倒计时
      registerForm: {
        mobile: '',
        password: '',
        verifyCode: ''
      },
      registerRules: {
        mobile: [{ required: true, pattern: /^1[3-9](\d{9})$/, message: '请输入正确手机号', trigger: ['change', 'blur'] }],
        password: [{ required: true, validator: password, trigger: ['blur'] }],
        verifyCode: [{ required: true, message: '请输入验证码', trigger: ['change', 'blur'] }]
      }
    }
  },
  methods: {
    // 获取验证码
    getCode() {
      if (!this.registerForm.mobile) {
        this.$message.error('请输入手机号码')
        return
      }
      const option = {
        sendType: 101,
        mobile: this.registerForm.mobile
      }
      sendMessage(option).then(() => {
        this.$message.success('发送成功')
        this.isGetCode = true
        this.getCountdown()
      })
    },
    // 倒计时
    getCountdown() {
      this.countdown = 60
      const timeClock = setInterval(() => {
        this.countdown--
        if (this.countdown === 0) {
          clearInterval(timeClock)
          this.isGetCode = false
        }
      }, 1000)
    },
    // 继续
    nextStep() {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          const option = {
            sendType: 101,
            mobile: this.registerForm.mobile,
            verifyCode: this.registerForm.verifyCode
          }
          checkMessageCode(option).then(() => {
            findInvitation({ mobile: this.registerForm.mobile }).then(res => {
              const params = {
                mobile: this.registerForm.mobile,
                password: this.registerForm.password
              }
              localStorage.setItem('registerForm', JSON.stringify(params))
              if (res.body) {
                const userId = res.body.invitee
                setUserId(userId)
                // 有邀请
                this.$router.push({ path: '/invite/accept', query: { from: 'register' }})
              } else {
                // 无邀请
                this.$router.push('./registerend')
              }
            })
          })
        } else {
          return false
        }
      })
    },
    // 已有账号，立即登录
    loginUser() {
      this.$router.push('../../login/index')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "login.css";
  /deep/.el-input--mini .el-input__inner { height:40px; line-height:40px; font-size:14px;}
</style>
