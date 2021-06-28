<template>
  <div class="workFlowBoardBox">
    <div class="header">
      <div class="returnBtn">
        <i class="el-icon-arrow-left mr16 cur-p" @click="back"/><span>{{ params.workflowName }}</span>
      </div>
      <el-button type="primary" class="saveBtn" @click="back(1)">保存</el-button>
    </div>
    <div class="contentBox">
      <span v-if="params.flowType === 1" class="introduce">
        <span>以下操作需要在表单活动中触发&nbsp;&nbsp;</span>
        <span class="blue">{{ params.formName }}&nbsp;&nbsp;</span>
        <span>,&nbsp;当一条记录被&nbsp;&nbsp;</span>
        <span class="blue">{{ getTriggerActionDesc(params.triggerAction) }}</span>
      </span>
      <span v-if="params.flowType === 2" class="introduce">添加需要在&nbsp;<span class="blue" >{{ executionCycle }} {{ params.triggerAction }}</span>&nbsp;执行的操作 <i class="iconfont iconri-edit-line" style="cursor: pointer;" @click="openAndShow('editWorkFlowInfo')"/></span>
      <div class="timelineBox">
        <ul class="cardBox">
          <draggable
            v-model="flowOpData"
          >
            <li
              v-for="item in flowOpData"
              :key="item.ruleId"
              :class="{noCondition: item.logicalOper === 'always', hasCondition: item.logicalOper === 'condition'}"
              class="cardItem" >
              <div class="cardHeader" style="display: flex;justify-content: space-between">
                <div style="overflow: hidden;line-height: 50px;height: 100%;" class="textEllipsis">
                  <i class="icon iconfont iconmove"/>
                  <span v-if="item.logicalOper==='always'|| item.logicalOper==='default'">{{ item.logicalOperDesc }}</span>
                  <el-tooltip :content="item.ruleConditionDto && item.ruleConditionDto.conditionDesc" class="item" effect="dark" placement="top-start">
                    <span v-if="item.logicalOper==='condition'">{{ item.ruleConditionDto.conditionDesc }}</span>
                  </el-tooltip>
                </div>
                <div v-if="flowType===1" class="mr16">
                  <i v-if="item.logicalOper==='always'" class="iconfont iconadd-line addIcon" @click="conditionChange(item,'add')"/>
                  <i v-if="item.logicalOper==='condition'" class="iconfont iconri-edit-line addIcon ml8" @click="conditionChange(item,'edit')"/>
                  <i v-if="item.logicalOper==='condition'" class="iconfont iconri-delete-bin--line addIcon ml8" @click="deleteCondition(item)"/>
                </div>
              </div>
              <div class="cardContent">
                <draggable
                  v-model="item.ruleActionDtoList"
                  :options="{group: item.logicalOper === 'default' ? 'subItem' : 'subItem-1', animation:150}"
                >
                  <div
                    v-for="m in item.ruleActionDtoList"
                    :key="m.ruleActionId"
                    class="cardContentItem"
                  >
                    <i class="icon iconfont iconmove" style="line-height: 38px;"/>
                    <span class="mainContent" @click="editWorkFlow(getJumpType(m.executionId), m)">
                      <div class="greyFont">{{ m.actionName }}</div>
                      <div class="blueFont">{{ m.showActionDesc }}</div>
                      <span class="editAndDelete">
                        <i class="icon iconfont iconri-edit-line"/>
                        <i v-show="item.logicalOper !=='default'" class="icon iconfont iconri-delete-bin--line ml8" @click.stop="deleteAction(m.ruleActionId)"/>
                      </span>
                    </span>
                    <i v-show="item.logicalOper !=='default'" class="icon iconfont iconadd-line addIcon" @click="addWorkFlow(m)"/>
                  </div>
                </draggable>
              </div>
            </li>
          </draggable>
        </ul>
        <div class="addNewOperation" @click="editWorkFlow('addTimingTask')">添加新的操作</div>
      </div>
    </div>
    <el-drawer
      :with-header="false"
      :visible.sync="drawer"
      :wrapper-closable="false"
      size="750px"
      title="添加操作"
      direction="rtl"
      append-to-body
    >
      <!-- *** 添加操作 *** -->
      <div v-if="drawerType === 'addTimingTask'">
        <div class="drawerHeader">添加操作<i class="el-icon-close rightIcon" @click="handleClose"/></div>
        <!-- 有无条件 - 过滤器 -->
        <div style="overflow-y: auto;height:calc(100vh - 150px);">
          <div v-if="!singleAddId&&flowType === 1" style="padding:0 40px;">
            <el-form ref="formData" :model="formData" label-position="left">
              <div style="display: flex">
                <el-form-item label="设置条件" label-width="100px" prop="logicalOper">
                  <el-radio-group v-model="formData.logicalOper">
                    <el-radio label="always">无条件</el-radio>
                    <el-radio label="condition">配置条件</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="filterBox">
                <filter-condition v-if="formData.logicalOper==='condition'" :form-data="formData" :target-form-page-id="currentPage.currentFormPageId" :current-form-page-id="currentPage.currentFormPageId" :is-current-info="true" :target-fields-list="currentFieldsList" from="currentForm" @clearValidate="clearValidate"/>
              </div>
            </el-form>
          </div>
          <!-- 操作类型: 通知，字段权限， 数据操作-->
          <operation-list :operation-data="executionList" title="操作类型:" class="mt15" @click="jumpToOperation"/>
        </div>

      </div>

      <!-- *** 数据操作 *** -->
      <div v-if="drawerType==='dataOperation'">
        <div class="notificationBox">
          <div class="backOperation" @click="drawerSwitch('addTimingTask')">
            <i class="el-icon-arrow-left"/>&nbsp;返回
          </div>
          <div class="title">数据操作</div>
          <i class="el-icon-close rightIcon rightCloseBtn" @click="handleClose" />
        </div>
        <operation-list :operation-data="getOperationData('dataOperation')" title="选择动作:" @drawerSwitch="drawerSwitch"/>
      </div>
      <!-- 数据操作 - 操作记录 -->
      <div v-if="isRecord ">
        <record v-if="isRecord" :single-add-id.sync="singleAddId" :edit-data="editData" :execution-id="getExecutionId(drawerType)" :type="drawerType" :flow-type="flowType" :rule-condition="formData" @drawerSwitch="drawerSwitch" @handleClose="handleClose" @saveEnd="saveEnd"/>
      </div>

      <!-- *** 字段权限 *** -->
      <div v-if="drawerType==='fieldPermissions'">
        <div class="notificationBox">
          <div class="backOperation" @click="drawerSwitch('addTimingTask')">
            <i class="el-icon-arrow-left"/>&nbsp;返回
          </div>
          <div class="title">权限操作</div>
          <i class="el-icon-close rightIcon rightCloseBtn" @click="handleClose"/>
        </div>
        <operation-list :operation-data="getOperationData('fieldPermissions')" title="字段动作:" @drawerSwitch="drawerSwitch"/>
      </div>
      <!-- 字段权限 - 操作不可操作 -->
      <div v-if="drawerType === 'disable'|| drawerType === 'actionable'">
        <field-operation v-if="drawerType === 'disable'|| drawerType === 'actionable'" :execution-id="getExecutionId(drawerType)" :single-add-id.sync="singleAddId" :flow-type="flowType" :edit-data="editData" :type="drawerType" :rule-condition="formData" @drawerSwitch="drawerSwitch" @handleClose="handleClose" @saveEnd="saveEnd"/>
      </div>
      <!-- 字段权限 - 锁定解锁 -->
      <div v-if="drawerType === 'lockData'|| drawerType === 'unlockData'">
        <lock-and-unlock v-if="drawerType === 'lockData'|| drawerType === 'unlockData'" :execution-id="getExecutionId(drawerType)" :single-add-id.sync="singleAddId" :flow-type="flowType" :edit-data="editData" :type="drawerType" :rule-condition="formData" @drawerSwitch="drawerSwitch" @handleClose="handleClose" @saveEnd="saveEnd"/>
      </div>

      <!-- *** 消息提示 *** -->
      <div v-if="drawerType === 'showSuccess'" class="operatorBox">
        <div class="drawerHeader">消息提示<i class="el-icon-close rightIcon" @click="handleClose"/></div>
        <div class="tipBox">
          <div class="tipTitle">提示内容</div>
          <input v-model="editData.actionParameter.showMessage" class="tipInput" type="text" placeholder="请输入">
        </div>
        <div class="footerBtn">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="saveShowSuccess">保存</el-button>
        </div>
      </div>

      <!-- *** 完成后跳转 *** -->
      <div v-if="drawerType === 'redirectUrl'">
        <redirect-url :edit-data="editData" :execution-id="getExecutionId('redirectUrl')" @handleClose="handleClose" @saveEnd="saveEnd"/>
      </div>
      <!-- *** 条件的 新增 编辑 *** -->
      <div v-if="drawerType === 'editCondition'">
        <div class="drawerHeader">{{ conditionType==='edit'?'编辑':'新增' }}条件<i class="el-icon-close rightIcon" @click="handleClose"/></div>
        <div style="padding-left: 40px;">
          <el-form ref="formData" :model="formData" label-position="left">
            <filter-condition :form-data="formData" :is-current-info="true" :target-fields-list="currentFieldsList" :target-form-page-id="currentPage.currentFormPageId" :current-form-page-id="currentPage.currentFormPageId" from="currentForm"/>
          </el-form>
          <div class="footerBtn">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="saveCondition">保存</el-button>
          </div>
        </div>
      </div>
      <!-- *** 通知类型 *** -->
      <div v-if="drawerType === 'selectNoiceType'">
        <div class="notificationBox">
          <div class="backOperation" @click="drawerSwitch('addTimingTask')">
            <i class="el-icon-arrow-left"/>&nbsp;返回
          </div>
          <div class="title">选择通知类型</div>
          <i class="el-icon-close rightIcon rightCloseBtn" @click="handleClose" />
        </div>
        <operation-list :operation-data="getOperationData('selectNoiceType')" title="选择操作:" @drawerSwitch="drawerSwitch"/>
      </div>
      <!-- 通知 - 发送邮件 --->
      <div v-if="drawerType === 'sendEmail'">
        <send-email-form v-if="drawerType === 'sendEmail'" :execution-id="getExecutionId('sendEmail')" :single-add-id.sync="singleAddId" :rule-condition="formData" :edit-data="editData" @drawerSwitch="drawerSwitch" @handleClose="handleClose" @saveEnd="saveEnd"/>
      </div>
      <!-- 通知 - 发送手机短信 --->
      <div v-if="drawerType === 'sendMessage'">
        <send-phone-message v-if="drawerType === 'sendMessage'" :execution-id="getExecutionId('sendMessage')" :rule-condition="formData" :single-add-id.sync="singleAddId" :edit-data="editData" @drawerSwitch="drawerSwitch" @saveEnd="saveEnd" @handleClose="handleClose"/>
      </div>
      <!-- 通知 - 发送站内信 --->
      <div v-if="drawerType === 'sendInternalMessage'">
        <send-mail v-if="drawerType === 'sendInternalMessage'" :execution-id="getExecutionId('sendInternalMessage')" :rule-condition="formData" :single-add-id.sync="singleAddId" :edit-data="editData" @drawerSwitch="drawerSwitch" @saveEnd="saveEnd" @handleClose="handleClose"/>
      </div>

      <!-- *** 编辑工作流 *** --->
      <div v-if="drawerType === 'editWorkFlowInfo'">
        <edit-work-flow-info v-if="drawerType='editWorkFlowInfo'" @handleClose="handleClose" @saveEnd="saveEnd"/>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import SendEmailForm from '@/views/workflow/components/sendEmailForm'
import SendPhoneMessage from '@/views/workflow/components/sendPhoneMessage'
import editWorkFlowInfo from '@/views/workflow/components/editWorkFlowInfo'
import SendMail from '@/views/workflow/components/sendMail'
import record from '@/views/workflow/components/record'
import operationList from '@/views/workflow/components/operationList'
import redirectUrl from '@/views/workflow/components/redirectUrl'
import fieldOperation from '@/views/workflow/components/fieldOperation'
import lockAndUnlock from '@/views/workflow/components/lockAndUnlock'
import { getCompanyId } from '../../util/auth'
import { getAllMenu, formPageGetFields, formFieldList } from '@/api/builder'
import filterCondition from '@/components/filterCondition'
import { ruleList, ruleActionEdit, ruleConditionSave, ruleConditionUpdate, ruleConditionDelete, ruleActionDelete, userSearchList, searchDepartments, executionList } from '@/api/workflow'
import { getComparisonOpers, showFilterCondition, filterParameter } from '@/util/index'
export default {
  name: 'WorkFlowBoard',
  components: {
    SendEmailForm,
    SendPhoneMessage,
    SendMail,
    lockAndUnlock,
    editWorkFlowInfo,
    record,
    fieldOperation,
    operationList,
    filterCondition,
    redirectUrl,
    Draggable
  },
  props: {
    from: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      departmentList: [],
      executionList: [], // 操作列表
      inputList: [], // 下单列表
      menuList: [],
      editData: {}, // 当前编辑的操作项
      flowOpData: [],
      params: {},
      drawer: false,
      flowType: JSON.parse(localStorage.getItem('params')).flowType, // 1 表单工作流 2 定时
      // 抽屉触发类型，决定抽屉显示内容
      // 1: 定时工作流添加操作 addTimingTask 2: 消息提示 showSuccess 3: 完成后跳转 redirectUrl 4 新增 编辑条件 editCondition
      // 5: 选择通知类型 selectNoiceType 6: 发送邮件 sendEmail  7: 发送手机短信 sendMessage 8: 发送站内信 sendInternalMessage 9：editWorkFlowInfo 编辑工作流 10: 字段权限 fieldPermissions 11: 数据操作 dataOperation 12: 添加记录 addData 13: 更新记录 updateData 14:删除记录 deleteData 15：锁定记录 lockData 16:字段权限 可操作 actionable 17 不可操作 disable
      drawerType: 'addTimingTask',
      singleAddId: '',
      // todo------------------- 条件设置
      formData: {
        workflowFilterDtoList: [],
        logicalOper: 'always'
      },
      currentPage: {
        currentPageId: JSON.parse(localStorage.getItem('params')).formId, // 当前表单的页面id
        currentListPageId: '',
        currentFormPageId: ''
      },
      currentFieldsList: [],
      // TODO-----------------  新增编辑条件
      conditionType: '', // 操作类型
      conditionInfo: {}
    }
  },
  computed: {
    isRecord() {
      if (this.drawerType === 'addData' || this.drawerType === 'updateData' || this.drawerType === 'deleteData') {
        return true
      } else {
        return false
      }
    },
    executionCycle() {
      let desc = ''
      switch (this.params.executionCycle) {
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
    }
  },
  async mounted() {
    this.params = JSON.parse(localStorage.getItem('params'))
    await this.getExecutionList()
    await this.getAllMenuList()
    if (this.flowType === 1) {
      await this.getCurrentInfo()
    }
    await this.init()
  },
  methods: {
    init() {
      const jsonData = {
        flowId: this.params.flowId
      }
      ruleList(jsonData).then(async res => {
        this.departmentList = await this.getDepartment()
        this.flowOpData = res.body
        this.flowOpData.forEach(item => {
          item.ruleActionDtoList.forEach(async m => {
            this.$set(m, 'showActionDesc', await this.showActionDes(m))
          })
        })
      })
    },

    // 获取所有表单
    async getAllMenuList() {
      const res = await getAllMenu()
      this.menuList = res.body
      this.inputList = res.body.filter(f => f.pageType === 0)
      // console.log(this.flowType)
      if (this.flowType === 1) {
        const arr = res.body.filter(f => f.parentTemplateDataId === this.currentPage.currentPageId)
        this.currentPage.currentFormPageId = arr.filter(f => f.pageType === 1)[0].templateDataId
        this.currentPage.currentListPageId = arr.filter(f => f.pageType === 2)[0].templateDataId
      }
    },
    async getCurrentInfo() {
      const res = await formPageGetFields({ templateDataId: this.currentPage.currentPageId })
      const resp = await formFieldList(this.currentPage.currentFormPageId)
      const formList = resp.body.filter(f => !f.sysAdd && f.type !== 'grid')
      let currentFieldsList = res.body
      if (!currentFieldsList.length) {
        this.$message.error('表单无字段可选')
        return
      }

      currentFieldsList = currentFieldsList.filter(f => f.type !== 'grid' && f.type !== 'relatedForm' && f.type !== 'html')
      currentFieldsList.forEach(item => {
        this.$set(item, 'isShowTip', true)
        item.comparisonOpersArr = item.comparisonOpers.split(',') // 下拉框条件
        item.comparisonOpersArr.forEach((m, i) => {
          item.comparisonOpersArr[i] = {
            label: getComparisonOpers(m),
            value: m
          }
        })
        formList.forEach(f => {
          if (item.dataKey === f.dataKey) {
            this.$set(item, 'options', f.options)
          }
        })
      })
      this.currentFieldsList = [
        {
          label: '',
          fieldsType: 'fields',
          options: currentFieldsList.filter(f => !f.sysAdd)
        },
        {
          label: '',
          fieldsType: 'sys',
          options: currentFieldsList.filter(f => f.sysAdd)
        }
      ]
    },
    // 获取操作类型
    async  getExecutionList() {
      const res = await executionList()
      this.executionList = res.body
    },
    getOperationData(val) {
      const arr = this.executionList.filter(f => f.methodName === val)[0].executionDtoList
      return arr
    },
    // 获取操作id
    getExecutionId(val) {
      const arr = this.executionList.map(m => m.executionDtoList).flat()
      return arr.filter(f => f.methodName === val)[0].executionId
    },
    getTriggerActionDesc(type) {
      let typeDesc = ''
      switch (type) {
        case 'insert':
          typeDesc = '创建'
          break
        case 'update':
          typeDesc = '编辑'
          break
        case 'delete':
          typeDesc = '删除'
          break
      }
      return typeDesc
    },
    // 返回
    back(isBackFlag) {
      if (this.from === 'builder') {
        if (isBackFlag === 1) {
          this.$emit('update:showFlag', false)
        } else {
          this.$message.warning('请点击保存回到自定义操作项')
        }
      } else {
        const appId = this.$route.params.appId
        this.$router.push({
          path: `/${appId}/design/workflow/workflowlist`,
          query: {
            flowType: this.params.flowType
          }
        })
      }
    },
    // 根据executionId来判断编辑的类型是邮件还是短信还是站内信
    getJumpType(exId) {
      const executionIds = []
      this.executionList.forEach(item => {
        executionIds.push(item)
        item.executionDtoList.forEach(f => {
          executionIds.push(f)
        })
      })
      const type = executionIds.filter(f => f.executionId === exId)[0]
      if (type) {
        return type.methodName
      } else {
        return 'addTimingTask'
      }
    },
    // 添加一条数据
    addWorkFlow(m) {
      this.openDrawer()
      this.drawerSwitch('addTimingTask')
      this.singleAddId = m.ruleId
    },
    // 编辑工作流
    editWorkFlow(type, m) {
      if (m) {
        this.editData = JSON.parse(JSON.stringify(m))
        this.editData.actionParameter = JSON.parse(this.editData.actionParameter)
      }
      if (type === 'addTimingTask') {
        localStorage.removeItem('formData')
        this.formData.workflowFilterDtoList = []
        this.formData.logicalOper = 'always'
        this.drawerType = type
      } else {
        this.drawerSwitch(type)
      }
      this.openDrawer()
    },
    // 操作项显示内容
    async showActionDes(m) {
      let text = ''
      let actionParameter = null
      if (m.actionParameter) {
        actionParameter = JSON.parse(m.actionParameter)
      }
      switch (this.getJumpType(m.executionId)) {
        case 'addTimingTask':
          break
        case 'showSuccess':
          text = JSON.parse(m.actionParameter).showMessage || ''
          break
        case 'redirectUrl':
          const jump = JSON.parse(m.actionParameter)
          if (jump.isJump === 0) {
            text = '不跳转'
          } else {
            // 先获取一级菜单的templateDataId
            // jump.location 添加页或列表页的templateDataId
            const parentId = this.menuList.filter(f => f.templateDataId === jump.location)[0].parentTemplateDataId
            // 通过一级菜单的templateDataId  获取 一级菜单的名称
            const parentName = this.menuList.filter(f => f.templateDataId === parentId)[0].pageTemplateName
            if (jump.jumpType === 'report') {
              text = parentName + ' 列表页'
            } else {
              text = parentName + ' 添加页'
            }
          }
          break
        case 'sendEmail':
          const receiver = actionParameter.receiver.split(',')
          text = await this.showData(receiver, actionParameter.base, 'sendEmail')
          break
        case 'sendMessage':
          const phoneTo = actionParameter.phoneTo.split(',')
          text = await this.showData(phoneTo, actionParameter.base, 'sendMessage')
          break
        case 'sendInternalMessage':
          const target = actionParameter.target.split(',')
          text = await this.showData(target, actionParameter.base, 'sendInternalMessage')
          break
        case 'addData':
        case 'updateData':
        case 'lockData':
        case 'unlockData':
        case 'deleteData':
        case 'disable':
        case 'actionable':
          const dataFromPage = this.menuList.filter(f => f.templateDataId === actionParameter.templateDataId)[0].dataFromPage
          const arr = this.menuList.filter(f => f.dataFromPage === dataFromPage)
          text = arr.filter(f => f.pageType === 0)[0].pageTemplateName
          break
      }
      return text
    },
    // 处理 展示的人和部门等
    async showData(to, base, type) {
      const sysString = [
        { label: '管理员', value: '${adminId}' },
        { label: '创建者', value: '${creator}' },
        { label: '修改者', value: '${lastEditor}' }
      ]
      const emailSys = [
        { label: '管理员用户的邮箱地址', value: '${lowcode.adminEmail}' },
        { label: '登陆用户的邮箱地址', value: '${lowcode.loginEmail}' }
      ]
      // 处理部门
      let text = ''
      if (base === 'department') {
        this.departmentList.forEach(item => {
          to.forEach(t => {
            if (item.id === t) {
              text += item.departmentName + ' '
            }
          })
        })
      } else if (base === 'system') {
        if (type === 'sendEmail') {
          to.forEach(item => {
            text += emailSys.filter(f => f.value === item)[0].label + ' '
          })
        } else {
          to.forEach(item => {
            text += sysString.filter(f => f.value === item)[0].label + ' '
          })
        }
        // to.forEach(item => {
        //   text += item.match(/\${(\S*)}/)[1] + ' '
        // })
      } else if (base === 'user') {
        const resp = await this.getUser(to)
        resp.forEach(item => {
          text += item.name + ' '
        })
      } else if (base === 'zdy') {
        to.forEach(item => {
          text += item + ' '
        })
      }
      return text
    },
    async getUser(userIds) {
      const params = {
        companyId: getCompanyId(),
        page: 1,
        size: 9999,
        allData: true,
        userIds: userIds
      }
      const res = await userSearchList(params)
      const userId = res.body.records || []
      return userId
    },
    // 获取部门列表
    async getDepartment() {
      const res = await searchDepartments({ companyId: getCompanyId() })
      const department = res.body.data || []
      return department
    },
    saveShowSuccess() {
      const jsonData = {
        ruleActionId: this.editData.ruleActionId,
        actionParameter: {}
      }
      jsonData.actionParameter = {
        showMessage: this.editData.actionParameter.showMessage
      }
      jsonData.actionParameter = JSON.stringify(jsonData.actionParameter)
      ruleActionEdit(jsonData).then(res => {
        this.saveEnd()
      })
    },
    // 新增 编辑 条件
    conditionChange(item, type) {
      this.conditionType = type
      this.conditionInfo = item
      if (type === 'edit') {
        const conditionContent = JSON.parse(item.ruleConditionDto.conditionContent)
        this.formData.workflowFilterDtoList = showFilterCondition(conditionContent, this.currentFieldsList, this.currentFieldsList)
      } else {
        this.formData.workflowFilterDtoList = []
      }
      this.openDrawer()
      this.drawerSwitch('editCondition')
    },
    // 保存修改条件
    saveCondition() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.conditionType === 'add') {
            this.addCondition()
          } else {
            this.editCondition()
          }
        }
      })
    },
    // 新增条件
    addCondition() {
      const option = {
        ruleId: this.conditionInfo.ruleId,
        workflowFilterDtoList: filterParameter(this.formData.workflowFilterDtoList)
      }
      ruleConditionSave(option).then(res => {
        this.saveEnd()
      })
    },
    // 编辑条件
    editCondition() {
      const option = {
        workflowFilterDtoList: filterParameter(this.formData.workflowFilterDtoList),
        conditionId: this.conditionInfo.ruleConditionDto.conditionId
      }
      ruleConditionUpdate(option).then(res => {
        this.saveEnd()
      })
    },
    // 删除 条件
    deleteCondition(item) {
      const conditionId = item.ruleConditionDto.conditionId
      ruleConditionDelete(conditionId).then(() => {
        this.saveEnd()
      })
    },
    saveEnd() {
      this.handleClose()
      this.params = JSON.parse(localStorage.getItem('params'))
      this.init()
    },
    // 删除操作项
    deleteAction(ruleActionId) {
      ruleActionDelete(ruleActionId).then(res => {
        this.$message.success('删除成功')
        this.init()
      })
    },
    // 打开抽屉
    openDrawer() {
      this.drawer = true
    },
    // 关闭抽屉
    handleClose() {
      this.singleAddId = ''
      this.drawer = false
      // debugger
      setTimeout(() => {
        this.drawerType = 'addTimingTask'
        this.editData = {}
      }, 1000)
    },
    // 切换抽屉
    drawerSwitch(type) {
      if (type === 'addTimingTask' && localStorage.getItem('formData')) {
        this.formData = JSON.parse(localStorage.getItem('formData'))
      }
      this.drawerType = type
    },
    // 点击添加操作中的 操作类型
    jumpToOperation(type) {
      if (this.singleAddId) {
        this.drawerType = type
        return
      }
      if (this.flowType === 1) {
        this.$refs.formData.validate((valid) => {
          if (valid) {
            localStorage.setItem('formData', JSON.stringify(this.formData))
            this.drawerType = type
          }
        })
      } else {
        this.drawerType = type
      }
    },
    clearValidate(obj) {
      this.$refs.formData.clearValidate('workflowFilterDtoList.' + obj.sectionIndex + '.conditionDtoList.' + obj.rowIndex + '.fieldValues')
    },
    openAndShow(type) {
      this.drawer = true
      this.drawerType = type
    }
  }
}
</script>
<style lang="scss" scoped>
.workFlowBoardBox {
  .header {
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    padding-left: 24px;
    overflow: hidden;
    .returnBtn {
      font-size: 14px;
      float: left;
      color: #000000;
    }
    .saveBtn {
      height: 56px;
      font-size: 14px;
      color: #ffffff;
      float: right;
    }
  }
  .contentBox {
    background: #F0F0F0;
    overflow: hidden;
    /*height: calc(100vh - 56px);*/
    padding: 24px 80px;
    .timelineBox {
      margin-top: 20px;
    }
  }
}
.mr16 {
  margin-right: 16px;
}
.blue {
  color: #0097FF;
}
/deep/ .el-timeline-item__node--primary {
  margin-top: 20px;
}
/deep/ .el-drawer__header {
  height: 80px;
  line-height: 80px;
  padding: 0 12px;
  text-align: center;
  font-size: 20px;
  color: #232E37;
  border-bottom: 1px solid #E8E8E8;
}
/deep/ .el-drawer {
  width: 620px;
}
.drawerHeader {
  position: relative;
  height: 80px;
  line-height: 80px;
  padding: 0 12px;
  text-align: center;
  font-size: 20px;
  color: #232E37;
  margin-bottom: 40px;
  border-bottom: 1px solid #E8E8E8;
  .rightIcon {
    position: absolute;
    right: 25px;
    top: 30px;
    cursor: pointer;
  }
}
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
.tipBox {
  display: flex;
  padding-left: 40px;
  .tipTitle {
    width: 128px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #232E37;
  }
  .tipInput {
    width: 250px;
    height: 40px;
    padding-left: 8px;
    background: #FFFFFF;
    border: 1px solid #E8E8E8;
    border-radius: 2px;
  }
  .tipSelect {
    width: 250px;
    height: 40px;
    padding-left: 8px;
    background: #FFFFFF;
    border-radius: 2px;
  }
}
.operatorBox {
  height: 100%;
  position: relative;
}
.footerBtn {
  display: block;
  width: 100%;
  height: 50px;
  line-height: 50px;
  position: absolute;
  bottom: 0;
  right: 0;
  border-top: 1px solid #E8E8E8;
  padding-right: 12px;
  text-align: right;
}
.notificationBox {
  display: flex;
  position: relative;
  height: 80px;
  line-height: 80px;
  padding: 0 12px;
  color: #232E37;
  margin-bottom: 40px;
  border-bottom: 1px solid #E8E8E8;
  .backOperation {
    width: 25%;
    color: #A9AFB5;
    font-size: 12px;
    cursor: pointer;
  }
  .title {
    width: 50%;
    text-align: center;
    color: #232E37;
    font-size: 20px;
  }
  .rightCloseBtn {
    width: 20%;
    text-align: right;
    font-size: 20px;
    margin-top: 30px;
  }
}
.mt25 {
  margin-top: 25px !important;
}
.cardBox {
  width: 580px;
  position: relative;
  .cardItem {
    position: relative;
    margin-top: 20px;
    .cardHeader {
      background: #F8F9FA;
      height: 54px;
      line-height: 54px;
      padding-left: 9px;
    }
    .cardContent {
      background: #ffffff;
      padding: 32px;
      /*line-height: 38px;*/
      .cardContentItem {
        margin-top: 12px;
        /*height: 38px;*/
        display: flex;
        .mainContent {
          position: relative;
          display: flex;
          flex: 1;
          margin-left: 9px;
          margin-right: 13px;
          padding: 0 8px;
          cursor: pointer;
        }
        i {
          opacity: 0;
        }
      }
      .cardContentItem:first-child {
        margin-top: 0;
      }
      .cardContentItem:hover .mainContent {
        background: #F8F9FA;
      }
      .cardContentItem:hover i {
        opacity: 1;
      }
    }
  }
  .cardItem:first-child {
    margin-top: 0;
  }
}
.cardBox:before {
  display: inline-block;
  content: "";
  border-left: 1px dashed #A9AFB5;
  left: -26px;
  bottom: 0;
  position: absolute;
  top: 36px;
  height: calc(100% - -8px);
}
.cardItem:before {
  left: -35px;
  background: #A9AFB5;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -o-border-radius: 50%;
  -moz-border-radius: 50%;
  -ms-border-radius: 50%;
  content: "";
  height: 18px;
  left: -35px;
  position: absolute;
  top: 18px;
  width: 18px;
  border: 1px solid #A9AFB5;
}
.cardItem.noCondition:before {
  width: 18px;
  height: 18px;
  background: #F0F0F0;
  border-radius: 0;
  content: '';
  transform: scale(0.8) rotate(45deg);
  left: -35px;
  position: absolute;
  top: 18px;
}
.cardItem.hasCondition:before {
  width: 18px;
  height: 18px;
  background: #F0F0F0;
  border: 1px solid #0097FF;
  border-radius: 0;
  content: '';
  transform: scale(0.8) rotate(45deg);
  left: -35px;
  position: absolute;
  top: 18px;
}
.blueFont {
  font-size: 14px;
  color: #0097FF;
  float: left;
  cursor: pointer;
  margin-top: 9px;
  padding-right: 10px;
}
.greyFont {
  min-width:70px;
  font-size: 14px;
  line-height: 38px;
  color: #A9AFB5;
  float: left;
  margin-right: 8px;
}
.addNewOperation {
  position: relative;
  color: #0097FF;
  width: 580px;
  height: 64px;
  line-height: 64px;
  background: #F8F9FA;
  border: 1px dashed #E8E8E8;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  margin-top: 20px;
}
.addNewOperation:before {
  background: #0097FF;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -o-border-radius: 50%;
  -moz-border-radius: 50%;
  -ms-border-radius: 50%;
  color: #ffffff;
  content: "+";
  font-size: 14px;
  font-weight: 500;
  height: 18px;
  left: -35px;
  line-height: 18px;
  position: absolute;
  top: 23px;
  width: 18px;
  border: 1px solid #0097FF;
}
.editAndDelete {
  line-height: 38px;
  position: absolute;
  right: 3px;
}
.ml8 {
  margin-left: 8px;
}
.addIcon {
  font-size: 14px;
  color: #232E37;
  line-height: 38px;
  cursor: pointer;
}
.cur-p {
  cursor: pointer;
}
/deep/ .el-input__inner {
  height: 32px;
}
/deep/.el-date-editor.el-input, .el-date-editor.el-input__inner{width: 140px;}
</style>
