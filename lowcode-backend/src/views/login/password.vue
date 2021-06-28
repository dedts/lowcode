<template>
  <div class="loginWrap">
    <div class="login">
      <el-row class="loginList">
        <el-col><h3>找回密码</h3></el-col>
      </el-row>
      <el-form ref="ruleForm" :model="info" :rules="rules">
        <el-form-item prop="mobile">
          <el-input v-model="info.mobile" placeholder="手机号" />
        </el-form-item>
        <el-form-item prop="verifyCode">
          <el-row>
            <!--<el-col :span="16"><el-input v-model.trim="info.verifyCode" placeholder="验证码" /></el-col>-->
            <!--<el-col :span="8">-->
            <!--<span v-show="!isGetCode" class="getYzm" @click="getCode">获取验证码</span>-->
            <!--<span v-show="isGetCode" class="getYzm">{{ countdown }}秒后可再次获取</span>-->
            <!--</el-col>-->
            <el-col>
              <el-input v-model.trim="info.verifyCode" placeholder="验证码">
                <i v-show="!isGetCode" slot="suffix" class="el-input__icon getYzm" @click="getCode">获取验证码</i>
                <i v-show="isGetCode" slot="suffix" class="el-input__icon getYzm">{{ countdown }}秒后可再次获取</i>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-row class="loginList">
        <el-col>
          <el-button type="primary" class="btnLogin" @click="nextStep()">
            下一步<svg-icon icon-class="iconJt" class-name="ml5" />
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
import { sendMessage, checkMessageCode } from '../../api/login'
export default {
  data() {
    return {
      info: {
        mobile: '',
        verifyCode: ''
      },
      isGetCode: false,
      countdown: null, // 倒计时
      rules: {
        mobile: [{ required: true, pattern: /^1[3-9](\d{9})$/, message: '请输入正确手机号', trigger: ['change', 'blur'] }],
        verifyCode: [{ required: true, message: '请输入验证码', trigger: ['change', 'blur'] }]
      }
    }
  },
  methods: {
    // 获取验证码
    getCode() {
      if (!this.info.mobile) {
        this.$message.error('请输入手机号码')
        return
      }
      const option = {
        sendType: 102,
        mobile: this.info.mobile
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
    // 下一步
    nextStep() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const option = {
            sendType: 102,
            mobile: this.info.mobile,
            verifyCode: this.info.verifyCode
          }
          checkMessageCode(option).then(() => {
            this.$router.push({ name: 'setpassword', params: { mobile: this.info.mobile }})
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
  /deep/.el-input--mini .el-input__inner { height:40px; line-height:40px; font-size:14px;}
</style>
