<template>
  <div class="content">
    <el-form-item
      v-if="widget.type != 'divider' && display[widget.dataKey]"
      :prop="widget.dataKey"
      :class="{
        [widget.options.customClass]: widget.options.customClass?true: false,
        'no-label-form-item': widget.options.isLabelWidth && widget.options.labelWidth == 0
      }"
      :label-width="widget.options.isLabelWidth ? widget.options.labelWidth + 'px' : ''"
    >
      <div style="width:100%;">
        <label slot="label" style="width:100%;">
          <el-row v-if="widget.type === 'relatedForm'">
            <el-col :span="12">
              <span>{{ widget.name }}<i v-if="widget.options.required" class="iconStar">*</i>
                <el-tooltip v-if="widget.options.help !== '' && widget.options.help" :content="widget.options.help" class="item" effect="dark" placement="right">
                  <i class="icon iconfont iconquestion-line"/>
                </el-tooltip>
              </span>
            </el-col>
            <el-col :span="12" align="right">
              <el-button v-preventReClick type="text" @click="addNewElementItem">+新建记录</el-button>
            </el-col>
          </el-row>
          <span v-else>{{ widget.name }}<i v-if="widget.options.required" class="iconStar">*</i>
            <el-tooltip v-if="widget.options.help !== '' && widget.options.help" :content="widget.options.help" class="item" effect="dark" placement="right">
              <i class="icon iconfont iconquestion-line"/>
            </el-tooltip>
          </span>
        </label>
        <generate-element-item
          ref="generateElementItem"
          :blanks="blanks"
          :is-table="false"
          :widget="widget"
          v-model="dataModel"
          :models="dataModels"
          :remote="remote"
          :edit="edit"
          :operation="operation"
          :remote-option="remoteOption"
          :key="widget.key"
          :rules="rules"
        >

          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"/>
          </template>
        </generate-element-item>
      </div>
    </el-form-item>

    <el-divider
      v-if="widget.type == 'divider' && display[widget.dataKey]"
      :content-position="widget.options.contentPosition"
    >
      {{ widget.name }}
    </el-divider>
  </div>

</template>

<script>
import GenerateElementItem from './GenerateElementItem'
import { replaceKeyWord } from '@/util/expression'
import { setGenerateFormFieldMapper } from '@/util/expression'
import { formFieldList } from '@/api/builder'
import { searchMemberByDepartment } from '@/api/workflow'
export default {
  components: {
    GenerateElementItem
  },
  props: ['widget', 'models', 'rules', 'remote', 'blanks', 'display', 'edit', 'remoteOption', 'operation'],
  data() {
    return {
      dataModel: this.models[this.widget.dataKey],
      dataModels: this.models
    }
  },
  inject: ['expressionMap', 'setCurItem'],
  computed: {
    curExpressionMap() {
      return this.expressionMap()
    }
  },
  watch: {
    dataModel: {
      deep: true,
      async handler(val) {
        this.models[this.widget.dataKey] = val
        this.setCurItem(this.widget.dataKey)
        if (this.widget.type === 'member' || this.widget.type === 'date' || this.widget.type === 'relatedChoice') {
          if (this.widget.type === 'relatedChoice' && this.operation !== 'preview') {
            const templateId = this.$store.state.user.page.filter(f => f.templateDataId === this.widget.options.formId)[0].dataFromPage
            const res = await formFieldList(templateId)
            const member = await searchMemberByDepartment({ departmentIds: [], userIds: [] })
            const widget = JSON.parse(JSON.stringify(this.widget))
            widget.options.field = widget.options.field.map(h => {
              const header = res.body.filter(f => f.dataKey === h)[0]
              if (header.type === 'member') {
                header.options.memberData = member.body
              }
              return header
            })
            setGenerateFormFieldMapper(this.models, widget)
          } else {
            setGenerateFormFieldMapper(this.models, this.widget)
          }
        } else {
          setGenerateFormFieldMapper(this.models)
        }
        // 通知订阅者更新数据
        this.widget.subs.forEach(item => {
          const curExpressionData = this.curExpressionMap.filter(m => m.dataKey === item)[0].expressionData
          this.models[item] = eval(replaceKeyWord(curExpressionData, item))
        })
        this.$emit('update:models', {
          ...this.models
        })
        this.$emit('input-change', val, this.widget.dataKey, this.widget.type)
      }
    },
    models: {
      deep: true,
      handler(val) {
        const newValue = val[this.widget.dataKey]
        let flag = false
        if (newValue !== undefined) {
          if (this.widget.type === 'date') {
            if (new Date(newValue).getTime() !== new Date(this.dataModel).getTime()) {
              flag = true
            }
          } else {
            if (typeof newValue === 'string' || typeof newValue === 'number') {
              if (newValue !== this.dataModel) {
                flag = true
              }
            } else {
              if (newValue.join() !== this.dataModel.join()) {
                flag = true
              }
            }
          }
        }
        if (flag) {
          this.dataModel = val[this.widget.dataKey]
        }
        this.dataModels = val
      }
    }
  },
  methods: {
    // 新建关联表记录
    addNewElementItem() {
      this.$refs.generateElementItem.$refs.relatedForm.addFromDate()
    }
  }
}
</script>
<style scoped>
  .content  { width:100%; }
  .iconStar { color: #ff0000; }
</style>
