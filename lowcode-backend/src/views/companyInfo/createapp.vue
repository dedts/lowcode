<template>
  <div class="appWrap">
    <!-- 创建应用TITLE -->
    <div class="appTitle">
      <el-row>
        <el-col :span="12" style="font-size:24px;">
          创建应用
        </el-col>
        <el-col :span="12" align="right">
          <el-button @click="backAppList()">
            <i class="el-icon-close" />取消
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 应用模版 -->
    <div class="appTemplate">
      <h3>应用模版</h3>
      <div class="appList">
        <ul :style="{ width: appUlWidth + 'px' }">
          <li>
            <div :style="{ width: appLiWidth + 'px' }" class="appBox" @click="createAppBox()">
              <div class="appContent">
                <span class="templateCustom">自定义应用</span>
              </div>
              <div class="appFooter">
                <h4>从头开始创建</h4>
                <span>创建一个空白项目</span>
              </div>
            </div>
          </li>
          <li>
            <div :style="{ width: appLiWidth + 'px' }" class="appBox" @mouseenter="templateShow=true" @mouseleave="templateShow=false">
              <div class="appContent">
                <transition name="fade">
                  <div v-if="templateShow" class="templateIntro">
                    <span>这里显示线上销售管理的简单介绍，销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价销售管理销售管理是指通过销售报价、销售订单、销售发货、退货、销售发票处理、客户管理、价格管理等功能，对销售全过程进行有效的控制和跟踪。</span>
                    <i><el-button type="primary" class="btnMb">使用此模版创建</el-button></i>
                  </div>
                </transition>
                <img src="@/assets/test1.png">
              </div>
              <div class="appFooter">
                <h4>从头开始创建</h4>
                <span>创建一个空白项目</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      appDelDialogVisible: false,
      templateShow: false,
      appLiWidth: 291,
      appUlWidth: 955
    }
  },
  mounted() {
    // 设置我的应用列表尺寸
    this.myAppSize()
  },
  methods: {
    myAppSize() {
      /*
      *  < 1200
      * 初始值 appulWidth, appLiWidth, 3列
      * > 1200
      * 计算 appUlwidth, appLiWidth, 4列
      * */
      const _this = this
      this.computedSize(_this)
      window.onresize = function() {
        _this.computedSize(_this)
      }
    },
    computedSize(_this) {
      // 可视区宽度
      const windowWidth = document.body.clientWidth
      // 列数
      const colCount = Math.ceil((windowWidth - 326) / 320)
      if (windowWidth <= 1200) {
        // console.log('小于1200')
        _this.appUlWidth = 955
        _this.appLiWidth = 291
      } else {
        // console.log('大于1200')
        // appLiWidth = Math.floor(屏幕尺寸 - 左右padding和 - 间距 * (列数-1) - box边框 * 列数) / 列数
        _this.appUlWidth = windowWidth - 245
        _this.appLiWidth = Math.floor((windowWidth - 270 - 25 * (colCount - 1) - 2 * colCount) / colCount)
      }
    },
    // 返回应用列表
    backAppList() {
      const path = '/' + this.$route.params.companyId + '/company/index'
      this.$router.push({ path })
    },
    // 创建应用
    createAppBox() {
      const path = '/' + this.$route.params.companyId + '/company/createstart'
      this.$router.push({ path })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.appTitle { padding:15px 135px 0; height:57px; }
.appTemplate { min-height:calc(100vh - 121px); padding:0 135px; background:#F5F6FA; overflow: hidden; }
.appTemplate h3 { line-height:60px; font-weight:normal; font-size:20px; color:rgba(0, 0, 0, 0.45); }
.el-icon-close { margin-right:5px; }
.appList { margin-top:20px; }
.appList ul { display: flex; flex-wrap: wrap; }
.appList li { margin-bottom:25px; flex: 0 1 auto; }
.appBox { margin-right:25px; height:410px; border-radius:2px; border:1px solid #DBDBDB; cursor:pointer; font-size:14px; background:#ffffff; overflow:hidden; }
.appBox:hover { border:1px solid #4557F6; }
.appContent { height:336px; position:relative; overflow:hidden; }
.appContent img { width:100%; min-height:336px; }
.templateIntro { width:100%; height:336px; background:rgba(255, 255, 255, 0.95); position:absolute; left:0; top:0; z-index:3; }
.templateIntro span { padding:24px; line-height:20px; height:260px; display:block; color:rgba(0, 0, 0, 0.65); overflow:hidden; }
.templateIntro i { margin:20px 24px 0; height:40px; display:block; }
.templateCustom { margin-top:152px; display:block; text-align:center; font-size:24px; color:rgba(0, 0, 0, 0.25); }
.btnMb { width:100%; height:40px; }
.appFooter { padding-left:24px; height:73px; border-top:1px solid #DBDBDB; }
.appFooter h4   { margin-top:7px; line-height:30px; font-size:16px; color:rgba(0, 0, 0, 0.85); }
.appFooter span { font-size:12px; color:rgba(0, 0, 0, 0.45); }
.fade-enter-active, .fade-leave-active { transition:opacity.5s; }
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ { opacity: 0; }
</style>

