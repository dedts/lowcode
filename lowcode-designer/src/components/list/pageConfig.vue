<template>
  <div class="pageConfigWrap">
    <el-form :model="curPageData" :rules="rules" label-position="top" size="small">
      <!--名称-->
      <el-form-item :label="$t('fm.config.widget.name')" prop="pageTemplateName">
        <el-input v-model.trim="curPageData.pageTemplateName" placeholder="请输入内容" @blur="savePageSetting('name')"/>
      </el-form-item>
      <!--标识-->
      <el-form-item :label="$t('fm.config.widget.model')">
        <el-input v-model.trim="curPageData.templateDataId" disabled/>
      </el-form-item>
      <el-form-item v-if="isFirstMenu" label="样式">
        <el-select v-model="curPageData.pageTemplateIcon" clearable @focus="setMinWidthEmpty" @change="savePageSetting('icon')">
          <el-option
            v-for="item in iconList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            class="inline"
            style="padding: 0 18px;"
          >
            <i :class="['iconfont',item.value]" style="font-size: 20px;"/>
          </el-option>
        </el-select>
      </el-form-item>
      <div class="el-form-item__label subTitle">权限</div>
      <el-form-item>
        <el-select :value="roles" filterable multiple placeholder="搜索" @change="setRole" >
          <el-option
            v-for="item in allAuthorizationList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { formPageUpdate, roleSimpleSearch } from '@/api/builder'
import { authorityPageUpdate } from '@/api/permission'
import { getCompanyId, getAppId } from '@/util/auth'
export default {
  name: 'PageConfig',
  props: {
    curPageData: {
      type: Object,
      default() {
        return {}
      }
    },
    isFirstMenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      managerId: '',
      rules: {
        pageTemplateName: [
          {
            required: true,
            // pattern: /^([\u4e00-\u9fa5][\u4e00-\u9fa5\-_~]{1,9})$|^([a-zA-Z][a-zA-Z\-_~]{2,19})$/,
            message: '名称不能为空',
            trigger: ['change', 'blur']
          }
        ]
      },
      allAuthorizationList: [],
      iconList: [
        { label: '电脑', value: 'iconmenu_computer' },
        { label: '日历', value: 'iconmenu_calendar' },
        { label: '运输', value: 'iconmenu_bus' },
        { label: '数据库', value: 'iconmenu_database' },
        { label: '文件', value: 'iconmenu_file' },
        { label: '文件夹', value: 'iconmenu_folder' },
        { label: '分组', value: 'iconmenu_group' },
        { label: '图片', value: 'iconmenu_image' },
        { label: '财务', value: 'iconmenu_money' },
        { label: '商场', value: 'iconmenu_store' },
        { label: '设置', value: 'iconmenu_settings' },
        { label: '邮件', value: 'iconmenu_mail' },
        { label: '菜单', value: 'iconmenu_menu' },
        { label: '主页', value: 'iconmenu_home' }
      ]
    }
  },
  computed: {
    roles() {
      return this.curPageData.roles ? this.curPageData.roles.split(',') : ['0']
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 获取权限列表
      const jsonData = {
        companyId: getCompanyId(),
        appId: getAppId(),
        current: 1,
        size: 100,
        onlyRole: true
      }
      roleSimpleSearch(jsonData).then(res => {
        this.allAuthorizationList = res.body
        // this.managerId = this.allAuthorizationList.find(item => item.createBy === '-1').id
      })
    },
    dealAllAndManagerRole(val) {
      if (!val.length) {
        return
      }
      const newCurPageData = JSON.parse(JSON.stringify(this.curPageData))
      const oldArr = newCurPageData.roles.split(',')
      // ['0'],['1'],['0', '1'], ['0', 其他], ['1', 其他], [其他]
      if (val.includes('0') || val.includes('1')) {
        if (val.includes('0') && val.includes('1')) {
          if (oldArr.includes('0')) {
            newCurPageData.roles = '1'
          }
          if (oldArr.includes('1')) {
            newCurPageData.roles = '0'
          }
        } else {
          if (val.includes('0')) {
            if (!oldArr.includes('0')) {
              newCurPageData.roles = '0'
            } else {
              newCurPageData.roles = val.filter(m => m !== '0').join(',')
            }
          } else {
            if (!oldArr.includes('1')) {
              newCurPageData.roles = '1'
            } else {
              newCurPageData.roles = val.filter(m => m !== '1').join(',')
            }
          }
        }
      } else {
        newCurPageData.roles = val.join(',')
      }
      this.$emit('update:curPageData', newCurPageData)
    },
    setRole(val) {
      this.dealAllAndManagerRole(val)
      this.$nextTick(() => {
        this.savePageSetting('roles')
      })
    },
    // 保存表单
    savePageSetting(type) {
      const jsonData = {
        templateDataId: this.curPageData.templateDataId,
        pageTemplateSort: this.curPageData.pageTemplateSort
      }
      if (type === 'name') {
        if (this.curPageData.pageTemplateName === '') {
          return
        }
        jsonData.pageTemplateName = this.curPageData.pageTemplateName
      } else if (type === 'icon') {
        jsonData.pageTemplateIcon = this.curPageData.pageTemplateIcon
      } else {
        jsonData.roles = this.curPageData.roles || ''
      }
      formPageUpdate(jsonData)
    },
    setMinWidthEmpty(val) {
      // 无数据的情况下，给请选择提示设置最小宽度
      const domEmpty = document.getElementsByClassName('el-select-dropdown__list')
      if (domEmpty.length > 0) {
        domEmpty[0].style['width'] = '280px'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/ .el-select { width:100%; }
  .pageConfigWrap .navTitle { margin-top:20px; font-weight:bold; line-height:20px; font-size:13px; color:#232E37; }
</style>
<style>
  .pageConfigWrap .el-input__inner, .pageConfigWrap .el-textarea__inner { border:1px solid #F8F9FA; border-radius:2px; }
  .pageConfigWrap .el-input.is-disabled .el-input__inner { border:1px solid #F8F9FA; background-color:#F3F5F8; color:#A9AFB5; }
</style>
