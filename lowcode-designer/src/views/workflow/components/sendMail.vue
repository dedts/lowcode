<template>
  <div>
    <div class="notificationBox">
      <div v-if="!isEdit" class="backOperation" @click="toOperation">
        <i class="el-icon-arrow-left"/>&nbsp;返回
      </div>
      <div v-else class="backOperation" style="visibility: hidden">123</div>
      <div class="title">发送站内信</div>
      <i class="el-icon-close rightIcon rightCloseBtn" @click="handleClose" />
    </div>
    <el-form ref="formData" :model="formData" :rules="fromRule" class="formBox" label-width="128px">
      <el-form-item label="选择用户基于">
        <el-select v-model="formData.base" @change="baseChange">
          <!--<el-option value="department" label="部门"/>-->
          <!--<el-option value="user" label="用户列表"/>-->
          <el-option value="system" label="系统变量"/>
        </el-select>
      </el-form-item>
      <el-form-item label="收件人">
        <select-filter
          v-if="formData.base==='user'"
          v-model="formData.target"
          :data-list.sync="options"
          :loading="loading"
          option-label="name"
          option-value="userId"
          placeholder="请输入关键词"
          @remote-method="getUserList"
          @pageChange="pageChange"
          @init="selectInit"
        />
        <el-select v-else-if="formData.base==='department'" v-model="formData.target" multiple filterable clearable>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id"/>
        </el-select>
        <el-select v-else v-model="formData.target" multiple filterable clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>

      </el-form-item>
      <el-form-item label="标题">
        <textarea id="" ref="textarea" v-model="formData.content" class="textArea" name="" cols="30" rows="10" placeholder="填写内容"/>
        <div v-if="flowType===1">
          <el-dropdown @command="handleCommand" >
            <span class="insertVariable">插入变量</span>
            <el-dropdown-menu slot="dropdown" style="line-height: 28px;">
              <div class="pl10">code变量</div>
              <el-dropdown-item v-for="item in formList.code" :key="item.id" :command="item">{{ item.label }}</el-dropdown-item>
              <div v-if="flowType===1">
                <el-divider/>
                <div class="pl10">系统变量</div>
                <el-dropdown-item v-for="item in formList.sys" :key="item.id" :command="item">{{ item.label }}</el-dropdown-item>
              </div>
              <div v-if="flowType===1">
                <el-divider/>
                <div class="pl10">表单字段</div>
                <el-dropdown-item v-for="item in formList.form" :key="item.id" :command="item">{{ item.label }}</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-form-item>
    </el-form>
    <div class="footerBtn">
      <el-button v-preventReClick="1200" type="primary" @click="saveMail">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </div>
</template>
<script>
import { CommomJs } from './changeMessageTo'
import { insterJs } from './insertVariable'
import {save} from "./operationSave";
import selectFilter from '../../../components/selectFilter/selectFilter'
export default {
  name: 'SendMail',
  components: { selectFilter },
  mixins: [CommomJs, insterJs,save],
  props: {
    editData: {
      type: Object,
      default: () => {}
    },
    singleAddId: {
      type: String,
      default: ''
    },
    executionId: {
      type: String,
      default: ''
    },
    ruleCondition: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {
        base: '',
        content: ''
      },
      options: [],
      fromRule: {
        target: [{ required: true, message: '请选择收件人', trigger: 'change' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    }
  },
  mounted() {
  },
  methods: {
    toOperation() {
      this.$emit('drawerSwitch', 'selectNoiceType')
    },
    saveMail() {
      this.$refs['formData'].validate((valid) => {
        const actionParameter = this.txtChange()
        if (valid) {
          if (this.isEdit) {
            this.edit(actionParameter)
          } else {
            if (this.singleAddId) {
              this.addSingle(actionParameter)
            } else {
              this.add(actionParameter)
            }
          }
        } else {
          return false
        }
      })
    },
    // 插入变量
    handleCommand(item) {
      const index = this.$refs.textarea.selectionStart
      const val = item.value
      const str = this.$refs.textarea.value
      this.formData.content = str.slice(0, index) + val + str.slice(index)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "style";
</style>
