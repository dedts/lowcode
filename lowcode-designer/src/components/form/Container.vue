<template>
  <el-container class="fm2-container">
    <!-- nav -->
    <el-header class="navHeader">
      <nav-main
        :show-hide-btn-preview="componetOrContentId"
        btn-end-show-hide="show"
        type-page="builder"
        @publish="publish"
        @showPreview="handlePreview" />
    </el-header>
    <el-main class="fm2-main">
      <!-- 构建器 -->
      <el-container>
        <!-- 组件 -->
        <el-aside
          width="250px"
          class="el-aside">
          <div
            class="components-list"
            style="background-color:#F9FAFB; ">
            <!-- menu页面 - shou -->
            <menu-page
              v-model="menuPage"
              :cur-form-data.sync="curFormData"
              :cur-page-data.sync="curPageData"
              :from-add.sync="dialog.formAdd"
              :switch-page-loading.sync="switchPageLoading"
              :is-first-menu.sync="isFirstMenu"
              @init="init"
              @setCurPageData="setCurPageData"
              @modifyConfigTab="modifyConfigTab"
              @changeFormAdd="changeFormAddFlag"
              @showComponentOrContent="showCC"
              @dealMenuClick="dealMenuClick" />

            <div class="propertyList">
              <el-scrollbar class="default-scrollbar">
                <div v-if="componetOrContentId === 'formPage'">
                  <!-- 基础组件 -->
                  <template v-if="basicFields.length">
                    <div class="widget-cate">{{ $t('fm.components.basic.title') }}</div>
                    <draggable
                      :list="basicComponents"
                      v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                      :move="handleMove"
                      tag="ul"
                      @end.self="handleMoveEnd"
                      @start="handleMoveStart">
                      <li
                        v-preventReClick
                        v-for="(item, index) in basicComponents"
                        v-if="basicFields.indexOf(item.type)>=0"
                        :class="{'no-put': item.type == 'divider'}"
                        :key="index"
                        style="pointer-events: auto"
                        class="form-edit-widget-label"
                        @click.stop="handleField(item)">
                        <a>
                          <i
                            :class="item.icon"
                            class="icon iconfont" />
                          <span>{{ item.name }}</span>
                        </a>
                      </li>
                    </draggable>
                  </template>
                  <!-- 高级组件 -->
                  <template v-if="advanceFields.length">
                    <div class="widget-cate">{{ $t('fm.components.advance.title') }}</div>
                    <draggable
                      :list="advanceComponents"
                      v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                      :move="handleMove"
                      tag="ul"
                      @end.self="handleMoveEnd"
                      @start="handleMoveStart">
                      <li
                        v-preventReClick
                        v-for="(item, index) in advanceComponents"
                        v-if="advanceFields.indexOf(item.type) >= 0"
                        :class="{'no-put': item.type == 'table'}"
                        :key="index"
                        class="form-edit-widget-label"
                        @click.stop="handleField(item)">
                        <a>
                          <i
                            :class="item.icon"
                            class="icon iconfont" />
                          <span>{{ item.name }}</span>
                        </a>
                      </li>
                    </draggable>
                  </template>
                </div>
                <!-- 列表-选择列表内容 - shou -->
                <list-content
                  v-if="componetOrContentId === 'listPage'"
                  :select.sync="widgetFormSelect"
                  :list-components="widgetForm.list"
                  @modifyConfigTab="modifyConfigTab" />

                  <!--布局-->
                  <!--<template v-if="layoutFields.length">-->
                  <!--<div class="widget-cate">{{$t('fm.components.layout.title')}}</div>-->
                  <!--<draggable tag="ul" :list="layoutComponents"-->
                  <!--v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"-->
                  <!--@end="handleMoveEnd"-->
                  <!--@start="handleMoveStart"-->
                  <!--:move="handleMove"-->
                  <!--&gt;-->
                  <!--<li @click="handleField(item)" v-if="layoutFields.indexOf(item.type) >=0" class="form-edit-widget-label no-put" v-for="(item, index) in layoutComponents" :key="index">-->
                  <!--<a>-->
                  <!--<i class="icon iconfont" :class="item.icon"></i>-->
                  <!--<span>{{item.name}}</span>-->
                  <!--</a>-->
                  <!--</li>-->
                  <!--</draggable>-->
                  <!--</template>-->
              </el-scrollbar>
            </div>
          </div>
        </el-aside>
        <!-- 组件-编辑器 -->
        <el-container
          v-loading="switchPageLoading"
          class="center-container"
          direction="vertical">
          <!--<el-header class="btn-bar inline" style="height: 45px;">-->
          <!--&lt;!&ndash;<slot name="action">&ndash;&gt;-->
          <!--&lt;!&ndash;</slot>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-button type="text" :disabled="!undo" size="medium" icon="el-icon-back" @click="handleUndo">{{$t('fm.actions.undo')}}</el-button>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-button type="text" :disabled="!redo" size="medium" icon="el-icon-right" @click="handleRedo">{{$t('fm.actions.redo')}}</el-button>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-button v-if="upload" type="text" size="medium" icon="el-icon-upload2" @click="handleUpload">{{$t('fm.actions.import')}}</el-button>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-button v-if="clearable" type="text" size="medium" icon="el-icon-delete" @click="handleClear">{{$t('fm.actions.clear')}}</el-button>&ndash;&gt;-->
          <!--&lt;!&ndash; 预览表单 &ndash;&gt;-->
          <!--&lt;!&ndash;<el-button v-if="preview" type="text" size="medium" icon="el-icon-view" @click="handlePreview">{{$t('fm.actions.preview')}}</el-button>&ndash;&gt;-->
          <!--&lt;!&ndash; 获取表单数据 &ndash;&gt;-->
          <!--&lt;!&ndash;<el-button v-if="generateJson" type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">获取表单数据</el-button>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-button v-if="generateJson" type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">{{$t('fm.actions.json')}}</el-button>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-button v-if="generateCode" type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">{{$t('fm.actions.code')}}</el-button>&ndash;&gt;-->
          <!--</el-header>-->
          <el-main :class="{'widget-empty': widgetForm.list.length === 0,fromContent:true}">
            <widget-form
              v-if="!resetJson"
              ref="widgetForm"
              :cur-page-name="curPageData.pageTemplateName"
              :mune-type="componetOrContentId"
              :cur-page-id="curPageData.templateDataId"
              :data="widgetForm"
              :select.sync="widgetFormSelect" />
          </el-main>
        </el-container>

        <!-- 组件-属性 -->
        <el-aside class="widget-config-container">
          <el-container class="asideConfig">
            <el-header height="45px">
              <!--<div class="config-tab" :class="{active: configTab=='widget'}" @click="handleConfigSelect('widget')">{{$t('fm.config.widget.title')}}</div>-->
              <!--<div class="config-tab" :class="{active: configTab=='form'}" @click="handleConfigSelect('form')">{{$t('fm.config.form.title')}}</div>-->
              <!-- 字段属性 -->
              <div class="config-tab">{{ showAttributeSetting }}</div>
            </el-header>
            <el-main class="config-content">
              <el-scrollbar class="default-scrollbar">
                <!--字段属性组件-->
                <div class="asideConfigWapprer">
                  <widget-config
                    v-if="configTab === 'widget' || configTab === 'list'"
                    :mune-type="componetOrContentId"
                    :cur-page-id="curPageData.templateDataId"
                    :data.sync="widgetFormSelect" />
                  <!--表单属性组件-->
                  <!--<form-config v-show="configTab=='form'" :data="widgetForm.config"></form-config>-->
                  <!--页面属性组件-->
                  <page-config
                    v-if="configTab === 'page'"
                    :is-first-menu="isFirstMenu"
                    :cur-page-data.sync="curPageData" />
                </div>
              </el-scrollbar>
            </el-main>
          </el-container>
        </el-aside>

        <!-- 添加菜单，创建表单 - shou -->
        <el-dialog
          :visible.sync="dialog.formAdd"
          top="30vh"
          title="选择要添加的内容"
          width="30%">
          <ul class="addMenu">
            <!--<li @click="addMenu()"><h3>添加菜单</h3><span>添加一个空菜单，可以像菜单中拖拽表单或列表页面</span></li>-->
            <li @click="addForm()">
              <h3>创建表单</h3><span>表单页面将用于内容录入、展示和编辑</span>
            </li>
          </ul>
        </el-dialog>

        <!-- 添加菜单/创建表单 - shou -->
        <el-dialog
          :visible.sync="dialog.formCreate"
          :fullscreen="true"
          width="100%"
          height="100%">
          <div class="createForm">
            <h3>添加菜单/创建表单</h3>
            <el-row class="createFormList">
              <el-col :span="4">表单名称</el-col>
              <el-col :span="20">
                <el-input
                  v-model="menuForm"
                  placeholder="请填写" />
              </el-col>
            </el-row>
            <el-row>
              <el-col align="center">
                <el-button
                  v-preventReClick
                  type="primary"
                  size="mini"
                  align="center"
                  @click="createFormMenu()">创建表单</el-button>
              </el-col>
            </el-row>
          </div>
        </el-dialog>

        <!-- 预览表单 -->
        <cus-dialog
          ref="widgetPreview"
          :visible="previewVisible"
          :title="$t('fm.actions.preview')"
          width="800px"
          form
          @on-close="previewVisible = false">
          <generate-form
            v-if="previewVisible && (previewForm.config.ui == 'element' || !previewForm.config.ui)"
            ref="generateForm"
            :data="previewForm"
            :value="widgetModels"
            :remote="remoteFuncs"
            :cur-page-id="curPageData.templateDataId"
            operation="preview"
            insite="true">
            <template v-slot:blank="scope">
              Width
              <el-input v-model="scope.model.blank.width" />
              Height：
              <el-input v-model="scope.model.blank.height" />
            </template>
          </generate-form>

          <!--<antd-generate-form insite="true" v-if="previewVisible && previewForm.config.ui == 'antd'" :data="previewForm" :value="widgetModels" :remote="remoteFuncs" ref="generateAntForm"></antd-generate-form>-->
          <template slot="action">
            <el-button
              type="primary"
              @click="closeForm">关闭</el-button>
              <!--<el-button type="primary" @click="handleTest">{{$t('fm.actions.getData')}}</el-button>-->
              <!--<el-button @click="handleReset">{{$t('fm.actions.reset')}}</el-button>-->
          </template>
        </cus-dialog>

        <!-- 导入JSON -->
        <cus-dialog
          ref="uploadJson"
          :visible="uploadVisible"
          :title="$t('fm.actions.import')"
          width="800px"
          form
          @on-close="uploadVisible = false"
          @on-submit="handleUploadJson">
          <el-alert
            :title="$t('fm.description.uploadJsonInfo')"
            type="info" />
          <code-editor
            v-model="jsonEg"
            height="400px"
            mode="json" />
        </cus-dialog>

        <!-- 生成JSON -->
        <cus-dialog
          ref="jsonPreview"
          :visible="jsonVisible"
          :title="$t('fm.actions.json')"
          width="800px"
          form
          @on-close="jsonVisible = false">
          <code-editor
            v-model="jsonTemplate"
            height="400px"
            mode="json" />
          <template slot="action">
            <el-button
              :data-clipboard-text="jsonCopyValue"
              type="primary"
              class="json-btn">{{ $t('fm.actions.copyData') }}</el-button>
          </template>
        </cus-dialog>

        <!-- 生成代码 -->
        <cus-dialog
          ref="codePreview"
          :visible="codeVisible"
          :title="$t('fm.actions.code')"
          width="800px"
          form
          @on-close="codeVisible = false">
          <el-tabs
            v-model="codeActiveName"
            type="border-card"
            style="box-shadow: none;">
            <el-tab-pane
              label="Vue Component"
              name="vue">
              <code-editor
                v-model="vueTemplate"
                height="450px"
                mode="html" />
            </el-tab-pane>
            <el-tab-pane
              label="HTML"
              name="html">
              <code-editor
                v-model="htmlTemplate"
                height="450px"
                mode="html" />
            </el-tab-pane>
          </el-tabs>
          <template slot="action">
            <el-button
              :data-clipboard-text="codeCopyValue"
              type="primary"
              class="code-btn">{{ $t('fm.actions.copyData') }}</el-button>
          </template>
        </cus-dialog>
      </el-container>
    </el-main>
    <!-- footer -->
    <!--<el-footer height="30px" style="font-weight: 600;">Powered by <a target="_blank" href="https://github.com/GavinZhuLei/vue-form-making">vue-form-making</a></el-footer>-->
  </el-container>

</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import GenerateForm from './GenerateForm'
import AntdGenerateForm from '../AntdvGenerator/GenerateForm'
import Clipboard from 'clipboard'
import CodeEditor from '../CodeEditor'
import {
  basicComponents,
  layoutComponents,
  advanceComponents,
  listComponents
} from './componentsConfig.js'
import { loadJs, loadCss } from '../../util/index.js'
import { EventBus } from '../../util/event-bus.js'
import request from '../../util/request.js'
import generateCode from './generateCode.js'
import historyManager from '../../util/history-manager.js'
import _ from 'lodash'
import Vue from 'vue'
import MenuPage from '../list/menu'
import ListContent from '../list/listcontent'
import NavMain from '@/views/layoutcomponents/NavMain'

import { menuAdd, getAllMenu, formPageGetFields, formFieldAdd, formFieldList, updateOptions, formFieldMove } from '@/api/builder'
import { updateOperation, getOperations } from '@/api/list'
import { getAppId } from '@/util/auth'

import PageConfig from '@/components/list/pageConfig'
import mixins from '@/views/mixins/builderMixins'
export default {
  name: 'FmMakingForm',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm,
    CodeEditor,
    AntdGenerateForm,
    MenuPage,
    ListContent,
    NavMain,
    PageConfig
  },
  mixins: [mixins],
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    generateCode: {
      type: Boolean,
      default: false
    },
    generateJson: {
      type: Boolean,
      default: false
    },
    upload: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    basicFields: {
      type: Array,
      default: () => ['input', 'textarea', 'number', 'radio', 'checkbox', 'time', 'date', 'rate', 'color', 'select', 'switch', 'slider', 'text', 'member', 'fileupload', 'imgupload', 'autonumber']
    },
    advanceFields: {
      type: Array,
      default: () => ['blank', 'html', 'editor', 'cascader', 'table', 'grid', 'relatedChoice', 'relatedForm', 'paging']
    },
    layoutFields: {
      type: Array,
      default: () => ['tabs', 'divider']
    }
  },
  data() {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      listComponents,
      widgetFormKey: 0,
      curFormData: {},
      switchPageLoading: false,
      operations: [],
      listData: [],
      defaultParentDataKey: '',
      isFirstMenu: false,
      resetJson: false,
      dialog: {
        formAdd: false, // 创建页面弹窗flag
        formCreate: false // 添加菜单/创建表单flag
      },
      menuForm: '', // 添加菜单/创建表单
      menuPage: [], // 列表数据
      menuPageType: 'menuBuilder', // 菜单表单类型
      componetOrContentId: 'blank', // 点击子菜单显示组件和选择列表内容标示
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'top',
          size: 'small',
          customClass: '',
          ui: 'element',
          layout: 'horizontal',
          labelCol: 3
        }
      },
      curPageData: {},
      previewForm: {},
      configTab: 'default',
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      remoteFuncs: {
        func_test(resolve) {
          setTimeout(() => {
            const options = [
              { id: '1', name: '1111' },
              { id: '2', name: '2222' },
              { id: '3', name: '3333' }
            ]

            resolve(options)
          }, 2000)
        },
        funcGetToken(resolve) {
          request
            .get('http://tools-server.xiaoyaoji.cn/api/uptoken')
            .then((res) => {
              resolve(res.uptoken)
            })
        },
        upload_callback(response, file, fileList) {}
      },
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      jsonTemplate: '',
      vueTemplate: '',
      uploadEditor: null,
      jsonCopyValue: '',
      jsonClipboard: null,
      jsonEg: `{
  "list": [],
  "config": {
    "labelWidth": 100,
    "labelPosition": "right",
    "size": "small",
    "customClass": "",
    "ui": "element",
    "layout": "horizontal",
    "labelCol": 3
  }
}`,
      codeCopyValue: '',
      codeClipboard: null,
      codeActiveName: 'vue',
      undo: false,
      redo: false
    }
  },
  computed: {
    // 属性设置标题
    showAttributeSetting() {
      let title = ''
      switch (this.configTab) {
        case 'default':
        case 'list':
          title = this.$t('fm.config.widget.attributeSetting')
          break
        case 'widget':
          title = this.widgetFormSelect ? `${this.$t(`fm.components.fields.${this.widgetFormSelect.type}`)}-设置` : '页面属性'
          break
        case 'page':
          title = this.$t('fm.config.widget.pageAttribute')
          break
      }
      return title
    }
  },
  watch: {
    widgetFormSelect: {
      deep: true,
      handler(val) {
        if (this.componetOrContentId === 'formPage') {
          if (val && val.key) {
            this.widgetForm.list.forEach((item) => {
              item.key === val.key &&
                (item.name = val.name) &&
                this.$set(item, 'roles', val.roles) &&
                this.$set(item, 'rules', val.rules) &&
                typeof item.isDuplicated === 'boolean' &&
                (item.isDuplicated = val.isDuplicated)
              if (item.type === 'grid') {
                item.columns.list.length &&
                  item.columns.list.forEach((m) => {
                    m.key === val.key &&
                    (m.name = val.name) &&
                    this.$set(m, 'roles', val.roles) &&
                    this.$set(m, 'rules', val.rules) &&
                    typeof m.isDuplicated === 'boolean' &&
                    (m.isDuplicated = val.isDuplicated)
                  })
              }
            })
          }
        }
      }
    },
    widgetForm: {
      deep: true,
      handler: function(val) {
        if (this.componetOrContentId === 'formPage') {
          val &&
            this.widgetForm.list.forEach((item) => {
              item.flag === undefined && this.$set(item, 'flag', false)
            })
        }
      }
    },
    operations: {
      deep: true,
      handler(val) {}
    },
    componetOrContentId: function(val) {
      val !== 'formPage' && (this.widgetForm.list = [])
      if (val === 'listPage') {
        const customOperations = this.operations.filter(
          (item) => item.operationType === 'customize'
        )
        customOperations.forEach(item => {
          this.$set(item, 'icon', item.operationIcon)
        })
        this.listData.forEach((item) => {
          if (item.options.operationList) {
            item.options.operationList.forEach((m, index) => {
              const obj = this.operations.find(
                (n) => n.operationType === m.operationType
              )
              if (obj) {
                obj.icon = m.icon
                this.$set(item.options.operationList, index, obj)
              }
            })
            if (item.type === 'operation') {
              item.options.operationList = [
                ...item.options.operationList.filter(
                  (i) => i.operationType !== 'customize'
                ),
                ...customOperations.filter((m) => m.positionType === 1)
              ]
            }
            if (item.type === 'preview') {
              item.options.operationList = [
                ...item.options.operationList.filter(
                  (i) => i.operationType !== 'customize'
                ),
                ...customOperations.filter((m) => m.positionType === 3)
              ]
            }
          }
          if (item.options.batchList) {
            item.options.batchList.forEach((m, index) => {
              const obj = this.operations.find(
                (n) => n.operationType === m.operationType
              )
              if (obj) {
                obj.icon = m.icon
                this.$set(item.options.batchList, index, obj)
              }
            })
          }
          const key = new Date().getTime() + ''
          const widgetItem = _.cloneDeep({
            ...item,
            options: {
              ...item.options
            },
            key,
            name: this.$t(`fm.components.fields.${item.type}`)
          })
          this.widgetForm.list.push(widgetItem)
        })
      }
    },
    $lang: function(val) {
      this._loadComponents()
    },
    codeActiveName(val) {
      this.codeCopyValue =
          this.codeActiveName == 'vue' ? this.vueTemplate : this.htmlTemplate
    }
  },
  created() {
    if (localStorage.getItem('refresh') === '1') {
      location.reload()
    }
    // alert(Vue.config.lang)
    this._loadComponents()
  },
  mounted() {
    this.init()
    const _this = this

    historyManager.clear().then(() => {
      EventBus.$on('on-history-add', (item, widgetItem) => {
        historyManager
          .add(
            this.widgetForm,
            this.widgetFormSelect && this.widgetFormSelect.key
              ? this.widgetFormSelect.key
              : ''
          )
          .then(() => {
            _this.undo = true
            _this.redo = false
            item && _this.saveFormData(0, item, widgetItem)
          })
      })
    })
  },
  provide() {
    return {
      setCurElement: this.setCurElement,
      initMenu: this.init,
      saveFormData: this.saveFormData,
      modifyConfigTab: this.modifyConfigTab,
      curPageData: this.curPageData,
      getCurPageCompsData: this.getCurPageCompsData,
      getCurPageOperationData: this.getCurPageOperationData,
      curFormData: () => this.curFormData,
      compsData: () => this.widgetForm.list
    }
  },
  methods: {
    async init() {
      getAllMenu().then((res) => {
        const newMenuData = res.body.filter((item) => item.pageType === 0)
        newMenuData.sort((a, b) => a.parentTemplateSort - b.parentTemplateSort)
        newMenuData.forEach((item, index) => {
          newMenuData[index]['subMenu'] = []
          this.$set(item, 'subMenu', [])
        })
        const twoLevelMenuData = res.body.filter((item) => item.pageType !== 0)
        twoLevelMenuData.forEach((item, index) => {
          item.pageType === 1 && (item.isInited = false)
          const oneLevelMenuIndex = newMenuData.findIndex(
            (m) => item.parentTemplateDataId === m.templateDataId, item['subMenu'] = []
          )
          if (newMenuData[oneLevelMenuIndex]) {
            newMenuData[oneLevelMenuIndex]['subMenu'].push(item)
          }
        })
        newMenuData.forEach((item) => {
          item.subMenu.sort((a, b) => {
            return a.pageType - b.pageType
          })
        })
        this.menuPage = newMenuData
        this.menuPage.forEach((item) => {
          this.$set(item, 'active', false)
          this.$set(item, 'iconFlag', false)
          this.$set(item, 'editFlag', false)
          this.$set(item, 'navFlag', false)
        })
        this.modifyConfigTab('default')
        this.componetOrContentId = 'blank'
        const arr = []
        res.body.forEach((item) => arr.push(item))
        const root = arr.filter((item) => item.parentTemplateId === '0').map((item) => {
          const child = arr.filter((i) => i.parentTemplateDataId === item.templateDataId).map((i) => {
            return {
              pageTemplateId: i.templateDataId,
              pageTemplateName: i.pageTemplateName,
              pageType: i.pageType
            }
          })
          return {
            pageTemplateId: item.templateDataId,
            pageTemplateName: item.pageTemplateName,
            child: child
          }
        })
        this.$store.commit('SET_FORM', root)
      })
    },
    // 生成默认区段数据
    getDefaultGridData(childData) {
      childData.options.flag = true
      childData.fieldColumn = 1
      childData.fieldRow = 1
      const key = new Date().getTime() + ''
      const gridCompsArr = this.widgetForm.list.filter(
        (item) => item.type === 'grid'
      )
      let linkName = ''
      if (gridCompsArr.length) {
        linkName = `grid${
          Math.max(gridCompsArr.map((m) => parseInt(m.linkName.substring(4)))) +
            1
        }`
      } else {
        linkName = 'grid1'
      }
      return {
        type: 'grid',
        icon: 'iconquduan',
        key,
        linkName,
        name: this.$t(`fm.components.fields.grid`),
        loading: false,
        columns: {
          list: [childData]
        },
        options: {
          typeDesc: '区段',
          flag: false,
          isShowName: true, // 是否显示名称
          linkID: '', //  链接ID
          gutter: 0,
          justify: 'start',
          align: 'top',
          customClass: '',
          hidden: false
        }
      }
    },
    // 处理获取到的组件数据
    dealComsData(compsArr) {
      const defaultGrid = compsArr.filter((item) => {
        return item.sysAdd
      })
      defaultGrid.length && (this.defaultParentDataKey = defaultGrid[0].dataKey)
      compsArr = compsArr.filter((item) => {
        return !item.sysAdd
      })
      const gridArr = compsArr.filter((item) => item.type === 'grid')
      gridArr.length &&
        gridArr.forEach((item) => {
          item.columns.list = []
          compsArr.forEach((m) => {
            m.type !== 'grid' &&
            m.parentDataKey === item.dataKey &&
            (m.isGridChild = true) &&
            item.columns.list.push(m)
          })
        })
      compsArr = compsArr.filter((item) => !item.isGridChild)
      compsArr.forEach((item) => {
        item.type === 'grid' &&
          item.columns.list.sort((a, b) => a.fieldRow - b.fieldRow)
      })
      this.widgetForm.list = compsArr.sort((a, b) => a.fieldRow - b.fieldRow)
    },
    // 实时获取当前页面的组件数据
    getCurPageCompsData() {
      formFieldList(this.curPageData.templateDataId).then((res) => {
        this.dealComsData(res.body)
        this.dealSelected()
      })
    },
    // 获取当前列表页面的操作项数据
    async getCurPageOperationData() {
      this.operations = (await getOperations(this.curPageData.templateDataId)).body
      this.dealOperationData()
    },
    // 处理操作数据
    dealOperationData() {
      const customOperations = this.operations.filter(
        (item) => item.operationType === 'customize'
      )
      customOperations.forEach((item, index) => {
        this.$set(item, 'icon', item.operationIcon)
      })
      this.widgetForm.list.forEach((item, index) => {
        if (item.options.operationList) {
          item.options.operationList = item.options.operationList.filter(
            (m) => m.operationType !== 'customize'
          )
          item.options.operationList.forEach((m, index) => {
            const obj = this.operations.find(
              (n) => n.operationType === m.operationType
            )
            if (obj) {
              obj.icon = m.icon
              this.$set(item.options.operationList, index, obj)
            }
          })
          if (item.type === 'operation') {
            item.options.operationList = [
              ...item.options.operationList,
              ...customOperations.filter((m) => m.positionType === 1)
            ]
          }
          if (item.type === 'preview') {
            item.options.operationList = [
              ...item.options.operationList,
              ...customOperations.filter((m) => m.positionType === 3)
            ]
          }
        }
        if (item.options.batchList) {
          item.options.batchList.forEach((m, index) => {
            const obj = this.operations.find(
              (n) => n.operationType === m.operationType
            )
            if (obj) {
              obj.icon = m.icon
              this.$set(item.options.batchList, index, obj)
            }
          })
        }
      })
      console.log(this.widgetForm.list, 88)
    },
    // 处理组件选中
    dealSelected() {
      this.widgetForm.list.forEach((item, index) => {
        this.$set(
          item.options,
          'flag',
          this.widgetFormSelect ? this.widgetFormSelect.key === item.key : false
        )
        if (item.type === 'grid') {
          item.columns &&
            item.columns.list.forEach((m) => {
              this.$set(
                m.options,
                'flag',
                this.widgetFormSelect
                  ? this.widgetFormSelect.key === m.key
                  : false
              )
            })
        }
      })
    },
    // 保存表单
    async saveFormData(type, curItem, widgetItem) {
      this.widgetForm.list.forEach((item) => {
        item.type === 'grid' &&
          item.columns.list.forEach((m) => {
            !m.parentDataKey && this.$set(m, 'parentDataKey', item.dataKey)
          })
      })
      const comps = this.widgetForm.list.filter(
        (item) => item.type !== 'grid' && item.type !== 'paging'
      )
      !curItem && (curItem = this.widgetFormSelect)
      if (type === 1) {
        // 列表
        if (curItem.operationName) {
          const jsonData = {
            dataKey: curItem.dataKey,
            operationName: curItem.operationName
          }
          curItem.linkflow && (jsonData.linkflow = curItem.linkflow)
          updateOperation(jsonData)
        } else {
          const jsonData = {
            ...curItem
          }
          updateOptions(jsonData)
        }
      } else {
        // 处理现有区段里面的组件拖拽到外面自生成一个区段
        if (this.widgetFormSelect.dataKey && comps.length) {
          const jsonData = this.getDefaultGridData(this.widgetFormSelect)
          jsonData.columns.list = []
          jsonData.parentDataKey = '0'
          jsonData.templateDataId = this.curPageData.templateDataId
          jsonData.fieldRow =
              this.widgetForm.list.findIndex(
                (item) => item.dataKey === this.widgetFormSelect.dataKey
              ) + 1
          jsonData.fieldColumn = 1
          const res = await formFieldAdd(jsonData)
          this.widgetFormSelect.parentDataKey = res.body.dataKey
          const moveData = {
            dataKey: this.widgetFormSelect.dataKey,
            parentDataKey: res.body.dataKey,
            fieldColumn: 1,
            fieldRow: 1
          }
          await formFieldMove(moveData)
          this.getCurPageCompsData()
          return
        }
        this.dealSelected()
        // 表单
        let res = {}
        if (this.widgetFormSelect.type === 'autonumber') {
          this.widgetFormSelect.prefix = this.widgetFormSelect.options.autoNumberPrefix
          this.widgetFormSelect.initValue = this.widgetFormSelect.options.autoNumberValue
        }
        if (this.widgetFormSelect.type === 'member') {
          this.widgetFormSelect.selectType = this.widgetFormSelect.options.multiple ? 2 : 1
        }
        if (this.widgetFormSelect.type === 'relatedChoice') {
          this.widgetFormSelect.selectType = this.widgetFormSelect.options.choiceType === 'multiple' ? 2 : 1
        }
        if (this.widgetFormSelect.dataKey) {
          this.widgetFormSelect.isRequired = this.widgetFormSelect.options.required
          if (this.widgetFormSelect.type === 'relatedChoice' || this.widgetFormSelect.type === 'relatedForm') {
            this.widgetFormSelect.relateTemplateDataId = this.widgetFormSelect.options.formId
          }
          res = await updateOptions(this.widgetFormSelect)
        } else {
          if (!widgetItem) return
          curItem && curItem.name && (curItem.loading = true) && (widgetItem.loading = true)
          let formMakingData = {}
          this.widgetFormSelect.roles = '0'
          // 第一次新增
          if (
            this.widgetFormSelect.parentDataKey &&
              this.widgetFormSelect.parentDataKey !== '0' &&
              this.widgetFormSelect.type !== 'grid'
          ) {
            formMakingData = {
              ...this.widgetFormSelect,
              templateDataId: this.curPageData.templateDataId,
              fieldColumn: 1,
              parentDataKey: this.widgetFormSelect.parentDataKey
            }
            formMakingData.fieldRow =
                this.widgetForm.list
                  .find(
                    (item) =>
                      item.dataKey &&
                      item.dataKey === this.widgetFormSelect.parentDataKey
                  )
                  .columns.list.findIndex(
                    (m) => m.key === this.widgetFormSelect.key
                  ) + 1
          } else {
            if (
              this.widgetFormSelect.type !== 'grid' &&
                this.widgetFormSelect.type !== 'paging'
            ) {
              formMakingData = this.getDefaultGridData(this.widgetFormSelect)
            } else {
              formMakingData = this.widgetFormSelect
            }
            formMakingData.parentDataKey = '0'
            formMakingData.templateDataId = this.curPageData.templateDataId
            formMakingData.fieldColumn = 1
            formMakingData.fieldRow =
                this.widgetForm.list.findIndex(
                  (item) => item.key === this.widgetFormSelect.key
                ) + 1
          }
          if (this.widgetFormSelect.options.required) {
            this.widgetFormSelect.isRequired = true
          }
          if (
            this.widgetFormSelect.type === 'relatedChoice' ||
              this.widgetFormSelect.type === 'relatedForm'
          ) {
            this.widgetFormSelect.relateTemplateDataId = this.widgetFormSelect.options.formId
          }
          if (this.widgetFormSelect.type === 'relatedForm') {
            this.widgetFormSelect.relateDataKeys = this.widgetFormSelect.options.header.map(
              (item) => item.datakey
            )
            this.widgetFormSelect.maxRow = this.widgetFormSelect.options.maxSize
          }
          res = await formFieldAdd(formMakingData)
          if (res.body.type === 'grid' && res.body.columns.list.length) {
            this.$set(this, 'widgetFormSelect', res.body.columns.list[0])
          } else {
            this.$set(this, 'widgetFormSelect', res.body)
          }
          this.getCurPageCompsData()
          curItem && curItem.name && (curItem.loading = false) && widgetItem && (widgetItem.loading = true)
        }
        this.widgetForm.list.forEach((item, index) => {
          item.key === this.widgetFormSelect.key &&
            this.$set(this.widgetForm.list, index, this.widgetFormSelect)
          item.type === 'grid' &&
            item.columns.list.forEach((m, dIndex) => {
              m.key === this.widgetFormSelect.key &&
              this.$set(item.columns.list, dIndex, this.widgetFormSelect)
            })
        })
      }
    },
    setWidgetForm(jsonData, pageType, flag) {
      if (pageType === 1) {
        if (jsonData.length) {
          this.dealComsData(jsonData)
        } else {
          this.widgetForm.list = []
        }
      } else {
        if (flag) {
          this.operations = jsonData
        } else {
          this.listData = jsonData.filter((item) => !item.sysAdd)
        }
      }
    },
    // 点击菜单
    dealMenuClick(jsonData, pageType, flag) {
      this.setWidgetForm(jsonData, pageType, flag)
      if (pageType === 1) {
        this.clearSelected()
        this.initAppData()
      }
    },
    initAppData() {
      getAllMenu().then(res => {
        const root = res.body.filter(item => item.parentTemplateId === '0').map(item => {
          const child = res.body.filter(i => i.parentTemplateDataId === item.templateDataId).map(i => {
            return {
              pageTemplateId: i.templateDataId,
              pageTemplateName: i.pageTemplateName,
              pageType: i.pageType
            }
          })
          return {
            pageTemplateId: item.templateDataId,
            pageTemplateName: item.pageTemplateName,
            child: child
          }
        })
        this.$store.commit('SET_FORM', root)
      })
    },
    //  清除选中
    clearSelected() {
      this.widgetForm.list.forEach((item) => {
        item.options.flag = false
        if (item.type === 'grid') {
          item.columns &&
            item.columns.list.forEach((m) => {
              this.$set(m.options, 'flag', false)
            })
        }
      })
    },
    setCurElement(curIndex, flag, element) {
      this.widgetForm.list.forEach((item, index) => {
        if (flag) {
          item.options.flag = false
          item.columns &&
            item.columns.list.forEach((m, dIndex) => {
              this.$set(
                m.options,
                'flag',
                curIndex === dIndex && m.key === element.key
              )
            })
        } else {
          item.options && (item.options.flag = curIndex === index)
          if (item.type === 'grid') {
            item.columns.list.forEach((m) => {
              this.$set(m.options, 'flag', false)
            })
          }
        }
      })
      if (element.type === 'relatedForm' || element.type === 'relatedChoice') {
        // console.log(element)
      }
    },
    // 子组件更改父组件的添加页面弹窗的flag
    changeFormAddFlag(params) {
      this.dialog.formAdd = params
    },
    // 添加菜单
    addMenu() {
      this.dialog.formCreate = true
      this.dialog.formAdd = false
      this.menuPageType = 'menuBuilder'
    },
    // 添加表单
    addForm() {
      this.dialog.formCreate = true
      this.dialog.formAdd = false
      this.menuPageType = 'formBuilder'
    },
    // 创建表单
    createFormMenu() {
      if (this.menuForm === '') {
        this.$message.warning('表单名称不能空！')
        return false
      }
      const jsonData = {
        pageTemplateName: this.menuForm,
        appId: getAppId()
      }
      menuAdd([jsonData]).then((res) => {
        this.dialog.formCreate = false
        this.menuForm = ''
        this.init()
      })
    },
    // 接收菜单子组件返回的标示
    showCC(subItem) {
      this.componetOrContentId =
          subItem.pageType === 1
            ? 'formPage'
            : subItem.pageType === 2
              ? 'listPage'
              : 'blank'
      // 如果菜单可以展开多个， 相同pageType之间切换时  会存在this.componetOrContentId不更新  如果
      // this.componetOrContentId 没有更新导致 列表数据不会修改（watch监听里 监听this.componetOrContentId 修改 this.widgetForm的值）
    },
    handleGoGithub() {
      window.location.href = 'https://github.com/GavinZhuLei/vue-form-making'
    },
    handleConfigSelect(value) {
      this.configTab = value
    },
    modifyConfigTab(type) {
      this.configTab = type
    },
    handleMoveEnd(evt) {
      // this.modifyConfigTab('widget')
      // this.saveFormData()
    },
    handleMoveStart({ oldIndex }) {},
    handleMove() {
      return true
    },
    setCurPageData(curData) {
      this.curPageData = curData
      this.widgetForm.templateDataId = this.curPageData.templateDataId
      this.widgetFormSelect = null
    },
    // 显示预览弹出框
    handlePreview() {
      this.previewForm = _.cloneDeep(this.widgetForm)
      this.previewVisible = true
    },
    // 关闭预览表单
    closeForm() {
      this.previewVisible = false
    },
    handleReset() {
      const $form =
          this.previewForm.config.ui == 'element'
            ? this.$refs.generateForm
            : this.$refs.generateAntForm

      $form.reset()
    },
    handleTest() {
      const $form =
          this.previewForm.config.ui == 'element'
            ? this.$refs.generateForm
            : this.$refs.generateAntForm

      $form
        .getData()
        .then((data) => {
          this.jsonVisible = true
          this.jsonTemplate = data
          this.$nextTick(() => {
            if (!this.jsonClipboard) {
              this.jsonClipboard = new Clipboard('.json-btn')
              this.jsonClipboard.on('success', (e) => {
                this.$message.success(this.$t('fm.message.copySuccess'))
              })
            }
            this.jsonCopyValue = JSON.stringify(data)
          })
          this.$refs.widgetPreview.end()
        })
        .catch((e) => {
          this.$message.error(e)
          this.$refs.widgetPreview.end()
        })
    },
    handleGenerateJson() {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      this.$nextTick(() => {
        if (!this.jsonClipboard) {
          this.jsonClipboard = new Clipboard('.json-btn')
          this.jsonClipboard.on('success', (e) => {
            this.$message.success(this.$t('fm.message.copySuccess'))
          })
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm)
      })
    },
    handleGenerateCode() {
      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm), 'html')
      this.vueTemplate = generateCode(JSON.stringify(this.widgetForm), 'vue')
      this.$nextTick(() => {
        if (!this.codeClipboard) {
          this.codeClipboard = new Clipboard('.code-btn')
          this.codeClipboard.on('success', (e) => {
            this.$message.success(this.$t('fm.message.copySuccess'))
          })
        }
        this.codeCopyValue =
            this.codeActiveName == 'vue' ? this.vueTemplate : this.htmlTemplate
      })
    },
    handleUpload() {
      this.uploadVisible = true
    },
    handleUploadJson() {
      try {
        this.setJSON(this.jsonEg)
        this.uploadVisible = false
      } catch (e) {
        this.$message.error(e.message)
        this.$refs.uploadJson.end()
      }
    },
    handleClear() {
      this.widgetForm = {
        ...this.widgetForm,
        list: []
      }

      this.widgetFormSelect = {}

      this.$nextTick(() => {
        EventBus.$emit('on-history-add')
      })
    },
    getJSON() {
      return this.widgetForm
    },
    getHtml() {
      return generateCode(JSON.stringify(this.widgetForm))
    },
    setJSON(json) {
      if (typeof json === 'string') {
        json = JSON.parse(json)
      }

      this.widgetForm = json
      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0]
      }

      this.$nextTick(() => {
        EventBus.$emit('on-history-add')
      })
    },
    handleInput(val) {
      this.blank = val
    },
    handleField(item) {
      this.modifyConfigTab('widget')
      EventBus.$emit('on-field-add', item)
    },
    handleUndo() {
      historyManager
        .updateLatest(
          this.widgetForm,
          this.widgetFormSelect && this.widgetFormSelect.key
            ? this.widgetFormSelect.key
            : ''
        )
        .then(() => {
          historyManager.undo().then((data) => {
            this.widgetForm = { ...data.data }
            // this.widgetFormSelect = this.widgetForm.list.length ? this.widgetForm.list[0] : {}
            this.widgetFormSelect = this._findWidgetItem(
              this.widgetForm.list,
              data.key
            )
            this.undo = data.undo
            this.redo = data.redo
          })
        })
    },
    handleRedo() {
      historyManager.redo().then((data) => {
        this.widgetForm = { ...data.data }
        this.widgetFormSelect = this._findWidgetItem(
          this.widgetForm.list,
          data.key
        )

        this.undo = data.undo
        this.redo = data.redo
      })
    },
    _findWidgetItem(list, key) {
      const index = list.findIndex((item) => item.key == key)

      if (index >= 0) {
        return list[index]
      } else {
        for (let m = 0; m < list.length; m++) {
          const item = list[m]

          if (item.type === 'grid') {
            for (let i = 0; i < item.columns.length; i++) {
              return this._findWidgetItem(item.columns[i].list, key)
            }
          }
          if (item.type === 'table') {
            return this._findWidgetItem(item.tableColumns, key)
          }
          if (item.type === 'tabs') {
            for (let i = 0; i < item.tabs.length; i++) {
              return this._findWidgetItem(item.tabs[i].list, key)
            }
          }
        }

        return {}
      }
    },
    _loadComponents() {
      this.basicComponents = this.basicComponents.map((item) => {
        return {
          ...item,
          name: this.$t(`fm.components.fields.${item.type}`),
          loading: false
        }
      })
      this.advanceComponents = this.advanceComponents.map((item) => {
        return {
          ...item,
          name: this.$t(`fm.components.fields.${item.type}`),
          loading: false
        }
      })
      this.layoutComponents = this.layoutComponents.map((item) => {
        return {
          ...item,
          name: this.$t(`fm.components.fields.${item.type}`),
          loading: false
        }
      })
      this.listComponents = this.listComponents.map((item) => {
        return {
          ...item,
          name: this.$t(`fm.components.fields.${item.type}`),
          loading: false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .inline {
    display: inline-block;
    margin: 0 auto;
  }
  .addMenu li {
    margin-bottom: 16px;
    padding: 10px 10px 0;
    height: 72px;
    cursor: pointer;
    border: 1px solid #ffffff;
    background: #f8f9fa;
  }
  .addMenu li:hover {
    border: 1px solid #0097ff;
  }
  .addMenu li h3 {
    font-size: 16px;
    color: #232e37;
  }
  .addMenu li span {
    font-size: 14px;
    color: #a9afb5;
  }
  .createForm {
    margin: 10% auto 0;
    width: 500px;
  }
  .createForm h3 {
    font-size: 30px;
    line-height: 38px;
    text-align: center;
  }
  .createFormList {
    padding: 15px 0 30px;
    line-height: 30px;
  }
  .setColor {
    color: #a9afb5;
  }
  .ft12 {
    font-size: 12px;
  }
  .blank {
    background: red;
  }
  .no-click {
    pointer-events: none;
    /*background-color: #C0C4CC !important;*/
  }
  .grey {
    color: #c0c4cc !important;
  }
  /deep/.el-dialog__body {
    padding: 15px 16px;
  }
  /deep/.el-dialog__title {
    font-size: 16px;
    font-weight: bold;
  }

  .el-aside {
    overflow: hidden;
    .components-list {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .propertyList {
        flex: 1;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
      }
    }
  }
  .center-container {
    .fromContent {
      overflow: hidden;
      padding: 24px;
    }
  }
  .asideConfig {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .config-content {
      padding: 0;
      flex: 1;
      flex-shrink: 0;
      overflow: hidden;
      .asideConfigWapprer{
        padding: 10px 16px;
      }
    }
  }
</style>
