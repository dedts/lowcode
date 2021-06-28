<template>
  <div>
    <div class="notificationBox">
      <div v-if="!isEdit" class="backOperation" @click="toOperation">
        <i class="el-icon-arrow-left"/>&nbsp;返回
      </div>
      <div v-else class="backOperation" style="visibility: hidden">123</div>
      <div class="title">发送手机短信</div>
      <i class="el-icon-close rightIcon rightCloseBtn" @click="handleClose" />
    </div>
    <el-form ref="formData" :model="formData" :rules="formRules" class="formBox" label-width="128px">
      <el-form-item label="选择用户基于">
        <el-select v-model="formData.base" @change="baseChange">
          <!--<el-option value="department" label="部门"/>-->
          <!--<el-option value="user" label="用户列表"/>-->
          <el-option value="system" label="系统变量"/>
        </el-select>
      </el-form-item>
      <el-form-item label="到" prop="phoneTo">
        <!--<el-select v-if="formData.base==='user'" v-model="formData.phoneTo" multiple filterable remote clearable  placeholder="请输入关键词" :remote-method="getUserList" :loading="loading">-->
        <!--<el-option-->
        <!--v-for="item in options"-->
        <!--:key="item.userId"-->
        <!--:label="item.name"-->
        <!--:value="item.userId">-->
        <!--</el-option>-->
        <!--</el-select>-->
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
        <el-select v-else-if="formData.base==='department'" v-model="formData.phoneTo" multiple filterable clearable>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id"/>
        </el-select>
        <el-select v-else v-model="formData.phoneTo" multiple filterable clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="内容">
        <div class="textArea">【善工云】尊敬的${name}，${user}已在${module}中${operator}了${num}条记录，请知晓；</div>
      </el-form-item>
    </el-form>
    <div class="footerBtn">
      <el-button type="primary" @click="savePhoneMessage">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </div>
</template>
<script>
import { CommomJs } from './changeMessageTo'
import selectFilter from '../../../components/selectFilter/selectFilter'
import { save } from './operationSave'

export default {
  name: 'SendPhoneMessage',
  components: { selectFilter },
  mixins: [CommomJs, save],
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
        phoneTo: []
      },
      isEdit: false,
      options: [],
      formRules: {
        phoneTo: [{ required: true, message: '请选择收信人', trigger: 'change' }]
      },
      flowType: 0 // 1  表单 2 工作流

    }
  },
  mounted() {
    this.flowType = JSON.parse(localStorage.getItem('params')).flowType
  },
  methods: {
    toOperation() {
      this.$emit('drawerSwitch', 'selectNoiceType')
    },
    savePhoneMessage() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          // console.log(this.isEdit, this.singleAddId);
          // debugger
          const actionParameter = this.getActionParameter()
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
    getActionParameter() {
      const form = { phoneTo: this.formData.phoneTo, base: this.formData.base }
      form.phoneTo = form.phoneTo.join(',')
      return JSON.stringify(form)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "style";
</style>
