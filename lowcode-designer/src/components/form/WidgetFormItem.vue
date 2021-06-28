<template>
  <div class="component-item">
    <!-- 编辑区 每个form-item-->
    <!--<el-form-item class="widget-view "-->
    <!--v-if="element && element.key && element.type != 'divider'"-->
    <!--:class="{active: selectWidget.key == element.key, 'is_req': element.options.required, 'is_hidden': element.options.hidden}"-->
    <!--:label="element.name"-->
    <!--:label-width="element.options.isLabelWidth ? element.options.labelWidth + 'px' : ''"-->
    <!--@click.native.stop="handleSelectWidget(index)"-->
    <!--&gt;-->

    <widget-element-item :index="index" :element="element" :flag="flag" :is-table="false" @handleSelectWidget="handleSelectWidget(index)" @deleteItem="handleWidgetDelete(index)"/>

    <!--<div class="widget-view-action" v-if="selectWidget.key == element.key">-->
    <!--&lt;!&ndash;<i class="iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)"></i>&ndash;&gt;-->
    <!--<i class="icon iconfont iconri-delete-bin&#45;&#45;line" @click.stop="handleWidgetDelete(index)"></i>-->
    <!--</div>-->

    <!--<div class="widget-view-drag" v-if="selectWidget.key == element.key">-->
    <!--<i class="iconfont icon-drag drag-widget"></i>-->
    <!--</div>-->

    <!--<div class="widget-view-model" v-if="element.options.dataBind">-->
    <!--<span>{{element.model}}</span>-->
    <!--</div>-->

    <!--</el-form-item>-->

    <div
      v-if="element && element.key && element.type == 'divider'"
      :class="{active: selectWidget.key == element.key, 'is_hidden': element.options.hidden}"
      class="widget-view no-put"
      style="padding-bottom: 0;"
      @click.stop="handleSelectWidget(index)"
    >
      <el-divider :content-position="element.options.contentPosition">
        {{ element.name }}
      </el-divider>

      <div v-if="selectWidget.key == element.key" class="widget-view-action">
        <i class="iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)"/>
        <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"/>
      </div>
      <div v-if="selectWidget.key == element.key" class="widget-view-drag">
        <i class="iconfont icon-drag drag-widget"/>
      </div>

      <div v-if="element.options.dataBind" class="widget-view-model">
        <span>{{ element.model }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetElementItem from './WidgetElementItem'
import _ from 'lodash'
import { EventBus } from '../../util/event-bus.js'
import { formFieldDelete, formFieldList } from '@/api/builder'
import { getCompanyId, getAppId } from '@/util/auth'
export default {
  components: {
    WidgetElementItem,
    Draggable
  },
  props: ['element', 'select', 'index', 'data', 'flag'],
  data() {
    return {
      selectWidget: this.select
    }
  },
  inject: ['modifyConfigTab', 'saveFormData', 'curPageData', 'getCurPageCompsData', 'compsData'],
  computed: {
    compsList() {
      return this.compsData()
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

  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index]
      this.modifyConfigTab('widget')
      // 组件属性 widgetForm的显示字段，防止重复请求接口
      if (this.selectWidget.type === 'relatedChoice' || this.selectWidget.type === 'relatedForm') {
        // 当前组件对应的表单id
        this.$store.commit('SET_CURRENT_FORM_ID', this.selectWidget.options.formId)
        // console.log(this.$store.state.components.form)
        const pageArr = this.$store.state.components.form.filter(item => item.pageTemplateId === this.selectWidget.options.formId)

        if (pageArr.length > 0) {
          const detailPageTemplateId = pageArr[0].child.filter(item => item.pageType === 1)[0].pageTemplateId
          // 组件对应的表单的字段
          formFieldList(detailPageTemplateId).then(res => {
            // 存储vuex
            this.$store.commit('SET_CURRENT_FIELDS', res.body.map(item => {
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
          })
        }
      }
    },
    async handleWidgetDelete(index) {
      if (this.data.list.length === 1) {
        if (this.compsList.length > 1) {
          this.$emit('select-change', -2)
        } else {
          this.$emit('select-change', -1)
        }
      } else {
        this.$emit('select-change', index)
      }
      const dataKey = this.data.list[index].dataKey
      // this.data.list = this.data.list.filter(f => f.dataKey !== dataKey)
      formFieldDelete(dataKey).then(resp => {
        this.getCurPageCompsData()
      })
    },
    handleWidgetClone(index) {
      const key = new Date().getTime() + ''
      const cloneData = {
        ..._.cloneDeep(this.data.list[index]),
        key,
        model: this.data.list[index].type + key
      }

      this.data.list.splice(index + 1, 0, cloneData)

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]

        this.$nextTick(() => { EventBus.$emit('on-history-add') })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.component-item:first-child {
  padding-top: 5px;
}
</style>
