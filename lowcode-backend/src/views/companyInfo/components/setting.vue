<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="text mb10">
          公司图标
        </div>
        <avater :size="1" :image-url.sync="info.icon" />
        <div class="text mb20 mt20" style="font-size: 14px;">
          图片尺寸需小于1024px X 1024px，且小于1MB
        </div>
        <div class="text mb10">
          公司名称
        </div>
        <el-input v-model="info.name" placeholder="公司名称" style="width:250px;" />
        <div v-if="info.isAdmin" class="mt20 mb30">
          <el-button type="danger" plain @click="deleteDialog=true">
            解散公司
          </el-button>
        </div>
      </el-col>
      <el-col :span="4" align="right">
        <el-button type="primary" @click="updateCompany">
          保存
        </el-button>
      </el-col>
    </el-row>
    <delete-dialog v-if="deleteDialog" :visible.sync="deleteDialog" :is-show-input="true" :input-text.sync="companyName" delete-text="解散公司" title="确认解散公司？" placeholder="输入公司完整名称" content="将彻底删除公司内全部信息，并移除所有关联用户，此操作不可逆。" @confirm="dismiss" />
  </div>
</template>
<script>
import Avater from '../../../components/Upload/avatar'
import { companyDismiss, companyUpdate, companyList } from '../../../api/company'
import { getCompanyId } from '../../../utils/auth'
import deleteDialog from '@/components/deleteDialog'
export default {
  components: { Avater, deleteDialog },
  props: {
    companyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      info: {},
      deleteDialog: false,
      companyName: '',
      activeName: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      companyList({ companyId: this.companyId }).then(res => {
        this.info = res.body.company[0]
        this.activeName = res.body.company[0].name
      })
    },
    // 解散公司
    dismiss() {
      if (this.companyName !== this.activeName) {
        this.$message.error('公司名称不匹配')
        return
      }
      const option = {
        id: getCompanyId()
      }
      companyDismiss(option).then(res => {
        this.$message.success('公司已解散')
        this.deleteDialog = false
        this.$emit('complete')
      })
    },
    updateCompany() {
      if (!this.info.name) {
        this.$message.error('请输入公司名称')
        return
      }
      const option = {
        name: this.info.name,
        icon: this.info.icon,
        id: getCompanyId()
      }
      companyUpdate(option).then(res => {
        this.$message.success('修改成功')
        this.$emit('complete')
      })
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .title{color: rgba(0, 0, 0, 0.85);font-weight: 500;font-size: 16px;line-height: 28px;}
  .text{color:rgba(0, 0, 0, 0.65);font-size: 12px;}
</style>
