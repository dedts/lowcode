<template>
  <div>
    <el-select v-model="memberList" :disabled="disabled" :placeholder="placeholder" :multiple="!!multiple" filterable clearable @change="memberChange">
      <el-option
        v-for="item in dataList"
        v-show="showUser(item)"
        :key="item.userId"
        :label="item.name"
        :value="item.userId">
        <div v-if="isHoverDetail">
          <el-tooltip
            :visible-arrow="false"
            class="item"
            effect="light"
            placement="right-start"
            popper-class="tooltip"
          >
            <div slot="content">
              <div>
                <div style="display: flex;justify-content: space-between">
                  <div class="mr10">
                    <div>{{ item.name }}</div>
                    <div v-if="item.departmentDto" class="mt10">{{ item.departmentDto.departmentName }}</div>
                    <div class="mt10">{{ item.mobile }}</div>
                    <div class="mt10">{{ item.email }}</div>
                  </div>
                  <img v-if="item.headPortrait" :src="item.headPortrait" alt="" style="width: 40px;height: 40px;border-radius: 50%;">
                </div>
              </div>
            </div>
            <div>{{ item.name }}{{ item.isCompanyCreate?'(创建者)':item.isAdmin?'(管理员)':'' }}</div>
          </el-tooltip>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { searchMemberByDepartment } from '@/api/workflow'
export default {
  props: {
    value: {
      type: Array | String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isHoverDetail: { // 悬停显示详情
      type: Boolean,
      default: false
    },
    multiple: {
      type: Number | String,
      default: 0
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    hasFilterByPower: { // 是否过滤出有应用权限的人
      type: Boolean,
      default: false
    },
    memberRange: {
      type: Object,
      default: () => {
        return {
          departmentIds: [],
          userIds: []
        }
      }
    }
  },
  data() {
    return {
      dataList: [],
      memberList: ''
    }
  },
  computed: {
    showUser() {
      return function(item) {
        if (this.hasFilterByPower) {
          return item.currentAppUser
        } else {
          return true
        }
      }
    }
  },
  mounted() {
    if (this.multiple) {
      // 多选
      this.memberList = this.value || []
    } else {
      // 单选
      if (this.value) {
        if (typeof this.value === 'string') {
          this.memberList = this.value
        } else {
          this.memberList = (this.value.length && this.value[0]) || ''
        }
      } else {
        this.memberList = ''
      }
    }
    this.getUser()
  },
  methods: {
    getUser() {
      const params = {
        ...this.memberRange
      }
      searchMemberByDepartment(params).then(res => {
        this.dataList = res.body
      })
    },
    memberChange(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/  .el-select{width: 100%}
</style>
