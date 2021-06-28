<template>
  <section class="nc-main">
    <!--nav-->
    <el-header style="padding:0;" height="56px"><nav-main/></el-header>
    <!--table-->
    <div class="content">
      <!--header-->
      <el-row>
        <el-col :span="4" class="title">函数</el-col>
        <el-col :span="20" align="right">
          <el-input v-model="input" placeholder="搜索函数" suffix-icon="el-icon-search" class="inline" style="width: 200px;"/>
          <el-button type="primary" class="ml10">+ 添加函数</el-button>
        </el-col>
      </el-row>
      <!--table-->
      <el-table :data="tableData" style="width: 100%" stripe @sort-change="sortChange" >
        <el-table-column prop="date" label="函数名称" sortable/>
        <el-table-column label="状态" sortable>
          <template slot-scope="scope">
            <span><i class="tips greenbgc"/>运行中</span>
            <span><i class="tips redbgc"/>未完成</span>
            <span><i class="tips greybgc"/>已停止</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="被调用(位置)" sortable/>
        <el-table-column prop="date" label="类型" sortable="custom"/>
        <el-table-column :sort-method="timeSort" prop="date" label="创建时间" sortable/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span>
              <el-button type="text">编辑</el-button>
              <el-divider direction="vertical"/>
              <el-button type="text">删除</el-button>
            </span>
            <span>
              <el-button type="text">查看</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div style="text-align: right;margin-top: 10px;">
        <el-pagination :total="30" layout="prev, pager, next"/>
      </div>

    </div>
  </section>
</template>
<script>
import NavMain from '../layoutcomponents/NavMain'
export default {
  components: { NavMain },
  data() {
    return {
      input: '',
      tableData: [{}, {}, {}]
    }
  },
  mounted() {},
  methods: {
    // 表格排序
    sortChange(column, key, order) {
      console.log(column, key, order)
    },
    // 时间排序
    timeSort(a, b) {
      console.log(a)
      console.log(b)
      return 1
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .nc-main{height: 100%;background-color: #f0f0f0;}
  .title{font-size: 20px;line-height: 28px;}
  .content{margin: 15px;padding: 15px;background-color: #fff;}
  .el-divider{background-color: #409EFF;}
</style>
