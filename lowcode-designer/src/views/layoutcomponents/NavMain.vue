<template>
  <div class="nav_main">
    <el-row>
      <el-col :span="6"><el-button type="text" class="btnMenu" @click="backApplication"><i class="iconfont iconri-menu--line"/></el-button></el-col>
      <el-col :span="12" align="center">
        <span :class="['menuTop', {curr: typePage ==='builder'}]" @click="showBuilderPage()"><i class="iconfont iconpencil-ruler--fill"/>构建器</span>
        <span :class="['menuTop', {curr: typePage ==='workflow'}]" @click="showWorkflowPage()"><i class="iconfont icongit-flow-fill"/>工作流</span>
        <span :class="['menuTop', {curr: typePage ==='setting'}]" @click="showSetPage()"><i class="iconfont iconsettings"/>设置</span>
      </el-col>
      <el-col :span="6" align="right"><el-button v-if="showPreviewBtn" type="text" class="btnPreview" @click="showPreview()">预览应用<i class="el-icon-caret-right el-icon--right"/></el-button><el-button v-preventReClick="12000" type="text" class="btnEnd" @click="appBuilder()">完成</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
import { getAppId, getCompanyId } from '@/util/auth'
import { BIO } from '@/util/bio'
export default {
  name: 'NavMain',
  props: {
    // 表单构建器显示预览按钮，列表构建器不显示预览按钮
    showHideBtnPreview: {
      type: String,
      default: ''
    },
    // typePage 构建器，工作流，设置页面区分
    typePage: {
      type: String,
      default: ''
    },
    btnEndShowHide: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      appId: getAppId()
    }
  },
  computed: {
    showPreviewBtn() {
      if (this.showHideBtnPreview === 'formPage' && this.typePage === 'builder') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    backApplication() {
      window.location.href = process.env.VUE_APP_COMPANY_API + BIO.tenTo62(getCompanyId()) + '/company/index'
    },
    showPreview() {
      this.$emit('showPreview')
    },
    showBuilderPage() {
      this.$router.push('/' + BIO.tenTo62(getAppId()) + '/design/index')
    },
    showWorkflowPage() {
      this.$router.push('/' + BIO.tenTo62(getAppId()) + '/design/workflow/workflowlist')
    },
    showSetPage() {
      this.$router.push('/' + BIO.tenTo62(getAppId()) + '/design/setting')
    },
    appBuilder() {
      this.$emit('publish')
    }
  }
}
</script>
<style scoped>
.nav_main { width:100%; height:60px; position:fixed; left:0; top:0; z-index:50; background:#232E37; }
.menuTop  { margin-right:30px; height:56px; border-bottom:4px solid #232E37; cursor:pointer; line-height:56px; display:inline-block; color: rgba(255, 255, 255, 0.25); }
.menuTop:hover,.menuTop.curr { color:#fff; border-bottom:4px solid #0097FF; }
.nav_main .el-button.btnMenu { padding:0 15px; height:56px; border-radius:0; background: rgba(0, 0, 0, 0.25); color:#fff; }
.nav_main .el-button.btnEnd { padding:0 15px; height:56px; border-radius:0; background:#0097FF; color:#fff; }
.nav_main .iconfont { font-size:16px; margin-right:5px; }
.nav_main .iconri-menu--line { font-size:20px; }
.iconarrow-right-s-fill { margin-top:10px; color:#fff; }
.el-button--text.btnPreview { color:#fff; }
</style>
