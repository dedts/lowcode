<template>
  <div class="formWorkFlowBox">
    <div class="header">
      <div class="item">工作流名称</div>
      <div class="item">操作数量</div>
      <div class="item">触发条件</div>
      <div class="item">创建时间</div>
      <div class="item">操作</div>
    </div>
    <div v-for="item in listData" :key="item.id" class="itemInfo" >
      <div class="tabTitle">{{ item.formName }}</div>
      <div v-for="m in item.workflowDtoList" :key="m.id" class="content">
        <div class="item">{{ m.flowName }}</div>
        <div class="item">{{ m.countAction }}</div>
        <div class="item">{{ m.triggerActionDesc }}</div>
        <div class="item">{{ m.createTime }}</div>
        <div class="item operationBtn" @click="edit(item, m)">编辑</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FormWorkFlowList',
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
    }
  },
  methods: {
    edit(item, m) {
      this.$emit('edit', item, m)
    }
  }
}
</script>
<style lang="scss" scoped>
.formWorkFlowBox {
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
      }
      .operationBtn {
        color: #0097FF;
        cursor: pointer;
      }
    }
    .content:hover {
      background: #F5F7FA;
    }
  }
}
</style>
