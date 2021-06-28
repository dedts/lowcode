<template>
  <div>
    <div class="header" />
    <div class="info">
      <!--头像-->
      <div class="imgBox">
        <img v-if="info.headPortrait" :src="info.headPortrait" alt="" class="img">
        <div v-else :style="{'background-color': bgColor('')}" class="imgDefault">
          {{ info.name.substring(info.name.length-2) }}
        </div>
        <div class="userInfo">
          <div>
            <span class="title">{{ info.name }}</span>
            <span class="status inlineBlock ml5">{{ info.statusDec }}</span>
            <el-button v-if="info.status===2||info.status===5" type="text" @click="sendInfo">
              发送短信邀请
            </el-button>
          </div>
          <div class="text mt10">
            {{ info.sex===null? '':info.sex?'男':'女' }}
          </div>
        </div>
      </div>
      <!--信息-->
      <div>
        <div style="margin-top: 60px;">
          <div class="mb15 label">
            手机号
          </div>
          <div class="text">
            {{ info.mobile }}
          </div>
        </div>
        <div class="mt30">
          <div class="mb15 label">
            部门
          </div>
          <div class="text">
            {{ info.departmentDto.departmentName }}
          </div>
        </div>
        <div class="mt30">
          <div class="mb15 label">
            备注
          </div>
          <div class="text">
            {{ info.remark }}
          </div>
        </div>
        <div class="mt30">
          <div class="mb15 label">
            应用权限
          </div>
          <div class="text">
            {{ info.appNames }}
          </div>
        </div>
        <div class="mt30">
          <div class="mb15 label">
            邮箱
          </div>
          <div class="text">
            {{ info.email }}
          </div>
        </div>
      </div>
      <!--按钮-->
      <div class="tac">
        <el-button v-if="!info.isCompanyCreate" type="primary" plain style="width: 100%;" class="mb15" @click="memberEdit">
          编辑
        </el-button>
        <el-button type="text" style="margin-left: 0" @click="jump">
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { findUserInfo } from '../../api/member'
import { sendMessage } from '../../api/login'
import { aplictionList } from '../../api/company'
import { getCompanyId } from '../../utils/auth'
import { BIO } from '../../utils/bio'

export default {
  data() {
    return {
      info: {
        name: '',
        departmentDto: {}
      },
      departmentList: [],
      applicationList: [],
      companyId: BIO.s62to10(this.$route.params.companyId)
    }
  },
  computed: {
    bgColor(status) {
      return function(status) {
        if (status === '活跃') {
          return '#FA8C16'
        } else if (status === '禁用') {
          return '#FF5722'
        } else {
          return '#4557F6'
        }
      }
    }
  },
  mounted() {
    this.info.userId = this.$route.query.userId
    this.init()
    this.getUserInfo()
  },
  methods: {
    init() {
      const option = {
        companyId: this.companyId
      }
      aplictionList(option).then(res => {
        this.applicationList = res.result
      })
    },
    getUserInfo() {
      const option = {
        userId: this.info.userId,
        companyId: this.companyId
      }
      findUserInfo(option).then(res => {
        this.info = res.body
        this.info.statusDec = this.userStatus(this.info.status)
        this.info.appNames = this.info.appDtoList.map(m => m.name).join(', ')
      })
    },
    userStatus(key) {
      let status = ''
      switch (key) {
        case 0:
          status = '活跃'
          break
        case 1:
          status = '正常'
          break
        case 2:
          status = '未激活'
          break
        case 3:
          status = '删除'
          break
        case 4:
          status = '禁用'
          break
        case 5:
          status = '已拒绝'
          break
      }
      return status
    },
    // 编辑员工
    memberEdit() {
      const path = '/' + BIO.tenTo62(this.companyId) + '/company/memberEdit'
      this.$router.push({ path, query: { userId: this.info.userId }})
    },
    // 发送短信邀请
    sendInfo() {
      const option = {
        mobile: this.info.mobile,
        sendType: 104
      }
      sendMessage(option).then(res => {

      })
    },
    // 返回
    jump() {
      const path = '/' + this.$route.params.companyId + '/company/index'
      this.$router.push({ path, query: { from: 'member' }})
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .header{height: 165px;background: url("../../assets/memberbg.png");}
  .info{width:30%;margin: 0 auto;}
  .imgBox{display: flex;position: absolute;top: 30px;}
  .img{width: 160px;height: 160px;box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.1); border: 3px solid #fff;
    box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.1);}
  .imgDefault{width: 160px;height: 160px;text-align: center;line-height: 160px;color:#fff;font-size: 38px;box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.1);border: 3px solid #fff;}
  .userInfo{display: flex;justify-content:flex-end;flex-wrap: wrap;flex-direction: column;margin-left: 15px;}
  .status{display:inline-block;font-size: 12px;color: rgba(0, 0, 0, 0.65);border: 0.5px solid #D9D9D9;padding: 0 5px;
    background-color: #F5F5F5;height: 20px;line-height: 20px;margin-right: 5px;}
  .text{color:rgba(0, 0, 0, 0.65);font-size: 14px;}
  .title{color: rgba(0, 0, 0, 0.85);font-size: 18px;}
  .label{color:rgba(0, 0, 0, 0.45);font-size: 12px;}
  .btn{color: #4557F6;width: 100%;height: 38px;border: 1px solid #4557F6;;line-height: 38px;font-size: 14px;cursor: pointer;margin-top: 20px;text-align: center;}
</style>
