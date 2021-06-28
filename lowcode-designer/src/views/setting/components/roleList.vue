<template>
  <div class="roleList">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="member" label="成员">
        <template slot-scope="scope">
          <!-- 角色 -->
          <div v-if="scope.row.departmentDtoList.length > 0" class="roleList">
            <i class="el-icon-user-solid"/><span>{{ scope.row.departmentName }}</span>
          </div>
          <!-- 用户 -->
          <div v-if="scope.row.userDtoList.length > 0" class="roleList">
            <i class="el-icon-user"/><span>{{ scope.row.userName }}</span>
          </div>
          <span v-if="scope.row.userDtoList.length <= 0 && scope.row.departmentDtoList.length <= 0">—</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.createBy === '-1'">--</span>
          <span v-else><el-button type="text" size="small" @click="roleEdit(scope.row)">编辑</el-button><el-divider direction="vertical"/><el-button type="text" size="small" @click="deleteRoleDailog(scope.row)">删除</el-button></span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="paging">
      <el-col align="right">
        <el-pagination :total="pageTotal" layout="prev, pager, next" @current-change="handleCurrentChange" />
      </el-col>
    </el-row>
    <!-- 删除角色 -->
    <delete-dialog :visible.sync="dialog.deleteRoleFlag" title="是否删除该角色？" content="角色被删除时，角色内成员将移至未分组角色。" @confirm="deleteRole"/>
  </div>
</template>
<script>
import { getAppId, getCompanyId } from '@/util/auth.js'
import { roleSearch, roleRemove } from '@/api/setting.js'
import DeleteDialog from '@/components/deleteDialog/index.vue'
import { BIO } from '@/util/bio.js'
export default {
  name: 'RoleList',
  components: {
    DeleteDialog
  },
  data() {
    return {
      dialog: {
        deleteRoleFlag: false // 删除角色FLAG
      },
      pageTotal: 0,
      tableData: [], // 角色列表
      removeClass: {}, // 删除
      params: {
        companyId: getCompanyId(),
        appId: getAppId(),
        current: 1,
        size: 10
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 初始化列表
      this.requestData(this.params)
    },

    // 显示删除角色
    deleteRoleDailog(row) {
      this.removeClass = row
      this.dialog.deleteRoleFlag = true
    },
    // 编辑
    roleEdit(row) {
      this.$router.push({ path: '/' + BIO.tenTo62(getAppId()) + '/design/roleset', query: { id: row.id }})
    },
    // 删除角色
    deleteRole() {
      const params = {
        id: this.removeClass.id,
        companyId: this.removeClass.companyId,
        appId: this.removeClass.appId
      }
      roleRemove(params).then(resp => {
        this.$message.success('角色删除成功！')
        this.dialog.deleteRoleFlag = false
        // 刷新列表
        this.requestData(this.params)
      }).catch(err => {
        console.log(err)
      })
    },
    // 分页
    handleCurrentChange(val) {
      this.params.current = val
      this.requestData(this.params)
    },
    // 数据渲染
    requestData(params) {
      roleSearch(params).then(resp => {
        this.tableData = resp.body || []
        this.tableData.forEach(item => {
          const dStr = item.departmentDtoList.map(m => m.departmentName)
          const uStr = item.userDtoList.map(m => m.name)
          item.departmentName = dStr.join(' ')
          item.userName = uStr.join(' ')
        })
        this.pageTotal = resp.count
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.roleList i { margin-right:8px; }
.stopText   { margin-bottom:20px; font-size:14px; color:rgba(0, 0, 0, 0.65); }
.el-dialog__body { padding:5px 20px 15px; }
.paging { margin-top:20px; }
.el-table--enable-row-transition .el-table__body td { border:none; }
</style>
