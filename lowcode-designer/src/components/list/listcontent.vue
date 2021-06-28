<template>
  <div class="listcontent">
    <div class="widget-cate">选择列表内容</div>
    <ul>
      <li v-for="(item, index) in listComponents" :key="index" :class="{curr: selectWidget && selectWidget.type===item.type}" @mousedown.prevent="" @click="toggleCurrent(index, item)"><a>{{ item.name }}</a></li>
    </ul>
  </div>
</template>
<script>
import { EventBus } from '../../util/event-bus'
export default {
  name: 'ListContent',
  props: {
    listComponents: {
      type: Array,
      default: function() {
        return []
      }
    },
    select: {
      type: Object,
      default: null
    }
  },
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
    toggleCurrent(index, item) {
      this.selectWidget = this.listComponents[index]
      this.$emit('modifyConfigTab', 'list')
    }
  }
}
</script>
<style lang="scss" scoped>
  .listcontent li { float:left; margin:1%; width:48%; height:38px; text-align:center; border-radius:2px; line-height:38px; font-size:12px; border:1px solid #E8E8E8; background:#ffffff;  }
  .listcontent li a {  width:108px; display:block; color:#232E37; }
  .listcontent .curr { border:1px solid #0097FF; background:#F4F6FC; }
</style>
