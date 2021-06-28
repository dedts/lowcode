<template>
  <div
    v-if="muneType === 'blank'"
    class="widget-blank" />
  <div
    v-else-if="muneType==='formPage'"
    class="widget-form-container"
    disabled="">
    <!--<div v-if="isMenu" class="mask">-->
    <!--<el-button type="primary" plain="" size="lager" @click="isMenu=false">编辑表单</el-button>-->
    <!--</div>-->
    <!--拖拽过来的组件-->
    <div class="btnBox">
      <!--中间几个按钮-->
      <widget-nav :page-name="curPageName" />
    </div>
    <div class="fromContent">
      <el-scrollbar class="default-scrollbar">
        <el-form
          :size="data.config.size"
          :label-position="data.config.labelPosition"
          :label-width="data.config.labelWidth + 'px'"
          class="fromContentWapper"
          label-suffix=":">
          <div
            v-if="data.list.length == 0"
            class="form-empty">{{ $t('fm.description.containerEmpty') }}</div>
          <draggable
            v-model="data.list"
            v-bind="{
              group:'people',
              ghostClass: 'ghost',
              animation: 200
            }"
            :move="handleMove"
            class=""
            @end=""
            @add.prevent="handleWidgetAdd"
            @update="handleWidgetUpdate($event, data.list)">
            <transition-group
              name="fade"
              tag="div"
              class="widget-form-list">
              <template
                v-for="(element, index) in data.list"
                v-if="element && element.key">
                <!--<widget-table-->
                <!--v-if="element.type === 'table'"-->
                <!--:key="element.key"-->
                <!--:element="element"-->
                <!--:select.sync="selectWidget"-->
                <!--:index="index" :data="data"-->
                <!--@select-change="handleSelectChange"-->
                <!--&gt;-->
                <!--</widget-table>-->
                <widget-tab-item
                  v-if="element.type === 'tabs'"
                  :key="element.key"
                  :element="element"
                  :select.sync="selectWidget"
                  :index="index"
                  :data="data"
                  @select-change="handleSelectChange" />
                <widget-form-item
                  v-else-if="element.type !== 'grid'"
                  :key="element.key"
                  :element="element"
                  :select.sync="selectWidget"
                  :index="index"
                  :data="data"
                  @select-change="handleSelectChange" />
                <widget-col-item
                  v-else
                  :key="element.key"
                  :element="element"
                  :select.sync="selectWidget"
                  :index="index"
                  :data="data"
                  @add.prevent="handleWidgetAdd"
                  @addRelatedFrom="addRelatedFrom"
                  @select-change="handleSelectChange" />
              </template>
            </transition-group>
          </draggable>
        </el-form>
      </el-scrollbar>
    </div>
    <!-- 关联选项起始菜单 -->
    <el-dialog
      :visible.sync="relatedChoice.dialogVisible"
      :before-close="handleRelatedChoiceClose"
      title="关联选项配置"
      width="30%">
      <el-form
        ref="relatedChoiceForm"
        :model="relatedChoice"
        :rules="relatedChoiceRules"
        label-width="80px">
        <el-form-item
          label="目标表单"
          prop="formId">
          <el-select
            v-model="relatedChoice.formId"
            placeholder="请求选择表单"
            @change="formSelected(relatedChoice.formId, 'relatedChoice')">
            <el-option
              v-for="item in formOption('relatedChoice')"
              :key="item.templateDataId"
              :label="item.pageTemplateName"
              :value="item.templateDataId" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示字段" prop="field">
          <el-select
            v-model="relatedChoice.field"
            :disabled="relatedChoice.formId === ''"
            placeholder="选择关联字段"
            multiple>
            <el-option
              v-for="item in app.field"
              v-show="item.type !=='grid' && item.type !=='paging' "
              :key="item.dataKey"
              :label="item.name"
              :value="item.dataKey"
              :disabled="fieldOptionDisabled(item)" >
              <div class="flex-between">
                <span>{{ item.name }}</span>
                <span class="inline ml30" style="color: #8492a6; font-size: 12px">{{ showFieldType(item) }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项类型">
          <el-radio-group v-model="relatedChoice.choiceType">
            <el-radio label="single">单选</el-radio>
            <el-radio label="multiple">多选</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="handleRelatedChoiceConfirm">确 定</el-button>
        <el-button @click="handleRelatedChoiceClose">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 关联表单配置字段弹窗 -->
    <el-dialog
      v-if="relatedForm.dialogVisible"
      :visible.sync="relatedForm.dialogVisible"
      :before-close="handleRelatedFormClose"
      title="关联表单配置"
      width="30%">
      <el-form
        ref="relatedForm"
        :model="relatedForm"
        :rules="relatedChoiceRules"
        label-width="80px">
        <el-form-item
          label="目标表单"
          prop="formId">
          <el-select
            v-model="relatedForm.formId"
            placeholder="请求选择表单"
            @change="formSelected(relatedForm.formId,'relatedForm')">
            <el-option
              v-for="item in formOption('relatedForm')"
              :key="item.templateDataId"
              :label="item.pageTemplateName"
              :value="item.templateDataId" />
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="handleRelatedFormConfirm">确 定</el-button>
        <el-button @click="handleRelatedFormClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
  <div
    v-else
    class="widget-form-container">
    <!--<div v-if="isMenu" class="mask">-->
    <!--<el-button type="primary" plain="" size="lager" @click="isMenu=false">编辑列表</el-button>-->
    <!--</div>-->
    <div class="widget-form-list">
      <list-builder
        :data="data"
        :select.sync="selectWidget"
        :cur-page-id="curPageId" />
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'
import WidgetColItem from './WidgetColItem'
import WidgetTable from './WidgetTable'
import WidgetTabItem from './WidgetTabItem'
import WidgetNav from './WidgetNav'
import ListBuilder from '../list/listbuilder'
import { EventBus } from '../../util/event-bus'
import _ from 'lodash'
import { formFieldMove } from '@/api/builder'
import { getAllMenu, formFieldList, formFieldExchange } from '@/api/builder'
import { showFieldTypeDesc } from '@/util/index'
export default {
  components: {
    Draggable,
    WidgetFormItem,
    WidgetColItem,
    WidgetTable,
    WidgetTabItem,
    WidgetNav,
    ListBuilder
  },
  props: ['data', 'select', 'muneType', 'curPageName', 'curPageId'],
  provide() {
    return {
      dealLinkName: this.dealLinkName
    }
  },
  inject: ['saveFormData', 'modifyConfigTab', 'getCurPageCompsData'],
  data() {
    return {
      relatedChoice: {
        dialogVisible: false,
        formId: '',
        choiceType: 'single',
        index: -1,
        field: [],
        options: [],
        widget: {},
        oldWidget: {}
      },
      relatedForm: {
        dialogVisible: false,
        formId: '',
        widget: {},
        oldWidget: {}
      },
      app: {
        form: [],
        field: []
      },
      relatedChoiceRules: {
        formId: [{ required: true, message: '请选择表单', trigger: 'change' }],
        field: [{ type: 'array', required: true, message: '请至少选择一个字段', trigger: 'change' }]
      },
      selectWidget: this.select,
      isMenu: true
    }
  },
  computed: {
    formOption: function() {
      return function(type) {
        const firstMenu = this.app.form.filter(item => item.parentTemplateId === '0')
        if (type === 'relatedChoice') {
          return firstMenu
        } else if (type === 'relatedForm') {
          // debugger
          return firstMenu.filter(f => f.dataFromPage !== this.curPageId)
        }
      }
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  mounted() {
    this.initAppData()
    document.body.ondrop = function(event) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    EventBus.$on('on-field-add', item => {
      const key = new Date().getTime() + ''
      const widgetItem = _.cloneDeep({
        ...item,
        options: {
          ...item.options,
          remoteFunc: 'func_' + key,
          remoteOption: 'option_' + key
        },
        key,
        linkName: item.type + this.dealLinkName(item),
        rules: []
      })
      this._addWidget(this.data.list, widgetItem)
      // 关联选项拖进去的时候，弹出框
      if (widgetItem.type === 'relatedChoice') {
        // 关联选项
        const loading = this.$loading({
          lock: true
        })
        getAllMenu().then(res => {
          this.app.form.splice(0)
          res.body.forEach(item => this.app.form.push(item))

          const root = this.app.form.filter(item => item.parentTemplateId === '0').map(item => {
            const child = this.app.form.filter(i => i.parentTemplateDataId === item.templateDataId).map(i => {
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
          loading.close()
          this.relatedChoice.widget = widgetItem
          this.relatedChoice.index = this.data.list.length - 1
          this.relatedChoice.dialogVisible = true
        })
      } else if (widgetItem.type === 'relatedForm') {
        // 此处再次请求，是因为mounted中的getAllMenu只有在刷新页面的情况下才会调用，但是在添加字段不会刷新页面
        const loading = this.$loading({
          lock: true
        })
        // 关联表单
        getAllMenu().then(res => {
          this.app.form.splice(0)
          res.body.forEach(item => this.app.form.push(item))
          const root = this.app.form.filter(item => item.parentTemplateId === '0').map(item => {
            const child = this.app.form.filter(i => i.parentTemplateDataId === item.templateDataId).map(i => {
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
          loading.close()
          this.relatedForm.widget = widgetItem
          this.relatedForm.index = this.data.list.length - 1
          this.relatedForm.dialogVisible = true
        })
      } else {
        this.$nextTick(() => {
          EventBus.$emit('on-history-add', widgetItem, widgetItem)
        })
      }
    })
  },
  methods: {
    initAppData() {
      getAllMenu().then(res => {
        this.app.form.splice(0)
        res.body.forEach(item => this.app.form.push(item))
        const root = this.app.form.filter(item => item.parentTemplateId === '0').map(item => {
          const child = this.app.form.filter(i => i.parentTemplateDataId === item.templateDataId).map(i => {
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
    fieldOptionDisabled: function(item) {
      // 关联选项组件：允许显示的字段类型：文本/数字/日期时间/单选项/成员(单选类)/自编号
      return !(item.type === 'input' ||
        item.type === 'number' ||
        item.type === 'date' ||
        item.type === 'radio' ||
        item.type === 'member' && item.options.multiple === 0 ||
        item.type === 'autonumber')
    },
    // formId 为一级菜单
    formSelected(formId, type) {
      const detailFormArr = this.app.form.filter(item => item.parentTemplateDataId === formId && item.pageType === 1)
      if (detailFormArr.length > 0) {
        formFieldList(detailFormArr[0].templateDataId).then(res => {
          this.app.field.splice(0)
          res.body.forEach(item => this.app.field.push(item))
          // 存储vuex
          this.$store.commit('SET_CURRENT_FORM_ID', this.relatedChoice.formId)
          this.$store.commit('SET_CURRENT_FIELDS', this.app.field.map(item => {
            return {
              options: item.options,
              fieldId: item.dataKey,
              name: item.name,
              type: item.type,
              required: item.isRequired,
              // 关联组件：允许显示的字段类型：文本/数字/日期时间/单选项/成员(单选类)/自编号
              choiceOptional: item.type === 'input' || item.type === 'number' || item.type === 'date' || item.type === 'radio' || (item.type === 'member' && item.options.multiple === 0) || item.type === 'autonumber'
            }
          }))
          this.relatedChoice.field = []
        })
      }
    },
    _addWidget(list, widget) {
      if (this.muneType === 'formPage') {
        if (this.selectWidget && this.selectWidget.key) {
          const index = list.findIndex(item => item.key === this.selectWidget.key)
          if (index >= 0) {
            this.$set(widget, 'parentDataKey', list[index].parentDataKey)
            list.splice(index + 1, 0, widget)
            this.selectWidget = list[index + 1]
          } else {
            list.forEach(item => {
              if (item.type === 'grid') {
                [item.columns].forEach(column => {
                  widget.type !== 'grid' && widget.type !== 'paging' && this._addWidget(column.list, widget)
                })
              }
              if (item.type === 'table') {
                this._addWidget(item.tableColumns, widget)
              }
              if (item.type === 'tabs') {
                item.tabs.forEach(tab => {
                  this._addWidget(tab.list, widget)
                })
              }
            })
          }
        } else {
          list.push(widget)
          this.selectWidget = list[list.length - 1]
        }
      } else if (this.muneType == 'listPage') {
        this.selectWidget = list.filter(f => f.type === widget.type)[0]
        // this.selectWidget = widget
      }
    },
    // 处理linkName
    dealLinkName(newItem) {
      const linkNameArr = []
      const type = newItem.type
      this.data.list.forEach(item => {
        if (item.linkName) {
          item.type === type && linkNameArr.push(parseInt(item.linkName.substring(item.linkName.indexOf(type) + type.length)))
          type !== 'grid' && item.type === 'grid' && item.columns.list.forEach(m => {
            m.linkName && m.type === type && linkNameArr.push(parseInt(m.linkName.substring(m.linkName.indexOf(type) + type.length)))
          })
        }
      })
      return linkNameArr.length ? Math.max.apply(null, linkNameArr) + 1 : 1
    },
    handleMove(e) {
      if (this.selectWidget) {
        return e.draggedContext.element.dataKey === this.selectWidget.dataKey
      } else {
        return false
      }
    },
    async handleWidgetUpdate(evt, newList) {
      const newVal = newList
      const oldIndex = evt.oldIndex
      const newIndex = evt.newIndex
      if (Math.abs(oldIndex - newIndex) === 1) {
        // 组件替换
        const dataKey = newList[newIndex].dataKey
        const exchangeDataKey = newVal[oldIndex].dataKey
        const obj = {
          dataKey,
          exchangeDataKey
        }
        await formFieldExchange(obj)
      } else {
        const jsonData = {
          dataKey: this.selectWidget.dataKey,
          parentDataKey: this.selectWidget.parentDataKey,
          fieldColumn: 1,
          fieldRow: newIndex > oldIndex ? newIndex + 2 : newIndex + 1
        }
        // 组件移动
        await formFieldMove(jsonData)
      }
      this.$nextTick(() => {
        EventBus.$emit('on-history-add')
        this.getCurPageCompsData()
      })
    },
    // col 区段,colIndex 区段索引
    addRelatedFrom(widget) {
      if (widget.type === 'relatedChoice') {
        this.relatedChoice.widget = widget
        this.relatedChoice.dialogVisible = true
      } else if (widget.type === 'relatedForm') {
        this.relatedForm.widget = widget
        this.relatedForm.dialogVisible = true
      }
      this.initAppData()
    },
    handleWidgetAdd(evt) {
      const newIndex = evt.newIndex
      const to = evt.to
      this.modifyConfigTab('widget')
      const oldItem = { ...this.data.list[newIndex] }
      if (oldItem.type === 'relatedChoice') {
        this.relatedChoice.oldWidget = _.cloneDeep(oldItem)
      } else if (oldItem.type === 'relatedForm') {
        this.relatedForm.oldWidget = _.cloneDeep(oldItem)
      }
      // 为拖拽到容器的元素添加唯一 key
      const key = new Date().getTime() + ''
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: this.data.list[newIndex].options.remoteFunc || 'func_' + key,
          remoteOption: this.data.list[newIndex].options.remoteOption || 'option_' + key
        },
        key,
        // 绑定键值
        linkName: this.data.list[newIndex].linkName ? this.data.list[newIndex].linkName : this.data.list[newIndex].type + this.dealLinkName(this.data.list[newIndex]),
        rules: this.data.list[newIndex].rules ? [...this.data.list[newIndex].rules] : []
      })
      const newWidget = _.cloneDeep(this.data.list[newIndex])
      if (newWidget.dataKey) {
        this.$set(this.data.list, newIndex, newWidget)
        this.selectWidget = this.data.list[newIndex]
        this.$nextTick(() => {
          EventBus.$emit('on-history-add', oldItem, this.selectWidget)
        })
      } else {
        // 关联选项拖进去的时候，弹出框
        if (newWidget.type === 'relatedChoice') {
          // 此处再次请求，是因为mounted中的getAllMenu只有在刷新页面的情况下才会调用，但是在添加字段不会刷新页面
          const loading = this.$loading({
            lock: true
          })
          // 关联表单
          getAllMenu().then(res => {
            this.app.form.splice(0)
            res.body.forEach(item => this.app.form.push(item))
            const root = this.app.form.filter(item => item.parentTemplateId === '0').map(item => {
              const child = this.app.form.filter(i => i.parentTemplateDataId === item.templateDataId).map(i => {
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
            loading.close()
            this.relatedChoice.widget = newWidget
            this.relatedChoice.index = newIndex
            this.relatedChoice.dialogVisible = true
          })
        } else if (newWidget.type === 'relatedForm') {
          const loading = this.$loading({
            lock: true
          })
          // 关联表单
          getAllMenu().then(res => {
            this.app.form.splice(0)
            res.body.forEach(item => this.app.form.push(item))
            const root = this.app.form.filter(item => item.parentTemplateId === '0').map(item => {
              const child = this.app.form.filter(i => i.parentTemplateDataId === item.templateDataId).map(i => {
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
            loading.close()
            this.relatedForm.widget = newWidget
            this.relatedForm.index = newIndex
            this.relatedForm.dialogVisible = true
          })
        } else {
          this.$set(this.data.list, newIndex, newWidget)
          this.selectWidget = this.data.list[newIndex]
          this.$nextTick(() => {
            EventBus.$emit('on-history-add', oldItem, this.selectWidget)
          })
        }
      }
    },
    handleRelatedChoiceClose() {
      this.$nextTick(()=>{
        // 从数组中移除
        this.handleWidgetDeleteById(this.relatedChoice.widget.key)
        try {
          this.$refs['relatedChoiceForm'].resetFields()
        } catch (e) {
        }
        this.relatedChoice.dialogVisible = false

      })

    },
    handleRelatedFormClose() {
      this.handleWidgetDeleteById(this.relatedForm.widget.key)
      this.$refs['relatedForm'].resetFields()
      this.relatedForm.dialogVisible = false
    },
    handleRelatedChoiceConfirm() {
      this.$refs['relatedChoiceForm'].validate((valid) => {
        if (valid) {
          this.selectWidget = this.relatedChoice.widget
          this.selectWidget.options.formId = this.relatedChoice.formId
          this.selectWidget.name = this.formOption('relatedChoice').filter(item => item.templateDataId === this.relatedChoice.formId)[0].pageTemplateName
          this.selectWidget.options.choiceType = this.relatedChoice.choiceType
          if (this.relatedChoice.field.length === 0) {
            this.handleWidgetDelete(this.relatedChoice.index)
            this.$refs['relatedChoiceForm'].resetFields()
            this.relatedChoice.dialogVisible = false
          } else {
            this.selectWidget.options.field = this.relatedChoice.field
            this.$nextTick(() => { EventBus.$emit('on-history-add', this.relatedChoice.oldWidget, this.selectWidget) })
            this.$refs['relatedChoiceForm'].resetFields()
            this.relatedChoice.dialogVisible = false
          }
        } else {
          return false
        }
      })
    },
    handleRelatedFormConfirm() {
      this.$refs['relatedForm'].validate((valid) => {
        if (valid) {
          this.selectWidget = this.relatedForm.widget
          // this.app.field.filter(item => item.isRequired).forEach(item => this.selectWidget.options.header.push({ dataKey: item.dataKey }))
          // console.log(this.app.field)
          // debugger
          this.app.field.filter(item => item.type !== 'grid' && item.type !== 'paging' && item.type !== 'html' && item.type !== 'relatedForm').forEach(item => this.selectWidget.options.header.push({ dataKey: item.dataKey }))
          this.selectWidget.options.formId = this.relatedForm.formId
          // 关联表单默认显示所有表头
          const comsTypes = ['input', 'textarea', 'number', 'date', 'radio', 'checkbox', 'member', 'switch', 'autonumber', 'cascader', 'imgupload', 'fileupload', 'relatedChoice']
          const allFields = _.cloneDeep(this.$store.state.components.currentFields).filter(item => comsTypes.includes(item.type))
          this.selectWidget.options.header = allFields.reduce((arr, item) => {
            arr.push({
              dataKey: item.fieldId
            })
            return arr
          }, [])
          this.selectWidget.name = this.formOption('relatedForm').filter(item => item.templateDataId === this.relatedForm.formId)[0].pageTemplateName
          this.$nextTick(() => { EventBus.$emit('on-history-add', this.relatedForm.oldWidget, this.selectWidget) })
          this.$refs['relatedForm'].resetFields()
          this.relatedForm.dialogVisible = false
        } else {
          return false
        }
      })
    },
    handleWidgetDelete(index) {
      if (index === -1) {
        return
      }
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)

        this.$nextTick(() => { EventBus.$emit('on-history-add') })
      })
    },
    handleWidgetDeleteById(dataKey) {

      // 移除区段，分页
      const outIndex = this.data.list.findIndex(item => item.key === dataKey)
      if (outIndex > -1) {
        this.data.list.splice(outIndex, 1)
      }
      // 移除区段内部
      this.data.list.forEach(item => {
        if (item.columns) {
          const index = item.columns.list.findIndex(item2 => item2.key === dataKey)
          if (index > -1) {
            item.columns.list.splice(index, 1)
          }
        }
      })
     this.selectWidget = {}
    },
    handleSelectChange(index) {
      setTimeout(() => {
        if (index > 0) {
          this.selectWidget = this.data.list[index - 1]
        } else if (index === 0 && this.data.list.length > 1) {
          this.selectWidget = this.data.list[1]
        } else {
          this.selectWidget = null
        }
      })
    },
    showFieldType: showFieldTypeDesc
  }
}
</script>

<style lang="scss" scoped>
.mask {
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.btnBox {
  background: #ffffff;
}
.widget-blank {
  height: 100%;
  background: #ffffff;
}
.widget-form-container {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .widget-form-list {
    margin: 0;
  }
  .fromContent {
    flex: 1;
    flex-shrink: 0;
    overflow: hidden;
    /deep/.el-scrollbar__view {
    }
    .fromContentWapper{
      height: 100%;
      overflow: hidden;
      & > div{
          .widget-form-list{
            min-height: calc(100vh - 168px) ;
          }
      }
      .form-empty{
        margin: 0;
        transform: translateY(-50%);
        line-height: 20px;
        height: 20px;
      }
    }
  }
}
</style>
