<template>
  <div class="widgetNavBox">
    <el-row>
      <el-col :span="4" :title="pageName" class="navText text-ellipsis">{{ pageName }}</el-col>
      <el-col :span="20" align="right">
        <!--<el-button size="mini" @click="submit">提交</el-button>-->
        <!--<el-button :disabled="true" size="mini" @click="reset">重置</el-button>-->
        <!--<el-button :disabled="true" size="mini" @click="close">关闭</el-button>-->
        <!--<el-button :disabled="true" icon="el-icon-delete" size="mini" @click="remove"></el-button>-->
        <span class="btn btnBgc">提交</span>
        <span class="btn">重置</span>
        <span class="btn">关闭</span>
        <span class="btn"><i class="iconfont iconri-delete-bin--line"/></span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default{
  props: {
    pageName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  methods: {
    // 提交
    submit() {
      console.log('提交')
    },
    // 重置
    reset() {
      console.log('重置')
    },
    // 关闭
    close() {
      console.log('关闭')
    },
    // 删除
    remove() {
      console.log('删除')
    }
  }
}
</script>
<style lang="scss" scoped>
    .widgetNavBox {width: 100%;height: 56px;line-height: 56px;border-bottom: 1px solid #efefef;padding: 0 15px;}
    .navText{font-size: 14px;color:rgba(0, 0, 0, 0.45);}
    .btn{display:inline-block;height: 36px;line-height: 28px;padding: 3px 12px;border: 1px solid  #EBEEF5;text-align: center; margin-right: 10px;color: #A9AFB5;cursor: pointer}
    .btnBgc{background-color: #797F99;color:#fff !important}
    .text-ellipsis {overflow: hidden; white-space: nowrap;text-overflow: ellipsis;}
</style>
