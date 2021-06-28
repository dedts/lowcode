<template>
  <div class="navbar">
    <div class="navRow">
      <el-row>
        <el-col :span="12">
          <span class="logoCol">
            <div class="hubebuyLogo" @click="backIndex"><img src="@/assets/huberbuyloginlogo.png"></div>
            <!--<svg-icon icon-class="sangonlogo" class-name="logo" />-->
          </span>
          <span class="logoCol">
            <!--<svg-icon icon-class="nocode" class-name="nocodeLogo" />-->
          </span>
        </el-col>
        <el-col :span="12" align="right">
          <!-- 登录注册 -->
          <div v-if="$route.meta.btnShow">
            <el-button type="text" class="btn" @click="userLogin()">
              登录
            </el-button>
            <el-button type="primary" class="btn" @click="userRegister()">
              注册
            </el-button>
          </div>
          <!-- 头像 -->
          <!--<theme-picker class="right-menu-item hover-effect" />-->
          <div v-if="$route.meta.avatarShow" class="userHeader" @click="editUser">
            <img v-if="$store.state.user.avatar" :src="$store.state.user.avatar">
            <div v-else class="imgDefault">
              {{ $store.state.user.name.substring($store.state.user.name.length-2) }}
            </div>
          </div>
          <!-- 消息 -->
          <div v-if="$route.meta.infoShow" class="iconMsgBox">
            <el-badge v-if="unread" :value="unread" class="item">
              <svg-icon icon-class="iconMsg" class-name="iconMessage" @click.stop="showHidePop()" />
            </el-badge>
            <svg-icon v-else icon-class="iconMsg" class-name="iconMessage" @click.stop="showHidePop()" />
            <!-- 消息下拉框 -->
            <div v-show="msgFlag" class="msgList" @mouseleave="hidePop()">
              <h3 class="msgTop">
                <span class="msg">消息通知</span><span class="allRead" @click="allRead">全部已读</span>
              </h3>
              <el-main class="msgCont">
                <!-- 无消息 -->
                <img v-if="!messageList.length" src="@/assets/noMessage.png" class="noMsg">
                <!-- 消息列表 -->
                <ul v-else>
                  <li v-for="(item,index) in messageList" :key="item.id" class="reading">
                    <span v-if="item.readed===0" class="iconRed" />
                    <span class="msgHeader">
                      <!--公司-->
                      <template v-if="item.type==='user'">
                        <img v-if="item.icon" :src="item.icon" alt="" class="img">
                        <div v-else class="avatar">{{ item.title && item.title.substring(item.title.length-2) }}</div>
                      </template>
                      <!--应用-->
                      <template v-if="item.type==='app'">
                        <div :style="{'background-color':item.bgc}" class="img">
                          <svg-icon :icon-class="item.tip+'-fff'" style="font-size: 20px;" />
                        </div>
                      </template>
                      <!--工作流-->
                      <template v-if="item.type==='task'">
                        <div :style="{'background-color':item.bgc}" class="img">
                          <svg-icon :icon-class="item.tip+'-fff'" style="font-size: 20px;" />
                        </div>
                      </template>
                      <!--公司-->
                      <template v-if="item.type==='com'">
                        <img v-if="item.icon" :src="item.icon" alt="" class="img">
                        <div v-else class="avatar" style="background-color:#FAAD14;">{{ item.title && item.title.substring(item.title.length-2) }}</div>
                      </template>
                      <!--系统消息-->
                      <template v-if="item.type==='sys'">
                        <div class="img" style="background-color:#4557F6;">
                          <svg-icon icon-class="iconMsg-fff" style="font-size: 20px;" />
                        </div>
                      </template>
                    </span>
                    <span class="msgName">{{ item.title }}</span>
                    <span class="msgCt">{{ item.content }}</span>
                    <el-row class="msgBt">
                      <el-col :span="12">
                        <i class="el-icon-time" />&nbsp;{{ item.createTime }}
                      </el-col>
                      <el-col v-if="!(item.type==='task'&&(!item.url || !item.formId))" :span="12" align="right">
                        <span @click="showMessage(index)">立即查看&nbsp;&gt;</span>
                      </el-col>
                    </el-row>
                  </li>
                </ul>
              </el-main>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
import { messageReadAll, messageRead } from '../../../api/message'
import { BIO } from '@/utils/bio.js'
export default {
  components: {
    ThemePicker
  },
  data() {
    return {
      msgFlag: false,
      messageList: []
    }
  },
  computed: {
    unread() {
      return this.$store.state.message.unread
    }
  },
  mounted() {
    // const whiteList = ['/login/index', '/login/password', '/login/setpassword', '/login/register', '/login/registerend','/dashboard']
    // console.log(this.$route.path)
    // console.log(whiteList.indexOf(this.$route.path))
    // if (whiteList.indexOf(this.$route.path) === -1) {

    // }
  },
  methods: {
    userLogin() {
      this.$router.push('../../login/index')
    },
    userRegister() {
      this.$router.push('../../login/register')
    },
    // 显示消息页
    showMessage(index) {
      messageRead({ id: this.messageList[index].id }).then(res => {
        const msg = this.messageList[index]
        const regPos = /^[0-9]+$/
        if (msg.type === 'user' && regPos.test(msg.url)) {
          window.open(process.env.VUE_APP_DESIGN_API + BIO.tenTo62(msg.url) + '/app/', '_self')
        } else if (msg.type === 'task') {
          if (!msg.url || !msg.formId) {
            return
          }
          const p = msg.url ? ('?mongoDataId=' + msg.url) : ''
          // type=task,url是数据id，若url为空，则是删除；若url不为空，则是新增或者删除 mongoDataId
          console.log(process.env.VUE_APP_GENERATOR_API + BIO.tenTo62(msg.appId) + '/app/report/' + msg.formId + p)
          // debugger
          window.open(process.env.VUE_APP_GENERATOR_API + BIO.tenTo62(msg.appId) + '/app/report/' + msg.formId + p, '_self')
        } else {
          window.open(this.messageList[index].url, '_self')
        }
        this.msgFlag = false
      })
    },
    // 消息
    showHidePop() {
      this.msgFlag = true
      this.getMessage()
    },
    hidePop() {
      setTimeout(() => {
        this.msgFlag = false
      }, 1000)
    },
    // 获取消息列表
    getMessage() {
      this.$store.dispatch('getMessageLists').then(() => {
        this.messageList = this.$store.state.message.messageList
        // console.log(this.messageList)
        this.$store.dispatch('getUnreadNum')
      })
    },
    // 全部已读
    allRead() {
      messageReadAll().then(res => {
        this.$message.success('全部已读')
        this.getMessage()
        this.$store.dispatch('getUnreadNum')
      })
    },
    editUser() {
      const path = '/' + this.$route.params.companyId + '/company/memberEdit'
      this.$router.push({ path, query: { userId: this.$store.state.user.userId, from: 'avatar' }})
    },
    // 返回首页
    backIndex() {
      // const path = '/' + this.$route.params.companyId + '/company/index'
      // this.$router.push({ path })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar { height:64px; line-height:64px; /*box-shadow:1px 1px 2px #f5f5f5;*/ }
.navRow { padding:0 40px; }
.navRow .logoCol { float:left; margin-left:10px; }
.logo { font-size:35px; vertical-align: middle; }
.nocodeLogo { font-size:65px; vertical-align: middle; }
.btn { width:110px; height:35px; font-size:16px; }
.iconMsgBox { float:right; margin-top:12px; height:30px; line-height:30px; position:relative; }
.iconMessage { font-size:24px; color:rgba(0, 0, 0, 0.65); }
.userHeader { float:right; margin:7px 0 0 20px; width:36px; height:36px; overflow:hidden; border-radius:18px;cursor: pointer }
.userHeader img { width:36px; height:36px; vertical-align: top; }
.imgDefault{width: 36px;height: 36px;line-height: 36px;background-color: #2C2C2C;color:#fff;border-radius: 50%;text-align: center; overflow:hidden; }
.msgList { width:340px; max-height:430px; box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.1); background:#ffffff; position:absolute; right:-20px; top:40px; z-index: 10; }
.msgTop  { padding:0 16px; height:45px; line-height:45px; border-bottom:1px solid #F5F6FA; }
.msg     { float:left; font-size:14px; }
.allRead { float:right; cursor:pointer; font-size:12px; color:rgba(0, 0, 0, 0.65); }
.msgCont { padding:0px; max-height:385px; }
.msgCont ul { margin:10px 0 20px 0; }
.msgCont li { padding:0 16px 0 58px; min-height:88px; font-size:12px; position:relative; text-align:left; color:rgba(0, 0, 0, 0.25); overflow:hidden; }
.msgCont li:hover { background:#F5F5F5; }
.msgCont .msgHeader { width:32px; height:32px; display:block; border-radius:50%; position:absolute; left:16px; top:10px; z-index:3;}
.avatar{background-color:#2C2C2C;color: #fff;border-radius: 50%;text-align: center;line-height: 32px}
.img{width:32px; height:32px;border-radius:50%;line-height: 32px;text-align: center;}
.msgCont .msgName { margin-top:8px; font-weight:bold; height:20px; line-height:20px; display:block; overflow: hidden; }
.msgCont .msgCt { max-height:40px; line-height:20px; display:block; overflow:hidden; }
.msgCont .msgBt { border-bottom:1px solid #F5F6FA; }
.msgCont .msgBt span:hover { color:#4557F6;cursor: pointer }
.msgCont .reading .msgName { color:rgba(0, 0, 0, 0.85); }
.msgCont .reading .msgCt { color:rgba(0, 0, 0, 0.65); }
.msgCont .iconRed { width:8px; height:8px; border-radius:4px; display:block; background:#ff0000; position:absolute; left:10px; top:5px; z-index:3; }
.noMsg { margin:50px auto 50px; display:block; }

.hubebuyLogo { height:50px; overflow: hidden; cursor: pointer; }
.hubebuyLogo img { margin:10px auto 0; width:90px; display:block; }
</style>
<style>
.navRow .el-main { padding:0; }
</style>

