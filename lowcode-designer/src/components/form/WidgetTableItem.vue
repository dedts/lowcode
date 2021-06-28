<template>
  <div
    v-if="element && element.key"
    :class="{active: selectWidget.key == element.key, 'is_req': element.options.required}"
    :style="{width: !element.options.width || element.options.width == '100%' ? '200px' : element.options.width}"
    class="widget-table-view"
    @click.stop="handleSelectWidget(index)"
  >
    <el-table
      :data="[{}]"
      row-class-name="widget-table-row">
      <el-table-column :label="element.name" :label-class-name="element.options.required ? 'required' : ''">
        <widget-element-item :element="element" :is-table="true"/>
      </el-table-column>
    </el-table>

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
</template>

<script>
import WidgetElementItem from './WidgetElementItem'
import _ from 'lodash'
import { EventBus } from '../../util/event-bus.js'

export default {
  components: {
    WidgetElementItem
  },
  props: ['element', 'select', 'index', 'data'],
  data() {
    return {
      selectWidget: this.select
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
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data[index]
    },
    handleWidgetDelete(index) {
      if (this.data.length == 1) {
        this.$emit('select-change', -1)
      } else {
        if (this.data.length - 1 == index) {
          this.$emit('select-change', index - 1)
        } else {
          this.$emit('select-change', index)
        }
      }

      this.$nextTick(() => {
        this.data.splice(index, 1)

        setTimeout(() => {
          EventBus.$emit('on-history-add')
        }, 20)
      })
    },
    handleWidgetClone(index) {
      const key = new Date().getTime() + ''
      const cloneData = {
        ..._.cloneDeep(this.data[index]),
        key,
        model: this.data[index].type + key
      }

      this.data.splice(index + 1, 0, cloneData)

      this.$nextTick(() => {
        this.selectWidget = this.data[index + 1]

        this.$nextTick(() => { EventBus.$emit('on-history-add') })
      })
    }
  }
}
</script>
