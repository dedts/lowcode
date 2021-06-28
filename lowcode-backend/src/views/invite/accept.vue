<template>
  <div class="contentBox">
    <el-row :gutter="80">
      <el-col :span="10">
        <!--邀请人信息-->
        <div :style="{marginTop: flag.refuseFlag === true ? + '30px' : '0'}" class="flex">
          <el-avatar v-if="info.inviteHeadPortrait" :src="info.inviteHeadPortrait" />
          <el-avatar v-else>
            {{ info.inviteName }}
          </el-avatar>
          <div class="ml10 fs14 mt5">
            <div><strong>{{ info.inviteName }}</strong></div>
            <div class="mt5 c59">
              邀请您加入
            </div>
          </div>
        </div>
        <!--邀请公司信息-->
        <div class="mt20 flex" style="align-items: center">
          <img v-if="info.companyIcon" :src="info.companyIcon" class="cpmpanyLogo mr10">
          <img v-else class="cpmpanyLogo mr10" src="../../assets/companyDefault.png">
          <span class="copmanyName">{{ info.companyName }}</span>
        </div>
        <!-- 确认个人信息 -->
        <div v-if="flag.joinFlag">
          <div class="mt30 c59 mb20 fs14">
            确认个人信息
          </div>
          <el-form ref="info" :model="info" :rules="rules">
            <el-row :gutter="10" class="mb5">
              <el-col :span="16">
                <el-form-item prop="inviteeName">
                  <el-input v-model="info.inviteeName" placeholder="填写姓名" size="small" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="userSex">
                  <el-select v-model="info.userSex" placeholder="选择性别" size="small" style="width: 100%">
                    <el-option :value="true" label="男" />
                    <el-option :value="false" label="女" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!--<el-form-item prop="email">-->
            <!--<el-input v-model="info.email" placeholder="填写邮箱"/>-->
            <!--</el-form-item>-->
          </el-form>
          <div>
            <el-button type="primary" style="width: 100%" size="small" @click="confirm(1)">
              立即加入
            </el-button>
          </div>
          <div class="tac mt15">
            <el-button type="text" size="small" @click="confirm(2)">
              拒绝
            </el-button>
          </div>
        </div>
        <!-- 已加入，已拒绝 -->
        <div v-if="flag.refuseFlag" class="joinRefuseFlag">
          <span v-if="info.status === 1" class="mt30 c59 mb10 fs14">已加入</span>
          <span v-if="info.status === 2" class="mt30 c59 mb10 fs14">已拒绝</span>
        </div>
      </el-col>
      <el-col :span="10">
        <img src="../../assets/invite.png" alt="">
      </el-col>
      <el-col :span="4" align="right">
        <a class="btnClose" @click="jump"><i class="el-icon-close" />关闭</a>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { findInvitation, updateInvitation } from '../../api/member'
import { getUserId, getCompanyId } from '../../utils/auth'
import { BIO } from '../../utils/bio'

export default {
  data() {
    var checkUserName = (rule, value, callback) => {
      const reg = /^([\u4e00-\u9fa5][\u4e00-\u9fa5\-_~]{1,9})$|^([a-zA-Z][a-zA-Z\-_~]{2,19})$/
      if (value === '') {
        callback(new Error('请输入姓名'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入2到9个中文或3到19个英文字符'))
      }
    }
    return {
      info: {
        inviteHeadPortrait: '',
        inviteName: '',
        icon: '',
        companyName: '',
        companyIcon: '',
        inviteeName: null,
        userSex: null,
        email: null
      },
      flag: {
        joinFlag: false,
        refuseFlag: false // 已加入，已拒绝
      },
      registerForm: JSON.parse(localStorage.getItem('registerForm')),
      rules: {
        inviteeName: [{ validator: checkUserName, trigger: ['change', 'blur'] }],
        email: [{ pattern: /^([a-zA-Z]|[0-9])(\w|\-|\.)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱', trigger: ['change', 'blur'] }]
      }
    }
  },
  computed: {
    from() {
      // 'register' 注册页面；  ''，消息
      return this.$route.query.from || ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const params = {
      }
      if (this.from) {
        params.mobile = this.registerForm ? this.registerForm.mobile : ''
      }
      if (this.$store.state.user.userId) {
        params.userId = this.$store.state.user.userId
      }
      if (this.$route.query.invite) {
        params.invitationId = this.$route.query.invite
      }
      findInvitation(params).then(res => {
        if (res.body && res.body.status === 0) { // 未激活
          this.flag.joinFlag = true
        } else if (res.body && res.body.status === 1 || res.body.status === 2) { // 已经加入或拒绝
          this.flag.refuseFlag = true
        }
        this.info = res.body
      })
    },
    confirm(type) {
      const option = {
        status: type,
        id: this.info.id,
        userSex: this.info.userSex,
        // email: this.info.email,
        inviteeName: this.info.inviteeName
      }
      updateInvitation(option).then(() => {
        if (type === 1) { // 加入成功
          this.$message.success('加入公司成功')
          if (this.from === 'register') { // 注册进入
            const option = {
              name: this.info.inviteeName,
              sex: this.info.userSex,
              mobile: this.registerForm.mobile,
              password: this.registerForm.password
            }
            this.$store.dispatch('register', option).then(data => {
              const companyId = BIO.tenTo62(data.companyId)
              this.$router.push({ path: `/${companyId}/company/index` })
            })
          } else { // 消息进入
            this.jump()
            // const companyId = BIO.tenTo62(getCompanyId())
            // this.$router.push({ path: `/${companyId}/company/index` })
          }
        } else { // 拒绝
          this.$message.success('你已拒绝加入')
          if (this.from === 'register') {
            this.$router.push('../../login/registerend')
          } else {
            this.jump()
            // const companyId = BIO.tenTo62(getCompanyId())
            // this.$router.push({ path: `/${companyId}/company/index` })
          }
        }
      })
    },
    jump() {
      this.$router.go(-1)
      // const companyId = BIO.tenTo62(this.$route.query.company)
      // this.$router.push({ path: `/${companyId}/company/index` })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "mix.css";
  .joinRefuseFlag { margin-top:30px; }
  .btnClose { font-size:14px; color:#666666; }
  /deep/ .el-avatar>img{width: 100%}
</style>
