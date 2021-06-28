<template>
  <!-- 操作项列表-->
  <div class="drawerContentBox">
    <div class="title">{{ title }}</div>
    <div class="itemBox">
      <div v-for="item in operationData" v-if="item.executionActive" :key="item.executionId" class="item" @click="drawerSwitch(item.methodName)">
        <div class="iconBox">
          <i :class="['iconfont', item.iconImage]"/>
        </div>
        <div class="textBox">
          <div class="itemTitle">{{ item.executionName }}</div>
          <div class="itemDes">{{ item.showDesc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '请选择'
    },
    operationData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    drawerSwitch(type) {
      if (type === 'selectNoiceType' || type === 'fieldPermissions' || type === 'dataOperation') {
        this.$emit('click', type)
      } else {
        this.$emit('drawerSwitch', type)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .drawerContentBox {
    padding: 0 40px;
    .title {
      color: #232E37;
      font-size: 14px;
    }
    .itemBox {
      display: flex;
      margin-top: 16px;
      flex-wrap: wrap;
      justify-content: space-between;
      flex-direction: row;
      .item {
        display: flex;
        cursor: pointer;
        width: 48%;
        margin-bottom: 40px;
        .iconBox {
          width: 72px;
          height: 72px;
          line-height: 72px;
          text-align: center;
          border: 1px dashed #E8E8E8;
          color: #232E37;
          i {
            font-size: 26px;
          }
        }
        .textBox {
          margin-left: 16px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          .itemTitle {
            margin-top: 11px;
            font-size: 14px;
            font-weight: bold;
            color: #232E37;
          }
          .itemDes {
            font-size: 12px;
            color: #A9AFB5;
            margin-top: 8px;
          }
        }
      }
      .item:hover .iconBox{
        background: #EBF7FF;
        border: 1px solid #0097FF;
      }
      .item:hover .itemTitle{
        color: #0097FF;
      }
      .item:hover .itemDes{
        color: #0097FF;
      }
      .item:nth-child(2) {
        margin-left: 16px;
      }
    }
  }
</style>
