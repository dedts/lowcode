<template>
  <div class="listPropertyWrap">
    <div v-if="data.type=='header'">
      <el-form-item>
        <li v-for="(item, index) in data.options.operationList" :key="index" class="headerLi">
          <el-input v-model="item.operationName" @blur="saveFormData(1, item)">
            <i slot="prefix" :class="['icon', 'iconfont', item.icon]"/>
            <i slot="suffix" class="icon iconfont iconri-edit-line"/>
          </el-input>
        </li>
      </el-form-item>
      <el-form-item>
        <h3 class="navTitle">批量操作设置</h3>
        <li v-for="(item, index) in data.options.batchList" :key="index" class="headerLi">
          <el-input v-model="item.operationName" @blur="saveFormData(1, item)">
            <i slot="prefix" :class="['icon', 'iconfont', item.icon]"/>
            <i slot="suffix" class="icon iconfont iconri-edit-line"/>
          </el-input>
        </li>
      </el-form-item>
    </div>
    <!--列表-->
    <div v-if="data.type=='list'">
      <el-form-item label="表头属性">
        <el-button type="text" @click="setingHeader">设置表头内容</el-button>
        <div>
          <el-checkbox v-model="data.options.fixHeader" @change="saveFormData(1)">冻结表头</el-checkbox>
        </div>
      </el-form-item>
      <h3 class="navTitle">表单排序</h3>
      <el-form-item label="排序依据" class="pb10">
        <el-select v-model="data.options.defaultSort.prop" clearable @change="saveFormData(1)">
          <el-option
            v-for="item in sortData"
            :key="item.dataKey"
            :label="item.name"
            :value="item.dataKey"/>
        </el-select>
      </el-form-item>
      <el-form-item label="排序规则" class="pb10">
        <el-select v-model="data.options.defaultSort.order" clearable @change="saveFormData(1)">
          <el-option :value="0" label="升序"/>
          <el-option :value="1" label="倒序"/>
        </el-select>
      </el-form-item>
    </div>
    <!--操作区域-->
    <div v-if="data.type=='operation'">
      <h3 slot="label" class="navTitle" style="margin-top:0px;">操作项列表<span class="addOption" @click="addOperation(1)">添加操作项</span></h3>
      <el-form-item v-if="data.type=='operation'">
        <draggable
          :list="data.options.operationList"
          v-bind="{
            group:{
              group:'people',
              ghostClass: 'ghost',
              animation: 200,
            }
          }"
          tag="ul"
        >
          <li v-for="(item, index) in data.options.operationList" :key="index" class="headerLi flex-between">
            <i class="icon iconfont iconmove cur-p"/>
            <el-input v-model="item.operationName" maxlength="10" show-word-limit @blur="saveFormData(1, item)">
              <i slot="prefix" :class="['icon', 'iconfont', item.icon]"/>
            </el-input>
            <div style="width:60px;">
              <i class="icon iconfont iconri-edit-line cur-p ml10 customColor" @click="editOperation(item)"/>
              <i v-if="item.operationType === 'customize'" class="icon iconfont iconri-delete-bin--line ml5 cur-p customColor" @click="deleteOperationList(item.dataKey)"/>
            </div>
          </li>
        </draggable>
        <!--<el-button type="text" @click="addOperationList">+ 添加操作</el-button>-->
      </el-form-item>
      <h3 class="navTitle">样式</h3>
      <el-form-item label="操作列样式" class="pb10">
        <el-select v-model="data.options.fix" @change="saveFormData(1)">
          <el-option value="right" label="右侧固定"/>
          <el-option value="hidden" label="隐藏到右键"/>
        </el-select>
      </el-form-item>
    </div>
    <!--页脚-->
    <div v-if="data.type==='footer'">
      <h3 class="navTitle" style="margin-top:0;">操作列样式</h3>
      <el-form-item class="pb10">
        <el-select v-model="data.options.size" @change="saveFormData(1)">
          <el-option :value="20"/>
          <el-option :value="50"/>
          <el-option :value="100"/>
        </el-select>
      </el-form-item>
    </div>
    <!--预览设置-->
    <div v-if="data.type=='preview'">
      <!--<div class="el-form-item__label subTitle">详情预览设定</div>-->
      <!--<el-form-item class="pb10">-->
      <!--<el-button type="text" @click="setingHeader">配置显示内容</el-button>-->
      <!--</el-form-item>-->
      <div>
        <span slot="label" class="operationTitle">预览操作按钮</span>
        <span class="addOption" @click="addOperation(3)">添加操作项</span>
      </div>
      <el-form-item class="pb10">
        <draggable
          :list="data.options.operationList"
          v-bind="{
            group:{
              group:'people',
              ghostClass: 'ghost',
              animation: 200,
            }
          }"
          tag="ul"
        >
          <li v-for="(item, index) in data.options.operationList" :key="index" class="headerLi">
            <el-input v-model="item.operationName" @blur="saveFormData(1, item)">
              <i slot="suffix" class="icon iconfont iconri-edit-line cur-p" @click="editOperation(item)"/>
              <i v-if="item.operationType === 'customize'" slot="suffix" class="icon iconfont iconri-delete-bin--line ml5 cur-p" @click="deleteOperationList(item.dataKey)"/>
              <i slot="prefix" class="icon iconfont iconmove"/>
            </el-input>
          </li>
        </draggable>
      </el-form-item>
    </div>
    <!-- 设置表头 -->
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" title="设置表头" width="40%">
      <div>
        <set-table-header v-if="dialogVisible" v-model="headerList" :all-field="options" />
      </div>
      <div slot="footer" class="dialog-footer tac">
        <el-button v-preventReClick type="primary" @click="saveSetting(data.type)">保存</el-button>
        <el-button @click="cencel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加操作项 -->
    <el-drawer
      :with-header="false"
      :visible.sync="drawer"
      :wrapper-closable="false"
      size="800px"
      direction="rtl"
      class="drawBox"
      append-to-body
      modal-append-to-body
      destroy-on-close
    >
      <div class="drawerHeader">{{ isAddOperation ? '添加操作项' : '编辑操作项' }}<i class="el-icon-close rightIcon" @click="handleClose"/></div>
      <el-form ref="form" :model="formData" :rules="rules" class="formBox">
        <el-form-item label="按钮设置" prop="resourceName" class="btnSetting">
          <el-select ref="select_icon" :key="iconKey" v-model="formData.icon" class="btnIcon" @change="iconChange">
            <el-option
              v-for="item in iconListData"
              :key="item.value"
              :value="item.value"
              class="inline"
              style="padding: 0 18px;"
            >
              <i :class="item.value" class="icon iconfont"/>
            </el-option>
          </el-select>
          <el-input v-model="formData.resourceName" maxlength="10" show-word-limit class="btnMsg" placeholder="请输入按钮文字"/>
        </el-form-item>
        <el-form-item label="启动操作项">
          <el-radio-group v-model="formData.filter" @change="filterChange">
            <el-radio :label="0">一直</el-radio>
            <el-radio :label="1">条件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form ref="formData" :model="filterData" label-position="left">
          <filter-condition v-if="showFilter" :is-current-info="true" :form-data="filterData" :target-fields-list="currentFieldsList" :target-form-page-id ="curFormItemData.templateDataId" :current-form-page-id ="curFormItemData.templateDataId" from="currentForm" class="filterBox" @clearValidate="clearValidate"/>
        </el-form>
        <el-form-item label="确认弹窗">
          <el-radio v-model="formData.pop" :label="0" class="vertical-m">否</el-radio>
          <el-radio v-model="formData.pop" :label="1" class="vertical-m">是</el-radio>
        </el-form-item>
        <div v-if="formData.pop" class="popBox">
          <el-form-item label="弹窗提示内容" prop="popContent.body">
            <el-input v-model="formData.popContent.body" type="textarea" placeholder="是否执行此记录的操作?"/>
          </el-form-item>
          <el-form-item label="确认执行">
            <el-input v-model="formData.popContent.confirm" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="取消执行">
            <el-input v-model="formData.popContent.cancel" placeholder="请输入"/>
          </el-form-item>
        </div>
        <el-form-item>
          <span slot="label"><i class="red">*</i>工作流名称</span>
          <el-form ref="flow" :model="curOperationInfo" :rules="flowRules" label-position="left" class="flowNameBox">
            <el-form-item prop="flowName">
              <el-input v-model="curOperationInfo.flowName" :disabled="isEdit" placeholder="请输入工作流名称" style="width:288px; "/>
            </el-form-item>
          </el-form>
        </el-form-item>
        <div class="createWorkFlow" @click="createWorkFlow">{{ isEdit ? '编辑工作流' : '创建工作流' }}</div>
      </el-form>
      <div class="saveBtnBox">
        <el-button type="primary" @click="saveOperationResource">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-drawer>
    <!-- 工作流弹窗 -->
    <el-dialog
      :visible.sync="flowVisible"
      :show-close="false"
      :close-on-click-modal="false"
      width="100%"
      custom-class="flowDialogBox"
    >
      <work-flow-board v-if="flowVisible" :show-flag.sync="flowVisible" from="builder"/>
    </el-dialog>
  </div>
</template>
<script>
import { formPageGetFields, formFieldList, getAllMenu } from '@/api/builder'
import { workflowList, workflowAdd, workflowDelete } from '@/api/workflow'
import { formPageSetListHead, formPageSetPreview, addOperationResource, addOperation, deleteOperation, editOperationConfig, queryOperationConfig } from '@/api/list'
import { formatDate, filterParameter, showFilterCondition, getComparisonOpers } from '@/util/index'
import FilterCondition from '@/components/filterCondition/index'
import WorkFlowBoard from '@/views/workflow/workflowboard'
import SetTableHeader from '@/components/SetTableHeader/index'
import Draggable from 'vuedraggable'
export default {
  components: {
    Draggable,
    FilterCondition,
    WorkFlowBoard,
    SetTableHeader
  },
  props: ['data', 'curPageId'],
  data() {
    return {
      currFormPageId: '',
      curLinkFlowData: {},
      isAddOperation: true,
      iconKey: 0,
      typeArr: ['grid', 'paging', 'html', 'editor', 'relatedForm'],
      flowVisible: false,
      flowRules: {
        flowName: [
          {
            required: true,
            message: '工作流名称不能为空',
            trigger: 'blur'
          }
        ]
      },
      rules: {
        resourceName: [
          {
            required: true,
            message: '按钮文字不能为空',
            trigger: 'blur'
          }
        ],
        'popContent.body': [
          {
            required: true,
            message: '提示内容不能为空',
            trigger: 'blur'
          }
        ]
      },
      curOperationInfo: {
        flowId: '',
        flowName: '',
        curConfigDataKey: ''
      },
      isEdit: false,
      positionType: 1,
      iconListData: [
        { value: 'iconcustombtn_archive-line' },
        { value: 'iconcustombtn_alarm-line' },
        { value: 'iconcustombtn_add-line' },
        { value: 'iconcustombtn_bookmark-line' },
        { value: 'iconcustombtn_base-station-line' },
        { value: 'iconcustombtn_close-line' },
        { value: 'iconcustombtn_delete-bin-5-line' },
        { value: 'iconcustombtn_check-line' },
        { value: 'iconcustombtn_code-s-line' },
        { value: 'iconcustombtn_download-2-line' },
        { value: 'iconcustombtn_exchange-box-line' },
        { value: 'iconcustombtn_download-cloud-2-line' },
        { value: 'iconcustombtn_flag-line' },
        { value: 'iconcustombtn_folder-line' },
        { value: 'iconcustombtn_computer-line' },
        { value: 'iconcustombtn_home-2-line' },
        { value: 'iconcustombtn_keynote-line' },
        { value: 'iconcustombtn_edit-box-line' },
        { value: 'iconcustombtn_bus-line' },
        { value: 'iconcustombtn_information-line' },
        { value: 'iconcustombtn_file-line' },
        { value: 'iconcustombtn_mail-add-line' },
        { value: 'iconcustombtn_mail-line' },
        { value: 'iconcustombtn_eye-off-line' },
        { value: 'iconcustombtn_mail-send-line' },
        { value: 'iconcustombtn_map-pin-line' },
        { value: 'iconcustombtn_eye-line' },
        { value: 'iconcustombtn_lock-unlock-line' },
        { value: 'iconcustombtn_plane-line' },
        { value: 'iconcustombtn_lock-line' },
        { value: 'iconcustombtn_line-chart-line' },
        { value: 'iconcustombtn_global-line' },
        { value: 'iconcustombtn_message-3-line' },
        { value: 'iconcustombtn_pie-chart-line' },
        { value: 'iconcustombtn_mic-line' },
        { value: 'iconcustombtn_play-circle-line' },
        { value: 'iconcustombtn_printer-line' },
        { value: 'iconcustombtn_qr-scan-2-line' },
        { value: 'iconcustombtn_profile-line' },
        { value: 'iconcustombtn_pushpin-line' },
        { value: 'iconcustombtn_reply-line' },
        { value: 'iconcustombtn_save-line' },
        { value: 'iconcustombtn_share-forward-box-line' },
        { value: 'iconcustombtn_settings-3-line' },
        { value: 'iconcustombtn_ship-line' },
        { value: 'iconcustombtn_shuffle-line' },
        { value: 'iconcustombtn_shopping-cart-line' },
        { value: 'iconcustombtn_subway-line' },
        { value: 'iconcustombtn_shut-down-line' },
        { value: 'iconcustombtn_upload-2-line' },
        { value: 'iconcustombtn_sound-module-line' },
        { value: 'iconcustombtn_upload-cloud-2-line' },
        { value: 'iconcustombtn_car-line' }
      ],
      drawer: false,
      header: [],
      dialogVisible: false,
      options: [],
      oldHeader: [],
      headerList: [],
      filterData: {
        workflowFilterDtoList: []
      },
      formData: {
        icon: '',
        resourceName: '',
        filter: 0,
        pop: 0,
        popContent: {
          body: '',
          confirm: '',
          cancel: ''
        },
        filterList: [],
        linkFlow: ''
      },
      systemField: [],
      currentFieldsList: [],
      showFilter: false
    }
  },
  inject: ['saveFormData', 'curFormData', 'getCurPageOperationData'],
  computed: {
    curFormItemData() {
      return this.curFormData()
    },
    sortData() {
      const filterCompsTypeArr = ['imgupload', 'fileupload', 'member', 'checkbox', 'cascader']
      return this.data.options.content.filter(item => !filterCompsTypeArr.includes(item.type))
    }
  },
  watch: {
    'data.type': function(val) {
      this.init()
    },
    'formData.icon': function(val) {
      this.$nextTick(() => {
        this.iconChange(val)
      })
    }
  },
  mounted() {
    this.init()
    if (this.data.type === 'list' || this.data.type === 'preview') {
      const oldHeader = this.data.options.content
      this.oldHeader = JSON.parse(JSON.stringify(oldHeader))
    }
  },
  methods: {
    async init() {
      // 获取当前表单字段
      const option = {
        templateDataId: this.curPageId
      }
      const res = await formPageGetFields(option)
      const resp = await formFieldList(this.curFormItemData.templateDataId)
      const formList = resp.body
      this.options = res.body || []
      this.options.forEach(item => {
        this.$set(item, 'isShowTip', true)
        const obj = formList.find(f => f.dataKey === item.dataKey)
        if (obj) {
          this.$set(item, 'options', obj.options)
        }
      })
      // 过滤已删除的表头组件
      if (this.data.type === 'list') {
        this.data.options.content = this.options.filter(f => f.isHead).sort((a, b) => {
          return a.fieldSort - b.fieldSort
        })
      } else if (this.data.type === 'preview') {
        this.data.options.content = this.options
      }
      // 获取页面菜单，用户获取设置表头的字段（详情页templateDataId）
      this.getMenuTemplateDataId()
    },
    // getMenuTemplateDataId
    getMenuTemplateDataId() {
      getAllMenu().then(resp => {
        this.currFormPageId = resp.body.filter(f => f.templateDataId === this.curPageId)[0].dataFromPage
      }).catch(err => {
        console.log(err)
      })
    },
    // 设置字段排序  配置显示内容
    setingHeader() {
      this.headerList = this.data.options.content.map(m => m.dataKey)
      this.dialogVisible = true
    },
    // TODO -----------------------弹窗------------------
    // 删除字段
    handleOptionsRemove(index) {
      this.headerList.splice(index, 1)
      this.optionsFilter(index, 'del')
    },
    // 添加字段
    // addContent() {
    //   const headers = this.options.filter(item => this.typeArr.indexOf(item.type) === -1)
    //   if (this.headerList.length >= headers.length) {
    //     this.$message.error('最多' + headers.length + '项')
    //     return
    //   }
    //   this.headerList.push('')
    // },
    // 筛选已选项 保留自身
    optionsFilter(index, type) {
      this.options.map(m => m.isShowTip = true)
      this.options.forEach(o => {
        this.headerList.forEach(item => {
          if (item === o.dataKey) {
            o.isShowTip = false
          }
        })
      })
      if (type !== 'del') {
        this.options.forEach(item => {
          if (item.dataKey === this.headerList[index].dataKey) {
            item.isShowTip = true
          }
        })
      }
    },
    // 取消
    cencel() {
      this.headerList = []
      this.dialogVisible = false
    },
    // 保存
    saveSetting(type) {
      if (!this.headerList.length) {
        this.$message.error('字段不能为空')
        return
      }
      this.dialogVisible = false
      const arr = []
      const fieldAll = [...this.options, ...this.systemField]
      this.headerList.forEach(item => {
        const content = fieldAll.filter(f => f.dataKey === item)[0]
        arr.push({ ...content })
      })
      this.data.options.content = arr
      this.saveFormData(1)
      if (type === 'list' || type === 'preview') {
        this.setHeaderOrPreview(type)
      }
    },
    // 设置表头
    setHeaderOrPreview(type) {
      const header = JSON.parse(JSON.stringify(this.data.options.content))
      this.oldHeader.forEach((item, index) => {
        header.forEach((c, i) => {
          if (item.dataKey === c.dataKey) {
            this.oldHeader[index] = ''
            header[i] = ''
          }
        })
      })
      // 取消表头 表头为false
      const cancelHeader = this.oldHeader.filter(f => f !== '')
      const setHeader = header.filter(f => f !== '')
      if (cancelHeader.length) {
        cancelHeader.forEach(item => {
          const option = {
            dataKey: item.dataKey,
            templateDataId: this.currFormPageId
          }
          if (type === 'list') {
            option.isHead = false
            formPageSetListHead(option)
          } else if (type === 'preview') {
            option.isPreview = false
            formPageSetPreview(option)
          }
        })
      }
      // 设置表头 表头为true
      if (setHeader.length) {
        setHeader.forEach(item => {
          const option = {
            dataKey: item.dataKey,
            templateDataId: this.currFormPageId
          }
          if (type === 'list') {
            option.isHead = true
            formPageSetListHead(option)
          } else if (type === 'preview') {
            option.isPreview = true
            formPageSetPreview(option)
          }
        })
      }
      // 排序
      this.data.options.content.forEach((item, index) => {
        const option = {
          dataKey: item.dataKey,
          templateDataId: this.currFormPageId
        }
        if (type === 'list') {
          option.isHead = true
          option.fieldSort = index + 1
          formPageSetListHead(option)
        } else if (type === 'preview') {
          option.isPreview = true
          option.previewSort = index + 1
          formPageSetPreview(option)
        }
      })
    },
    // todo--------------------操作模块---------------------------------------
    iconChange(val) {
      this.formData.icon = val
      if (val === '') {
        this.iconKey++
        return
      }
      const dom = this.$refs['select_icon'].$el
      const svgDom = document.createElement('span') // ('<svg-icon ref="iconRef" icon-class="' + val + '" style="float: left;width: 3%;height: 30px;border: 1px solid #dcdfe6;border-right:none;" />');
      svgDom.setAttribute('class', 'el-input__prefix')
      svgDom.innerHTML = `<span class="el-input__inner iconsBox"><i class="icon iconfont ${val}"></i></span>`
      dom.children[0].replaceChild(svgDom, dom.children[0].children[0])
    },
    // 添加操作
    addOperationList() {
      this.data.options.operationList.push({
        dataKey: ''
      })
    },
    // 添加操作项
    async addOperation(type) {
      this.isAddOperation = true
      await this.getCurrentInfo()
      this.drawer = true
      this.positionType = type
    },
    // 过滤器
    async getCurrentInfo() {
      const res = await formPageGetFields({ templateDataId: this.curFormItemData.parentTemplateDataId })
      const resp = await formFieldList(this.curFormItemData.templateDataId)
      const formList = resp.body
      let currentFieldsList = res.body
      if (!currentFieldsList.length) {
        this.$message.error('表单无字段可选')
        return
      }

      currentFieldsList = currentFieldsList.filter(f => f.type !== 'grid' && f.type !== 'relatedForm' && f.type !== 'html')
      currentFieldsList.forEach(item => {
        this.$set(item, 'isShowTip', true)
        item.comparisonOpersArr = item.comparisonOpers.split(',') // 下拉框条件
        item.comparisonOpersArr.forEach((m, i) => {
          item.comparisonOpersArr[i] = {
            label: getComparisonOpers(m),
            value: m
          }
        })
        formList.forEach(f => {
          if (item.dataKey === f.dataKey) {
            this.$set(item, 'options', f.options)
          }
        })
      })
      this.currentFieldsList = [
        {
          label: '',
          fieldsType: 'fields',
          options: currentFieldsList.filter(f => !f.sysAdd)
        },
        {
          label: '',
          fieldsType: 'sys',
          options: currentFieldsList.filter(f => f.sysAdd)
        }
      ]
    },
    // 关闭抽屉
    handleClose() {
      this.drawer = false
      this.$refs.form.clearValidate()
      this.$refs.flow.clearValidate()
      this.clearCurOperationData()
    },
    // 点击取消
    async cancel() {
      if (this.isAddOperation) {
        const curFlowId = this.curOperationInfo.flowId
        if (curFlowId !== '') {
          await workflowDelete(curFlowId)
        }
      }
      this.handleClose()
    },
    // 创建工作流
    createWorkFlow() {
      const curParams = JSON.parse(localStorage.getItem('params'))
      if (this.isEdit) {
        const params = {
          flowType: 1,
          flowId: this.curLinkFlowData.flowId || curParams.flowId,
          workflowName: this.curLinkFlowData.flowName || curParams.workflowName,
          triggerAction: this.curLinkFlowData.triggerAction || curParams.triggerAction,
          formName: this.curFormItemData.name,
          executionCycle: 'once',
          formId: this.curFormItemData.parentTemplateDataId
        }
        localStorage.setItem('params', JSON.stringify(params))
        this.flowVisible = true
      } else {
        this.$refs.flow.validate(valid => {
          if (valid) {
            const jsonData = {
              flowName: this.curOperationInfo.flowName,
              flowType: 1,
              triggerAction: 'customer',
              targetId: this.curFormItemData.parentTemplateDataId
            }
            workflowAdd(jsonData).then(res => {
              this.curOperationInfo.flowId = res.body
              const params = {
                flowType: 1,
                flowId: res.body,
                workflowName: this.curOperationInfo.flowName,
                triggerAction: 'customer',
                formName: this.curFormItemData.name,
                executionCycle: 'once',
                formId: this.curFormItemData.parentTemplateDataId
              }
              localStorage.setItem('params', JSON.stringify(params))
              this.isEdit = true
              this.flowVisible = true
            })
          }
        })
      }
    },
    // 当前数据初始化
    clearCurOperationData() {
      this.isEdit = false
      this.curOperationInfo.flowId = ''
      this.curOperationInfo.flowName = ''
      this.curOperationInfo.curConfigDataKey = ''
      this.formData = {
        icon: '',
        resourceName: '',
        filter: 0,
        pop: 0,
        popContent: {
          body: '',
          confirm: '',
          cancel: ''
        },
        filterList: []
      }
      this.filterData.workflowFilterDtoList = []
    },
    // 添加操作项保存
    saveOperationResource() {
      this.$refs.formData.validate(filterValid => {
        if (filterValid) {
          this.$refs.form.validate(async valid => {
            if (valid) {
              if (this.curOperationInfo.flowId === '') {
                return this.$message.error('工作流必须在创建项之前创建')
              }
              const jsonData = {}
              this.formData.linkFlow = this.curOperationInfo.flowId
              jsonData.configParamsJson = this.formData
              jsonData.configParamsJson.filterList = filterParameter(this.filterData.workflowFilterDtoList)
              if (this.curOperationInfo.curConfigDataKey !== '') {
                jsonData.configDataKey = this.curOperationInfo.curConfigDataKey
                await editOperationConfig(jsonData)
              } else {
                jsonData.templateDataId = this.curFormItemData.parentTemplateDataId
                const res = await addOperationResource(jsonData)
                const operationParams = {
                  templateDataId: this.curPageId,
                  operationName: this.formData.resourceName,
                  operationType: 'customize',
                  configDataKey: res.body,
                  positionType: this.positionType
                }
                await addOperation(operationParams)
              }
              this.drawer = false
              this.clearCurOperationData()
              this.getCurPageOperationData()
            }
          })
        }
      })
    },
    // 删除操作项
    deleteOperationList(dataKey) {
      deleteOperation(dataKey).then(res => {
        this.getCurPageOperationData()
      })
    },
    // 编辑操作项
    async editOperation(item) {
      if (item.operationType !== 'customize') {
        return
      }
      this.isAddOperation = false
      this.isEdit = true
      this.curOperationInfo.curConfigDataKey = item.configDataKey
      const jsonData = {
        configDataKey: item.configDataKey,
        templateDataId: this.curFormItemData.parentTemplateDataId
      }
      await this.getCurrentInfo()
      const res = await queryOperationConfig(jsonData)
      this.drawer = true
      const resultData = res.body[0]
      this.formData = resultData.configParamsJson
      this.curOperationInfo.flowId = this.formData.linkFlow
      const allFormWorkFlow = await workflowList({ flowType: 1 })
      this.curLinkFlowData = allFormWorkFlow.body.filter(m => m.formId === this.curFormItemData.parentTemplateDataId)[0].workflowDtoList.filter(n => n.flowId === this.curOperationInfo.flowId)[0]
      this.curOperationInfo.flowName = this.curLinkFlowData.flowName
      const resp = await formFieldList(this.curFormItemData.templateDataId)
      const formList = resp.body.filter(f => !f.sysAdd && f.type !== 'grid')
      this.options.forEach(item => {
        this.$set(item, 'isShowTip', true)
        if (item.comparisonOpers) {
          item.comparisonOpersArr = item.comparisonOpers.split(',') // 下拉框条件
          item.comparisonOpersArr.forEach((m, i) => {
            item.comparisonOpersArr[i] = {
              label: getComparisonOpers(m),
              value: m
            }
          })
        }
        formList.forEach(f => {
          if (item.dataKey === f.dataKey) {
            this.$set(item, 'options', f.options)
          }
        })
      })
      this.filterData.workflowFilterDtoList = this.formData.filterList.length > 0 ? showFilterCondition(this.formData.filterList, this.options, this.options) : []
      if (this.formData.filter === 1) {
        this.showFilter = true
      } else {
        this.showFilter = false
      }
    },
    // 为空 || 不为空取消filedValues的校验
    clearValidate(obj) {
      this.$refs.formData.clearValidate('workflowFilterDtoList.' + obj.sectionIndex + '.conditionDtoList.' + obj.rowIndex + '.fieldValues')
    },
    filterChange(val) {
      this.filterData.workflowFilterDtoList = []
      if (val === 1) {
        this.showFilter = true
      } else {
        this.showFilter = false
      }
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
 .headerLi{padding:5px 0px 5px 0px; }
 .subTitle{font-weight: 500 !important;margin-top: 10px;}
 .deleteBtn{border: 0;color: #A9AFB5;min-width: unset}
 .el-button--default:hover{box-shadow:unset;color: #3280FE}
 .operationTitle { color: #232E37;line-height: 20px;font-size: 12px;font-weight: 400;margin-bottom: 3px;}
 .addOption {cursor: pointer;font-size: 12px;color: #0097FF;float: right; }
 .customColor { color:#A9AFB5; }
 .listPropertyWrap .navTitle { margin-top:20px; font-weight:bold; line-height:20px; font-size:13px; color:#232E37; }
 /deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item { margin:0; }
 /deep/ .el-select { width: 100%; }
 .drawBox {
   .drawerHeader {
     position: relative;
     height: 80px;
     line-height: 80px;
     padding: 0 12px;
     text-align: center;
     font-size: 20px;
     color: #232E37;
     margin-bottom: 40px;
     border-bottom: 1px solid #E8E8E8;
     .rightIcon {
       position: absolute;
       right: 25px;
       top: 30px;
       cursor: pointer;
     }
   }
   /deep/ .el-form-item__label {
     width: 128px;
     font-size: 14px;
     color: #232E37;
     text-align: right;
     margin-right: 16px;
   }
   /deep/ .el-form-item__content {
     display: inline-block;
     vertical-align: middle;
   }
   /deep/ .el-input input {
     height: 40px;
   }
   /deep/ .btnSetting .el-input input {
     height: 40px;
   }
   /deep/ .el-form-item {
     margin-top: 20px;
   }
   .filterBox {
     margin-top: 20px;
   }
   /deep/ .filterBox .el-form-item, .flowNameBox .el-form-item {
     margin-top: 0;
   }
   .btnIcon {
     width: 72px;
     margin-right: 16px;
     float: left;
     /deep/ .el-input--suffix {
       height: 40px !important;
     }
   }
   .btnMsg {
     width: 200px;
   }
   /deep/ .popBox .el-form-item:first-child .el-form-item__content {
       vertical-align: top;
   }
   .formBox {
     height: calc(100vh - 180px);
     overflow-y: scroll;
     overflow-x: hidden;
     padding: 0 40px 50px;
   }
   .createWorkFlow {
     cursor: pointer;
     color: #0097FF;
     margin: 20px 0 0 144px;
     font-size: 14px;
   }
   .saveBtnBox {
     width: 100%;
     position: absolute;
     bottom: 0;
     left: 0;
     height: 50px;
     text-align: right;
     border-top: 1px solid #E8E8E8;
     button {
       width: 80px;
       height: 34px;
       margin-top: 8px;
     }
   }
 }
 .vertical-m {
   vertical-align: middle;
 }
  /deep/ .iconsBox {
    font-size: 40px;
    height: 40px;
    line-height: 20px;
  }
  /deep/ .drawBox .el-input.el-input--mini.el-input--suffix {
    height: 40px !important;
  }
  .ml5 {
    margin-left: 5px;
  }
  .cur-p {
    cursor: pointer;
  }
  /deep/ .flowDialogBox {
    height: 100vh;
    margin-top: 0 !important;
  }
  /deep/ .btnSetting .el-form-item__content .el-form-item__error {
    margin-left: 88px;
  }
  /deep/ .flowDialogBox .el-dialog__header {
    display: none;
  }
  /deep/ .flowDialogBox .el-dialog__body {
    padding: 0;
  }
  /deep/ .flowDialogBox.el-dialog {
    margin: 0 !important;
  }
  /deep/ .filterBox .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 18px !important;
  }
  /deep/ .filterBox .el-input input {
    height: 32px !important;
  }
 /deep/ .filterBox .el-input.el-input--mini.el-input--suffix {
   height: 32px !important;
 }
 /deep/ .filterBox .el-form-item__content {
   width: 100%;
 }
</style>
<style>
  .el-select-dropdown.el-popper {
    max-width: 400px;
  }
</style>
