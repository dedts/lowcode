<template>
  <div class="addRole">
    <i class="el-icon-close" @click="backTopRole"/>
    <el-row class="addRoleBox">
      <el-col :span="11"><span class="roleName">角色名称</span></el-col>
      <el-col :span="13">
        <h3>添加角色</h3>
        <el-input v-model="roleName" placeholder="请输入" />
        <el-button type="primary" class="btnRole" @click="createRole">创建角色</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getAppId, getCompanyId } from '@/util/auth.js'
import { roleAdd } from '@/api/setting.js'
import { BIO } from '@/util/bio.js'
export default {
  data() {
    return {
      roleName: '',
      companyId: getCompanyId(),
      appId: getAppId()
    }
  },
  methods: {
    createRole() {
      if (this.roleName === '') {
        this.$message.error('请输入角色名称')
        return false
      }
      // 添加角色
      const params = {
        companyId: this.companyId,
        appId: this.appId,
        roleName: this.roleName
      }
      roleAdd(params).then(resp => {
        if (resp.code === 200) {
          this.$message.success('角色添加成功！')
          this.$router.push({ path: '/' + BIO.tenTo62(getAppId()) + '/design/roleset', query: { id: resp.body.id }})
        }
      }).catch(err => {
        console.log(err)
      })
    },
    backTopRole() {
      this.$router.push({ path: '/' + BIO.tenTo62(getAppId()) + '/design/setting', query: { type: 'role' }})
    }
  }
}
</script>
<style lang="scss" scoped>
.addRole    { overflow:hidden; }
.addRoleBox { margin:10% auto 0; width:600px; }
.addRole h3 { margin-bottom:30px; font-size:26px; }
.roleName   { margin-top:75px; padding-right:70px; display:block; text-align:right; }
.btnRole    { margin-top:20px; }
.el-icon-close { font-size:20px; position: absolute; right:30px; top:20px; z-index:5; }
</style>

