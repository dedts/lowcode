<template>
  <!--
    1.目标字段：除了（自编号，区段，分页，关联表单，关联选项，HTML）字段，其他字段都可以作为目标字段
    2.图片文件只有当前字段（匹配），选择文件或图片，不校验fileValues
    3.目标字段切换的时候，字段类型默认变成自定义
    4.条件
    if(匹配字段)
    {
      if(图片和文件)
      {
        不校验
      }
      else
      {
        其他组件校验
      }
    }
    else if(自定义)
    {
      if(条件为空，不为空)
      {
        不校验
        默认显示自定义且禁用
      }
      else if (除（为空，不为空）其他条件)
      {
        校验
        if(数字组件的校验)
        {
          if(数字组件且条件为介于)
          {
            校验，原表单字段为最大值数字框和最小值数字框
          }
          else
          {
            校验，原表单字段只有一个数字框
          }
        }
        else if(除数字组件外其他组件的校验)
        {
          if(日期组件且介于)
          {
            原表单字段为日期范围选择组件
          }
          else if(日期组件其他条件)
          {
            原表单字段为日期选择组件
          }
        }
      }
    }
  -->
  <div v-loading="loading" class="filterConditionWrap">
    <div v-for="(sectionItem, sectionIndex) in formData.workflowFilterDtoList" :key="sectionIndex" class="filterOr">
      <!-- 或 -->
      <span v-if="sectionIndex !== 0 && sectionItem.conditionDtoList.length > 0" class="conditionsOr">或</span>
      <el-row v-for="(rowItem, rowIndex) in sectionItem.conditionDtoList" :key="rowIndex" :gutter="10" class="filterRow">
        <!-- 目标字段 -->
        <el-col class="w120">
          <el-form-item :prop="'workflowFilterDtoList.' + sectionIndex + '.conditionDtoList.'+ rowIndex +'.fieldId'" :rules="[{ required:true, message:'请选择字段', trigger:['change','blur'] }]">
            <el-select v-model="rowItem.fieldId" placeholder="选择字段" @visible-change="fieldOptionShow(rowIndex, sectionItem.conditionDtoList)" @change="targetFieldsSelect(rowItem, sectionIndex, rowIndex)">
              <template v-if="targetFieldsList[0]&&!targetFieldsList[0].options.length&&targetFieldsList[1].options.length">
                <el-option
                  v-for="c in targetFieldsList[1].options"
                  v-show="c.isShowTip"
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
        </el-col>
        <!-- 选择条件 -->
        <el-col class="w120">
          <el-form-item :prop="'workflowFilterDtoList.' + sectionIndex + '.conditionDtoList.'+ rowIndex +'.comparisonOper'" :rules="[{ required:true, message:'选择条件', trigger:['change','blur'] }]">
            <el-select v-model="rowItem.comparisonOper" placeholder="选择条件" @change="comparisonOperSelect(rowItem, sectionIndex, rowIndex)">
              <el-option
                v-for="item in rowItem.comparisonOpersArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 值类型 -->
        <el-col class="w120">
          <el-select v-model="rowItem.valuesType" :disabled="fieldTypeDisable(rowItem) || comparisonOperDisable(rowItem) || from==='currentForm' || flowType===2 " placeholder="值类型" @change="valuesTypeSelect(rowItem)">
            <el-option :value="0" label="自定义"/>
            <el-option :value="1" label="当前字段"/>
          </el-select>
        </el-col>
        <!-- 当前表单字段 自定义 || 当前表单字段 -->
        <el-col style="width:220px;">
          <!-- * 匹配字段 - 当前表单字段 -->
          <template v-if="rowItem.valuesType === 1" >
            <el-form-item v-if="!fieldTypeDisable(rowItem)" :prop="'workflowFilterDtoList.' + sectionIndex + '.conditionDtoList.'+ rowIndex +'.fieldValues'" :rules="[{ required:true, message:'请选择当前表单字段', trigger:['change','blur'] }]">
              <el-select v-model="rowItem.fieldValues" :disabled="comparisonOperDisable(rowItem)" placeholder="选择字段">
                <template v-if="rowItem.currentFieldsList[0]&&rowItem.currentFieldsList[0].options.length&& !rowItem.currentFieldsList[1].options.length">
                  <el-option
                    v-for="c in rowItem.currentFieldsList[0].options"
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
                <template v-else-if="rowItem.currentFieldsList[0]&&rowItem.currentFieldsList[1].options.length&& !rowItem.currentFieldsList[0].options.length">
                  <el-option
                    v-for="c in rowItem.currentFieldsList[1].options"
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
                    v-for="(group,index) in rowItem.currentFieldsList"
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
            </el-form-item>
            <el-form-item v-else>
              <el-select v-model="rowItem.fieldValues" :disabled="true" placeholder="选择字段">
                <template v-if="rowItem.currentFieldsList[0]&&rowItem.currentFieldsList[0].options.length&& !rowItem.currentFieldsList[1].options.length">
                  <el-option
                    v-for="c in rowItem.currentFieldsList[0].options"
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
                <template v-else-if="rowItem.currentFieldsList[0]&&rowItem.currentFieldsList[1].options.length&& !rowItem.currentFieldsList[0].options.length">
                  <el-option
                    v-for="c in rowItem.currentFieldsList[1].options"
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
                    v-for="(group,index) in rowItem.currentFieldsList"
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
            </el-form-item>
          </template>
          <!-- * 自定义 -->
          <template v-if="rowItem.valuesType === 0">
            <!-- ** 为空，不为空 - 禁止操作且不校验 -->
            <el-form-item v-if="comparisonOperDisable(rowItem)" >
              <!-- 单选，复选 -->
              <div v-if="rowItem.fieldType === 'radio' || rowItem.fieldType === 'checkbox'">
                <el-select v-model="rowItem.fieldValues" :disabled="true" :multiple="rowItem.fieldType === 'checkbox'" collapse-tags placeholder="值类型">
                  <el-option v-for="itemOptions in rowItem.options &&rowItem.options.options" :key="itemOptions.id" :label="itemOptions.value" :value="itemOptions.value"/>
                </el-select>
              </div>
              <!-- 数字 -->
              <div v-else-if="rowItem.fieldType === 'number'">
                <el-input-number v-model="rowItem.fieldValues" :disabled="true" :controls="false" style="width:100%;"/>
              </div>
              <!-- 日期 -->
              <div v-else-if="rowItem.fieldType === 'date'">
                <el-date-picker
                  v-model="rowItem.fieldValues"
                  :disabled="true"
                  :type="rowItem.options&&rowItem.options.type || 'date'"
                  :value-format="rowItem.options && rowItem.options.format || 'yyyy-MM-dd HH:mm:ss'"
                  :format="rowItem.options && rowItem.options.format || 'yyyy-MM-dd HH:mm:ss'"
                  clearable
                  placeholder="选择日期"
                  style="width:100%;"
                />
              </div>
              <!-- 地理位置 -->
              <div v-else-if="rowItem.fieldType === 'cascader'">
                <province-city-county :type="rowItem.options.type" :disabled="true" v-model="rowItem.fieldValues" :is-default="true" from="workflow" />
              </div>
              <!-- 成员 -->
              <div v-else-if="rowItem.fieldType === 'member'">
                <member v-model="rowItem.fieldValues" :disabled="true" :multiple="rowItem.options&&rowItem.options.multiple" :member-range="rowItem.options&&rowItem.options.memberRange"/>
              </div>
              <!-- 文本框 -->
              <div v-else>
                <el-input v-model="rowItem.fieldValues" :disabled="true" placeholder="输入值"/>
              </div>
            </el-form-item>
            <!-- ** 其他条件（除了为空，不为空） - 校验 -->
            <template v-else>
              <!-- *** 其他条件 - 不是数字组件 -->
              <el-form-item v-if="rowItem.fieldType !== 'number'&&rowItem.fieldType !== 'autonumber'" :prop="'workflowFilterDtoList.' + sectionIndex + '.conditionDtoList.'+ rowIndex +'.fieldValues'" :rules="[{ required:true, message:'当前字段不能为空', trigger:['blur', 'change']}]">

                <!-- 单选，复选 -->
                <div v-if="rowItem.fieldType === 'radio' || rowItem.fieldType === 'checkbox'">
                  <el-select v-model="rowItem.fieldValues" :multiple="rowItem.fieldType === 'checkbox'" collapse-tags placeholder="值类型">
                    <el-option v-for="itemOptions in rowItem.options.options" :key="itemOptions.id" :label="itemOptions.value" :value="itemOptions.value"/>
                  </el-select>
                </div>
                <!-- 开关 -->
                <div v-else-if="rowItem.fieldType === 'switch'">
                  <el-select v-model="rowItem.fieldValues" placeholder="值类型">
                    <el-option :value="0" label="关"/>
                    <el-option :value="1" label="开"/>
                  </el-select>
                </div>
                <!-- 日期 -->
                <div v-else-if="rowItem.fieldType === 'date'">
                  <div v-if="typeof rowItem.fieldValues==='string' || rowItem.fieldValues===null">
                    <el-date-picker
                      v-show="rowItem.comparisonOper !== 'between'"
                      v-model="rowItem.fieldValues"
                      :format="rowItem.options && rowItem.options.format || 'yyyy-MM-dd HH:mm:ss'"
                      type="datetime"
                      clearable
                      value-format="yyyy-MM-dd HH:mm:ss"
                      popper-class="dateSelect"
                      placeholder="选择日期"
                      style="width:100%;"
                    />
                  </div>
                  <div v-if="Array.isArray(rowItem.fieldValues) || rowItem.fieldValues===null">
                    <el-date-picker
                      v-show="rowItem.comparisonOper === 'between'"
                      v-model="rowItem.fieldValues"
                      :default-time="['00:00:00', '23:59:59']"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="daterange"
                      popper-class="dateSelect"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width:100%;"
                    />
                  </div>
                </div>
                <!-- 地理位置 -->
                <div v-else-if="rowItem.fieldType === 'cascader'">
                  <province-city-county :type="rowItem.options.type" v-model="rowItem.fieldValues" :is-default="true" from="workflow" />
                </div>
                <!-- 成员 -->
                <div v-else-if="rowItem.fieldType === 'member'">
                  <member v-model="rowItem.fieldValues" :multiple="rowItem.options && rowItem.options.multiple" :member-range="rowItem.options&&rowItem.options.memberRange"/>
                </div>
                <!--关联选项-->
                <div v-else-if="rowItem.fieldType === 'relatedChoice'">
                  <related-choice v-model="rowItem.fieldValues" :widget="rowItem" from="filterCondition"/>
                </div>
                <!-- 文本框 -->
                <div v-else>
                  <el-input v-model="rowItem.fieldValues" placeholder="输入值"/>
                </div>
              </el-form-item>
              <!-- *** 其他条件 - 数字组件 自编号 -->
              <div v-else>
                <el-row v-if="rowItem.comparisonOper === 'between'" :gutter="10">
                  <el-col :span="12">
                    <el-form-item :prop="'workflowFilterDtoList.' + sectionIndex + '.conditionDtoList.'+ rowIndex +'.fieldValuesMin'" :rules="[{ required:true, message:'请输入', trigger:['blur', 'change'] }]">
                      <el-input-number v-model="rowItem.fieldValuesMin" :max="rowItem.fieldValuesMax" :controls="false" placeholder="最小值" style="width:100%;" @change="fieldValuesChange(rowItem)"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :prop="'workflowFilterDtoList.' + sectionIndex + '.conditionDtoList.'+ rowIndex +'.fieldValuesMax'" :rules="[{ required:true, message:'请输入', trigger:['blur', 'change'] }]">
                      <el-input-number v-model="rowItem.fieldValuesMax" :min="rowItem.fieldValuesMin" :controls="false" placeholder="最大值" style="width:100%;" @change="fieldValuesChange(rowItem)"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div v-else>
                  <el-form-item :prop="'workflowFilterDtoList.' + sectionIndex + '.conditionDtoList.'+ rowIndex +'.fieldValues'" :rules="[{ required:true, message:'当前字段不能为空', trigger:['blur', 'change']}]">
                    <el-input-number v-model="rowItem.fieldValues" :controls="false" style="width:100%;"/>
                  </el-form-item>
                </div>
              </div>
            </template>
          </template>
        </el-col>
        <!-- 删除 -->
        <el-col style="width: 60px; text-align:center;">
          <span class="el-icon-plus" @click="addRow(sectionIndex)"/>
          <span v-show="!(formData.workflowFilterDtoList.length <= 1 && sectionItem.conditionDtoList.length <= 1)" class="iconfont iconri-delete-bin--line" @click="deleteRow(sectionIndex, rowIndex)"/>
        </el-col>
      </el-row>
    </div>
    <!-- 添加一组 -->

    <div style="margin-right: 60px;">
      <el-button style="width: 100%;height: 36px;" plain @click="addGroup">添加一组</el-button>

    </div>
  </div>
</template>
<script>
import ProvinceCityCounty from '@/components/provinceCityCounty/index'
import Member from '@/components/member/index'
import RelatedChoice from '@/components/relatedChoice/index'
import { getMatchFields } from '@/api/workflow'
import { showFieldTypeDesc } from '../../util'
export default {
  components: {
    ProvinceCityCounty,
    Member,
    RelatedChoice
  },
  props: {
    // 目标表单所有字段
    targetFieldsList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表单数据
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 判断是否是当前表单
    isCurrentInfo: {
      type: Boolean,
      default: false
    },
    // 来源
    from: {
      type: String,
      default: ''
    },
    targetFormPageId: {
      type: String,
      default: ''
    },
    currentFormPageId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 过滤器数据
      // workflowFilterDtoList: [{
      //   connectionEnum: null,
      //   conditionDtoList: [
      //     {
      //       fieldId: '', // dateKey
      //       fieldType: '', // 控件类型
      //       linkName: '',
      //       connectionEnum: null, // 链接方式
      //       comparisonOper: '', // 运算符
      //       valuesType: 0, // 匹配值类型(0:自定义，1:匹配字段)
      //       fieldValues: ['3'],  // 当前字段
      //       comparisonOpersArr: [], // 选择条件下拉数据
      //       currentFieldsList: JSON.parse(JSON.stringify(this.currentFieldsList)) // 当前表单字段数组
      //     }
      //   ]
      // }],
      targetFieldsListArr: [],
      currentFieldsListArr: [],
      isDelete: true,
      flowType: 0,
      targetOption: [],
      loading: true
    }
  },
  computed: {
    // 为空，不为空校验
    comparisonOperDisable() {
      return function(rowItem) {
        let flag = false
        switch (rowItem.comparisonOper) {
          case 'is_empty':
            flag = true
            break
          case 'is_not_empty':
            flag = true
            break
        }
        return flag
      }
    },
    // 图片，文件校验
    fieldTypeDisable() {
      return function(rowItem) {
        let flag = false
        switch (rowItem.fieldType) {
          case 'imgupload':
            flag = true
            break
          case 'fileupload':
            flag = true
            break
        }
        return flag
      }
    }
  },
  mounted() {
    if (this.$route.query.from) {
      switch (this.$route.query.from) {
        case 'timing':
          this.flowType = 2
          break
        case 'form':
          this.flowType = 1
          break
        default:
          this.flowType = 0
          break
      }
    }
    if (this.targetFieldsList.length) {
      this.targetFieldsListArr = [...this.targetFieldsList[0].options, ...this.targetFieldsList[1].options]
    }
    // console.log(this.targetFormPageId);
    // debugger
    this.init()
  },
  methods: {
    // 初始化
    init() {
      // console.log(111,this.formData.workflowFilterDtoList)
      if (!this.formData.workflowFilterDtoList.length) {
        // debugger
        // console.log(this.targetFieldsList)
        this.addGroup()
        this.loading = false
      } else {
        // debugger
        // 编辑
        this.showEdit()
      }
    },
    showEdit() {
      const matchFields = []
      const valuesTypeArr = []
      console.log(this.targetFieldsList)
      this.formData.workflowFilterDtoList.forEach((item, index) => {
        item.conditionDtoList.forEach((cItem, i) => {
          const currentTargetFieldsItem = this.targetFieldsListArr.filter(f => f.dataKey === cItem.fieldId)[0]
          if (currentTargetFieldsItem) {
            cItem.comparisonOpersArr = currentTargetFieldsItem.comparisonOpersArr
            this.$set(cItem, 'options', currentTargetFieldsItem.options)
            if (cItem.valuesType === 1) {
              const option = {
                templateDataId: this.currentFormPageId,
                sourceTemplateDataId: this.targetFormPageId,
                // fieldType: currentTargetFieldsItem.type,
                // selectType: currentTargetFieldsItem.selectType,
                matchType: 1,
                dataKey: currentTargetFieldsItem.dataKey
              }
              matchFields.push(getMatchFields(option))
              valuesTypeArr.push(cItem)
            }
          }
        })
      })
      Promise.all(matchFields).then(res => {
        res.forEach((r, i) => {
          const currentFieldsList = [
            {
              label: '',
              options: r.body.filter(f => !f.sysAdd)
            },
            {
              label: '',
              options: r.body.filter(f => f.sysAdd)
            }
          ]
          valuesTypeArr[i].currentFieldsList = currentFieldsList
        })
        // console.log(this.formData.workflowFilterDtoList)
        this.loading = false
      })
    },
    // 添加一行
    addRow(sectionIndex) {
      if (this.targetFieldsListArr.length - 1 <= this.formData.workflowFilterDtoList[sectionIndex].conditionDtoList.length) {
        this.$message.error('最多可添加' + this.targetFieldsListArr.length + '行')
        return
      }
      this.formData.workflowFilterDtoList[sectionIndex].conditionDtoList.push({
        fieldId: '', // dateKey
        fieldType: '', // 控件类型
        linkName: '',
        connectionEnum: '&&',
        comparisonOper: '',
        valuesType: 0,
        fieldValues: null,
        comparisonOpersArr: [],
        currentFieldsList: [],
        fieldValuesMin: undefined,
        fieldValuesMax: undefined
      })
    },
    // 数字，介于，自定义值处理
    fieldValuesChange(rowItem) {
      if (!rowItem.fieldValues) {
        rowItem.fieldValues = []
        this.$set(rowItem.fieldValues, 0, rowItem.fieldValuesMin)
        this.$set(rowItem.fieldValues, 1, rowItem.fieldValuesMax)
      }
      if (rowItem.fieldValuesMin || rowItem.fieldValuesMin === 0) {
        rowItem.fieldValues[0] = rowItem.fieldValuesMin
      }
      if (rowItem.fieldValuesMax || rowItem.fieldValuesMax === 0) {
        rowItem.fieldValues[1] = rowItem.fieldValuesMax
      }
    },
    // 添加一组
    addGroup() {
      this.formData.workflowFilterDtoList.push(
        {
          connectionEnum: '||',
          conditionDtoList: [{
            fieldId: '', // dateKey
            fieldType: '', // 控件类型
            linkName: '',
            connectionEnum: null,
            comparisonOper: '',
            valuesType: 0,
            fieldValues: null,
            comparisonOpersArr: [],
            currentFieldsList: [

            ],
            fieldValuesMin: undefined,
            fieldValuesMax: undefined
          }]
        }
      )
    },
    // 删除
    deleteRow(sectionIndex, rowIndex) {
      this.formData.workflowFilterDtoList[sectionIndex].conditionDtoList.splice(rowIndex, 1)
      if (this.formData.workflowFilterDtoList[sectionIndex].conditionDtoList.length <= 0) {
        this.formData.workflowFilterDtoList.splice(sectionIndex, 1)
      }
    },
    // todo -- 目标字段，当前字段下拉过滤；筛选过滤器不可选择的字段：区段/分页、HTML、关联表单、自编号 --
    // 目标字段显示下拉 - 筛选过滤器不可选择的字段
    fieldOptionShow(index, conditionDtoList) {
      this.targetFieldsList.forEach(item => {
        item.options.map(m => m.isShowTip = true)
      })
      conditionDtoList.forEach(item => {
        this.targetFieldsList.forEach(f => {
          f.options.forEach(o => {
            if (item.fieldId === o.dataKey) {
              o.isShowTip = false
            }
          })
        })
      })
      this.targetFieldsList.forEach(item => {
        item.options.forEach(o => {
          if (o.dataKey === conditionDtoList[index].fieldId) {
            o.isShowTip = true
          }
        })
      })
    },
    // 目标字段Change - 目标字段匹配当前表单字段
    async targetFieldsSelect(rowItem, sectionIndex, rowIndex) {
      // console.log(rowItem)
      // debugger
      this.targetFieldsListArr = [...this.targetFieldsList[0].options, ...this.targetFieldsList[1].options]
      const currentTargetFieldsItem = this.targetFieldsListArr.filter(f => f.dataKey === rowItem.fieldId)[0]
      // debugger
      rowItem.comparisonOpersArr = currentTargetFieldsItem.comparisonOpersArr
      this.$set(rowItem, 'options', currentTargetFieldsItem.options)

      rowItem.fieldType = currentTargetFieldsItem.type
      rowItem.linkName = currentTargetFieldsItem.linkName
      // 清空选择的值
      rowItem.fieldValues = null
      rowItem.comparisonOper = ''
      // 目标字段切换的时候，除了（文件，图片组件）组件匹配类型默认为自定义
      rowItem.valuesType = 0
      // 选择图片，附件，切换到匹配字段并且不可编辑状态
      if (rowItem.fieldType === 'imgupload' || rowItem.fieldType === 'fileupload') {
        rowItem.valuesType = 1
        this.$emit('clearValidate', { sectionIndex, rowIndex })
      }
      // console.log(this.targetOption)

      // console.log('currentTargetFieldsItem=>', currentTargetFieldsItem)
      // console.log('rowItem=>', rowItem)

      // 选择的字段对象
      if (rowItem.valuesType === 1) {
      //   // 匹配字段
        await this.getCurrentMatchFields(rowItem, currentTargetFieldsItem)
      }
    },
    async getCurrentMatchFields(rowItem, currentTargetFieldsItem) {
      const option = {
        templateDataId: this.currentFormPageId,
        sourceTemplateDataId: this.targetFormPageId,
        dataKey: currentTargetFieldsItem.dataKey,
        matchType: 1
      }
      const res = await getMatchFields(option)
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
      rowItem.currentFieldsList = currentFieldsList
    },
    // 选择条件
    comparisonOperSelect(rowItem, sectionIndex, rowIndex) {
      // 为空或者不为空 匹配类型切换到自定义和对应的输入框，并且清空值
      if ((rowItem.comparisonOper === 'is_empty' || rowItem.comparisonOper === 'is_not_empty')) {
        this.$emit('clearValidate', { sectionIndex, rowIndex })
        if (this.fieldTypeDisable(rowItem)) {
          rowItem.valuesType = 1
          rowItem.fieldValues = null
        } else {
          rowItem.valuesType = 0
          rowItem.fieldValues = null
        }
      }
      if (rowItem.fieldType === 'date') {
        rowItem.fieldValues = null
      }
    },
    // 匹配自定义Change - 当前字段或自定义改变的时候重新将目标字段和当前字段进行匹配
    async valuesTypeSelect(rowItem) {
      const currentTargetFieldsItem = this.targetFieldsListArr.filter(f => f.dataKey === rowItem.fieldId)[0]
      // 清空选择的值
      rowItem.fieldValues = null
      if (!currentTargetFieldsItem) {
        return
      }
      // 选择的字段对象
      if (rowItem.valuesType === 1) {
        // 匹配字段
        await this.getCurrentMatchFields(rowItem, currentTargetFieldsItem)
      }
    },
    showFieldType: showFieldTypeDesc
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-select { width:100%!important; }
/deep/ .el-input__inner { width:100%!important; }
/deep/ .el-input-number.is-without-controls .el-input__inner { padding:0 10px; }
/deep/ .el-range-editor--mini.el-input__inner { height:32px; }
.w150{width: 150px;}
.w120{width: 120px;}
.conditionsOr  { margin-bottom:10px; display:block; }
.btnAddRow   { margin-bottom:10px; width:80px; height:32px; text-align:center; cursor:pointer; line-height:32px; font-size:12px; display:block; border:1px solid #0097FF; color:#0097FF; }
.iconri-delete-bin--line { margin:8px 0 0; cursor:pointer; color:#A9AFB5; }
.el-icon-plus { margin:8px 10px 0 0; color:#999; cursor:pointer; }
/deep/ .el-input input {
  height: 32px !important;
}

</style>
