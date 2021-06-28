<template>
  <div class="timeTaskBox">
    <div class="header">
      <div class="item">工作流名称</div>
      <div class="item">操作数量</div>
      <div class="item">启用禁用</div>
      <div class="item">运行间隔</div>
      <div class="item">创建时间</div>
      <div class="item">操作</div>
    </div>
    <div v-for="item in listData" :key="item.id" class="itemInfo" >
      <div class="tabTitle">{{ item.formName }}</div>
      <div v-for="m in item.workflowDtoList" :key="m.id" class="content">
        <div class="item">{{ m.flowName }}</div>
        <div class="item">{{ m.countAction }}</div>
        <div class="item">
          <el-switch
            v-model="m.flowStatus"
            @change="statusChange(m)"/>
          <span v-if="m.flowStatus" class="active">启用</span>
          <span v-if="!m.flowStatus" class="deActive">禁用</span>
        </div>
        <div class="item">{{ m.executionCycleDesc ? m.executionCycleDesc : '-' }}</div>
        <div class="item">{{ m.createTime }}</div>
        <div class="item operationBtn">
          <span class="cursor" @click="edit(item, m)">编辑</span>
          <span class="ml12 mr12">|</span>
          <span class="cursor" @click="openDialog(m.flowId)">删除</span>
        </div>
      </div>
    </div>
    <!--删除二次弹框确认-->
    <delete-dialog :visible.sync="dialogDelete" content="删除工作流可能会导致一些功能失效，确认删除？" title="确认删除工作流" @confirm="deleteFlow"/>
  </div>
</template>
<script>
import { workflowDisable, workflowDelete } from '../../../api/workflow'
import DeleteDialog from '../../../components/deleteDialog'
export default {
  name: 'TimeTask',
  components: {
    DeleteDialog
  },
  props: {
    listData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogDelete: false
    }
  },
  methods: {
    edit(item, m) {
      this.$emit('edit', item, m)
    },
    deleteFlow() {
      workflowDelete(this.deleteId).then(res => {
        this.$message.success('删除成功')
        this.deleteId = ''
        this.dialogDelete = false
        this.$emit('deleteFlow')
      })
    },
    openDialog(id) {
      this.deleteId = id
      this.dialogDelete = true
    },
    statusChange(item) {
      workflowDisable(item.flowId).then(res => {
        this.$message.success('修改成功')
        this.$emit('changeStatusEnd')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .timeTaskBox {
    border: 1px solid #E8E8E8;
    overflow: hidden;
    .header {
      color: rgba(0, 0, 0, 0.45);
      font-weight: bold;
      font-size: 13px;
      height: 48px;
      line-height: 48px;
      padding-left: 80px;
      display: flex;
      .item {
        flex: 1;
        padding-left: 24px;
      }
    }
    .itemInfo {
      .tabTitle {
        background: #F3F5F8;
        font-weight: bold;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        padding-left: 24px;
      }
      .content {
        height: 48px;
        line-height: 48px;
        padding-left: 80px;
        font-size: 14px;
        color: #232E37;
        display: flex;
        .item {
          flex: 1;
          padding-left: 24px;
          .active {
            margin-left: 10px;
            color: #0097FF;
            font-size: 14px;
            vertical-align: middle;
          }
          .deActive {
            margin-left: 10px;
            color: #A9AFB5;
            font-size: 14px;
            vertical-align: middle;
          }
        }
        .operationBtn {
          color: #0097FF;
        }
      }
      .content:hover {
        background: #F5F7FA;
      }
    }
  }
  .cursor {
    cursor: pointer;
  }
  .ml12 {
    margin-left: 12px;
  }
  .mr12 {
    margin-right: 12px;
  }
</style>
