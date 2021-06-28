<template>
  <div>
    <div class="notificationBox">
      <div v-if="!isEdit" class="backOperation" @click="toOperation">
        <i class="el-icon-arrow-left"/>&nbsp;返回
      </div>
      <div v-else class="backOperation" style="visibility: hidden">123</div>
      <div class="title">发送邮件</div>
      <i class="el-icon-close rightIcon rightCloseBtn" @click="handleClose" />
    </div>
    <el-form ref="formData" :model="formData" :rules="fromRule" class="formBox">
      <!--<el-form-item label="发件人" prop="send" label-width="128px">-->

      <!--<el-select v-model="formData.send" disabled>-->
      <!--<el-option value="${lowcode.adminEmail}" label="管理员用户的邮箱地址"></el-option>-->
      <!--&lt;!&ndash;<el-option value="${lowcode.loginEmail}" label="登陆用户的邮箱地址"></el-option>&ndash;&gt;-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="收件人" prop="receiver" label-width="128px">
        <el-select v-model="formData.base" @change="baseChange(formData.base,'','email')">
          <!--<el-option value="department" label="部门"/>-->
          <!--<el-option value="user" label="用户列表"/>-->
          <el-option value="system" label="系统变量"/>
          <el-option value="zdy" label="指定邮箱"/>
        </el-select>
        <br>
        <div v-if="formData.base" class="mt10">
          <select-filter
            v-if="formData.base==='user'"
            v-model="formData.receiver"
            :data-list.sync="options"
            :loading="loading"
            option-label="name"
            option-value="userId"
            placeholder="请输入关键词"
            @remote-method="getUserList"
            @pageChange="pageChange"
            @init="selectInit"
          />
          <el-select v-else-if="formData.base==='department'" v-model="formData.receiver" multiple filterable clearable>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.departmentName"
              :value="item.id"/>
          </el-select>
          <el-select v-else-if="formData.base==='system'" v-model="formData.receiver" multiple filterable clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <el-select v-else v-model="formData.receiver" placeholder="请输入" multiple filterable allow-create clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        <!--<el-select v-if="formData.base" v-model="formData.emailTo" multiple filterable allow-create class="mt10">-->
          <!--<el-option-group label="系统变量">-->
          <!--<el-option value="${lowcode.adminEmail}" label="管理员用户的邮箱地址"></el-option>-->
          <!--<el-option value="${lowcode.loginEmail}" label="登陆用户的邮箱地址"></el-option>-->
          <!--</el-option-group>-->
          <!--<el-option-group label="指定邮箱">-->
          <!--<el-option label="直接输入,无需选择" value="zdy" disabled></el-option>-->
          <!--</el-option-group>-->
        <!--</el-select>-->
        </div>
      </el-form-item>
      <el-form-item label="主题" label-width="128px">
        <el-input v-model="formData.topic" placeholder="请填写"/>
      </el-form-item>
      <el-form-item label="正文" label-width="128px">
        <vue-editor ref="singleText" :editor-toolbar="customToolbar" v-model="formData.content"/>
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
                <el-divider/>
              </div>
              <div v-if="flowType===1">
                <div class="pl10">表单字段</div>
                <el-dropdown-item v-for="item in formList.form" :key="item.id" :command="item">{{ item.label }}</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-form-item>
    </el-form>
    <div class="footerBtn">
      <el-button type="primary" @click="saveEmail">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </div>
</template>
<script>
import { insterJs } from './insertVariable'
import { CommomJs } from './changeMessageTo'
import selectFilter from '../../../components/selectFilter/selectFilter'
import { save } from './operationSave'
export default {
  name: 'SendEmailForm',
  components: { selectFilter },
  mixins: [insterJs, CommomJs, save],
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
        content: '',
        receiver: [],
        base: ''
      },
      content: '', // 传给后台保存的富文本内容
      fromRule: {
        send: [{ required: true, message: '请选择发件人', trigger: 'change' }],
        receiver: [{ required: true, message: '请选择收件人', trigger: 'change' }]
      },
      customToolbar: [
        ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
        ['blockquote', 'code-block'], // 引用，代码块
        [{ 'header': [1, 2, 3, 4, 5, 6] }], // 标题，键值对的形式；1、2表示字体大小
        [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 列表
        [{ 'script': 'sub' }, { 'script': 'super' }], // 上下标
        [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
        [{ 'color': [] }, { 'background': [] }, { 'size': ['small', false, 'large', 'huge'] }, { 'font': [] }], // 字体颜色，字体背景颜色, 字体大小,几级标题
        [{ 'align': [] }],
        ['image']
      ]

    }
  },
  mounted() {
  },
  methods: {
    toOperation() {
      this.$emit('drawerSwitch', 'selectNoiceType')
    },

    saveEmail() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          const actionParameter = this.txtChange()
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
      const index = this.$refs.singleText.quill.selection.savedRange.index
      const val = item.value
      this.$refs.singleText.quill.insertText(index, val)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "style";
  /deep/ .el-divider--horizontal{margin: 12px 0}
  /deep/ .el-dropdown-menu--mini .el-dropdown-menu__item{padding: 0 24px;}
</style>
