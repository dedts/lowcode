<template>
  <div class="content">
    <template v-if="widget.type === 'blank'">
      <div :style="{width: isTable ? '100%' : widget.options.width}">
        <slot :name="widget.dataKey" :model="dataModels"/>
      </div>
    </template>
    <template v-if="widget.type === 'input'" >
      <el-input
        v-if="widget.options.dataType === 'number' || widget.options.dataType === 'integer' || widget.options.dataType === 'float'"
        v-model.number="dataModel"
        :disabled="!edit || widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :show-password="widget.options.showPassword"
        :style="{width: isTable ? '100%' : widget.options.width}"
        type="number"
      />
      <el-input
        v-else
        :type="widget.options.dataType"
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :maxlength="widget.options.maxlength"
        :placeholder="widget.options.placeholder"
        :show-password="widget.options.showPassword"
        :style="{width: isTable ? '100%' : widget.options.width}"
      />
    </template>

    <template v-if="widget.type === 'textarea'">
      <el-input
        :rows="5"
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :placeholder="widget.options.placeholder"
        :maxlength="widget.options.maxlength"
        :style="{width: isTable ? '100%' : widget.options.width}"
        type="textarea"
        show-word-limit
      />
    </template>

    <template v-if="widget.type === 'number'">
      <el-input-number
        v-model="dataModel"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :step="widget.options.step"
        :controls="widget.options.controls"
        :disabled="!edit || widget.options.disabled"
        :min="widget.options.numericalRange ? widget.options.min : -Infinity"
        :max="widget.options.numericalRange ? widget.options.max : Infinity"
        :precision="widget.options.integer ? 0 : widget.options.float"
        controls-position="right"
        class="numBox"
      />
      <span v-if="widget.options.unit !== ''" class="unit">{{ widget.options.unit }}</span>
    </template>

    <template v-if="widget.type === 'radio'">
      <el-radio-group
        v-if="!widget.options.isSelect"
        v-model="dataModel"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :disabled="!edit || widget.options.disabled"
      >
        <el-radio
          v-for="(item, index) in (widget.options.remote ? remoteOptions : widget.options.options)"
          :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
          :key="index"
        >
          <template v-if="widget.options.remote">{{ item.label }}</template>
          <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
        </el-radio>
      </el-radio-group>
      <el-select
        v-if="widget.options.isSelect"
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: isTable ? '100%' : widget.options.width}"
      >
        <el-option v-for="item in (widget.options.remote ? remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"/>
      </el-select>
    </template>

    <template v-if="widget.type === 'checkbox'">
      <el-checkbox-group
        v-if="!widget.options.isSelect"
        v-model="dataModel"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :disabled="!edit || widget.options.disabled"
      >
        <el-checkbox

          v-for="(item, index) in (widget.options.remote ? remoteOptions : widget.options.options)"
          :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
          :key="index"
        >
          <template v-if="widget.options.remote">{{ item.label }}</template>
          <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
        </el-checkbox>
      </el-checkbox-group>
      <el-select
        v-if="widget.options.isSelect"
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: isTable ? '100%' : widget.options.width}"
        multiple
      >
        <el-option v-for="item in (widget.options.remote ? remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"/>
      </el-select>
    </template>

    <template v-if="widget.type === 'time'">
      <el-time-picker
        v-model="dataModel"
        :is-range="widget.options.isRange"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly"
        :disabled="!edit || widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :arrow-control="widget.options.arrowControl"
        :value-format="widget.options.format"
        :style="{width: isTable ? '100%' : widget.options.width}"
      />
    </template>

    <template v-if="widget.type === 'date'">
      <!--<el-date-picker-->
      <!--v-model="dataModel"-->
      <!--:type="widget.options.type"-->
      <!--:placeholder="widget.options.placeholder"-->
      <!--:start-placeholder="widget.options.startPlaceholder"-->
      <!--:end-placeholder="widget.options.endPlaceholder"-->
      <!--:readonly="widget.options.readonly"-->
      <!--:disabled="!edit || widget.options.disabled"-->
      <!--:editable="widget.options.editable"-->
      <!--:clearable="widget.options.clearable"-->
      <!--:value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"-->
      <!--:format="widget.options.format"-->
      <!--:style="{width: isTable ? '100%' : widget.options.width}"-->
      <!--&gt;-->
      <!--</el-date-picker>-->
      <el-date-picker
        v-if="widget.options.type==='date'"
        v-model="dataModel"
        :format="widget.options.format"
        :disabled="widget.options.disabled"
        :style="{width: isTable ? '100%' : widget.options.width}"
        type="date"
        placeholder="选择日期"
      />
      <el-date-picker
        v-else-if="widget.options.type==='datetime'"
        v-model="dataModel"
        :format="widget.options.format"
        :disabled="widget.options.disabled"
        :style="{width: isTable ? '100%' : widget.options.width}"
        type="datetime"
        placeholder="选择日期时间"
      />
    </template>

    <template v-if="widget.type ==='rate'">
      <el-rate
        v-model="dataModel"
        :max="widget.options.max"
        :disabled="!edit || widget.options.disabled"
        :allow-half="widget.options.allowHalf"
        :show-score="widget.options.showScore"
      />
    </template>

    <template v-if="widget.type === 'color'">
      <el-color-picker
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :show-alpha="widget.options.showAlpha"
      />
    </template>

    <template v-if="widget.type == 'select'">
      <el-select
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :multiple="widget.options.multiple"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{width: isTable ? '100%' : widget.options.width}"
        :filterable="widget.options.filterable"
      >
        <el-option v-for="item in (widget.options.remote ? remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"/>
      </el-select>
    </template>

    <template v-if="widget.type === 'switch'">
      <el-switch
        :value="!!dataModel"
        :disabled="!edit || widget.options.disabled"
        @change="switchChange($event)"
      />
    </template>

    <template v-if="widget.type === 'slider'">
      <el-slider
        v-model="dataModel"
        :min="widget.options.min"
        :max="widget.options.max"
        :disabled="!edit || widget.options.disabled"
        :step="widget.options.step"
        :show-input="widget.options.showInput"
        :range="widget.options.range"
        :style="{width: isTable ? '100%' : widget.options.width}"
      />
    </template>
    <!-- 图片 -->
    <template v-if="widget.type === 'imgupload'">
      <fm-upload
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :multiple="widget.options.multiple"
        :limit="widget.options.limit"
        :file-size="widget.options.fileSize"
        :action="widget.options.action"
      />
    </template>

    <!-- 富文本 -->
    <template v-if="widget.type === 'editor'">
      <el-quill-editor
        v-model="dataModel"
        :placeholder="widget.options.placeholder"
        :options="widget.options.customToolbar"
        :maxlength="widget.options.maxlength"
        :rows="widget.options.rows"
        :disabled="!edit || widget.options.disabled"
        class="fm-editor"
      />
    </template>
    <!-- 富文本 -->
    <!--    <template v-if="widget.type == 'relatedForm'">-->
    <!--        <span v-html="widget"></span>-->
    <!--    </template>-->
    <!-- 自编号 -->
    <template v-if="widget.type === 'autonumber'">
      <div :style="{'width': isTable ? '100%' : widget.options.width}" class="autoNumber">
        <ul>
          <li><span :title="widget.options.autoNumberPrefix" class="autoprefix">{{ widget.options.autoNumberPrefix }}</span></li>
          <li><span :title="widget.options.autoNumberValue" class="autoValue">{{ widget.options.autoNumberValue }}</span></li>
        </ul>
      </div>
    </template>

    <template v-if="widget.type === 'cascader'">
      <!--<el-cascader-->
      <!--v-model="dataModel"-->
      <!--:disabled="!edit || widget.options.disabled"-->
      <!--:clearable="widget.options.clearable"-->
      <!--:placeholder="widget.options.placeholder"-->
      <!--:style="{width: isTable ? '100%' : widget.options.width}"-->
      <!--:options="remoteOptions"-->
      <!--&gt;-->
      <!--</el-cascader>-->
      <province-city-county :type="widget.options.type" v-model="dataModel" :is-default="true" :disabled="widget.options.disabled" :style="{width:widget.options.width}" :key="widget.key" from="generator"/>
    </template>
    <template v-if="widget.type === 'member'">
      <member
        v-model="dataModel"
        :member-range="widget.options.memberRange"
        :style="{width:widget.options.width}"
        :disabled="widget.options.disabled"
        :is-hover-detail="widget.options.isHoverDetail"
        :multiple="widget.options.multiple"
        :placeholder="widget.options.placeholder"
      />
    </template>
    <template v-if="widget.type === 'text'">
      <span>{{ dataModel }}</span>
    </template>

    <template v-if="widget.type === 'html'">
      <span v-html="dataModel"/>
    </template>
    <!--关联表单-->
    <template v-if="widget.type === 'relatedForm'">
      <related-form
        ref="relatedForm"
        v-model="dataModel"
        :related-form-data.sync="relatedFormData"
        :edit="edit"
        :page-template-id="widget.pageTemplateId"
        :option="widget.options"
        :from="operation"
      />
    </template>
    <template v-if="widget.type === 'relatedChoice'">
      <related-choice
        v-model="dataModel"
        :widget="widget"
        :width="widget.options.width"
        :style="{'width': isTable ? '100%' : widget.options.width}"
        :from="operation"/>
    </template>
    <template v-if="widget.type === 'fileupload'">
      <fm-file-upload
        v-model="dataModel"
        :action="widget.options.action"
        :width="isTable ? '100%' : widget.options.width"
        :disabled="!edit || widget.options.disabled"
        :limit="widget.options.limit"
        :size="widget.options.fileSize"
      />
    </template>
  </div>
</template>

<script>
import FmUpload from './Upload'
import FmFormTable from '../FormTable'
import FmFileUpload from './Upload/file'
import ProvinceCityCounty from '../provinceCityCounty/index'
import Member from '../member/index'
import ElQuillEditor from './ElQuillEditor'
import RelatedForm from '../RelatedForm/index'
import RelatedChoice from '@/components/relatedChoice'
export default {
  name: 'GenerateElementItem',
  directives: {
    more: {
      // 指令的定义
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          const CONDITION = this.scrollHeight - Math.ceil(this.scrollTop) <= this.clientHeight
          if (CONDITION) {
            binding.value()
          }
        })
      }
    }
  },
  components: {
    Member,
    FmUpload,
    FmFormTable,
    FmFileUpload,
    ProvinceCityCounty,
    ElQuillEditor,
    RelatedForm,
    RelatedChoice
  },
  props: ['widget', 'value', 'models', 'remote', 'isTable', 'blanks', 'disabled', 'edit', 'remoteOption', 'rules', 'operation'],
  data() {
    return {
      initAreaOption: { // 初始化省市区
        country: '',
        province: '',
        city: '',
        county: ''
      },
      dataModel: this.value,
      dataModels: { ...this.models },
      remoteOptions: [],
      provinceKey: 0,
      relatedFormFields: [],
      relatedFormData: [],
      relatedChoicePageNow: 1,
      relatedChoiceData: [],
      templateDataId: '',
      relatedChoiceDataTotal: 10000,
      switchOptions: [
        {
          'label': '开',
          'value': 1
        },
        {
          'label': '关',
          'value': 0
        }
      ]
    }
  },
  watch: {
    value(val) {
      this.dataModel = val
    },
    dataModel(val) {
      this.$emit('input', val)
      // if (this.widget.type === 'cascader') {
      //   // this.provinceKey++
      // }
    },
    'remoteOption': {
      deep: 'true',
      handler: function(val) {
        if (Object.keys(this.remoteOption).indexOf(this.widget.options.remoteOption) >= 0 &&
          this.widget.options.remote &&
          this.widget.options.remoteType === 'option'
        ) {
          this.loadOptions(this.remoteOption[this.widget.options.remoteOption])
        }
      }
    }
  },
  created() {
    this.remoteOptions = []
    if (this.widget.options.remote &&
      (Object.keys(this.widget.options).indexOf('remoteType') >= 0 ? this.widget.options.remoteType == 'func' : true) &&
      this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc]((data) => {
        this.loadOptions(data)
      })
    }

    if (this.widget.options.remote &&
      this.widget.options.remoteType === 'option' &&
      this.remoteOption[this.widget.options.remoteOption]) {
      this.loadOptions(this.remoteOption[this.widget.options.remoteOption])
    }

    if (this.widget.type === 'imgupload' && this.widget.options.isQiniu) {
      this.remote[this.widget.options.tokenFunc]((data) => {
        this.widget.options.token = data
      })
    }
  },
  methods: {
    switchChange(e) {
      this.dataModel = e ? 1 : 0
    },
    loadOptions(data) {
      this.remoteOptions = data.map(item => {
        if (this.widget.options.props.children && this.widget.options.props.children.length && Object.keys(item).includes(this.widget.options.props.children)) {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: this.processRemoteProps(item[this.widget.options.props.children], this.widget.options.props)
          }
        } else {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label]
          }
        }
      })
    },
    processRemoteProps(children, props) {
      if (children && children.length) {
        return children.map(item => {
          if (this.processRemoteProps(item[props.children], props).length) {
            return {
              value: item[props.value],
              label: item[props.label],
              children: this.processRemoteProps(item[props.children], props)
            }
          } else {
            return {
              value: item[props.value],
              label: item[props.label]
            }
          }
        })
      } else {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.unit {
  display: inline-block;
  vertical-align: middle;
  height: 32px;
  background: #F4F4F5;
  border: 1px solid #E4E7ED;
  text-align: center;
  color: #909399;
}
  .numBox {
    vertical-align: middle;
  }
  .autoNumber       {  height:34px; border:1px solid #E4E7ED; border-radius:2px; background: #F4F4F5; }
  .autoNumber ul li { float:left; width:50%; }
  .autoNumber span  { padding:0 5px; border-right:1px solid #E4E7ED; height:34px; font-size:12px; line-height:34px; display:block; overflow:hidden; }
  .autoprefix       { color:#909399; }
  .autoValue        { color:#333333; }

.el-table td, el-table th{
  text-align: center !important;
}
</style>
