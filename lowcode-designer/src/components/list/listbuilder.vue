<template>
  <div class="listBuildContent">
    <el-container
      class="listBuildContentWapper"
      style="position: relative;">
      <!--页眉-->
      <el-header
        :class="{borderDefult:true, border: selectWidget && selectWidget.type == 'header'}"
        style="height: 56px;"
        @mousedown.native.prevent=""
        @click.native.stop="handleWidgetClone('header')">
        <el-row style="line-height: 54px;">
          <el-col :span="10">
            <span
              v-for="(item,index) in getInfo('header').options.batchList"
              :key="item.operationType"
              :class="['drawerBtn',index===0?'btnBgc':'']"> <i :class="['iconfont',item.icon]" />{{ item.operationName }}</span>
          </el-col>
          <el-col
            :span="14"
            align="right">
            <span
              v-for="(item,index) in getInfo('header').options.operationList"
              :key="item.operationType"
              :class="['drawerBtn',index===0?'btnBgc':'']"> <i :class="['iconfont',item.icon]" />{{ item.operationName }}</span>
          </el-col>
        </el-row>
      </el-header>
      <div class="tableListContainer">
        <el-scrollbar class="default-scrollbar">
          <el-container class="container">
            <el-main :class="{borderDefult:true,border: selectWidget && selectWidget.type == 'list'}" @click.native.stop="handleWidgetClone('list')">
              <!--表格-->
              <el-table :data="tableData" stripe tooltip-effect="dark" style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column v-for="(item,index) in getInfo('list').options.content" v-if="getInfo('list').options.content.length && options.length" :key="index" align="center">
                  <template slot="header" slot-scope="scope">
                    <span>{{ getInfo('list').options.content[index].name }}</span>
                  </template>
                  <template slot-scope="scope">
                    <span class="tableBefContent" />
                    <span class="tableContent" style="width: 60%" />
                  </template>
                </el-table-column>
                <!--无数据时-->
                <el-table-column v-if="!getInfo('list').options.content.length" align="center">
                  <template slot="header" slot-scope="scope">
                    <span />
                  </template>
                  <template slot-scope="scope"><span /></template>
                </el-table-column>
              </el-table>
            </el-main>
            <!--操作区域-->
            <!--:width="getInfo('operation').options.operationList.length*45+'px'"-->
            <el-aside :class="{borderDefult:true,border: selectWidget && selectWidget.type == 'operation'}" style="width: unset;" @click.native.stop="handleWidgetClone('operation')">
              <span class="tableHeader" style="width: 100%;border-left:1px solid #E8E8E8">操作</span>
              <div v-for="(c,i) in table" :key="c">
                <span :class="['tableHeader','table', i%2===0 ?'bgcf':'bgc']">
                  <span v-for="(item,index) in getInfo('operation').options.operationList" v-show="item.operationType !=='customize'" :key="index">{{ item.operationName }}{{ index < 2 ? ' | ':'' }}</span>
                  <el-dropdown trigger="click" placement="bottom">
                    <span class="el-dropdown-link">
                      <i v-if="getInfo('operation').options.operationList.some(s=>s.operationType==='customize')" class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown" style="margin-top: -10px">
                      <el-dropdown-item v-for="item in getInfo('operation').options.operationList" v-show="item.operationType==='customize'" :key="item.configDataKey" class="mt10">{{ item.operationName }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
                <span />
              </div>
            </el-aside>
          </el-container>
        </el-scrollbar>
      </div>
      <!--预览-->
      <el-drawer
        :visible.sync="selectWidget && selectWidget.type == 'preview'"
        :modal="false"
        :append-to-body="false"
        :modal-append-to-body="false"
        :show-close="false"
        size="60%"
        direction="rtl">
        <template slot="title">
          <el-row>
            <el-col :span="4" style="margin-top: 7px;">
              <span style="cursor: pointer" @click="selectWidget=null">收起 ></span>
            </el-col>
            <el-col :span="20" align="right">
              <span v-for="(item,index) in getInfo('preview').options.operationList" :key="index" class="drawerBtn">
                <i :class="['iconfont',item.icon]" />{{ item.operationName }}
              </span>
            </el-col>
          </el-row>
        </template>
        <div class="drawerContentBox">
          <el-row v-for="(item,index) in currentFormField" :key="index">
            <el-col :span="12" :class="['drawerContentTitle',index===0?'bt':'']">{{ item.name }}</el-col>
            <el-col :span="12" :class="['drawerContent',index===0?'bt':'']">
              <span class="tableBefContent" />
              <span class="tableContent" style="width: 70%" />
            </el-col>
          </el-row>
        </div>
      </el-drawer>
      <!--分页-->
      <el-footer :class="{borderDefult:true,border: selectWidget && selectWidget.type == 'footer'}" @click.native.stop="handleWidgetClone('footer')">
        <div class="tac pt20 pb20" style="position: relative;">
          <el-pagination :current-page="1" :page-size="20" :total="2000" layout=" prev, pager, next" />
          <div class="selectSize">
            <i class="icon iconfont iconpagination_placeholder" style="color:#F8F9FA" />
            <i class="icon iconfont icondown" />
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import { formPageGetFields } from '../../api/builder'
export default {
  props: ['data', 'select', 'curPageId'],
  data() {
    return {
      table: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      selectWidget: this.select,
      tableData: [
        { name: '', sex: '', phone: '', time: '', address: '' },
        { name: '', sex: '', phone: '', time: '', address: '' },
        { name: '', sex: '', phone: '', time: '', address: '' },
        { name: '', sex: '', phone: '', time: '', address: '' },
        { name: '', sex: '', phone: '', time: '', address: '' },
        { name: '', sex: '', phone: '', time: '', address: '' },
        { name: '', sex: '', phone: '', time: '', address: '' },
        { name: '', sex: '', phone: '', time: '', address: '' },
        { name: '', sex: '', phone: '', time: '', address: '' },
        { name: '', sex: '', phone: '', time: '', address: '' }
      ],
      options: []
    }
  },
  computed: {
    currentFormField: function() {
      return this.getInfo('preview').options.content.filter(f => !f.sysAdd)
    }
  },
  inject: ['modifyConfigTab'],
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
    this.init()
  },
  methods: {
    init() {
      // 获取表单字段 并在表头中过滤掉以删除的组件
      const option = {
        templateDataId: this.curPageId
      }
      formPageGetFields(option).then((res) => {
        this.options = res.body || []
        this.getInfo('list').options.content = this.options.filter((f) => f.isHead).sort((a, b) => {
          return a.fieldSort - b.fieldSort
        })
        this.getInfo('preview').options.content = this.options
      })
    },
    getInfo(type) {
      const index = this.data.list.indexOf(
        this.data.list.find((f) => f.type === type)
      )
      return this.data.list[index]
    },
    handleWidgetClone(val) {
      this.$nextTick(() => {
        this.selectWidget = this.data.list.filter((f) => f.type === val)[0]
        this.modifyConfigTab('list')
        // this.$nextTick(() => {         EventBus.$emit('on-history-add')       })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.center-container .el-main {
  background-color: #fff;
}
.fm2-container footer {
  border: 0;
  background-color: #fff;
}
.tableHeader {
  display: inline-block;
  height: 34px;
  line-height: 34px;
  background: #f8f9fa;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
  float: left;
}
.table {
  height: 56px;
  line-height: 56px;
  width: 100%;
  border-left: 1px solid #e8e8e8;
  font-size: 12px;
}
.tableBefContent {
  display: inline-block;
  height: 10px;
  width: 10px;
  background-color: #f8f9fa;
}
.tableContent {
  display: inline-block;
  height: 10px;
  background-color: #f8f9fa;
  margin-left: 5px;
}
.bgc {
  background-color: #fefbf4;
}
.bgcf {
  background-color: #fff;
}
.btnBgc {
  background-color: #797f99;
  color: #fff !important;
}
.selectSize {
  position: absolute;
  right: -5px;
  top: 15px;
  display: inline-block;
  width: 80px;
  height: 32px;
  color: #d9d9d9;
  border: 2px solid #d9d9d9;
}
.container {
  position: relative;
}
.container::before {
  content: '';
  position: absolute;
  background-color: #ebeef5;
  z-index: 1;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: 1px;
}
.border {
  border: 2px solid #0097ff !important;
  z-index: 9;
}
.borderDefult {
  border: 2px solid transparent;
}
/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fefbf4;
}
/deep/ .el-table td {
  border: 0;
}
/deep/ .el-table th {
  background-color: #f8f9fa;
}
/deep/ .el-table td {
  height: 56px;
}
/deep/ .el-table-column--selection .cell {
  padding: 0 14px;
}
/deep/ .el-table::before {
  display: none;
}
/deep/ .el-drawer__wrapper {
  position: absolute;
}
/deep/ .el-drawer__header {
  border-bottom: 1px solid #ebeef5;
  height: 59px;
  margin-bottom: 0;
  padding: 8px 15px;
}
.drawerBtn {
  display: inline-block;
  height: 36px;
  line-height: 28px;
  padding: 3px 12px;
  border: 1px solid #ebeef5;
  text-align: center;
  margin-right: 10px;
  color: #a9afb5;
  cursor: pointer;
}
.drawerContentBox {
  margin: 10px 15px;
}
.drawerContentTitle,
.drawerContent {
  height: 48px;
  border-left: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  background-color: #f8f9fa;
  line-height: 48px;
  padding-left: 15px;
}
.drawerContent {
  background-color: #fff;
  border-right: 1px solid #ebeef5;
}
.bt {
  border-top: 1px solid #ebeef5;
}
/deep/ .el-table {
  border-radius: 0;
}
/deep/ .el-table th.is-leaf {
  border: 0;
}
.listBuildContent {
  height: 100%;
  .listBuildContentWapper {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .tableListContainer {
      flex: 1;
      flex-shrink: 0;
      overflow: hidden;
    }
  }
}
</style>

