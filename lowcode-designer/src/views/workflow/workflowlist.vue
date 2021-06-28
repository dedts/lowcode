<template>
  <div class="workflowlist-container">
    <!-- nav -->
    <el-header class="navHeader"><nav-main type-page="workflow" @publish="publish"/></el-header>
    <div class="mainBox">
      <el-row>
        <el-col :span="6">
          <el-button :class="{active: flag}" class="default" plain @click="changeTab(1)">表单工作流</el-button>
          <el-button :class="{active: !flag}" class="default" @click="changeTab(2)">定时任务</el-button>
        </el-col>
        <el-col :span="6" :offset="12" class="tr">
          <el-button v-if="!flag" type="primary" class="bg" @click="toAddTimeTask">+ 添加定时任务</el-button>
        </el-col>
      </el-row>
      <div class="contentBox">
        <transition :duration="300" name="fade" mode="out-in">
          <components :is="workflowType" :key="workflowType" :list-data="workflowListData" @edit="edit" @deleteFlow="init" @changeStatusEnd="changeTab(2)"/>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import NavMain from '@/views/layoutcomponents/NavMain'
import FormWorkFlowList from '@/views/workflow/components/formWorkFlowList'
import TimeTask from '@/views/workflow/components/timeTask'
import { workflowList } from '@/api/workflow'
import mixins from '@/views/mixins/builderMixins'
export default {
  components: {
    NavMain,
    FormWorkFlowList,
    TimeTask
  },
  mixins: [mixins],
  data() {
    return {
      workflowListData: [],
      workflowType: 'FormWorkFlowList',
      flowType: 1,
      flag: true
    }
  },
  mounted() {
    this.changeTab(Number(this.$route.query.flowType) || 1)
  },
  methods: {
    init() {
      const jsonData = {
        flowType: this.flowType
      }
      workflowList(jsonData).then(res => {
        this.workflowListData = res.body
        this.workflowListData.forEach(item => {
          item.flowStatus = !!item.flowStatus

          item.workflowDtoList.forEach(m => {
            m.flowStatus = !!m.flowStatus
            m.executionCycleDesc = this.executionCycle(m.executionCycle)
          })
        })
      })
    },
    executionCycle(key) {
      let desc = ''
      switch (key) {
        case 'daily':
          desc = '每天'
          break
        case 'weekly':
          desc = '每周'
          break
        case 'monthly':
          desc = '每月'
          break
        case 'yearly':
          desc = '每年'
          break
      }
      return desc
    },
    changeTab(type) {
      this.flowType = type
      if (type === 1) {
        this.flag = true
        this.workflowType = 'FormWorkFlowList'
      } else {
        this.flag = false
        this.workflowType = 'TimeTask'
      }
      this.init()
    },
    toAddTimeTask() {
      const appId = this.$route.params.appId
      this.$router.push(`/${appId}/design/workflow/createworkflow`)
    },
    edit(item, m) {
      const params = {
        flowType: this.flowType,
        formName: item.formName,
        workflowName: m.flowName,
        triggerAction: m.triggerAction,
        executionCycle: m.executionCycle,
        flowId: m.flowId,
        formId: item.formId
      }
      localStorage.setItem('params', JSON.stringify(params))
      const appId = this.$route.params.appId
      this.$router.push(`/${appId}/design/workflow/workflowboard?from=${this.flag ? 'form' : 'timing'}`)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.workflowlist-container {
  background: #F0F0F0;
  height: 100vh;
  padding: 24px;
  .mainBox {
    background: #ffffff;
    height: calc(100vh - 48px);
    padding: 24px;
    font-size: 16px;
    .default {
      background: #F8F9FA;
      color: rgba(0, 0, 0, 0.25);
    }
    .active {
      background: #ffffff;
      border: 1px solid #0097FF;
      box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.04);
      color: #0097FF;
    }
    .contentBox {
      margin-top: 32px;
    }
  }
}
  .tr {
    text-align: right;
  }
  .bg {
    background: #409EFF;
  }
.slide-fade-enter-active {
  /*transition: all .3s ease;*/
}
/*.slide-fade-leave-active {*/
  /*transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
/*}*/
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  /*transform: translateX(10px);*/
  /*opacity: 0;*/
}
</style>
