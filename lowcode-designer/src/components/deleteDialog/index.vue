<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" :show-close="false" width="480px">
    <div>
      <div class="mb15">
        <i v-if="isShowIcon" class="el-icon-error" style=" color:red;font-size: 18px;" />
        <span class="title">{{ title }}</span>
      </div>
      <span style="line-height: 25px;">{{ content }}</span>
      <el-input v-if="isShowInput" v-model="value" :placeholder="placeholder" class="mt15" />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取消</el-button>
      <el-button type="danger" @click="confirmDelete">删 除</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isShowInput: {
      type: Boolean,
      default: false
    },
    isShowIcon: {
      type: Boolean,
      default: false
    },
    isShowDelete: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: '确定删除吗'
    },
    inputText: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      value: this.inputText
    }
  },
  watch: {
    'value': function(val) {
      this.$emit('update:inputText', val)
    }
  },
  mounted() {
  },
  methods: {
    cancelDialog() {
      this.value = ''
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    confirmDelete() {
      this.$emit('confirm')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-dialog__body{padding: 10px 20px;}
  /deep/ .el-dialog__header{padding: 5px}
  /deep/ .el-dialog{margin-top: 25vh !important;}
  .title{color: rgba(0, 0, 0, 0.85);font-weight: 500;font-size: 16px;line-height: 28px;}
</style>
