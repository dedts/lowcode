<template>
  <div class="roleNo">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="departmentName" label="角色名称" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="distributionRole(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="paging">
      <el-col align="right">
        <el-pagination :total="pageTotal" layout="prev, pager, next" @current-change="handleCurrentChange" />
      </el-col>
    </el-row>
    <!-- 分配角色弹窗 -->
    <el-dialog
      :visible.sync="dialog.noRoleVisible"
      :close-on-click-modal="false"
      title="分配角色"
      width="30%"
    >
      <span>为『{{ departmentName }}』分配角色</span>
      <el-select v-model="roleValue" multiple placeholder="请选择" class="selectBox">
        <el-option
          v-for="item in roleOptions"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"/>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRole()">取 消</el-button>
        <el-button type="primary" @click="submitRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getAppId, getCompanyId } from '@/util/auth.js'
import { noRole, roleSimpleSearch, roleUpdate } from '@/api/setting.js'
export default {
  name: 'RoleNo',
  data() {
    return {
      dialog: {
        noRoleVisible: false
      },
      tableData: [],
      pageTotal: 0, // 总条数
      params: {
        companyId: getCompanyId(),
        appId: getAppId(),
        current: 1,
        size: 10
      },
      roleOptions: [], // 分配角色列表
      roleValue: [], // 分配角色值
      departmentId: '', // 部门ID
      departmentName: '' // 部门名字
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getRole()
      this.requestData(this.params)
    },
    // 展示分配角色弹窗
    distributionRole(row) {
      this.dialog.noRoleVisible = true
      this.departmentId = row.id
      this.departmentName = row.departmentName
    },
    // 分配角色
    submitRole() {
      if (this.roleValue.length <= 0) {
        this.$message.error('请选择你要分配的角色')
        return false
      }
      const params = {
        roleIds: this.roleValue,
        departmentDtoList: [{ id: this.departmentId }]
      }
      roleUpdate(params).then(resp => {
        if (resp.code === 200) {
          this.$message.success('角色分配成功')
          this.dialog.noRoleVisible = false
          // 刷新未分配角色列表
          this.requestData(this.params)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 取消角色分配
    cancelRole() {
      this.dialog.noRoleVisible = false
      this.roleValue = []
    },
    // 分页
    handleCurrentChange(val) {
      this.params.current = val
      this.requestData(this.params)
    },
    // 未分配角色列表
    requestData(params) {
      noRole(params).then(resp => {
        if (resp.code === 200) {
          this.tableData = resp.body
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取角色
    getRole() {
      const params = {
        companyId: getCompanyId(),
        appId: getAppId(),
        current: 1,
        size: 1000,
        onlyRole: true
      }
      roleSimpleSearch(params).then(resp => {
        if (resp.body) {
          this.roleOptions = resp.body.filter(f => f.id !=='0' && f.id !== '1')
          console.log(this.roleOptions)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .selectBox { width:100%; margin-top:5px; }
</style>
