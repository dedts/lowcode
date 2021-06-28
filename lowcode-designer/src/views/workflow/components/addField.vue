<template>
  <div v-if="showPage">
    <el-row v-for="(item,index) in form.pageData" :key="index">
      <el-col style="display: flex">
        <el-form-item :prop="'pageData.'+ index +'.key'" :rules="[{required:true,message:'请选择字段',trigger:['change','blur']}]" class="mr10">
          <el-select v-model="item.key" :disabled="item.options && item.options.required&&from==='record'" @visible-change="fieldOptionShow(index)" @change="fieldChange($event,index)">
            <template v-if="targetFieldsList[0]&&!targetFieldsList[0].options.length && targetFieldsList[1].options.length">
              <el-option
                v-for="c in targetFieldsList[1].options"
                v-show="c.isShowTip"
                :disabled="group.fieldsType==='sys' || c.type==='autonumber'"
                :key="c.dataKey"
                :label="c.name"
                :value="c.dataKey"
              >
                <div class="flex-between">
                  <span>{{ c.name }}</span>
                  <span class="inline ml30" style="color: #8492a6; font-size: 12px">{{ showFieldType(c) }}</span>
                </div>
              </el-option>
            </template>
            <template v-else>
              <el-option-group
                v-for="(group,index) in targetFieldsList"
                :key="index"
                :label="group.label">
                <el-option
                  v-for="c in group.options"
                  v-show="c.isShowTip"
                  :disabled="group.fieldsType==='sys'&&c.dataKey!=='parentDataId' || c.type==='autonumber'"
                  :key="c.dataKey"
                  :label="c.name"
                  :value="c.dataKey"
                >
                  <div class="flex-between">
                    <span>{{ c.name }}</span>
                    <span class="inline ml30" style="color: #8492a6; font-size: 12px">{{ showFieldType(c) }}</span>
                  </div>
                </el-option>
              </el-option-group>
            </template>
          </el-select>
        </el-form-item>
        <div class="mr10 lh32 ca9"><i class="iconfont iconarrow-right-s-fill"/></div>
        <el-form-item :prop="'pageData.'+ index +'.valuesType'" :rules="[{required:true,message:'请选择字段',trigger:['change','blur']}]" class="mr10">
          <el-select v-model="item.valuesType" :disabled="flowType===2|| (item.targetType==='imgupload'||item.targetType==='fileupload')" @change="valueTypeChange(item,index)">
            <el-option :value="1" label="匹配字段"/>
            <el-option :value="0" label="自定义"/>
          </el-select>
        </el-form-item>
        <div class="mr10 lh32 ca9"><i class="iconfont iconarrow-right-s-fill"/></div>
        <el-form-item :prop="'pageData.'+ index +'.value'" :rules="[{required:true,message:'当前字段不能为空',trigger:['change','blur']}]" class="mr10">
          <div v-if="item.valuesType===1">
            <!--匹配字段-->
            <el-select v-model="item.value">
              <template v-if="item.currentFieldsList[0]&&item.currentFieldsList[1].options.length&&!item.currentFieldsList[0].options.length">
                <el-option
                  v-for="c in item.currentFieldsList[1].options"
                  :key="c.dataKey"
                  :label="c.name"
                  :value="'${field_'+c.dataKey+'}'"
                >
                  <div class="flex-between">
                    <span>{{ c.name }}</span>
                    <span class="inline ml30" style="color: #8492a6; font-size: 12px">{{ showFieldType(c) }}</span>
                  </div>
                </el-option>
              </template>
              <template v-else-if="item.currentFieldsList[0]&&item.currentFieldsList[0].options.length&&!item.currentFieldsList[1].options.length">
                <el-option
                  v-for="c in item.currentFieldsList[0].options"
                  :key="c.dataKey"
                  :label="c.name"
                  :value="'${field_'+c.dataKey+'}'"
                >
                  <div class="flex-between">
                    <span>{{ c.name }}</span>
                    <span class="inline ml30" style="color: #8492a6; font-size: 12px">{{ showFieldType(c) }}</span>
                  </div>
                </el-option>
              </template>
              <template v-else>
                <el-option-group
                  v-for="(group,index) in item.currentFieldsList"
                  :key="index"
                  :label="group.label">
                  <el-option
                    v-for="c in group.options"
                    :key="c.dataKey"
                    :label="c.name"
                    :value="'${field_'+c.dataKey+'}'"
                  >
                    <div class="flex-between">
                      <span>{{ c.name }}</span>
                      <span class="inline ml30" style="color: #8492a6; font-size: 12px">{{ showFieldType(c) }}</span>
                    </div>
                  </el-option>
                </el-option-group>
              </template>
            </el-select>
          </div>
          <div v-else>
            <div v-if="item.targetType==='number'">
              <el-input-number v-model="item.value" :controls="false"/>
            </div>
            <div v-else-if="item.targetType === 'radio'|| item.targetType === 'checkbox'">
              <el-select v-model="item.value" :multiple="item.targetType==='checkbox'" collapse-tags>
                <el-option
                  v-for="c in item.options.options"
                  :key="c.id"
                  :label="c.value"
                  :value="c.value"
                />
              </el-select>
            </div>
            <div v-else-if="item.targetType === 'switch'">
              <el-select v-model="item.value">
                <el-option :value="true" label="开"/>
                <el-option :value="false" label="关"/>
              </el-select>
            </div>
            <div v-else-if="item.targetType==='date'">
              <el-date-picker
                v-model="item.value"
                :type="item.options.type"
                :format="item.options && item.options.format || 'yyyy-MM-dd HH:mm:ss'"
                placeholder="选择日期"
                clearable
              />
            </div>
            <div v-else-if="item.targetType==='cascader'">
              <province-city-county :type="item.options.format" v-model="item.value" :is-default="true" from="workflow"/>
            </div>
            <div v-else-if="item.targetType==='member'">
              <member v-model="item.value" :member-range="item.options.memberRange" :is-hover-detail="item.options.isHoverDetail" :multiple="item.options.multiple"/>
            </div>
            <!--关联选项-->
            <div v-else-if="item.targetType === 'relatedChoice'">
              <related-choice v-model="item.value" :widget="item" from="addField"/>
            </div>
            <div v-else-if="item.targetType==='imgupload'|| item.targetType==='fileupload'">
              <el-input v-model="item.value" disabled />
            </div>
            <div v-else>
              <el-input v-model="item.value"/>
            </div>

          </div>
        </el-form-item>
        <div class="lh32">
          <span v-if="item.options && item.options.required && from==='record'" class="ca9">(必填)</span>
          <i v-else class="iconfont iconri-delete-bin--line ca9 curpion" @click="deleteRow(index)"/>
        </div>
      </el-col>
    </el-row>
    <el-button type="primary" plain class="mt10" @click="addRow">添加一行</el-button>
  </div>
</template>
<script>
import ProvinceCityCounty from '@/components/provinceCityCounty/index'
import member from '../../../components/member/index'
import RelatedChoice from '../../../components/relatedChoice/index'
import { getMatchFields } from '../../../api/workflow'
import { showFieldTypeDesc } from '../../../util/index'
export default {
  components: {
    ProvinceCityCounty,
    member,
    RelatedChoice
  },
  props: {
    targetFieldsList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isCurrentInfo: { // 是否当前表单
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: '' // redirectUrl 完成后跳转 record:'记录'
    },
    isInit: { // 是否需要初始化
      type: Boolean,
      default: false
    },
    templateDataIds: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      options: [],
      showPage: false,
      flowType: JSON.parse(localStorage.getItem('params')).flowType
    }
  },
  mounted() {
    if (this.isEdit && !this.isInit) {
      // 编辑
      this.form.pageData.forEach((item, index) => {
        this.$set(item, 'currentFieldsList', [])
        this.fieldChange(item.key, index, 'init')
      })
      // console.log(this.targetFieldsList)
    } else {
      // 新增
      this.form.pageData = []
      const targetOptions = [...this.targetFieldsList[0].options, ...this.targetFieldsList[1].options]
      targetOptions.forEach(item => {
        if (item.options && item.options.required) {
          const obj = {
            key: item.dataKey,
            valuesType: 0,
            value: null,
            currentFieldsList: [],
            options: item.options,
            targetType: item.type
          }
          if (item.type === 'imgupload' || item.type === 'fileupload') {
            obj.valuesType = 1
          }
          this.form.pageData.push(obj)
        }
      })
    }
    this.showPage = true
  },
  methods: {
    // 新增一行
    addRow() {
      const length = this.targetFieldsList[0].options.length + this.targetFieldsList[1].options.length
      if (this.form.pageData.length >= length) {
        this.$message.error('最多' + length + '项')
        return
      }
      this.form.pageData.push({
        key: '',
        valuesType: 0,
        value: null,
        currentFieldsList: []
      })
    },
    // 删除一行
    deleteRow(index) {
      this.form.pageData.splice(index, 1)
    },
    // 下拉框出现
    fieldOptionShow(index) {
      this.targetFieldsList.forEach(item => {
        item.options.map(m => m.isShowTip = true)
      })
      this.form.pageData.forEach(item => {
        this.targetFieldsList.forEach(f => {
          f.options.forEach(o => {
            if (item.key === o.dataKey) {
              o.isShowTip = false
            }
          })
        })
      })
      this.targetFieldsList.forEach(item => {
        item.options.forEach(o => {
          if (o.dataKey === this.form.pageData[index].key) {
            o.isShowTip = true
          }
        })
      })
    },
    // 选择字段change
    fieldChange(val, index, type) {
      // type  'init' 初始化  否则 其他
      // 选择的字段对象
      const targetFieldsList = [...this.targetFieldsList[0].options, ...this.targetFieldsList[1].options]
      const key = targetFieldsList.find(f => f.dataKey === val)
      this.$set(this.form.pageData[index], 'targetType', key.type)
      this.$set(this.form.pageData[index], 'options', key.options)
      if ((key.type === 'fileupload' || key.type === 'imgupload') && !type) {
        this.form.pageData[index].valuesType = 1
        this.form.pageData[index].value = null
      }
      if (!type) {
        this.form.pageData[index].value = null
      }

      if (this.form.pageData[index].valuesType === 1) {
        // 匹配字段
        const option = {
          templateDataId: this.templateDataIds.currentFormPageId,
          sourceTemplateDataId: this.templateDataIds.targetFormPageId,
          dataKey: key.dataKey,
          matchType: 2
        }
        getMatchFields(option).then(res => {
          const currentFieldsList = [
            {
              label: '',
              options: res.body.filter(f => !f.sysAdd)
            },
            {
              label: '',
              options: res.body.filter(f => f.sysAdd)
            }
          ]
          this.form.pageData[index].currentFieldsList = currentFieldsList
        })
      }
    },
    // 匹配类型change
    valueTypeChange(item, index) {
      if (item.key && item.valuesType === 1) {
        this.fieldChange(item.key, index)
      }
      item.value = null
    },
    showFieldType:showFieldTypeDesc
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-input__inner{height: 32px !important;width: 175px !important;line-height: 32px;}
/deep/ .el-select{width: 175px !important}
/deep/ .el-input-number{width: 175px !important;}
/deep/ .el-input-number .el-input__inner{text-align: left;}
/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{width: 175px !important;}
  .lh32{line-height: 32px;}
  .ca9{color: #A9AFB5}
</style>
