<template>
  <div>
    <a-form-item
      v-if="widget.type != 'divider' && display[widget.model]"
      :label="widget.name"
      :prop="widget.model"
      :class="{
        [widget.options.customClass]: widget.options.customClass?true: false
      }"
    >
      <span>
        <template v-if="widget.type == 'blank'">
          <div :style="{width: isTable ? '100%' : widget.options.width}">
            <slot :name="widget.model" :model="dataModels"/>
          </div>

        </template>

        <template v-if="widget.type == 'input'" >
          <a-input
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
            :type="widget.options.dataType"
            :disabled="!edit || widget.options.disabled"
            :placeholder="widget.options.placeholder"
            :show-password="widget.options.showPassword"
            :style="{width: isTable ? '100%' : widget.options.width}"
          />
          <a-input
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            v-else
            :type="widget.options.dataType"
            :disabled="!edit || widget.options.disabled"
            :placeholder="widget.options.placeholder"
            :show-password="widget.options.showPassword"
            :style="{width: isTable ? '100%' : widget.options.width}"
          />
        </template>

        <template v-if="widget.type == 'textarea'">

          <a-textarea
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            :disabled="!edit || widget.options.disabled"
            :placeholder="widget.options.placeholder"
            :style="{width: isTable ? '100%' : widget.options.width}"
          />
        </template>

        <template v-if="widget.type == 'number'">

          <a-input-number
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            :style="{width: isTable ? '100%' : widget.options.width}"
            :step="widget.options.step"
            :disabled="!edit || widget.options.disabled"
            :min="widget.options.min"
            :max="widget.options.max"
            controls-position="right"
          />
        </template>

        <template v-if="widget.type == 'radio'">
          <a-radio-group
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            :style="{width: isTable ? '100%' : widget.options.width}"
            :disabled="!edit || widget.options.disabled"
          >
            <a-radio
              v-for="(item, index) in (widget.options.remote ? remoteOptions : widget.options.options)"
              :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
              :value="item.value"
              :key="index"
              style="line-height: 30px;"
            >
              <template v-if="widget.options.remote">{{ item.label }}</template>
              <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
            </a-radio>
          </a-radio-group>
        </template>

        <template v-if="widget.type == 'checkbox'">
          <a-checkbox-group
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            :style="{width: isTable ? '100%' : widget.options.width}"
            :disabled="!edit || widget.options.disabled"
          >
            <a-checkbox
              v-for="(item, index) in (widget.options.remote ? remoteOptions : widget.options.options)"
              :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
              :value="item.value"
              :key="index"
              style="line-height: 30px;"
            >
              <template v-if="widget.options.remote">{{ item.label }}</template>
              <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
            </a-checkbox>
          </a-checkbox-group>
        </template>

        <template v-if="widget.type == 'time'">
          <a-time-picker
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
              }
            ]"
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
            :format="widget.options.format"
            :style="{width: isTable ? '100%' : widget.options.width}"
          />
        </template>

        <template v-if="widget.type=='date'">
          <a-date-picker
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
              }
            ]"
            :type="widget.options.type"
            :mode="widget.options.type"
            :placeholder="widget.options.placeholder"
            :start-placeholder="widget.options.startPlaceholder"
            :end-placeholder="widget.options.endPlaceholder"
            :readonly="widget.options.readonly"
            :disabled="!edit || widget.options.disabled"
            :editable="widget.options.editable"
            :clearable="widget.options.clearable"
            :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
            :format="widget.options.format"
            :style="{width: isTable ? '100%' : widget.options.width}"
          />
        </template>

        <template v-if="widget.type =='rate'">
          <a-rate
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            :count="widget.options.max"
            :disabled="!edit || widget.options.disabled"
            :allow-half="widget.options.allowHalf"
            :show-score="widget.options.showScore"
          />
        </template>

        <template v-if="widget.type == 'color'">
          <div :style="{width: isTable ? '100%' : widget.options.width, color: '#999'}">
            Not currently supported.
          </div>
        </template>

        <template v-if="widget.type == 'select'">
          <a-select
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            :disabled="!edit || widget.options.disabled"
            :mode="widget.options.multiple ? 'multiple' : 'default'"
            :allow-clear="widget.options.clearable"
            :placeholder="widget.options.placeholder"
            :style="{width: isTable ? '100%' : widget.options.width}"
            :show-search="widget.options.filterable"
          >
            <a-select-option v-for="item in (widget.options.remote ? remoteOptions : widget.options.options)" :key="item.value" :value="item.value" >
              {{ widget.options.showLabel || widget.options.remote?item.label:item.value }}
            </a-select-option>
          </a-select>
        </template>

        <template v-if="widget.type=='switch'">
          <a-switch
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            :default-checked="dataModel"
            :disabled="!edit || widget.options.disabled"
          />
        </template>

        <template v-if="widget.type=='slider'">
          <a-slider
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            :min="widget.options.min"
            :max="widget.options.max"
            :disabled="!edit || widget.options.disabled"
            :step="widget.options.step"
            :show-input="widget.options.showInput"
            :range="widget.options.range"
            :style="{width: isTable ? '100%' : widget.options.width}"
          />
        </template>

        <template v-if="widget.type=='imgupload'">
          <div :style="{width: isTable ? '100%' : widget.options.width, color: '#999'}">
            Not currently supported.
          </div>
        </template>

        <template v-if="widget.type == 'editor'">
          <vue-editor
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            :style="{width: isTable ? '100%' : widget.options.width, cursor: (!edit || widget.options.disabled) ? 'no-drop' : '', backgroundColor: (!edit || widget.options.disabled) ? '#F5F7FA' : ''}"
            :editor-toolbar="widget.options.customToolbar"
            :disabled="!edit || widget.options.disabled"
            class="fm-editor"
          />
        </template>

        <template v-if="widget.type == 'cascader'">
          <a-cascader
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
            :disabled="!edit || widget.options.disabled"
            :allow-clear="widget.options.clearable"
            :placeholder="widget.options.placeholder"
            :style="{width: isTable ? '100%' : widget.options.width}"
            :options="remoteOptions"
          />
        </template>

        <template v-if="widget.type == 'text'">
          <span
            v-decorator="[
              widget.model,
              {
                rules: rules[widget.model],
                initialValue: dataModel
              }
            ]"
          >{{ dataModel }}</span>
        </template>

        <template v-if="widget.type == 'html'">
          <span v-html="dataModel"/>
        </template>

        <template v-if="widget.type == 'table'">
          <div :style="{width: isTable ? '100%' : widget.options.width, color: '#999'}">
            Not currently supported.
          </div>
        </template>

        <template v-if="widget.type == 'fileupload'">

          <div :style="{width: isTable ? '100%' : widget.options.width, color: '#999'}">
            Not currently supported.
          </div>
        </template>
      </span>
    </a-form-item>

    <a-divider
      v-if="widget.type == 'divider' && display[widget.model]"
      :orientation="widget.options.contentPosition"
    >
      {{ widget.name }}
    </a-divider>
  </div>

</template>

<script>
import GenerateElementItem from './GenerateElementItem'

export default {
  components: {
    GenerateElementItem
  },
  props: ['widget', 'models', 'rules', 'remote', 'blanks', 'display', 'edit', 'remoteOption'],
  data() {
    return {

      dataModel: this.models[this.widget.model],
      dataModels: this.models,
      remoteOptions: [],
      isTable: false
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val
        })
        this.$emit('input-change', val, this.widget.model)
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model]
        this.dataModels = val
      }
    },
    'remoteOption': {
      deep: 'true',
      handler: function(val) {
        if (Object.keys(this.remoteOption).indexOf(this.widget.options.remoteOption) >= 0 &&
          this.widget.options.remote &&
          this.widget.options.remoteType == 'option'
        ) {
          this.loadOptions(this.remoteOption[this.widget.options.remoteOption])
        }
      }
    }
  },
  created() {
    this.remoteOptions = []
  },
  methods: {
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
