<template>
  <!--
    表头设置
    headerList: 已经选择字段
    system-field: 系统字段
    current-form-field: 当前表单字段
  -->
  <div class="tableHeaderWrap">
    <!-- 添加字段 -->
    <el-select v-model="headerList" multiple placeholder="+ 添加字段" class="headerSelect" @change="getFieldList">
      <template v-if="from==='relatedForm'">
        <el-option
          v-for="item in fieldOptions[0].options"
          :key="item.dataKey"
          :label="item.name"
          :disabled="from==='relatedForm'&&item.options.required"
          :value="item.dataKey" >
          <div class="flex-between">
            <span>{{ item.name }}</span>
            <span class="inline ml30" style="color: #8492a6; font-size: 12px">{{ showFieldType(item) }}</span>
          </div>
        </el-option>
      </template>
      <template v-else>
        <el-option-group v-for="group in fieldOptions" :key="group.label" :label="group.label">
          <el-option
            v-for="item in group.options"
            :key="item.dataKey"
            :label="item.name"
            :value="item.dataKey"
          >
            <div class="flex-between">
              <span>{{ item.name }}</span>
              <span class="inline ml30" style="color: #8492a6; font-size: 12px">{{ showFieldType(item) }}</span>
            </div>
          </el-option>
        </el-option-group>
      </template>

    </el-select>
    <!-- 字段拖拽 -->
    <draggable
      v-model="fieldList"
      v-bind="{
        group: { group: 'people', ghostClass: 'ghost', animation: 200 }
      }"
      tag="ul"
      @end="headerListSort"
    >
      <li v-for="item in fieldList" :key="item.dataKey" class="headerList">
        <i class="iconfont iconmove"/>
        <span>{{ item.name }}</span>
      <i v-show="from==='relatedForm'&&!item.required || !from " class="iconfont iconri-delete-bin--line" @click="removeFieldList(item)" /></li>
    </draggable>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import { showFieldTypeDesc } from '@/util/index'
export default {
  name: 'SetTableHeader',
  components: {
    Draggable
  },
  props: {
    // 字段列表
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表头字段（系统，当前表单）
    allField: {
      type: Array,
      default: () => {
        return []
      }
    },
    from: { // 'relatedForm' 关联表单
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headerList: this.value,
      // allField中的sysAdd为true系统字段，false当前表单字段
      fieldOptions: [{
        label: '表单字段',
        options: this.allField.filter(f => !f.sysAdd && f.type !== 'relatedForm')
      }, {
        label: '系统字段',
        options: this.allField.filter(f => f.sysAdd)
      }],
      fieldList: []
    }
  },
  watch: {
    'headerList': function(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    this.getFieldList()
  },
  methods: {
    // 选择字段后展示列表
    getFieldList() {
      this.fieldList = this.allField.filter(f => this.headerList.includes(f.dataKey) || this.headerList.map(({ dataKey }) => dataKey).includes(f.dataKey))
      // console.log(this.allField)
      // console.log(this.fieldList)
    },
    // 删除列表中选中的字段
    removeFieldList(item) {
      // console.log(item)
      this.headerList = this.headerList.filter(f => f !== item.dataKey)
      this.fieldList = this.fieldList.filter(f => f.dataKey !== item.dataKey)
    },
    // 排序列表中的字段
    headerListSort() {
      const sortField = []
      this.fieldList.forEach(item => {
        sortField.push(item.dataKey)
      })
      this.headerList = sortField
    },
    showFieldType: showFieldTypeDesc,
    removeTag(val) {
      if (this.from === 'relatedForm') {

      }
    }
  }
}
</script>
<style scoped>
  .tableHeaderWrap { margin:0 20px; }
  .headerList { padding:0 50px 0 30px; margin-bottom:8px; height:40px; line-height:40px; border:1px solid #E8E8E8; background:#fff; position:relative; overflow:hidden; }
  .headerList:hover { border:1px solid #0097FF; }
  .headerList span { height:40px; font-size:14px; display:block; color:#232E37; }
  .headerList .iconmove { width:30px; text-align:center; display:block; color:#A9AFB5; position:absolute; left:0; top:0; z-index:3; }
  .headerList .iconri-delete-bin--line { width:50px; text-align:center; display:none; font-size:14px; color:#FB6D55; position:absolute; right:0; top:0; z-index:3; }
  .headerList:hover .iconri-delete-bin--line { display: block; }
  .headerSelect { margin-bottom:8px; min-height:40px; width: 100%}
  .tableHeaderWrap/deep/ .el-input__inner { height:40px; line-height:40px; border:1px solid #E8E8E8; borderr-radius:0; }
  .tableHeaderWrap/deep/ .el-input__inner:hover { border:1px solid #0097FF; }
  /deep/.el-select .el-input .el-select__caret { display: none; }
  .tableHeaderWrap/deep/ .el-input__inner::-webkit-input-placeholder{
    text-align:center;
    color: #0097FF;
  }
  .tableHeaderWrap/deep/ .el-input__inner::-moz-placeholder{
    text-align:center;
    color: #0097FF;
  }
  .tableHeaderWrap/deep/ .el-input__inner:-ms-input-placeholder{
    text-align:center;
    color: #0097FF;
  }
  /deep/.el-select .el-tag__close.el-icon-close{display: none}
</style>
