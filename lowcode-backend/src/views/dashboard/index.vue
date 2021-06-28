<template>
  <div class="dashboard-container">
    <div class="indexBg">
      <div class="dashboardIndex">
        <el-row :gutter="50" class="bashboardBox">
          <el-col :span="10" class="dashboardLeft">
            <h3>智慧云低代码开发平台</h3>
            <p>轻量级、可自定义的工作流管理软件、协作软件、saas企业管理软件、工作流管理，轻松搞定工程项目管理、企业流程管理</p>
            <el-button type="primary" size="large" class="btnStart" @click="startLowcode()">
              立即开始<svg-icon icon-class="iconJt" class-name="btnIconStart" />
            </el-button>
          </el-col>
          <el-col :span="14">
            <div class="dashboardRight">
              <img src="@/assets/indexImg.png">
              <div class="iconXs">
                <i /><i /><i />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!--<div class="footer">-->
      <!--<a href="@/assets/gongshang.jpg" target="_blank">北京善工智联科技有限公司</a><br>-->
      <!--<a href="http://beian.miit.gov.cn/publish/query/indexFirst.action" target="_blank">京ICP备20008805号-1</a>-->
      <!--</div>-->
      <!--<div class="footer">-->
        <!--<a href="@/assets/gongshang.jpg" target="_blank">善工智联</a><br>-->
        <!--<a href="http://www.beian.miit.gov.cn" target="_blank">京ICP备20008805号-1</a>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import { encrypt, decrypt } from '@/utils/jsEncrypt'
import { getToken } from '../../utils/auth'

export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'language'
    ]),
    lang: {
      get() {
        return this.$store.state.app.language
      },
      set(lang) {
        this.$i18n.locale = lang
        this.$store.dispatch('setLanguage', lang)
      }
    }
  },
  mounted() {},
  methods: {
    // encrypt
    // decrypt,
    startLowcode() {
      this.$router.push('../../login/index')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.indexBg { min-height:calc(100vh - 64px); border:1px solid #ffffff; background: url('../../assets/indexBg.png') left bottom repeat-x; }
.dashboardIndex { margin:0 140px; }
.bashboardBox { margin:8% 0 30px; }
.dashboardLeft h3 { margin:80px 0 30px; font-size:38px; line-height:84px; }
.dashboardLeft p { font-size:18px; line-height:28px; color:rgba(0,0,0,0.65); }
.btnStart { margin-top:30px; width:150px; }
.btnIconStart { margin-left:5px; }
.dashboardRight { padding:100px 0; border:1px solid rgba(0,0,0,0.85); border-radius:4px; box-shadow:0px 4px 8px rgba(0, 0, 0, 0.1); position:relative; }
.dashboardRight img { margin:0 auto; width:60%; display:block; }
.iconXs { wdith:100px; height:30px; position:absolute; right:10px; top:10px; z-index:3; }
.iconXs i { margin-left:10px; width:12px; height:12px; display:inline-block; border: 1px solid rgba(0, 0, 0, 0.85); border-radius:4px; }
.footer { margin-top:80px; padding-top:30px; height:130px; width:100%; line-height:30px; font-size:14px; text-align:center; }
.footer a { color:#666;  }
</style>
