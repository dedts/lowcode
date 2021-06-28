<template>
  <div v-if="showPage">
    <!-- 没有公司 -->
    <div v-if="noCompanyFlag">
      <div class="noDataText">
        <i class="el-icon-warning-outline mr5" style="color:#4557F6;font-size: 16px;" />
        <span class="inlineBlock mt-5">您当前未加入任何公司，请在线下与您的管理员沟通，将您加入至公司或自行创建公司。</span>
        <el-button type="text" class="ml10" @click="jumpCreatCompany">
          立即创建
        </el-button>
      </div>
      <div class="noDataImg">
        <img src="@/assets/noData.png">
      </div>
    </div>
    <!-- 当前公司 -->
    <div v-else>
      <div class="companyInfo">
        <el-row style="padding-top: 50px;position: relative;">
          <el-col :span="2" style="width: 80px;">
            <img v-if="activeIcon" :src="activeIcon" class="companyLogo" alt="">
            <img v-else src="../../assets/companyDefault.png" class="companyLogo" alt="">
          </el-col>
          <el-col :span="20" class="mt10">
            <!--<el-dropdown class="curpion" trigger="click" @command="companyChange">-->
            <!--<span class="el-dropdown-link">-->
              <span class="fs18 color">{{ activeCompany||'暂无公司' }}</span>
              <!--<span class="fs18 color">{{ activeCompany||'点击标题切换公司' }}</span>-->
              <!--<i class="el-icon-caret-bottom el-icon&#45;&#45;right"/>-->
            <!--</span>-->
            <!--<el-dropdown-menu slot="dropdown">-->
            <!--<el-dropdown-item>创建的公司</el-dropdown-item>-->
            <!--<el-dropdown-item v-for="item in options.creat" :key="item.id" :command="item" class="fs14 color lh34" >{{ item.name }}</el-dropdown-item>-->
            <!--<el-divider/>-->
            <!--<el-dropdown-item>加入的公司</el-dropdown-item>-->
            <!--<el-dropdown-item v-for="item in options.add" :key="item.id" :command="item" :style="{color: item.status===4?'#999':''}" class="fs14 color lh34">{{ item.name }}</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
            <!--</el-dropdown>-->

            <div class="creatTime">
              创建于 {{ companyDate }}
            </div>
          </el-col>
          <!--<span style="position: absolute;right: 0px;top:70px;">-->
          <!--<el-button type="primary" @click="jumpCreatCompany">创建公司</el-button>-->
          <!--</span>-->
        </el-row>
      </div>
      <div v-if="companyStatus || companyStatus===0">
        <div v-if="companyStatus !== 4">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="应用" name="first">
              <application v-if="activeCompanyId" ref="application" :key="componentsKey" :is-admin="isAdmin" :is-company-create="isCompanyCreate" :company-id="activeCompanyId" />
            </el-tab-pane>
            <el-tab-pane label="成员" name="second">
              <member v-if="activeCompanyId" ref="member" :key="componentsKey" :company-id="activeCompanyId" :is-admin="isAdmin" :is-company-create="isCompanyCreate" />
            </el-tab-pane>
            <el-tab-pane v-if="isAdmin" label="设置" name="third">
              <setting v-if="activeCompanyId" ref="setting" :key="componentsKey" :company-id="activeCompanyId" :is-company-create="isCompanyCreate" @complete="init" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-else>
          <div class="noDataText" style="margin-top: 0;width: 300px;">
            <i class="el-icon-warning-outline mr5" style="color:#4557F6;font-size: 16px;" />
            <span class="inlineBlock mt-5">该公司账号已被禁用，请联系公司管理员。</span>
          </div>
          <div class="noDataImg">
            <img src="@/assets/noData.png">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Application from './components/application'
import Member from './components/member'
import Setting from './components/setting'
import { companyList, companyChange } from '../../api/company'
import { findUserInfo } from '../../api/member'
import { BIO } from '@/utils/bio'
export default {
  components: {
    Application,
    Member,
    Setting
  },
  data() {
    return {
      activeName: 'first',
      options: {
        creat: [],
        add: []
      },
      activeCompany: '',
      activeCompanyId: BIO.s62to10(this.$route.params.companyId),
      activeIcon: '',
      companyDate: '', // 创建时间
      companyList: [],
      isAdmin: false,
      isCompanyCreate: false,
      componentsKey: 0,
      noCompanyFlag: false, // 没有公司信息
      showPage: false, // 解决页面闪烁
      companyStatus: null
    }
  },
  mounted() {
    this.init()
    this.routeChange(this.$route.query.from)
  },
  methods: {
    init() {
      this.options.add = []
      this.options.creat = []
      companyList().then(res => {
        // console.log('init')
        const { body } = res
        this.companyList = body.company || []
        this.showPage = true
        if (this.companyList.length <= 0) {
          this.noCompanyFlag = true
          this.$router.push({ path: '/-1/company/index' })
          return false
        }
        body.company.forEach(item => {
          if (item.isAdmin) {
            this.options.creat.push({ ...item }) // 创建的公司
          } else {
            this.options.add.push({ ...item }) // 加入的公司
          }
        })
        const arr = this.companyList.filter(f => f.id === this.activeCompanyId)
        let currentCompany
        if (arr.length) {
          currentCompany = arr[0]
        }
        if (!currentCompany) {
          // 解散公司之后 进入
          currentCompany = this.options.creat[0] || this.options.add[0]
          this.activeName = 'first'
          this.activeCompanyId = currentCompany.id
          this.jump('app')
          this.componentsKey++
        }
        this.setCurrCompany(currentCompany)
        this.getPower()
      })
    },
    setCurrCompany(info) {
      this.activeCompany = info.name
      this.companyDate = info.createTime
      this.activeCompanyId = info.id
      this.activeIcon = info.icon
    },
    // 查找权限
    getPower() {
      const option = {
        userId: this.$store.state.user.userId,
        companyId: this.activeCompanyId
      }
      findUserInfo(option).then(res => {
        this.isAdmin = res.body.isAdmin
        this.isCompanyCreate = res.body.isCompanyCreate
        this.companyStatus = res.body.status
        if (this.activeName === 'third' && !this.isAdmin) {
          this.activeName = 'first'
        }
      })
    },
    // 切换公司
    companyChange(item) {
      companyChange({ companyId: item.id }).then(() => {
        this.$router.push({ path: '/' + BIO.tenTo62(item.id) + '/company/index' })
        this.activeCompanyId = item.id
        this.init()
        if (item.status !== 4) {
          this.componentsKey++
        }
      })
    },
    jump(type) {
      const companyId = BIO.tenTo62(this.activeCompanyId)
      this.$router.push({ path: '/' + companyId + '/company/index', query: { from: type }})
    },
    routeChange(type) {
      switch (type) {
        case 'app':
          this.activeName = 'first'
          break
        case 'member':
          this.activeName = 'second'
          break
        case 'setting':
          this.activeName = 'third'
          break
        default:
          this.activeName = 'first'
          break
      }
      this.componentsKey++
    },
    handleClick() {
      if (this.activeName === 'first') {
        this.jump('app')
        this.$refs.application.init()
      } else if (this.activeName === 'second') {
        this.jump('member')
        this.$refs.member.init()
      } else if (this.activeName === 'third') {
        this.jump('setting')
        this.$refs.setting.init()
      }
    },
    jumpCreatCompany() {
      this.$router.push({ path: '/companycreate/create' })
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
   /deep/.el-tabs__nav-wrap::after{height: 1px;}
  /deep/ .el-tabs__header{margin: 0;background-color: #fff;padding: 0 135px;}
  /deep/ .el-tabs__content{padding: 20px 135px 0 135px;background-color: #F5F6FA;min-height: calc(100vh - 284px);}
  .companyInfo{height: 180px;padding: 0 135px;}
  .companyLogo{width: 72px;height: 72px;}
  .creatTime{font-size: 13px;line-height: 20px;color:rgba(0, 0, 0, 0.45);}
   .noCompany { width:100%; height:calc(100vh - 64px); background:#f4f5fa; overflow:hidden; }
  .noDataText{margin:5% auto 5%;padding:0 15px;width:600px;height:52px;line-height:52px;font-size:12px;box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);border-radius: 2px;color: rgba(0, 0, 0, 0.45);background:#ffffff;}
   .noDataImg{margin:0 auto; width:288px;}
  .color{color:rgba(0, 0, 0, 0.85)}
  .fs14{font-size: 14px;}
  .fs16{font-size: 16px;}
  .fs18{font-size: 18px;}
  .lh34{line-height: 34px;}
  /deep/ .el-divider--horizontal{margin: 8px 0;}
</style>

