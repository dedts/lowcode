<template>
  <div class="roleWrap">
    <el-row class="roleTitle">
      <el-col :span="12"><h3 class="roleManagement">角色管理</h3></el-col>
      <el-col :span="12" align="right"><el-button type="primary" icon="el-icon-plus" @click="addRole">添加角色</el-button></el-col>
    </el-row>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="角色列表" name="first">
        <role-list v-if="activeName === 'first'"/>
      </el-tab-pane>
      <el-tab-pane label="未分配角色" name="second">
        <role-no v-if="activeName === 'second'"/>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import RoleList from '@/views/setting/components/roleList'
import RoleNo from '@/views/setting/components/roleNo'
import { BIO } from '@/util/bio.js'
import { getAppId } from '@/util/auth.js'
export default {
  components: {
    RoleList,
    RoleNo
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    addRole() {
      // this.$router.push('./addrole')
      this.$router.push({ path: '/' + BIO.tenTo62(getAppId()) + '/design/addrole' })
    }
  }
}
</script>
<style lang="scss" scoped>
.roleWrap { padding:32px; }
.roleTitle { margin-bottom:20px; }
.roleManagement { font-weight:normal; }
</style>
