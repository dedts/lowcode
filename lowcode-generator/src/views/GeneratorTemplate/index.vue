<template>
  <div v-if="showPage">
    <div v-if="!showNodata || headerList.length" class="sectionBox">
      <!--按钮组-->
      <div class="btnBox">
        <!--正常展示-->
        <el-row :class="{animate:multipleSelection.length}" class="btn1">
          <el-col :span="18">
            <div style="font-size: 20px;color:#262626;">{{ pageName }}</div>
          </el-col>
          <el-col :span="6" align="right">
            <el-button v-for="item in headerInfo.options.operationList" :key="item.operationType" type="primary" @click="clickBtn(item.operationType)"><i :class="['iconfont',item.icon]"/> {{ item.operationName }}</el-button>
          </el-col>
        </el-row>
        <!--多选时展示-->
        <el-row>
          <el-col :span="20">
            <div>
              <el-button v-for="item in headerInfo.options.batchList" :key="item.dataKey" :type="item.operationType==='batchDelete'?'danger':''" plain @click="clickBtn(item.operationType)"><i :class="['iconfont',item.icon]"/> {{ item.operationName }}</el-button>
            </div>
          </el-col>
          <el-col :span="4" align="right">
            <el-button v-if="multipleSelection.length" plain icon="el-icon-close" @click="cencleBtach"> 取消</el-button>
          </el-col>
        </el-row>
      </div>
      <!--搜索条件-->
      <div class="mt10">
        <div v-if="filterList.length || sortList.length || workFlowCondition.length">
          <div v-if="sortList.length" class="tagsBox mr10">
            <label v-if="sortList.some(s=>s.isShowTags)" >排序</label>
            <span v-for="(tag,index) in sortList" :key="tag.sortField" class="tag">
              <span class="inline mr5">{{ tag.name }}&nbsp;{{ tag.orderDesc }}
              <i :class="[!tag.sortDesc?'el-icon-caret-top':'el-icon-caret-bottom']"/></span>
              <i class="el-icon-error tagCloseIcon" @click="handleCloseSort(tag,index)"/>
            </span>
          </div>
          <div v-if="filterList.length || workFlowCondition.length" class="tagsBox">
            <label>搜索</label>
            <!--工作流所带搜索条件-->
            <span v-if="workFlowCondition.length" class="tag">
              <span class="inline mr5 curpion">{{ getFilterSearchValue() }}</span>
              <i class="el-icon-error tagCloseIcon" @click="closeFilter"/>
            </span>
            <span v-for="(tag,index) in filterList" :key="tag.dataKey" class="tag">
              <!--查找来的条件-->
              <span class="inline mr5 curpion" @click="clickBtn('listQuery')">{{ tag.name }}{{ tag.comparisonOperLable }}{{ tag.filterValue }}</span>
              <i class="el-icon-error tagCloseIcon" @click="handleCloseSearch(tag,index)"/>
            </span>
          </div>
        </div>
      </div>
      <!--表格-->
      <el-table
        v-if="showTable"
        ref="multipleTable"
        :data="tableData"
        :max-height="listInfo.options.fixHeader?460:null"
        row-key="mongoDataId"
        class="mt20"
        border
        style="width: 100%"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
        @row-contextmenu="rowContextmenu">
        <el-table-column :reserve-selection="true" :selectable="selectable" type="selection" width="55"/>

        <el-table-column v-for="item in headerList" v-if="operationInfo.options.fix==='hidden'" :key="item.dataKey" :label="item.name" :sortable="sortable(item.type)" :prop="item.dataKey" min-width="120px">
          <template slot-scope="scope">
            <div v-contextmenu:contextmenu>
              <table-formatter :item="item" :related-choice-list="relatedChoiceList" :related-choice-mongo-data-ids-data="relatedChoiceMongoDataIdsData" :table-member-list="tableMemberList" :row="scope.row" from="table"/>
            </div>
          </template>
        </el-table-column>

        <el-table-column v-for="item in headerList" v-if="operationInfo.options.fix==='right'" :key="item.dataKey" :label="item.options&&item.options.unit?item.name+'('+item.options.unit+')':item.name" :sortable="sortable(item.type)" :prop="item.dataKey" min-width="120px">
          <template slot-scope="scope">
            <table-formatter :item="item" :related-choice-list="relatedChoiceList" :related-choice-mongo-data-ids-data="relatedChoiceMongoDataIdsData" :table-member-list="tableMemberList" :row="scope.row" from="table"/>
          </template>
        </el-table-column>

        <el-table-column v-if="operationInfo.options.fix==='right'" width="130" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button v-for="item in scope.row&&scope.row.operationList" v-show="item.isShowRow&&item.operationType!='customize'" :key="item.dataKey" type="text" style="white-space: unset;text-align: left;line-height: 1.3;" @click="clickBtn(item.operationType,scope.row,item)">{{ item.operationName }}</el-button>
            <el-dropdown placement="bottom" @command="handleCommandBtn($event,scope.row)">
              <span class="el-dropdown-link">
                <i v-if="scope.row&&scope.row.operationList.some(s=>s.operationType==='customize'&&s.isShowRow)" class="el-icon-arrow-down el-icon--right" style="color:#409EFF"/>
              </span>
              <el-dropdown-menu style="margin-top: 0px" >
                <el-dropdown-item v-for="item in scope.row&&scope.row.operationList" v-show="item.operationType==='customize'&&item.isShowRow" :key="item.configDataKey" :command="item" class="mt10"><el-button type="text">{{ item.operationName }}</el-button></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

        </el-table-column>
      </el-table>
      <!--分页-->
      <div v-if="tableData.length" class="paging">
        <el-row>
          <el-col :span="4" align="left">共{{ total }}条</el-col>
          <el-col :span="20" align="right">
            <el-pagination :current-page="paging.pageNow" :page-sizes="[20, 50, 100]" :page-size="paging.pageSize" :total="total" layout="prev, pager, next, sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
          </el-col>
        </el-row>
      </div>
      <!--批量编辑弹窗-->
      <el-dialog :visible.sync="batchEditDialog" :close-on-click-modal="false" :before-close="cancelDialog" title="批量编辑" width="480px">
        <el-form ref="form" :model="form" :rules="rules">
          <div>
            <span class="editLable">已选字段</span>
            <el-form-item prop="modify" class="inline">
              <el-select v-model="form.modify" placeholder="请选择" style="width: 300px;" @change="modifyChange">
                <el-option
                  v-for="item in headerList"
                  v-if="item.type !== 'fileupload'&&item.type !== 'imgupload'&&item.type !== 'autonumber'"
                  :disabled="item.isDuplicated || item.sysAdd"
                  :key="item.dataKey"
                  :label="item.name"
                  :value="item.dataKey"
                />
              </el-select>
            </el-form-item>
          </div>
          <div v-if="form.modify" class="mt15">
            <span class="editLable">更新为</span>
            <el-form-item prop="formValue" class="inline" style="width: 300px;">
              <listthtype v-if="form.modify" v-model="form.formValue" :form-item="getFormItem(form.modify,'batchEdit')" :key="componentKey" from="batchEdit" style="width: 300px;display: inline-block"/>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">恢复默认</el-button>
          <el-button type="primary" @click="comfirmBtacnEdit">确 定</el-button>
        </div>
      </el-dialog>
      <!--删除弹窗-->
      <delete-dialog :visible.sync="deleteDialog" title="是否删除" content="内容删除后将不可撤销" @cancel="cancelDialog" @confirm="deleteRow"/>
      <!--查看详情-->
      <el-drawer
        v-if="detailDrawer"
        :visible.sync="detailDrawer"
        :show-close="false"
        :wrapper-closable="false"
        :append-to-body="true"
        size="45%"
        direction="rtl">
        <template slot="title">
          <el-row>
            <el-col :span="4">
              <i class="el-icon-close" style="cursor: pointer" @click="cancelDialog"/>
            </el-col>
            <el-col :span="20" align="right">
              <el-button v-for="item in detailInfo.operationList" v-show="item.isShowRow" :key="item.icon" @click="clickBtn(item.operationType,detailInfo,item)"><i :class="['iconfont',item.icon]" style="font-size: 12px;"/> {{ item.operationName }}</el-button>
            </el-col>
          </el-row>
        </template>
        <div class="detailDrawerContent" >
          <!--区段写法-->
          <div style="width: 800px;">
            <div v-for="item in previewDialogInfo.content" :key="item.dataKey" >
              <div class="detail-label pb15 ml30">{{ item.options.hidden?'': item.name }}</div>
              <div class="previewBox">
                <div v-for="c in item.columns.list" :key="c.dataKey" :style="{width:c.type ==='relatedForm'?'100%':'46%'}" class="preview-content">
                  <div class="detail-label">{{ c.name }}</div>
                  <div v-if="c.type ==='relatedForm'" >
                    <!--关联表单-->
                    <el-table :data="detailInfo[c.dataKey]" style="width: 100%">
                      <el-table-column v-for="item in c.options.header" :key="item.dataKey" :label="item.name" :prop="item.dataKey" min-width="120px">
                        <template slot-scope="scope">
                          <table-formatter :item="item" :table-member-list="tableMemberList" :related-choice-mongo-data-ids-data="relatedChoiceMongoDataIdsData" :related-choice-list="relatedChoiceList" :row="scope.row" from="table"/>
                        </template>

                      </el-table-column>
                    </el-table>
                  </div>
                  <div v-else class="detail-content">
                    <!--除了关联表单其他组件-->
                    <table-formatter :item="c" :row="detailInfo" :related-choice-list="relatedChoiceList" :related-choice-mongo-data-ids-data="relatedChoiceMongoDataIdsData" :table-member-list="tableMemberList" from="preview"/>
                  </div>
                </div>
              </div>
            </div>
            <!--分页写法-->
            <div v-if="previewDialogInfo.tabs&&previewDialogInfo.tabs.length" class="pr20 pl30">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="(tab,index) in previewDialogInfo.tabs" :key="tab.dataKey" :label="tab.name" :name="index+''">
                  <div v-for="item in previewDialogInfo.tabsContent" :key="item.dataKey" >
                    <div class="detail-label pb15">{{ item.options.hidden?'': item.name }}</div>
                    <div class="previewBox" style="padding-left: 0px;width: 800px">
                      <div v-for="c in item.columns.list" :key="c.dataKey" :style="{width:c.type ==='relatedForm'?'100%':'46%'}" class="preview-content">
                        <div class="detail-label">{{ c.name }}</div>
                        <div v-if="c.type ==='relatedForm'" >
                          <!--关联表单-->
                          <el-table :data="detailInfo[c.dataKey]" style="width: 100%">
                            <el-table-column v-for="item in c.options.header" :key="item.dataKey" :label="item.name" :prop="item.dataKey" min-width="120px">
                              <template slot-scope="scope">
                                <table-formatter :item="item" :table-member-list="tableMemberList" :related-choice-mongo-data-ids-data="relatedChoiceMongoDataIdsData" :related-choice-list="relatedChoiceList" :row="scope.row" from="table"/>
                              </template>

                            </el-table-column>
                          </el-table>
                        </div>
                        <div v-else class="detail-content">
                          <!--除了关联表单其他组件-->
                          <table-formatter :item="c" :row="detailInfo" :related-choice-list="relatedChoiceList" :related-choice-mongo-data-ids-data="relatedChoiceMongoDataIdsData" :table-member-list="tableMemberList" from="preview"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </el-drawer>
      <!--搜索-->
      <el-drawer
        :visible.sync="searchDrawer"
        :wrapper-closable="false"
        :before-close="cancelDialog"
        :show-close="false"
        size="400px"
        direction="rtl"
        class="search-drawer">
        <template slot="title">
          <el-row>
            <el-col :span="20">搜索</el-col>
            <el-col :span="4" align="right"><i class="el-icon-close" style="cursor: pointer" @click="cancelDialog"/></el-col>
          </el-row>
        </template>
        <div class="drawer-body">
          <el-row v-for="(item,index) in headerList" :key="item.dataKey" class="mb20">
            <el-col :span="12">
              <el-checkbox v-model="item.check" @change="item.errorTip = false">{{ item.name }}</el-checkbox>
            </el-col>
            <el-col :span="12" align="right">
              <el-dropdown @command="handleCommand($event,index)">
                <span class="el-dropdown-link" style="color:#409EFF">
                  {{ item.comparisonOperLable }}<i class="el-icon-arrow-down el-icon--right"/>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(cItem,i) in item.comparisonOpersArr" :key="i" :command="cItem">{{ cItem.label }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col v-if="item.check&&item.comparisonOper !=='is_not_empty'&&item.comparisonOper!=='is_empty'" class="mt10">
              <listthtype :search-item="item" :form-item="getFormItem(item.dataKey,'search')" :key="item.dataKey+''+item.componentKey" from="search"/>
              <div v-if="item.errorTip" class="red mt5">内容不能为空</div>
            </el-col>
          </el-row>
          <div class="drawer-footer">
            <el-button type="primary" @click="searchTable">搜索</el-button>
          </div>
        </div>
      </el-drawer>
      <!--自定义右键弹窗-->
      <v-contextmenu ref="contextmenu" >
        <v-contextmenu-item v-for="item in tableRow.operationList" v-show="item.isShowRow" :key="item.dataKey" @click="clickBtn(item.operationType,tableRow,item)">{{ item.operationName }}</v-contextmenu-item>
      </v-contextmenu>

    </div>
    <div v-else>
      <div class="noData">
        {{ noDataText }}
      </div>
    </div>
  </div>
</template>
<script>
import listthtype from './components/listthtype'
import tableFormatter from './components/tableFormatter'
import deleteDialog from '@/components/deleteDialog'
import { formFieldList, formPageGetFields, getAppointData } from '../../api/builder'
import { searchMemberByDepartment } from '../../api/workflow'
import { formDataDataQuery, formDataDelete, formDataUpdate, getOperations, queryOperationConfig, customizeTrigger, getOptions } from '../../api/list'
import { BIO } from '@/util/bio.js'
import { getComparisonOpers } from '../../util'
import { generateFormWorkflow } from '../../components/form/generateFormWorkflow'
export default {
  components: { deleteDialog, listthtype, tableFormatter },
  mixins: [generateFormWorkflow],
  data() {
    return {
      showPage: false,
      showNodata: false,
      total: 0,
      paging: {
        pageNow: 1,
        pageSize: 20
      },
      componentKey: 0,
      headerList: [], // 表头
      sortList: [], // 排序条件
      filterList: [], // 搜索条件
      tableData: [],
      tableMemberList: [], // 成员表格显示及预览数据
      relatedChoiceList: [], // 关联选项的表单对应的数据设置集合
      relatedChoiceMongoDataIdsData: [], // 关联选项对应表单数据集合
      relatedFormDataKeys: [], // 关联表单的datakey 集合
      multipleSelection: [], // 多选时 已选项集合
      formList: [],
      dataQueryParmas: {}, // 查询表格数据的条件集合
      // todo----------------------批量编辑----------------------
      batchEditDialog: false,
      form: {
        modify: '',
        formValue: null
      },
      rules: {
        modify: [{ required: true, message: '请选择字段', trigger: 'change' }]
      },
      // todo-----------------------删除弹窗---------------------
      deleteDialog: false,
      deleteRowId: '',
      // todo--------------------搜索弹窗----------------
      searchDrawer: false,
      // todo----------------------- 列表设置--------------
      headerInfo: {
        options: { operationList: [] }
      },
      listInfo: { options: { fixHeader: '' }},
      tableRow: {},
      operationInfo: {
        options: { operationList: [] }
      },
      footerInfo: {},
      previewInfo: {
        options: { operationList: [] }
      },
      previewStr: [], // 预览字段
      // todo------------------------预览弹窗 查看详情----------
      previewDialogInfo: {
        tabsContent: []
      }, // 预览弹窗数据
      activeName: '0',
      pageIndexs: [],
      detailDrawer: false,
      detailInfo: {},
      // todo---------------------页面相关id--------------
      parentTemplateDataId: '',
      listTemplateDataId: '',
      formTemplateDataId: '',
      dataFromPage: '', // 详情页TemplateDataId
      pageName: '',
      appId: this.$route.params.appId,
      noDataText: '暂无数据，请先添加一条数据',
      showTable: false,
      workFlowCondition: []
    }
  },
  computed: {
    roleList() {
      return this.$store.state.user.roleList
    },

    sortable() {
      return (type) => {
        if (type === 'imgupload' || type === 'fileupload' || type === 'checkbox' || type === 'cascader' || type === 'member') {
          return false
        } else {
          return 'custom'
        }
      }
    }
  },
  async mounted() {
    await this.init()
  },
  methods: {
    async init() {
      this.listTemplateDataId = this.$route.params.id
      this.parentTemplateDataId = this.$store.state.user.page.filter(f => f.templateDataId === this.listTemplateDataId)[0].parentTemplateDataId
      const parentTemplateDataIdArr = this.$store.state.user.page.filter(f => f.parentTemplateDataId === this.parentTemplateDataId)
      this.formTemplateDataId = parentTemplateDataIdArr.filter(f => f.pageType === 1)[0].templateDataId
      this.dataFromPage = this.$store.state.user.page.filter(f => f.templateDataId === this.listTemplateDataId)[0].dataFromPage
      this.pageName = parentTemplateDataIdArr.filter(f => f.pageType === 2)[0].pageTemplateName
      this.dataQueryParmas.templateDataId = this.listTemplateDataId
      // 添加工作流设置的条件
      const localAppId = BIO.s62to10(this.appId)
      // console.log(localAppId)
      if (localStorage.getItem(localAppId) && this.$route.query.from === 'workflow') {
        this.workFlowCondition = JSON.parse(localStorage.getItem(localAppId))
        this.workFlowCondition.forEach(w => {
          w.conditionDtoList.forEach(c => {
            c.fieldValues = c.fieldValues.filter(f => f !== '')
          })
        })
        this.dataQueryParmas.filterList = this.workFlowCondition
      }
      await this.getFormSetting() // 获取对应表单组件设置
      await this.getFields() // 获取表头字段列表
      await this.getListSetting() // 获取列表设置
      if (this.$route.query.mongoDataId) {
        this.dataQueryParmas.mongoDataId = this.$route.query.mongoDataId
        await this.getTableData('sysMessage')
      }
      await this.getTableData() // 获取表格数据
    },
    // 获取表单组件数据
    async getFormSetting() {
      const res = await formFieldList(this.formTemplateDataId)
      const body = res.body || []
      this.formList = body
      if (!this.formList.length) {
        this.showNodata = true
        this.showPage = true
        return
      }
      // todo---------------------------处理关联表单数据-----------------------

      // 关联表单dataKey集合
      this.relatedFormDataKeys = this.formList.filter(f => f.type === 'relatedForm')
      if (this.relatedFormDataKeys.length) {
        let dataKeys = []
        this.formList.forEach(item => {
          if (item.type === 'relatedForm') {
            dataKeys.push(...item.options.header.map(m => m.dataKey))
          }
        })
        /** 1. 表格绑定的关联表单的表头datakey 去重 调接口 获取 关联表单对应的表头组件的设置
         *  2. 判断关联表单中的表头组件中是否有含有关联选项组件 如果有将关联选项组件 按relatedChoiceList的数据格式加入relatedChoiceList 数组中
         */
        dataKeys = this.getSingleItemArray(dataKeys)
        const resp = await getOptions({ dataKeys })
        this.formList.forEach(item => {
          if (item.type === 'relatedForm') {
            /** 1*/
            item.options.header.forEach((h, i) => {
              item.options.header[i] = resp.body.find(f => f.dataKey === h.dataKey)
            })
            /** 2*/
            item.options.header.forEach(h => {
              if (h.type === 'relatedChoice') {
                const fields = []
                h.options.field.forEach(item => {
                  fields.push({ dataKey: item })
                })
                this.relatedChoiceList.push({
                  templateDataId: this.$store.state.user.page.filter(f => f.templateDataId === h.options.formId)[0].dataFromPage,
                  appointFields: fields,
                  mongoDataIds: [],
                  dataKey: h.dataKey
                })
              }
            })
          }
        })
      }

      this.showPage = true
    },
    // 处理预览数据
    getPreview() {
      let formList = JSON.parse(JSON.stringify(this.formList))

      // 处理获取到的组件数据
      const gridArr = formList.filter(item => item.type === 'grid')
      gridArr.length && gridArr.forEach(item => {
        item.columns.list = []
        formList.forEach(m => {
          m.type !== 'grid' && m.parentDataKey === item.dataKey && (m.isGridChild = true) && (item.columns.list.push(m))
        })
      })
      formList = formList.filter(item => !item.isGridChild)
      formList.forEach(item => {
        item.type === 'grid' && (item.columns.list.sort((a, b) => a.fieldRow - b.fieldRow))
      })
      this.formListArr = formList.sort((a, b) => a.fieldRow - b.fieldRow)
      // 组成预览tabs数据
      const previewInfo = {
        tabs: [],
        content: []
      }
      if (this.formListArr.some(s => s.type === 'paging')) {
        this.pageIndexs = []
        this.formListArr.forEach((item, index) => {
          if (item.type === 'paging') {
            this.pageIndexs.push(index)
            previewInfo.tabs.push(item)
          }
        })
        this.formListArr.forEach((item, index) => {
          if (index < this.pageIndexs[0]) {
            previewInfo.content.push(item)
          }
        })
      } else {
        // 无分页
        previewInfo.content = this.formListArr
      }
      return previewInfo
    },
    // 切换分页
    handleClick() {
      const index = Number(this.activeName)
      const startIndex = this.pageIndexs[index]
      let endIndex = this.pageIndexs[index + 1]
      if (index >= this.pageIndexs.length) {
        // 最后一项
        endIndex = 0
      }
      this.$set(this.previewDialogInfo, 'tabsContent', [])
      this.formListArr.forEach((item, i) => {
        if (endIndex) { // 不是第一页
          if (startIndex < i && i < endIndex) {
            this.previewDialogInfo.tabsContent.push(item)
          }
        } else {
          // 最后一页
          if (i > startIndex) {
            this.previewDialogInfo.tabsContent.push(item)
          }
        }
      })
    },
    // 获取列表设置
    async getListSetting() {
      const res = await formFieldList(this.listTemplateDataId)
      const resp = await getOperations(this.listTemplateDataId)
      const query = await queryOperationConfig({ templateDataId: this.parentTemplateDataId })
      const operationsList = resp.body
      const list = res.body || []
      if (!list.length) {
        this.showNodata = true
        return
      }
      this.headerInfo = list.filter(f => f.type === 'header')[0]
      this.listInfo = list.filter(f => f.type === 'list')[0]
      this.operationInfo = list.filter(f => f.type === 'operation')[0]
      this.footerInfo = list.filter(f => f.type === 'footer')[0]
      this.previewInfo = list.filter(f => f.type === 'preview')[0]

      // todo ---------------------------------- 页眉设置---------------------
      this.headerInfo.options.operationList.forEach((item, index) => {
        operationsList.forEach(f => {
          if (item.operationType === f.operationType) {
            this.headerInfo.options.operationList[index] = { ...item, ...f }
          }
        })
      })
      this.headerInfo.options.batchList.forEach((item, index) => {
        operationsList.forEach(f => {
          if (item.operationType === f.operationType) {
            this.headerInfo.options.batchList[index] = { ...item, ...f }
          }
        })
      })
      // todo----------------------------------操作设置---------------------
      this.operationInfo.options.operationList = this.operationInfo.options.operationList.filter(f => f.operationType !== 'customize')
      this.operationInfo.options.operationList.forEach((item, index) => {
        operationsList.forEach(f => {
          if (item.operationType === f.operationType) {
            this.operationInfo.options.operationList[index] = { ...item, ...f, isShowRow: true }
          }
        })
      })
      // todo----------------------------------预览设置---------------------
      this.previewInfo.options.operationList = this.previewInfo.options.operationList.filter(f => f.operationType !== 'customize')
      this.previewInfo.options.operationList.forEach((item, index) => {
        operationsList.forEach(f => {
          if (item.operationType === f.operationType) {
            this.previewInfo.options.operationList[index] = { ...item, ...f, isShowRow: true }
          }
        })
      })
      // 自定义操作项分类
      operationsList.forEach(item => {
        if (item.operationType === 'customize') {
          const configParamsJson = query.body.filter(f => item.configDataKey === f.configDataKey)[0].configParamsJson
          if (item.positionType === 1) {
            // 操作
            this.operationInfo.options.operationList.push({ ...item, isShowRow: false, configParamsJson })
          } else if (item.positionType === 3) {
            // 预览
            this.previewInfo.options.operationList.push({ ...item, isShowRow: false, configParamsJson })
          }
        }
      })
      // console.log(this.operationInfo.options.operationList)
      // todo---------------------------------- 列表设置---------------------
      const defaultSort = this.listInfo.options.defaultSort
      if (defaultSort.prop && defaultSort.order !== '') {
        const obj = {
          sortField: defaultSort.prop,
          sortDesc: !!defaultSort.order,
          isShowTags: true
        }
        obj.name = this.headerList.filter(f => f.dataKey === obj.sortField)[0].name
        this.sortList.push(obj)
      }
      // todo---------------------------------- 页脚设置---------------------
      if (this.$route.query.page) {
        const page = Number(this.$route.query.page)
        const size = Number(this.$route.query.size)
        this.paging.pageSize = size
        this.paging.pageNow = page
      } else {
        this.paging.pageSize = this.footerInfo.options.size
      }

      if (this.sortList.length) {
        this.dataQueryParmas = { ...this.dataQueryParmas, sortList: this.sortList }
      }
      await this.getTableData()
      // console.log('previewInfo.operationList=>',this.previewInfo.options.operationList)
    },
    // 获取表格数据
    async getTableData(from) {
      this.dataQueryParmas = { ...this.dataQueryParmas, ...this.paging }
      if (from !== 'sysMessage') {
        delete this.dataQueryParmas.mongoDataId
      }
      if (from === 'workflow') {
        const localAppId = BIO.s62to10(this.appId)
        this.workFlowCondition = JSON.parse(localStorage.getItem(localAppId))
        this.workFlowCondition.forEach(w => {
          w.conditionDtoList.forEach(c => {
            c.fieldValues = c.fieldValues.filter(f => f !== '')
          })
        })
        this.dataQueryParmas.filterList = this.workFlowCondition
      }
      // console.log(this.dataQueryParmas.filterList)
      // debugger
      const res = await formDataDataQuery(this.dataQueryParmas)
      if (this.dataQueryParmas.mongoDataId) {
        this.detailInfo = res.body[0]
        if (this.detailInfo.mongoDataId) {
          this.openPreview(this.detailInfo)
        } else {
          this.$message.error('数据已删除')
        }
      }
      this.tableData = res.body || []
      this.total = res.count
      let memberList = []
      let relatedFormDataIds = []
      this.tableData.forEach(item => {
        this.$set(item, 'operationList', this.operationInfo.options.operationList)
        this.multipleSelection.forEach(m => {
          if (item.mongoDataId === m.mongoDataId) {
            this.$refs.multipleTable.toggleRowSelection(m, true)
          }
        })

        // 操作项按钮显示与隐藏
        item.operationList = this.isAllowedEdit(item)
        const keys = Object.keys(item)
        // 关联表单
        // 将 表格中的关联表单中的关联选项 的 关联组件和数据 存入 relatedFormDataIds
        this.formList.forEach(f => {
          keys.forEach(k => {
            // 关联表单
            if (f.dataKey === k && f.type === 'relatedForm') {
              f.options.header.forEach(h => {
                if (h.type === 'relatedChoice') {
                  const obj = {
                    data: [...item[f.dataKey]], // 关联表单字段 的值：[mongoDataId,mongoDataId]
                    header: f.options.header.map(m => m.dataKey) //
                  }
                  relatedFormDataIds = [...relatedFormDataIds, obj]
                }
              })
            }
          })
        })
        this.headerList.forEach(h => {
          keys.forEach(k => {
            if (h.dataKey === k && h.type === 'member') {
              if (typeof item[k] === 'string') {
                memberList = [...memberList, item[k]]
              } else if (Array.isArray(item[k])) {
                if (item[k].length) {
                  memberList = [...memberList, ...item[k]]
                }
              }
            }
            // 关联选项列 所有的数据mongoDataId 集合到mongoDataIds
            if (h.dataKey === k && h.type === 'relatedChoice') {
              this.relatedChoiceList.forEach(r => {
                const formID = this.$store.state.user.page.filter(f => f.templateDataId === h.options.formId)[0].dataFromPage
                if (r.templateDataId === formID && k === r.dataKey) {
                  r.mongoDataIds = [...r.mongoDataIds, item[h.dataKey]]
                }
              })
            }
          })
        })
      })
      // debugger
      // 获取table展示成员信息
      memberList = this.getSingleItemArray(memberList)
      // debugger
      const relatedFormList = this.formList.filter(f => f.type === 'relatedForm')
      const relatedFormHeader = []
      if (relatedFormList.length) {
        relatedFormList.forEach(item => {
          relatedFormHeader.push(...item.options.header)
        })
      }
      if (memberList.length || relatedFormHeader.some(s => s.type === 'member')) {
        const resp = await searchMemberByDepartment({ userIds: [] })
        this.tableMemberList = resp.body
      }
      this.$nextTick(() => {
        this.$previewRefresh()
      })
      // // todo-------------------------关联表单----------
      if (relatedFormDataIds.length) {
        const option = {
          // 将数据和组件 做 去重和平铺操作
          mongoDataIds: Array.from(new Set(relatedFormDataIds.map(m => m.data).flat())),
          appointFields: Array.from(new Set(['mongoDataId', relatedFormDataIds.map(m => m.header).flat()].flat()))
        }
        // 获取关联表单数据并将关联选项字段的值 存入对应的relatedChoiceList中
        const res = await getAppointData(option)
        res.body.forEach(item => {
          Object.keys(item).forEach(k => {
            this.relatedChoiceList.forEach(r => {
              if (r.dataKey === k) {
                r.mongoDataIds = [...r.mongoDataIds, item[r.dataKey]]
              }
            })
          })
        })
      }
      // todo-------------------------关联选项(包含表单和关联表单中的关联选项)---------
      // 获取table展示的关联选项的数据
      let relatedChoiceDataKeys = []
      // console.log(this.relatedChoiceList,111);
      // debugger
      if (this.relatedChoiceList.length) {
        const option = {
          mongoDataIds: [],
          appointFields: ['mongoDataId']
        }
        this.relatedChoiceList.forEach(item => {
          item.mongoDataIds = this.getSingleItemArray(item.mongoDataIds.flat())
          option.mongoDataIds = this.getSingleItemArray([...option.mongoDataIds, ...item.mongoDataIds])
          option.appointFields = [...option.appointFields, ...item.appointFields.map(m => m.dataKey)]
          relatedChoiceDataKeys.push(...option.appointFields)
        })
        // 获取表格中关联选项中所有mongoDataId对应的数据
        if (option.mongoDataIds.length) {
          const res = await getAppointData(option)
          this.relatedChoiceMongoDataIdsData = res.body
        }
        relatedChoiceDataKeys = relatedChoiceDataKeys.filter(f => f !== 'mongoDataId')
        // 获取 关联选项中关联选项组件的options和type
        const datakeys = await getOptions({ dataKeys: relatedChoiceDataKeys })
        datakeys.body.forEach(f => {
          this.relatedChoiceList.forEach(r => {
            r.appointFields.forEach(a => {
              if (f.dataKey === a.dataKey) {
                a.options = f.options
                a.type = f.type
              }
            })
          })
        })
        if (!memberList.length && this.relatedChoiceList.some(s => s.appointFields.some(a => a.type === 'member'))) {
          const resp = await searchMemberByDepartment({ userIds: [] })
          this.tableMemberList = resp.body
        }
        this.showTable = true
      } else {
        this.showTable = true
      }
    },
    // 表格按钮和预览按钮显示隐藏
    isAllowedEdit(rowData) {
      const row = JSON.parse(JSON.stringify(rowData))
      /**
         * allowEdit true  查看 编辑 删除显示  自定义按钮 按operations中的显示
         * allowEdit false 只显示查看
         */
      if (row.allowEdit) {
        row.operationList.forEach(item => {
          row.operations.forEach(key => {
            if (item.configDataKey === key) {
              item.isShowRow = true
            }
          })
        })
      } else {
        row.operationList.forEach(item => {
          item.isShowRow = false
          if (item.operationType === 'detailQuery') {
            item.isShowRow = true
          }
        })
      }
      return row.operationList
    },
    // 表格是否可勾选
    selectable(row) {
      return row.allowEdit
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.paging.pageNow = val
      this.jump()
      this.getTableData()
    },
    // 切换每页条数
    handleSizeChange(val) {
      this.paging.pageSize = val
      this.paging.pageNow = 1
      this.jump()
      this.getTableData()
    },
    //
    jump() {
      const path = '/' + this.appId + '/app/report/' + this.listTemplateDataId
      const query = {
        page: this.paging.pageNow,
        size: this.paging.pageSize
      }
      // if (this.$route.query.from) {
      //   query.from = this.$route.query.from
      // }
      this.$router.push({ path, query })
    },
    // 点击排序
    sortChange(val) {
      this.sortList.forEach((item, index) => {
        if (item.sortField === val.prop) {
          this.sortList[index] = ''
        }
      })
      this.sortList = this.sortList.filter(f => f !== '')
      const obj = {
        name: val.column.label,
        sortField: val.prop,
        isShowTags: true
      }
      if (val.order === 'descending') {
        // 倒序
        obj.sortDesc = true
      } else {
        // 正序
        obj.sortDesc = false
      }
      this.sortList.push(obj)
      this.getSortTableData()
    },
    // 排序搜索
    getSortTableData() {
      const option = {
        sortList: []
      }
      this.sortList.forEach(item => {
        option.sortList.push({
          sortField: item.sortField,
          sortDesc: item.sortDesc
        })
      })
      this.paging.pageNow = 1
      this.dataQueryParmas.sortList = []
      this.dataQueryParmas = { ...this.dataQueryParmas, ...option, ...this.paging }
      this.getTableData()
    },
    // 筛选传入表单组件的组件属性
    getFormItem(dataKey, type) {
      const formItem = this.formList.filter(f => f.dataKey === dataKey)[0]
      if (type === 'batchEdit') {
        this.rules.formValue = []
        if (!formItem.rules.length) return formItem
        this.rules.formValue = formItem.rules.map(im => {
          if (im.pattern) {
            return { ...im, pattern: eval(im.pattern) }
          } else {
            return { ...im }
          }
        })
      }
      return formItem
    },
    // 自定义按钮触发工作流
    executeWorkflow(dataKey, mongoDataId) {
      const option = { dataKey, mongoDataId }
      customizeTrigger(option).then(res => {
        if (res.body && res.body.isJump) {
          const locationHost = window.location.host
          this.generateFormResp(res.body, this.appId, locationHost, '保存成功', this.init)
          return
        }
        this.getTableData()
        this.$store.dispatch('getMessageLists').then(() => {
          this.$store.dispatch('getUnreadNum')
        })
      })
    },
    // todo---------------------------------tag------------------------
    async getTagValue(tag) {
      if (tag.comparisonOper === 'between' || tag.type === 'cascader' || tag.type === 'checkbox') {
        tag.filterValue = tag.fieldValues && tag.fieldValues.join(' , ')
      } else {
        if (tag.type === 'autonumber') {
          tag.filterValue = tag.options.autoNumberPrefix + tag.fieldValues
        } else if (tag.type === 'member') {
          if (tag.fieldValues) {
            if (tag.options && tag.options.multiple) {
              const resp = await searchMemberByDepartment({ userIds: tag.fieldValues })
              tag.filterValue = resp.body.map(m => m.name).join(',')
            } else {
              const resp = await searchMemberByDepartment({ userIds: [tag.fieldValues] })
              tag.filterValue = resp.body[0].name
            }
          }
        } else if (tag.type === 'switch') {
          tag.filterValue = tag.fieldValues ? '开' : '关'
        } else {
          tag.filterValue = tag.fieldValues
        }
      }
    },
    // 工作流所带条件tag
    getFilterSearchValue() {
      let text = ''
      this.workFlowCondition.forEach(item => {
        let str = ''
        item.conditionDtoList.forEach(c => {
          this.headerList.forEach(f => {
            if (c.fieldId === f.dataKey) {
              str += f.name
            }
          })
          str += `${getComparisonOpers(c.comparisonOper)}${c.fieldValues.join(' ')} && `
        })
        str = str.substr(0, str.length - 3)
        text += str + ' | | '
      })
      return text.substr(0, text.length - 4)
    },
    // 关闭搜索tags
    handleCloseSearch(val, index) {
      this.headerList.forEach(item => {
        if (item.dataKey === val.dataKey) {
          item.check = false
          item.fieldValues = null
          item.comparisonOperLable = item.comparisonOpersArr[0].label
          item.comparisonOper = item.comparisonOpersArr[0].value
        }
      })
      this.filterList.splice(index, 1)

      this.searchTable()
    },
    // 关闭工作流的搜索条件
    closeFilter() {
      this.dataQueryParmas.filterList = []
      this.workFlowCondition = []
      // const localAppId = BIO.s62to10(this.appId)
      // localStorage.removeItem(localAppId)
      this.searchTable()
    },
    // 关闭排序tag
    handleCloseSort(val, index) {
      this.sortList.splice(index, 1)
      this.getSortTableData()
    },
    // todo-------------------------------------弹窗---------------
    // 右键点击事件
    rowContextmenu(row) {
      this.tableRow = row
    },
    // 点击自定义按钮
    handleCommandBtn(command, row) {
      this.clickBtn(command.operationType, row, command)
    },
    // 点击按钮
    clickBtn(type, row, btnInfo) {
      switch (type) {
        case 'listQuery':
          this.headerList.forEach(item => {
            item.check = false
            item.fieldValues = null
            item.comparisonOperLable = item.comparisonOpersArr[0].label
            item.comparisonOper = item.comparisonOpersArr[0].value
            this.filterList.forEach(f => {
              if (f.dataKey === item.dataKey) {
                item.check = true
                item.comparisonOperLable = f.comparisonOperLable
                item.comparisonOper = f.comparisonOper
                item.fieldValues = f.fieldValues
              }
            })
          })
          this.searchDrawer = true
          break
        case 'add':
          const addpath = '/' + this.appId + '/app/form/' + this.formTemplateDataId
          this.$router.push({ path: addpath })
          break
        case 'batchEdit':
          if (this.$refs.form !== undefined) {
            this.$refs.form.resetFields()
          }
          this.batchEditDialog = true
          break
        case 'batchDelete':
          this.deleteDialog = true
          break
        case 'detailQuery':
          this.openPreview(row)
          break
        case 'detailDelete':
          this.deleteRowId = row.mongoDataId
          this.deleteDialog = true
          break
        case 'detailEdit':
          const editpath = '/' + this.appId + '/app/edit/' + this.formTemplateDataId + '/' + row.mongoDataId + '?page=' + this.paging.pageNow + '&size=' + this.paging.pageSize
          this.$router.push({ path: editpath })
          break
        case 'detailCopy':
          const copypath = '/' + this.appId + '/app/copy/' + this.formTemplateDataId + '/' + row.mongoDataId + '?page=' + this.paging.pageNow + '&size=' + this.paging.pageSize
          this.$router.push({ path: copypath })
          break
        case 'customize':
          // console.log(btnInfo)
          if (btnInfo.configParamsJson.pop) {
            this.$confirm(btnInfo.configParamsJson.popContent.body, '提示', {
              confirmButtonText: btnInfo.configParamsJson.popContent.confirm,
              cancelButtonText: btnInfo.configParamsJson.popContent.cancel,
              closeOnClickModal: false,
              closeOnPressEscape: false
            }).then(() => {
              this.executeWorkflow(btnInfo.dataKey, row.mongoDataId)
            }).catch(() => {})
          } else {
            this.executeWorkflow(btnInfo.dataKey, row.mongoDataId)
          }
          break
      }
    },
    // 关闭弹窗
    cancelDialog() {
      // 批量编辑
      this.form.modify = ''
      this.rules.formValue = []
      this.componentKey++
      this.batchEditDialog = false
      // 批量删除
      this.deleteRowId = ''
      this.deleteDialog = false
      // 查看详情
      this.detailDrawer = false
      this.detailInfo = {}
      // debugger
      if (this.$route.query.mongoDataId) {
        const path = '/' + this.appId + '/app/report/' + this.listTemplateDataId
        this.$router.push(path)
        this.getTableData()
      }
      // 搜索
      this.searchDrawer = false
    },
    // todo-------------------------预览----------------------------------------
    // 打开预览弹窗
    async openPreview(row) {
      this.previewDialogInfo.tabs = this.getPreview().tabs
      this.previewDialogInfo.content = this.getPreview().content
      this.detailInfo = JSON.parse(JSON.stringify(row))
      this.detailInfo.operationList = this.previewInfo.options.operationList
      this.detailInfo.operationList = this.isAllowedEdit(this.detailInfo)
      // 处理分页
      if (this.previewDialogInfo.tabs.length) {
        this.activeName = '0'
        this.handleClick()
      }
      // 处理关联表单
      if (this.relatedFormDataKeys.length) {
        // console.log(this.relatedFormDataKeys)
        const option = {
          mongoDataIds: [],
          appointFields: ['mongoDataId']
        }
        Object.keys(this.detailInfo).forEach(key => {
          this.relatedFormDataKeys.forEach(r => {
            if (key === r.dataKey) {
              option.mongoDataIds.push(...this.detailInfo[key])
              option.appointFields.push(...r.options.header.map(m => m.dataKey))
            }
          })
        })
        // 去除空数据
        option.appointFields = option.appointFields.filter(f => f)
        // 获取关联表单所有数据
        if (option.mongoDataIds.length) {
          const res = await getAppointData(option)
          // 替换数据
          // debugger
          this.relatedFormDataKeys.forEach(r => {
            if (this.detailInfo[r.dataKey]) {
              this.detailInfo[r.dataKey].forEach((item, index) => {
                const obj = res.body.filter(f => f.mongoDataId === item)[0]
                if (obj) {
                  this.detailInfo[r.dataKey].splice(index, 1, obj)
                } else {
                  this.detailInfo[r.dataKey].splice(index, 1, {})
                }
              })
            }
          })
        }
      }
      this.detailDrawer = true
    },
    // todo-------------------------批量编辑删除----------------------------------------
    // 取消批量
    cencleBtach() {
      this.$refs.multipleTable.clearSelection()
    },
    // 表格复选框选中取消
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 编辑字段Change
    modifyChange(val) {
      this.form.formValue = null
      this.componentKey++
      if (this.$refs.form !== undefined) {
        this.$refs.form.clearValidate()
      }
    },
    // 确认批量编辑
    comfirmBtacnEdit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const option = []
          this.multipleSelection.forEach(item => {
            const obj = {
              templateDataId: this.listTemplateDataId,
              pageData: {},
              mongoDataId: item.mongoDataId,
              childMongoDataIds: ''
            }
            obj.pageData[this.form.modify] = this.form.formValue
            option.push(obj)
          })
          formDataUpdate(option).then(() => {
            this.cancelDialog()
            this.getTableData()
            this.$message.success('编辑成功')
          })
        } else {
          return false
        }
      })
    },
    // 删除数据
    async deleteRow() {
      const option = []
      if (this.deleteRowId) {
        option.push({
          templateDataId: this.listTemplateDataId,
          mongoDataId: this.deleteRowId
        })
      } else {
        this.multipleSelection.forEach(item => {
          option.push({
            templateDataId: this.listTemplateDataId,
            mongoDataId: item.mongoDataId
          })
        })
      }
      const res = await formDataDelete(option)
      this.cancelDialog()
      this.multipleSelection.forEach(m => {
        this.$refs.multipleTable.toggleRowSelection(m, false)
      })
      const locationHost = window.location.host
      this.generateFormResp(res.body, this.appId, locationHost, '删除成功', async(from) => {
        await this.getTableData(from)
        // 如果删除的是最后一页  且 全部删除 则当前页变为前一页
        if (!this.tableData.length && this.paging.pageNow > 1) {
          this.paging.pageNow = this.paging.pageNow - 1
          await this.getTableData(from)
        }
      })
    },
    // todo---------------------------搜索弹窗--------------------------
    // 获取表单字段列表和预览字段
    async getFields() {
      const res = await formPageGetFields({ templateDataId: this.listTemplateDataId, needHead: true })
      const header = res.body || []
      // if (!header.length) {
      //   return
      // }
      // const header = body.filter(f => f.isHead)
      // todo------------- 处理表头
      if (!header.length) {
        this.showNodata = true
        this.noDataText = '请前往构建器设置表头'
        return
      }
      this.headerList = header.sort((a, b) => {
        return a.fieldSort - b.fieldSort
      })
      // 关联选项的表单id集合
      this.headerList.forEach(item => {
        this.$set(item, 'check', false) // 是否被选中
        this.$set(item, 'fieldValues', null) // 搜索值
        this.$set(item, 'errorTip', false) // 验证的错误信息是否显示
        this.$set(item, 'componentKey', 0) // 循环组件的key
        item.comparisonOpersArr = item.comparisonOpers.split(',') // 下拉框条件
        item.comparisonOpersArr.forEach((m, i) => {
          item.comparisonOpersArr[i] = {
            label: getComparisonOpers(m),
            value: m
          }
        })
        this.$set(item, 'comparisonOperLable', item.comparisonOpersArr[0].label) // 展示的值
        this.$set(item, 'comparisonOper', item.comparisonOpersArr[0].value) // 传给后台的值
        this.formList.forEach(c => {
          if (item.dataKey === c.dataKey) {
            if (c.isDuplicated) {
              this.$set(item, 'isDuplicated', true) // 唯一性
            }
            this.$set(item, 'options', c.options) // 设置
            // 关联选项的表单id
            /** 根据 formList 中的组件设置 将表头中的关联选项 按relatedChoiceList数据格式 加入relatedChoiceList数组*/
            if (item.type === 'relatedChoice') {
              const fields = []
              c.options.field.forEach(item => {
                fields.push({ dataKey: item })
              })
              const templateDataIdObj = this.$store.state.user.page.find(f => f.templateDataId === c.options.formId)
              if (templateDataIdObj) {
                this.relatedChoiceList.push({
                  templateDataId: templateDataIdObj.dataFromPage,
                  appointFields: fields,
                  mongoDataIds: [],
                  dataKey: item.dataKey
                })
              }
            }
          }
        })
      })
    },
    // 切换搜索条件
    handleCommand(command, index) {
      this.headerList[index].comparisonOperLable = command.label
      this.headerList[index].comparisonOper = command.value
      this.headerList[index].fieldValues = null
      this.headerList[index].errorTip = false
      this.headerList[index].componentKey++
    },
    // 点击搜索按钮
    async searchTable() {
      const option = {
        filterList: []
      }
      if (this.workFlowCondition.length) {
        this.workFlowCondition.forEach(item => {
          option.filterList.push(item)
        })
      } else {
        option.filterList = []
      }
      this.filterList = []
      const conditionDtoList = []
      this.headerList.forEach(item => {
        if (item.check) {
          // 处理接口数据
          const obj = {
            fieldId: item.dataKey,
            fieldType: item.type,
            linkName: item.linkName,
            valuesType: 0,
            comparisonOper: item.comparisonOper,
            connectionEnum: '&&'
          }
          if (typeof item.fieldValues === 'string') {
            obj.fieldValues = item.fieldValues.split(',')
          } else if (typeof item.fieldValues === 'number' || typeof item.fieldValues === 'boolean') {
            obj.fieldValues = [item.fieldValues]
          } else {
            obj.fieldValues = item.fieldValues || []
          }
          if (item.type === 'switch') {
            obj.fieldValues = obj.fieldValues[0] ? [1] : [0]
          }
          // 如果搜索条件中有除了条件为 为空不为空  其他的值为空的情况 需要校验
          if (item.comparisonOper !== 'is_not_empty' && item.comparisonOper !== 'is_empty' && !obj.fieldValues.length) {
            item.errorTip = true
          }
          conditionDtoList.push(obj)
          // 处理页面展示tag
          this.filterList.push({
            dataKey: item.dataKey,
            name: item.name,
            options: item.options,
            type: item.type,
            filterValue: '', // 展示的值
            comparisonOperLable: item.comparisonOperLable, // 条件的中文
            comparisonOper: item.comparisonOper, // 条件
            fieldValues: item.fieldValues // 搜索绑定的值
          })
        }
      })
      //  验证是否通过
      if (this.headerList.some(s => s.errorTip)) {
        return
      }
      if (conditionDtoList.length) {
        option.filterList.push({
          connectionEnum: '||',
          conditionDtoList: conditionDtoList
        })
      }
      this.dataQueryParmas = { ...this.dataQueryParmas, ...option, ...this.paging }

      if (this.dataQueryParmas.filterList.length && this.dataQueryParmas.filterList[0].conditionDtoList[0]) {
        this.dataQueryParmas.filterList[0].conditionDtoList[0].connectionEnum = null
        this.dataQueryParmas.filterList[0].connectionEnum = null
      }
      this.filterList.forEach(item => {
        this.getTagValue(item)
      })
      await this.getTableData()
      this.cancelDialog()
    },
    // todo---------------------工具方法-----------
    // 数据去重并平铺
    getSingleItemArray(arr) {
      return Array.from(new Set(arr)).flat()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .sectionBox{ padding:20px;  overflow: hidden;font-size: 12px; color: #606266;border-radius: 4px;}
  .seachBtn{height: 28px;width: 150px;border-radius: 4px;color:#C0C4CC;line-height: 16px;border:1px solid #E4E7ED;padding: 5px;cursor: pointer}
  .editLable{width: 85px;display: inline-block;}
  /*预览抽屉*/
  .detailDrawerContent{height: 90vh;overflow: scroll;margin-top: 20px;}
  .previewBox{padding:0 30px 20px;display:flex;flex-wrap: wrap;}
  .preview-content{border-bottom: 1px solid #F2F6FC;margin-right: 15px;margin-bottom: 20px;width: 48%;}
  .detail-label{font-size: 12px;color:#909399;margin-bottom: 5px;}
  .detail-content{color:#303133;margin-bottom: 10px;}
  /* 分页样式*/
  .paging {padding:20px 0;}
  /deep/ .el-drawer__header{margin-bottom: 0;}
  /deep/ .el-dropdown{font-size: 12px;cursor: pointer}
  /*搜索抽屉*/
  .search-drawer /deep/ .el-drawer__header{color:#606266;border-bottom: 1px solid #E4E7ED;padding:15px 20px;}
  .drawer-footer{display:block;width: 100%;text-align: center;position: absolute;padding: 20px 0;bottom: 0;background-color: #fff;z-index: 999;}
  .drawer-body{padding: 20px;overflow-y: auto;height:calc(100vh - 150px);padding-right: 30px;}
  .noData{height:100vh;display: flex;justify-content: center;margin-top: 15vh;}
  /*tags*/
  .tagsBox{display:inline-block;border: 1px solid #e9edf2;border-right:0;line-height: 28px;}
  .tagsBox label{display:inline-block;border-right: 1px solid #e9edf2;padding: 0 6px;background-color:#fff9f6;}
  .tag{display:inline-block;border-right: 1px solid #e9edf2;padding: 0 6px}
  .tagCloseIcon{font-size: 16px;color:#000;cursor: pointer}
  /deep/ .el-icon-error:before {position: relative;top: 2px;}
  .tagCloseIcon:hover{color:red}
  /*table*/
 /deep/ .el-table .descending .sort-caret.descending{border-top-color: #C0C4CC;}
 /deep/ .el-table .ascending .sort-caret.ascending{border-bottom-color: #C0C4CC;}
 /*按钮组*/
.btnBox{height: 40px;overflow: hidden;margin-top: 0;}
.btn1{transition: all 1s;margin-bottom: 10px;}
.animate{margin-top: -40px;}
/deep/ .el-button+.el-button{margin-left: 3px;}
</style>
