<template>
  <div v-loading="element.loading" class="quduan-container">
    <el-row
      :class="{ active: selectWidget && selectWidget.key && selectWidget.key == element.key && element.options.flag, 'is_hidden': element.options.hidden}"
      :gutter="element.options.gutter || 0"
      :justify="element.options.justify"
      :align="element.options.align"
      class="widget-col widget-view clearfix"
      type="flex"
      @click.native.stop="handleSelectWidget(index)"
    >
      <el-col v-for="(item, index) in [element.columns]" :key="index" :span="24" >
        <div v-if="element.options.isShowName" class="quduanBox">
          <i :class="element.icon" class="icon iconfont v-middle"/>
          <span class="v-middle ml10">{{ element.name }}</span>
          <i v-show="element.options.flag" class="icon iconfont iconri-delete-bin--line blue fr delIcon v-middle" @click.stop="deleteItem"/>
        </div>
        <draggable
          v-model="item.list"
          v-bind="{group:{name:'people', pull:'clone'}, ghostClass: 'ghost',animation: 200}"
          :no-transition-on-drag="true"
          :move="dealMove"
          @add="handleWidgetColAdd($event, element, index)"
          @update="handleWidgetColUpdate($event, element,item.list)"
        >

          <transition-group name="fade" tag="div" class="widget-col-list">
            <template v-for="(col, colindex) in item.list" v-if="col && col.dataKey">
              <widget-col-item
                v-if="col.type === 'grid'"
                :key="col.dataKey"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              />

              <widget-tab-item
                v-else-if="col.type === 'tabs'"
                :key="col.dataKey"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              />

              <widget-table
                v-else-if="col.type === 'table'"
                :key="col.dataKey"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item)"
              />

              <widget-form-item
                v-else
                :key="col.dataKey"
                :flag="true"
                :element="col"
                :select.sync="selectWidget"
                :index="colindex"
                :data="item"
                @select-change="handleSelectChange($event, item, element)"
              />
            </template>
          </transition-group>

        </draggable>
      </el-col>

      <!--<div class="widget-view-action widget-col-action" v-if="selectWidget.key == element.key">-->
      <!--<i class="iconfont icon-icon_clone" @click.stop="handleColClone(index)"></i>-->
      <!--<i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"></i>-->
      <!--</div>-->

      <!--<div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == element.key">-->
      <!--<i class="iconfont icon-drag drag-widget"></i>-->
      <!--</div>-->
    </el-row>
    <!--删除二次弹框确认-->
    <delete-dialog :visible.sync="dialogDelete" title="删除" @confirm="handleWidgetDelete(index)"/>
  </div>
</template>

<script>
import WidgetFormItem from './WidgetFormItem'
import WidgetTable from './WidgetTable'
import WidgetTabItem from './WidgetTabItem'
import Draggable from 'vuedraggable'
import _ from 'lodash'
import { CloneLayout } from '../../util/layout-clone.js'
import { EventBus } from '../../util/event-bus.js'
import DeleteDialog from '../deleteDialog/index'
import { formFieldDelete, formFieldMove, formFieldExchange } from '@/api/builder'

export default {
  name: 'WidgetColItem',
  components: {
    Draggable,
    WidgetFormItem,
    WidgetTable,
    WidgetTabItem,
    DeleteDialog
  },
  props: ['element', 'select', 'index', 'data'],
  data() {
    return {
      selectWidget: this.select,
      dialogDelete: false
    }
  },
  inject: ['modifyConfigTab', 'dealLinkName', 'getCurPageCompsData', 'compsData'],
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
      deep: true,
      handler(val) {
        this.$emit('update:select', val)
      }
    }
  },
  methods: {
    handleSelectWidget(index) {
      this.data.list.forEach((item, dIndex) => {
        this.$set(item.options, 'flag', index === dIndex)
        if (item.type === 'grid') {
          item.columns && item.columns.list.forEach((m) => {
            this.$set(m.options, 'flag', false)
          })
        }
      })
      this.selectWidget = this.data.list[index]
      this.modifyConfigTab('widget')
    },
    deleteItem() {
      this.dialogDelete = true
    },

    dealMove(e) {
      if (this.selectWidget) {
        return e.draggedContext.element.dataKey === this.selectWidget.dataKey
      } else {
        return false
      }
    },
    handleWidgetDelete(index) {
      if (this.data.list.length === 1) {
        this.$emit('select-change', -1)
      } else {
        this.$emit('select-change', index)
      }
      formFieldDelete(this.data.list[index].dataKey).then(resp => {
        this.getCurPageCompsData()
      })
    },

    handleColClone(index) {
      const cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]

        this.$nextTick(() => { EventBus.$emit('on-history-add') })
      })
    },
    async handleWidgetColUpdate(evt, row, newList) {
      const newVal = newList
      const oldIndex = evt.oldIndex
      const newIndex = evt.newIndex
      if (Math.abs(oldIndex - newIndex) === 1) {
        // 组件替换
        const dataKey = newVal[newIndex].dataKey
        const exchangeDataKey = newVal[oldIndex].dataKey
        const obj = {
          dataKey,
          exchangeDataKey
        }
        await formFieldExchange(obj)
      } else {
        // 组件移动
        const index = newIndex > oldIndex ? newIndex + 2 : newIndex + 1
        await this.handleMove(row, index)
      }
      this.$nextTick(() => {
        EventBus.$emit('on-history-add')
        this.getCurPageCompsData()
      })
    },
    async handleMove(row, index) {
      const jsonData = {
        dataKey: this.selectWidget.dataKey,
        parentDataKey: row ? row.dataKey : this.selectWidget.parentDataKey,
        fieldColumn: 1,
        fieldRow: index
      }
      await formFieldMove(jsonData)
    },
    async handleWidgetColAdd($event, row, colIndex) {
      const newIndex = $event.newIndex
      const data = row.columns.list[newIndex]
      if (data.type === 'grid' || data.type === 'paging') {
        row.columns.list.splice(newIndex, 1)
        this.getCurPageCompsData()
        return
      }
      if (data.dataKey) {
        await this.handleMove(row, newIndex + 1)
        this.getCurPageCompsData()
        return
      }
      this.modifyConfigTab('widget')
      const key = new Date().getTime() + ''
      this.$set(row.columns.list, newIndex, {
        ...row.columns.list[newIndex],
        options: {
          ...row.columns.list[newIndex].options,
          remoteFunc: row.columns.list[newIndex].options.remoteFunc || 'func_' + key,
          remoteOption: row.columns.list[newIndex].options.remoteOption || 'option_' + key
        },
        novalid: {
          ...row.columns.list[newIndex].novalid
        },
        key,
        linkName: row.columns.list[newIndex].linkName ? row.columns.list[newIndex].linkName : row.columns.list[newIndex].type + this.dealLinkName(row.columns.list[newIndex]),
        model: row.columns.list[newIndex].model ? row.columns.list[newIndex].model : row.columns.list[newIndex].type + '_' + key,
        rules: row.columns.list[newIndex].rules ? [...row.columns.list[newIndex].rules] : []
      })

      this.$set(row.columns.list, newIndex, _.cloneDeep(row.columns.list[newIndex]))
      this.selectWidget = row.columns.list[newIndex]
      this.$set(this.selectWidget, 'parentDataKey', row.dataKey)
      if (data.type === 'relatedForm' || data.type === 'relatedChoice') {
        // 关联选项，关联表单需要弹窗确认
        this.$emit('addRelatedFrom', this.selectWidget)
      } else {
        this.$nextTick(() => { EventBus.$emit('on-history-add', this.selectWidget, this.selectWidget) })
      }
    },
    handleSelectChange(index, item, element) {
      setTimeout(() => {
        if (index > 0) {
          this.selectWidget = item.list[index - 1]
        } else if (index === 0) {
          this.selectWidget = element
        } else {
          if (index === -2) {
            const gridIndex = this.index
            if (gridIndex === 0) {
              this.selectWidget = this.compsList[1]
            } else {
              this.selectWidget = this.compsList[gridIndex - 1]
            }
          } else {
            this.selectWidget = null
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
  /deep/ .widget-col {
    background-color: #F8F9FA;
  }
  /deep/ .widget-form-container .widget-form-list .widget-col:hover.active {
    border: 1px solid #0097FF;
  }
  /deep/ .widget-form-container .widget-form-list .widget-col-list {
    border: 1px solid #ECEEF5;
  }
  .fr {
    float: right;
  }
  .quduanBox {
    padding: 0 15px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    background: #f9f9f9;
    border: 1px solid #ECEEF5;
    box-sizing: border-box;
  }
.deleteIconBox {
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  width: 48px;
  height: 24px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  background: #0097FF;
  float: right;
  margin-right: 16px;
  margin-top: 8px;
  overflow: hidden;
}
.isShow {
  opacity: 1;
  pointer-events: auto;
}
.bgBlue {
  border: 1px solid #0097FF;
}
  .clearfix {
    clear: both;
  }
  .delIcon {
    cursor: pointer;
    color: #FB6D55;
  }
  .v-middle {
     vertical-align: middle;
   }
  .ml10 {
    margin-left: 10px;
  }
  .quduan-container:first-child {
    padding-top: 32px;
  }
</style>
