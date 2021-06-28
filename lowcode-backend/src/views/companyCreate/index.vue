<template>
  <div class="companyWrap">
    <div class="company">
      <el-row>
        <el-col align="center">
          <h3>欢迎使用</h3>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="companyBox">
            <span class="no">1</span>
            <span class="title">创建</span>
            <span class="text">创建一个公司，并把相关<br>工作人员添加至公司内</span>
            <span class="line" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="companyBox">
            <span class="no">2</span>
            <span class="title">创建应用</span>
            <span class="text">根据实际业务情景，创建<br>应用</span>
            <span class="line" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="companyBox">
            <span class="no">3</span>
            <span class="title">发布应用</span>
            <span class="text">发布应用后，即可让公司<br>成员使用此应用</span>
            <span class="line" />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col align="center">
          <el-button type="primary" class="btnCreate" @click="companyCreate()">
            创建公司
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      phoneNo: '',
      password: ''
    }
  },
  methods: {
    // 创建公司
    companyCreate() {
      this.$router.push({ path: '/companyCreate/create' })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .company { margin:13% auto 0; width:800px; }
  .company h3 { margin-bottom:80px; font-size:34px; }
  .companyBox { padding-left:40px; position:relative; }
  .companyBox .no { width:30px; height:30px; border-radius:15px; border:1px solid rgba(0, 0, 0, 0.85); color:rgba(0, 0, 0, 0.85); display:block; text-align:center; line-height:30px; position: absolute; left:0; top:0; z-index: 5; }
  .companyBox .title { height:40px; display:block; font-size:24px; font-weight:bold; }
  .companyBox .text { line-height:26px; color: rgba(0, 0, 0, 0.65); }
  .companyBox .line { width:110px; height:1px; display:block; background: rgba(0, 0, 0, 0.15); position:absolute; right:0; top:26px; z-index:3; }
  .btnCreate { margin-top:70px; width:475px; height:40px; }
</style>
