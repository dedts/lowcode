<template>
  <div>
    <div v-loading="loading" v-if="loadingState" class="app-container">
      <generate-form
        :key="key"
        :data="jsonData"
        :value="editData"
        operation="edit"
        @goBackList="goBackList"/>
    </div>
    <div v-else class="noData">
      暂无数据
    </div>
  </div>
</template>
<script>
import GenerateForm from '@/components/form/GenerateForm'
import { formDataDataQuery } from '@/api/list'
import { formFieldList } from '@/api/builder'
export default {
  components: { GenerateForm },
  data() {
    return {
      jsonData: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'top',
          size: 'small',
          customClass: '',
          ui: 'element',
          layout: 'horizontal',
          labelCol: 3
        }
      },
      loadingState: true,
      loading: true,
      editData: {},
      listId: this.$route.params.id,
      appId: this.$route.params.appId,
      templateDataId: '',
      mongoDataId: this.$route.params.dataid,
      dataFromPage: this.$route.params.id,
      dynamicData: {},
      key: '1'
    }
  },
  watch: {
    '$route'(to, from) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      this.listId = this.dataFromPage = this.$route.params.id
      this.appId = this.$route.params.appId
      const templateList = this.$store.state.user.page.filter(item => item.templateDataId === this.listId)[0]
      this.dataFromPage = templateList.dataFromPage
      const templateDetail = this.$store.state.user.page.filter(item => item.parentTemplateDataId === templateList.parentTemplateDataId && item.pageType === 1)[0]
      this.templateDataId = templateDetail.templateDataId
      // 回显数据
      formDataDataQuery({ templateDataId: this.dataFromPage, mongoDataId: this.mongoDataId }).then(res => {
        // console.log('回显示数据 => ', res.body[0])
        this.editData = res.body[0]
        // 获取详情页组件数据
        this.getFormFieldList()
      })
    },
    // 获取详情页组件数据
    getFormFieldList() {
      formFieldList(this.templateDataId).then(res => {
        this.loadingState = res.body.length
        this.loading = false
        this.dealComsData(res.body)
        this.jsonData.list.forEach(item => {
          item.model = item.dataKey
          if (item.type !== 'paging' && item.columns && item.columns.list.length > 0) {
            item.columns.list.forEach(itemList => {
              itemList.model = itemList.dataKey
              // 处理回显的日期数据
              if (itemList.type === 'date') {
                Object.keys(this.editData).forEach(f => {
                  if (f === itemList.dataKey) {
                    this.editData[f] = new Date(this.editData[f]).toJSON()
                  }
                })
              }
              if (itemList.type === 'member' && !itemList.options.multiple) {
                Object.keys(this.editData).forEach(f => {
                  if (f === itemList.dataKey) {
                    this.editData[f] = this.editData[f][0]
                  }
                })
              }
              // 不可操作字段被禁用
              if (this.editData.forbidFields.length > 0) {
                this.editData.forbidFields.forEach(forbidItem => {
                  if (itemList.dataKey === forbidItem) {
                    itemList.options.disabled = true
                  }
                })
              }
            })
          }
          // console.log('详情页组件数据 => ', this.jsonData.list)
        })
        this.key = window.location.href
      })
    },
    // 处理获取到的组件数据
    dealComsData(compsArr) {
      compsArr = compsArr.filter(item => {
        return !item.sysAdd
      })
      const gridArr = compsArr.filter(item => item.type === 'grid')
      gridArr.length && gridArr.forEach(item => {
        item.columns.list = []
        compsArr.forEach(m => {
          m.type !== 'grid' && m.parentDataKey === item.dataKey && (m.isGridChild = true) && (item.columns.list.push(m))
        })
      })
      compsArr = compsArr.filter(item => !item.isGridChild)
      compsArr.forEach(item => {
        item.type === 'grid' && (item.columns.list.sort((a, b) => a.fieldRow - b.fieldRow))
      })
      this.jsonData.list = compsArr.sort((a, b) => a.fieldRow - b.fieldRow)
    },
    // 返回列表
    goBackList() {
      // this.$router.push({ path: '/' + this.appId + '/app/report/' + this.getListPage(this.templateDataId),query:{page:this.paging.page,size:this.paging.size} })
      this.$router.go(-1)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container { padding:20px; margin:24px; background:#ffffff; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1); border-radius: 2px; }
  .noData{height:100vh;display: flex;justify-content: center;margin-top: 15vh;}
  .loading {
    height: 100vh;
    display: flex;
    justify-content: center;
  }
</style>
