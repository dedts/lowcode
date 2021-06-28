// 操作的保存及关闭
/**
 *用于：
 * 权限操作： 可操作  不可操作  解锁 锁定
 * 通知：发送邮件 发送站内信 发送短信
 * 数据操作： 添加记录 编辑记录 删除记录
 */
import { ruleSaveAction, ruleActionEdit, ruleActionAdd } from '@/api/workflow'
import { filterParameter } from '@/util/index.js'
export const save = {
  data() {
    return {
    }
  },
  methods: {
    // 新增操作
    add(actionParameter) {
      const ruleCondition = JSON.parse(JSON.stringify(this.ruleCondition))
      const option = {
        flowId: JSON.parse(localStorage.getItem('params')).flowId,
        logicalOper: ruleCondition.logicalOper,
        ruleActionDto: {
          executionId: this.executionId,
          actionParameter: actionParameter
        },
        ruleConditionDto: {
          workflowFilterDtoList: filterParameter(ruleCondition.workflowFilterDtoList)
        }
      }
      ruleSaveAction(option).then(res => {
        this.$emit('saveEnd')
      })
    },
    // 编辑操作
    edit(actionParameter) {
      const option = {
        ruleActionId: this.editData.ruleActionId,
        actionParameter: actionParameter
      }
      ruleActionEdit(option).then(res => {
        this.$emit('saveEnd')
      })
    },
    // 新增一条
    addSingle(actionParameter) {
      const option = {
        ruleId: this.singleAddId,
        executionId: this.executionId,
        actionParameter: actionParameter
      }
      ruleActionAdd(option).then(res => {
        this.$emit('saveEnd')
      })
    },
    // 关闭抽屉弹窗
    handleClose() {
      this.$emit('handleClose')
    }
  }
}
