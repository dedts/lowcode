<template>
  <div>
    <div class="header" />
    <div class="info">
      <!--头像-->
      <div class="imgBox">
        <avater :image-url.sync="info.headPortrait" :border="true" />
      </div>
      <!--信息-->
      <div style="margin-top: 60px;">
        <el-form ref="ruleForm" :model="info" :rules="rules">
          <el-form-item v-if="!from" label="用户状态" prop="status">
            <el-select v-model="info.status" :disabled="info.status===2" placeholder="" style="width: 100%">
              <el-option v-show="false" :value="0" label="活跃" />
              <el-option :value="1" label="正常" />
              <el-option v-show="false" :value="2" label="未激活" />
              <el-option v-show="false" :value="3" label="删除" />
              <el-option :value="4" label="禁用" />
              <el-option v-show="false" :value="5" label="已拒绝" />
            </el-select>
          </el-form-item>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="info.name" placeholder="填写姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="sex">
                <el-select v-model="info.sex" placeholder="选择性别" style="width: 100%">
                  <el-option :value="true" label="男" />
                  <el-option :value="false" label="女" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="!from" label="邮箱" prop="email">
            <el-input v-model="info.email" placeholder="填写邮箱" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="info.mobile" readonly placeholder="填写手机号">
              <i slot="suffix" class="el-input__icon el-icon-edit" style="color:#4557F6" @click="openDialog" />
            </el-input>
          </el-form-item>
          <el-form-item v-if="!from" label="部门" prop="departmentId">
            <el-select v-model="info.departmentId" placeholder="选择部门" style="width: 100%">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.departmentName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="!from && !info.isAdmin && !info.isCompanyCreate" label="可选应用" prop="appIds">
            <el-select v-model="info.appIds" placeholder="请选择应用" multiple style="width: 100%">
              <el-option
                v-for="item in applicationList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <span>{{ item.name }}</span>
                <span style="color: #8492a6; font-size: 13px">{{ item.isRole?'':'（没有权限）' }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息" prop="remark">
            <el-input v-model="info.remark" placeholder="备注信息" />
          </el-form-item>
        </el-form>
      </div>
      <!--新增按钮-->
      <div class="mb30 tac">
        <el-button type="primary" style="width: 100%" class="mb15" @click="submit">
          保存
        </el-button>
        <div v-if="from" style="display: flex;justify-content: space-between">
          <el-button type="text" class="mb15" @click="loginOut">
            退出登录
          </el-button>
          <el-button type="text" class="mb15" @click="jump">
            取消
          </el-button>
        </div>
        <div v-else>
          <el-button type="text" class="mb15" @click="jump">
            取消
          </el-button>
        </div>
      </div>
      <!--修改手机号-->
      <el-dialog :visible.sync="editDialog" :show-close="false" :close-on-click-modal="false" width="450px">
        <div>
          <span class="title">修改手机号</span>
          <el-form ref="modifyMobile" :model="editData" :rules="modifyMobileRules">
            <el-form-item prop="mobile">
              <el-input v-model="editData.mobile" placeholder="请输入手机号" class="mt15" />
            </el-form-item>
            <el-form-item prop="code">
              <el-input v-model="editData.code" placeholder="验证码">
                <i v-show="!isGetCode" slot="suffix" class="el-input__icon mr10" style="color: #595959;cursor: pointer" @click="getCode">获取验证码</i>
                <i v-show="isGetCode" slot="suffix" class="el-input__icon mr10">{{ countdown }}秒后可再次获取</i>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cencelDialog">取 消</el-button>
          <el-button type="primary" @click="comfirmEdit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Avater from '../../components/Upload/avatar'
import { userUpdate, findUserInfo } from '../../api/member'
import { searchDepartments, aplictionList } from '../../api/company'
import { sendMessage, checkMessageCode } from '../../api/login'
import { getCompanyId, removeAppId, removeToken, removeUserId } from '../../utils/auth'

export default {
  components: { Avater },
  data() {
    return {
      info: {
        headPortrait: null,
        status: null,
        departmentId: null
      },
      rules: {
        name: [{ required: true, pattern: /^([\u4e00-\u9fa5][\u4e00-\u9fa5\-_~]{1,9})$|^([a-zA-Z][a-zA-Z\-_~]{2,19})$/, message: '请输入正确姓名', trigger: ['change', 'blur'] }],
        mobile: [{ required: true, pattern: /^1[3-9](\d{9})$/, message: '请输入正确手机号', trigger: ['change', 'blur'] }],
        // departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        email: [{ pattern: /^([a-zA-Z]|[0-9])(\w|\-|\.)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱', trigger: ['change', 'blur'] }]
      },
      editDialog: false,
      editData: {
        mobile: '',
        code: ''
      },
      modifyMobileRules: {
        mobile: [{ required: true, pattern: /^1[3-9](\d{9})$/, message: '请输入正确手机号', trigger: ['change', 'blur'] }],
        code: [{ required: true, message: '请输入验证码', trigger: ['blur'] }]
      },
      departmentList: [],
      applicationList: [],
      countdown: 60,
      isGetCode: false
    }
  },
  computed: {
    from() {
      // 'avatar' 点击头像；  ''，成员
      return this.$route.query.from || ''
    },
    userId() {
      return this.$route.query.userId
    }
  },
  watch: {
    userId: function() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.$refs['ruleForm'] !== undefined) {
        this.$refs['ruleForm'].resetFields()
      }
      this.getUserInfo()
      if (!this.from) {
        this.getSelect()
      }
    },
    getSelect() {
      const option = {
        companyId: getCompanyId()
      }
      searchDepartments(option).then(res => {
        this.departmentList = res.body.data
      })
      aplictionList({ ...option, userId: this.userId }).then(res => {
        this.applicationList = res.body
      })
    },
    getUserInfo() {
      const option = {
        userId: this.userId
      }
      if (getCompanyId() !== 'null' && getCompanyId() !== null && getCompanyId() !== '-1') {
        option.companyId = getCompanyId()
      }

      findUserInfo(option).then(res => {
        this.info = res.body
      })
    },
    // 提交
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.editMember()
        } else {
          return false
        }
      })
    },
    // 编辑员工
    editMember() {
      const option = {
        userId: this.userId,
        status: this.info.status,
        appIds: this.info.appIds,
        mobile: this.info.mobile,
        email: this.info.email,
        name: this.info.name,
        sex: this.info.sex,
        remark: this.info.remark,
        headPortrait: this.info.headPortrait,
        departmentId: this.info.departmentId
      }
      if (getCompanyId() !== 'null' && getCompanyId() !== null) {
        option.companyId = getCompanyId()
      }
      userUpdate(option).then(res => {
        this.$message.success('编辑成功')
        if (!this.from) {
          const path = '/' + this.$route.params.companyId + '/company/index'
          this.$router.push({ path, query: { from: 'member' }})
        } else {
          this.$router.go(-1)
        }
      })
    },
    openDialog() {
      if (this.$refs['modifyMobile'] !== undefined) {
        this.$refs['modifyMobile'].resetFields()
      }
      this.editDialog = true
    },
    // 获取验证码
    getCode() {
      if (!this.editData.mobile) {
        this.$message.error('请输入手机号码')
        return
      }
      const option = {
        mobile: this.editData.mobile,
        sendType: 103
      }
      sendMessage(option).then(res => {
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
    cencelDialog() {
      this.editData.code = ''
      this.editData.mobile = ''
      this.editDialog = false
      this.isGetCode = false
    },
    comfirmEdit() {
      this.$refs.modifyMobile.validate(valid => {
        if (valid) {
          const option = {
            mobile: this.editData.mobile,
            sendType: 103,
            verifyCode: this.editData.code
          }
          checkMessageCode(option).then(res => {
            this.info.mobile = this.editData.mobile
            this.cencelDialog()
          })
        }
      })
    },
    // 取消
    jump() {
      if (this.from) {
        this.$router.go(-1)
      } else {
        const path = '/' + this.$route.params.companyId + '/company/index'
        this.$router.push({ path, query: { from: 'member' }})
      }
    },
    // 退出登录
    loginOut() {
      removeAppId()
      removeToken()
      removeUserId()
      this.$router.push('/')
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .header{height: 165px;background: url("../../assets/memberbg.png");}
  .info{width:30%;margin: 0 auto;}
  .imgBox{display: flex;position: absolute;top: 40px;z-index: 999;}
  .title{color: rgba(0, 0, 0, 0.85);font-weight: 500;font-size: 16px;line-height: 28px;}
  /deep/ .el-checkbox__input.is-checked+.el-checkbox__label{color:rgba(0, 0, 0, 0.45)}
  /deep/ .el-checkbox__label{color:rgba(0, 0, 0, 0.45);font-size: 12px;}
</style>
