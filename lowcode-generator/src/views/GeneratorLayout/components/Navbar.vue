<template>
  <div class="navbar">
    <el-row>
      <el-col :span="12">
        <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
        <breadcrumb />
      </el-col>
      <el-col :span="12" align="right">
        <div class="right-menu">
          <!-- 消息 -->
          <div class="iconMsgBox" >
            <el-badge v-if="unread" :value="unread" class="item" title="消息">
              <i class="el-icon-bell" style="font-size:26px;" @click="showHidePop"/>
            </el-badge>
            <i v-else class="el-icon-bell" style="font-size:28px;" title="消息" @click="showHidePop"/>
            <!-- 消息下拉框 -->
            <div v-show="msgFlag" class="msgList" @mouseleave="hidePop">
              <h3 class="msgTop"><span class="msg">消息通知</span><span class="allRead" @click="allRead">全部已读</span></h3>
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
                          <i :class="['iconfont',item.tip]" style="font-size: 20px;color:#fff"/>
                        </div>
                      </template>
                      <!--工作流-->
                      <template v-if="item.type==='task'">
                        <div :style="{'background-color':item.bgc}" class="img">
                          <i :class="['iconfont',item.tip]" style="font-size: 20px;color:#fff"/>
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
                          <i class="iconfont iconri-notification--line" style="font-size: 20px;color:#fff"/>
                        </div>
                      </template>
                    </span>
                    <span class="msgName">{{ item.title }}</span>
                    <span class="msgCt">{{ item.content }}</span>
                    <el-row style="height: 28px;line-height: 28px;">
                      <el-col :span="12"><i class="el-icon-time" />&nbsp;{{ item.createTime }}</el-col>
                      <el-col v-if="!(item.type==='task'&&(!item.url || !item.formId))" :span="12" align="right"><a href="#none" @click="showMessage(index)">立即查看&nbsp;&gt;</a></el-col>
                    </el-row>
                  </li>
                </ul>
              </el-main>
            </div>
          </div>
          <!-- 头像 -->
          <div class="userHeader">
            <img v-if="$store.state.user.avatar" :src="$store.state.user.avatar">
            <div v-else class="imgDefault">{{ $store.state.user.name.substring($store.state.user.name.length-2) }}</div>
          </div>
          <div>
            <i title="控制台" class="iconfont iconguanli" @click="layout"/>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { messageReadAll, messageRead } from '../../../api/message'
import { BIO } from '@/util/bio.js'
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      msgFlag: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ]),
    unread() {
      return this.$store.state.message.unread
    },
    messageList() {
      return this.$store.state.message.messageList
    }
  },
  inject: ['refresh'],
  mounted() {
    this.$store.dispatch('getUnreadNum')
    this.getMessage()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    // 显示消息页
    showMessage(index) {
      messageRead({ id: this.messageList[index].id }).then(res => {
        const msg = this.messageList[index]
        const regPos = /^[0-9]+$/
        if (msg.type === 'user' && regPos.test(msg.url)) {
          if (process.env.NODE_ENV === 'production') {
            // 生产环境
            window.open('http://console.sangon.net/#/' + BIO.tenTo62(msg.url) + '/app/', '_self')
          } else if (process.env.NODE_ENV === 'development') {
            // 测试环境
            window.open('http://localhost:8080/#/' + BIO.tenTo62(msg.url) + '/app', '_self')
          }
        } else if (msg.type === 'task') {
          if (!msg.url || !msg.formId) {
            return
          }
          const p = msg.url ? ('?mongoDataId=' + msg.url) : ''
          // type=task,url是数据id，若url为空，则是删除；若url不为空，则是新增或者删除 mongoDataId
          if (process.env.NODE_ENV === 'production') {
            // 生产环境
            window.open('https://console.sangon.net/#/' + BIO.tenTo62(msg.appId) + '/app/report/' + msg.formId + p, '_self')
          } else if (process.env.NODE_ENV === 'development') {
            // 测试环境
            window.open('http://localhost:8080/#/' + BIO.tenTo62(msg.appId) + '/app/report/' + msg.formId + p, '_self')
          }
        } else {
          window.open(this.messageList[index].url, '_self')
        }
        this.$store.dispatch('getUnreadNum')
        this.msgFlag = false
        this.refresh()
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
    layout() {
      const companyId = this.$store.state.user.activeCompanyId
      window.location.href = process.env.VUE_APP_COMPANY_API + BIO.tenTo62(companyId) + '/company/index'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
  .hamburger-container {line-height: 58px;height: 50px;float: left;padding: 0 10px;}
  .right-menu {
    display: flex;
    justify-content: flex-end;
    height: 100%;
    &:focus{outline: none;}
  }
}
/deep/ .el-badge__content.is-fixed{top: 10px;}
iconMsgBox {position: relative;margin-top:12px; height:30px; line-height:30px; }
.userHeader { width:36px; height:36px; margin:7px 20px 0; overflow:hidden; border-radius:20px;cursor: pointer }
.userHeader img { width:36px; height:36px; vertical-align: top; }
.imgDefault{width: 36px;height: 36px;line-height: 36px;background-color: #2C2C2C;color:#fff;border-radius: 50%;text-align: center;}
.msgList { width:340px; max-height:430px; box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.1); background:#ffffff; position:relative;top:-5px; z-index: 10;
  overflow: hidden;}
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
.iconguanli { margin-right:20px; font-size:20px; color:#909399; cursor:pointer; }
.el-icon-bell {line-height:50px; cursor:pointer; color:#909399; }
</style>

