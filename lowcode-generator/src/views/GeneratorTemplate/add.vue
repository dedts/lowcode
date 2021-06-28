<template>
  <div>
    <div v-loading="loading" v-if="loadingState" :class="[from==='choice'?'add-container':'app-container']">
      <generate-form
        :key="key"
        :data="jsonData"
        :value="editData"
        :from="from"
        :add-template-data-id="addTemplateDataId"
        operation="add"
        @updateKey="updateKey"
        @submit="submit"
      />
    </div>
    <div v-else class="noData">
      暂无数据
    </div>
  </div>
</template>
<script>
import GenerateForm from '@/components/form/GenerateForm'
import { formFieldList } from '@/api/builder'
import { BIO } from '@/util/bio'

export default {
  name: 'AddData',
  components: { GenerateForm },
  props: {
    from: { // choice 关联选项
      type: String,
      default: ''
    },
    addTemplateDataId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dateData: '',
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
      loading: false,
      loadingState: true,
      templateDataId: '',
      editData: {},
      dynamicData: {},
      key: 0
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
      // if (this.from === 'choice') {
      //   this.templateDataId = this.addTemplateDataId
      // } else {
      //   this.templateDataId = this.$route.params.id
      // }
      this.templateDataId = this.addTemplateDataId || this.$route.params.id
      formFieldList(this.templateDataId).then(res => {
        this.loadingState = res.body.length
        this.loading = false
        // 处理数据结构为 区段[组件]
        this.dealComsData(res.body)
        this.jsonData.list.forEach(item => {
          item.model = item.dataKey
          if (item.type !== 'paging' && item.columns && item.columns.list.length > 0) {
            item.columns.list.forEach(itemList => {
              itemList.model = itemList.dataKey
            })
          }
        })
        this.key = window.location.href
      })
      // 工作流数据回显
      if (this.$route.query.from === 'workflow') {
        const appId = this.$route.params.appId
        this.editData = JSON.parse(localStorage.getItem(BIO.s62to10(appId)))
      }
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
    updateKey() {
      this.key += '1'
    },
    submit() {
      this.$emit('submit')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container { padding:20px; margin:24px; background:#ffffff; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1); border-radius: 2px; }
  .add-container{ margin:24px;}
  .noData {
    height: 100vh;
    display: flex;
    justify-content: center;
    margin-top: 15vh;
  }

  .loading {
    height: 100vh;
    display: flex;
    justify-content: center;
  }
</style>
