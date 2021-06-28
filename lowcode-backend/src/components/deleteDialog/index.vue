<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" :show-close="false" width="480px">
    <div>
      <div class="mb15">
        <i v-if="isShowIcon" class="el-icon-error" style=" color:red;font-size: 18px;" />
        <span class="title">{{ title }}</span>
      </div>
      <span style="line-height: 25px;">{{ content }}</span>
      <el-form v-if="isShowInput" ref="dialogForm" :model="dataValue">
        <el-form-item :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]" prop="value">
          <el-input v-model="dataValue.value" :placeholder="placeholder" class="mt15" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!isSingleBtn" @click="cancelDialog">
        取消
      </el-button>
      <el-button v-if="!isSingleBtn" type="danger" @click="confirmDelete">
        {{ deleteText }}
      </el-button>
      <el-button v-if="isSingleBtn" type="primary" @click="cancelDialog">
        知道了
      </el-button>
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
    isSingleBtn: {
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
      default: ''
    },
    inputText: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    deleteText: {
      type: String,
      default: '删 除'
    }

  },
  data() {
    return {
      dataValue: {
        value: this.inputText
      }
    }
  },
  watch: {
    'dataValue.value': function(val) {
      this.$emit('update:inputText', val)
    }
  },
  mounted() {
    // 创建部门取消验证
    if (this.$refs['dialogForm'] !== undefined) {
      this.$refs['dialogForm'].resetFields()
    }
  },
  methods: {
    cancelDialog() {
      this.value = ''
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    confirmDelete() {
      if (this.isShowInput) {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.$emit('confirm')
          } else {
            return false
          }
        })
      } else {
        this.$emit('confirm')
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-dialog__body{padding: 10px 20px;}
  /deep/ .el-dialog{margin-top: 25vh;}
  .title{color: rgba(0, 0, 0, 0.85);font-weight: 500;font-size: 16px;line-height: 28px;}
</style>
