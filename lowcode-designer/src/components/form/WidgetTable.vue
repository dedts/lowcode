<template>
  <el-form-item
    :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      'is_hidden': element.options.hidden
    }"
    :label="element.name"
    :label-width="element.options.isLabelWidth ? element.options.labelWidth + 'px' : ''"
    class="widget-table widget-view"
    @click.native.stop="handleSelectWidget(index)"
  >

    <div class="widget-table-wrapper">
      <el-table :data="[{}]" class="widget-table-left" row-class-name="widget-table-row">
        <el-table-column label="#" width="50" fixed>
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
      </el-table>
      <div class="widget-table-content">
        <div v-if="element.tableColumns.length == 0" class="table-empty">{{ $t('fm.description.tableEmpty') }}</div>
        <draggable
          v-model="element.tableColumns"
          v-bind="{group:{name: 'people', put: handlePut}, ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          :no-transition-on-drag="true"
          @add="handleWidgetTableAdd($event, element)"
          @update="handleWidgetTableUpdate"
        >
          <transition-group :style="{width: columnsWidthStyle}" name="fade" tag="div" class="widget-table-col">

            <widget-table-item
              v-for="(item, index) in element.tableColumns"
              v-if="item.key"
              :key="item.key"
              :element="item"
              :select.sync="selectWidget"
              :index="index"
              :data="element.tableColumns"
              @select-change="handleSelectChange($event, item)"
            />
          </transition-group>
        </draggable>
      </div>
    </div>

    <div v-if="selectWidget.key == element.key" class="widget-view-action widget-col-action">
      <i class="iconfont icon-icon_clone" @click.stop="handleTableClone(index)"/>
      <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"/>
    </div>

    <div v-if="selectWidget.key == element.key" class="widget-view-drag widget-col-drag">
      <i class="iconfont icon-drag drag-widget"/>
    </div>
    <div v-if="element.options.dataBind" class="widget-view-model">
      <span>{{ element.model }}</span>
    </div>
  </el-form-item>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetTableItem from './WidgetTableItem'
import _ from 'lodash'
import { CloneLayout } from '../../util/layout-clone.js'
import { EventBus } from '../../util/event-bus.js'

export default {
  components: {
    Draggable,
    WidgetTableItem
  },
  props: ['element', 'select', 'index', 'data'],
  data() {
    return {
      selectWidget: this.select,
      columnsWidthStyle: '200px'
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      deep: true,
      handler(val) {
        this.$emit('update:select', val)
      }
    },
    element: {
      deep: true,
      handler(val) {
        this.calcTableColumnsWidth()
      }
    }
  },
  mounted() {
    this.calcTableColumnsWidth()
  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index]
    },
    handleWidgetDelete(index) {
      if (this.data.list.length == 1) {
        this.$emit('select-change', -1)
      } else {
        if (this.data.list.length - 1 == index) {
          this.$emit('select-change', index - 1)
        } else {
          this.$emit('select-change', index)
        }
      }

      this.data.list.splice(index, 1)

      setTimeout(() => {
        EventBus.$emit('on-history-add')
      }, 20)
    },
    handleTableClone(index) {
      const cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]

        this.$nextTick(() => { EventBus.$emit('on-history-add') })
      })
    },
    handleWidgetTableUpdate(evt) {
      this.$nextTick(() => { EventBus.$emit('on-history-add') })
    },
    calcTableColumnsWidth() {
      // this.columnsWidth = (this.element.tableColumns.length+1)*200

      this.columnsWidthStyle = 'calc(200px)'

      const widthArray = []

      for (let i = 0; i < this.element.tableColumns.length; i++) {
        if (!this.element.tableColumns[i].options.width || this.element.tableColumns[i].options.width == '100%') {
          widthArray.push('200px')
        } else {
          widthArray.push(this.element.tableColumns[i].options.width)
        }
      }

      this.columnsWidthStyle = `calc(200px + ${widthArray.join(' + ')})`
    },
    handlePut(a, b, c) {
      if (c.className.indexOf('widget-col') >= 0 ||
        c.className.indexOf('widget-table') >= 0 ||
        c.className.indexOf('widget-tab') >= 0 ||
        c.className.indexOf('no-put') >= 0 ||
        c.children[0].className.indexOf('no-put') >= 0) {
        return false
      }
      return true
    },
    handleWidgetTableAdd($event, table) {
      const newIndex = $event.newIndex
      const key = new Date().getTime() + ''
      this.$set(table.tableColumns, newIndex, {
        ...table.tableColumns[newIndex],
        options: {
          ...table.tableColumns[newIndex].options,
          remoteFunc: table.tableColumns[newIndex].options.remoteFunc || 'func_' + key,
          remoteOption: table.tableColumns[newIndex].options.remoteOption || 'option_' + key,
          width: '200px',
          tableColumn: true
        },
        novalid: {
          ...table.tableColumns[newIndex].novalid
        },
        key,
        model: table.tableColumns[newIndex].model ? table.tableColumns[newIndex].model : table.tableColumns[newIndex].type + '_' + key,
        rules: table.tableColumns[newIndex].rules ? [...table.tableColumns[newIndex].rules] : []
      })

      this.$set(table.tableColumns, newIndex, _.cloneDeep(table.tableColumns[newIndex]))

      this.selectWidget = table.tableColumns[newIndex]

      this.$nextTick(() => { EventBus.$emit('on-history-add') })
    },
    handleSelectChange(index, item) {
      setTimeout(() => {
        index >= 0 ? (this.selectWidget = this.element.tableColumns[index]) : (this.selectWidget = {})
      })
    }
  }
}
</script>
