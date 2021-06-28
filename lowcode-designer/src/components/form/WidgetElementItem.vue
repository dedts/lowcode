<template>
  <!--编辑区 每个组件-->
  <span>
    <template>
      <!--<el-input-->
      <!--v-model="element.options.defaultValue"-->
      <!--:style="{width: isTable ? '100%' : element.options.width}"-->
      <!--:placeholder="element.options.placeholder"-->
      <!--:disabled="element.options.disabled"-->
      <!--:show-password="element.options.showPassword"-->
      <!--&gt;-->
      <!--</el-input>-->
      <div v-loading="element.loading">
        <!--<div :class="{isShow: element.options.flag}" class="deleteIconBox">-->
        <!--<i class="icon iconfont iconri-delete-bin&#45;&#45;line blue" @click="deleteItem"></i>-->
        <!--</div>-->
        <div :class="{bgBlue: element.options.flag}" class="slingCell" @click.stop="edit">
          <div class="bgWhite">
            <i :class="element.icon" class="icon iconfont v-middle" />
            <span class="componentsName">{{ element.name }}</span>
            <i v-show="element.options.flag" class="icon iconfont iconri-delete-bin--line blue v-middle fr redDelIcon cur-po" @click.stop="deleteItem"/>
          </div>
        </div>
      </div>
    </template>

    <!--<template v-if="element.type == 'textarea'">-->
    <!--<div class="deleteIconBox">-->
    <!--<i class="icon iconfont iconri-delete-bin&#45;&#45;line blue"></i>-->
    <!--</div>-->
    <!--<div class="slingCell">-->
    <!--<div class="bgWhite">-->
    <!--<span class="componentsName">多行</span>-->
    <!--<i class="icon iconfont icondanhang fr" ></i>-->
    <!--</div>-->
    <!--</div>-->
    <!--&lt;!&ndash;<el-input type="textarea"  :rows="5"&ndash;&gt;-->
    <!--&lt;!&ndash;v-model="element.options.defaultValue"&ndash;&gt;-->
    <!--&lt;!&ndash;:style="{width: isTable ? '100%' : element.options.width}"&ndash;&gt;-->
    <!--&lt;!&ndash;:disabled="element.options.disabled"&ndash;&gt;-->
    <!--&lt;!&ndash;:placeholder="element.options.placeholder"&ndash;&gt;-->
    <!--&lt;!&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;<i slot="suffix" class="icon iconfont iconduohang"></i>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-input>&ndash;&gt;-->
    <!--</template>-->

    <!--<template v-if="element.type == 'number'">-->
    <!--&lt;!&ndash;<el-input-number&ndash;&gt;-->
    <!--&lt;!&ndash;v-model="element.options.defaultValue"&ndash;&gt;-->
    <!--&lt;!&ndash;:disabled="element.options.disabled"&ndash;&gt;-->
    <!--&lt;!&ndash;:controls-position="element.options.controlsPosition"&ndash;&gt;-->
    <!--&lt;!&ndash;:controls="false"&ndash;&gt;-->
    <!--&lt;!&ndash;:style="{width: isTable ? '100%' : element.options.width}"&ndash;&gt;-->
    <!--&lt;!&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;</el-input-number>&ndash;&gt;-->
    <!--</template>-->

    <!--<template v-if="element.type == 'radio'">-->
    <!--&lt;!&ndash;<el-radio-group v-model="element.options.defaultValue"&ndash;&gt;-->
    <!--&lt;!&ndash;:style="{width: isTable ? '100%' : element.options.width}"&ndash;&gt;-->
    <!--&lt;!&ndash;:disabled="element.options.disabled"&ndash;&gt;-->
    <!--&lt;!&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;<el-radio&ndash;&gt;-->
    <!--&lt;!&ndash;:style="{display: element.options.inline ? 'inline-block' : 'block'}"&ndash;&gt;-->
    <!--&lt;!&ndash;:label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"&ndash;&gt;-->
    <!--&lt;!&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;{{element.options.showLabel ? item.label : item.value}}&ndash;&gt;-->
    <!--&lt;!&ndash;</el-radio>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-radio-group>&ndash;&gt;-->
    <!--</template>-->

    <!--<template v-if="element.type == 'checkbox'">-->
    <!--&lt;!&ndash;<el-checkbox-group v-model="element.options.defaultValue"&ndash;&gt;-->
    <!--&lt;!&ndash;:style="{width: isTable ? '100%' : element.options.width}"&ndash;&gt;-->
    <!--&lt;!&ndash;:disabled="element.options.disabled"&ndash;&gt;-->
    <!--&lt;!&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;<el-checkbox&ndash;&gt;-->
    <!--&lt;!&ndash;:style="{display: element.options.inline ? 'inline-block' : 'block'}"&ndash;&gt;-->
    <!--&lt;!&ndash;:label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"&ndash;&gt;-->
    <!--&lt;!&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;{{element.options.showLabel ? item.label : item.value}}&ndash;&gt;-->
    <!--&lt;!&ndash;</el-checkbox>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-checkbox-group>&ndash;&gt;-->
    <!--</template>-->

    <!--<template v-if="element.type == 'time'">-->
    <!--<el-time-picker-->
    <!--v-model="element.options.defaultValue"-->
    <!--:is-range="element.options.isRange"-->
    <!--:placeholder="element.options.placeholder"-->
    <!--:start-placeholder="element.options.startPlaceholder"-->
    <!--:end-placeholder="element.options.endPlaceholder"-->
    <!--:readonly="element.options.readonly"-->
    <!--:disabled="element.options.disabled"-->
    <!--:editable="element.options.editable"-->
    <!--:clearable="element.options.clearable"-->
    <!--:arrowControl="element.options.arrowControl"-->
    <!--:style="{width: isTable ? '100%' : element.options.width}"-->
    <!--&gt;-->
    <!--</el-time-picker>-->
    <!--</template>-->

    <!--<template v-if="element.type == 'date'">-->
    <!--&lt;!&ndash;<el-date-picker&ndash;&gt;-->
    <!--&lt;!&ndash;v-model="element.options.defaultValue"&ndash;&gt;-->
    <!--&lt;!&ndash;:type="element.options.type"&ndash;&gt;-->
    <!--&lt;!&ndash;:is-range="element.options.isRange"&ndash;&gt;-->
    <!--&lt;!&ndash;:placeholder="element.options.placeholder"&ndash;&gt;-->
    <!--&lt;!&ndash;:start-placeholder="element.options.startPlaceholder"&ndash;&gt;-->
    <!--&lt;!&ndash;:end-placeholder="element.options.endPlaceholder"&ndash;&gt;-->
    <!--&lt;!&ndash;:readonly="element.options.readonly"&ndash;&gt;-->
    <!--&lt;!&ndash;:disabled="element.options.disabled"&ndash;&gt;-->
    <!--&lt;!&ndash;:editable="element.options.editable"&ndash;&gt;-->
    <!--&lt;!&ndash;:clearable="element.options.clearable"&ndash;&gt;-->
    <!--&lt;!&ndash;:style="{width: isTable ? '100%' : element.options.width}"&ndash;&gt;-->
    <!--&lt;!&ndash;class="datePickerIcon"&ndash;&gt;-->
    <!--&lt;!&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;</el-date-picker>&ndash;&gt;-->
    <!--</template>-->

    <!--<template v-if="element.type == 'rate'">-->
    <!--<el-rate v-model="element.options.defaultValue"-->
    <!--:max="element.options.max"-->
    <!--:disabled="element.options.disabled"-->
    <!--:allow-half="element.options.allowHalf"-->
    <!--:show-score="element.options.showScore"-->
    <!--&gt;</el-rate>-->
    <!--</template>-->

    <!--<template v-if="element.type == 'color'">-->
    <!--<el-color-picker-->
    <!--v-model="element.options.defaultValue"-->
    <!--:disabled="element.options.disabled"-->
    <!--:show-alpha="element.options.showAlpha"-->
    <!--&gt;</el-color-picker>-->
    <!--</template>-->

    <!--<template v-if="element.type == 'select'">-->
    <!--<el-select-->
    <!--v-model="element.options.defaultValue"-->
    <!--:disabled="element.options.disabled"-->
    <!--:multiple="element.options.multiple"-->
    <!--:clearable="element.options.clearable"-->
    <!--:placeholder="element.options.placeholder"-->
    <!--:style="{width: isTable ? '100%' : element.options.width}"-->
    <!--&gt;-->
    <!--<el-option v-for="item in element.options.options" :key="item.value" :value="item.value" :label="element.options.showLabel?item.label:item.value"></el-option>-->
    <!--</el-select>-->
    <!--</template>-->

    <!--<template v-if="element.type=='switch'">-->
    <!--<el-switch-->
    <!--v-model="element.options.defaultValue"-->
    <!--:disabled="element.options.disabled"-->
    <!--&gt;-->
    <!--</el-switch>-->
    <!--</template>-->

    <!--<template v-if="element.type=='slider'">-->
    <!--<el-slider-->
    <!--v-model="element.options.defaultValue"-->
    <!--:min="element.options.min"-->
    <!--:max="element.options.max"-->
    <!--:disabled="element.options.disabled"-->
    <!--:step="element.options.step"-->
    <!--:show-input="element.options.showInput"-->
    <!--:range="element.options.range"-->
    <!--:style="{width: isTable ? '100%' : element.options.width}"-->
    <!--&gt;</el-slider>-->
    <!--</template>-->

    <!--<template v-if="element.type=='imgupload'">-->
    <!--<fm-upload-->
    <!--v-model="element.options.defaultValue"-->
    <!--:disabled="element.options.disabled"-->
    <!--:style="{'width': isTable ? '100%' : element.options.width}"-->
    <!--:width="element.options.size.width"-->
    <!--:height="element.options.size.height"-->
    <!--token="xxx"-->
    <!--domain="xxx"-->
    <!--&gt;-->

    <!--</fm-upload>-->
    <!--</template>-->

    <!--<template v-if="element.type == 'cascader'">-->
    <!--<el-cascader-->
    <!--v-model="element.options.defaultValue"-->
    <!--:disabled="element.options.disabled"-->
    <!--:clearable="element.options.clearable"-->
    <!--:placeholder="element.options.placeholder"-->
    <!--:style="{width: isTable ? '100%' : element.options.width}"-->
    <!--:options="element.options.remoteOptions"-->
    <!--&gt;-->

    <!--</el-cascader>-->
    <!--</template>-->

    <!--<template v-if="element.type == 'editor'">-->
    <!--<vue-editor-->
    <!--v-model="element.options.defaultValue"-->
    <!--:style="{width: isTable ? '100%' : element.options.width, cursor: element.options.disabled ? 'no-drop' : '', backgroundColor: element.options.disabled ? '#F5F7FA' : ''}"-->
    <!--:editor-toolbar="element.options.customToolbar"-->
    <!--class="fm-editor"-->
    <!--:disabled="element.options.disabled"-->
    <!--&gt;-->
    <!--</vue-editor>-->
    <!--</template>-->

    <!--<template v-if="element.type=='blank'">-->
    <!--<div style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;">{{$t('fm.components.fields.blank')}}</div>-->
    <!--</template>-->

    <!--<template v-if="element.type == 'text'">-->
    <!--<span>{{element.options.defaultValue}}</span>-->
    <!--</template>-->

    <!--<template v-if="element.type == 'html'">-->
    <!--<span v-html="element.options.defaultValue"></span>-->
    <!--</template>-->

    <!--<template v-if="element.type == 'fileupload'">-->
    <!--<el-upload-->
    <!--action="https://jsonplaceholder.typicode.com/posts/"-->
    <!--:style="{width: isTable ? '100%' : element.options.width}"-->
    <!--:disabled="element.options.disabled"-->
    <!--:limit="element.options.limit"-->
    <!--&gt;-->
    <!--<el-button size="small" type="primary">{{$t('fm.actions.upload')}}</el-button>-->
    <!--<div v-if="element.options.tip" class="el-upload__tip" slot="tip">{{element.options.tip}}</div>-->
    <!--</el-upload>-->
    <!--</template>-->
    <!--删除二次弹框确认-->
    <delete-dialog :visible.sync="dialogDelete" title="删除" @confirm="sureDelete"/>
  </span>
</template>

<script>
import FmUpload from './Upload'
import DeleteDialog from '../deleteDialog/index'

export default {
  components: {
    FmUpload,
    DeleteDialog
  },
  props: ['element', 'isTable', 'index', 'flag'],
  inject: ['setCurElement'],
  data() {
    return {
      dialogDelete: false,
      componentNameArr: {
        input: '单行',
        textarea: '多行',
        number: '数字',
        radio: '单选项',
        checkbox: '复选框',
        date: '日期和时间',
        cascader: '地理区域',
        blank: '区段',
        table: '子表单'
      }
    }
  },
  methods: {
    edit() {
      this.setCurElement(this.index, this.flag, this.element)
      this.$emit('handleSelectWidget')
    },
    deleteItem() {
      this.dialogDelete = true
    },
    sureDelete() {
      this.$emit('deleteItem')
    }
  }
}
</script>
<style lang="scss" scoped>
  .slingCell{
    height: 56px;
    margin: 8px 8px 0px;
    padding: 8px;
    border:1px solid #ffffff;
    clear: both;
    .componentsName {
      color: rgba(0, 0, 0, 0.45);font-weight: bold;
      font-size: 14px;
      line-height: 22px;
      vertical-align: middle;
      margin-left: 10px;
    }
    .bgWhite {
      background-color: #ffffff;
      height: 40px;
      padding: 9px 15px 9px 13px;
      border: 1px solid #ECEEF5;
    }
    .fr {
      float: right;
    }
  }
  .deleteIconBox {
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    width: 48px;
    height: 24px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;
    background: #0097FF;
    float: right;
    margin-right: 16px;
    margin-top: 8px;
    overflow: hidden;
  }
  .isShow {
    opacity: 1;
    pointer-events: auto;
  }
  .bgBlue {
    border: 1px solid #0097FF;
    background: #F3F7FB;
  }
  .v-middle {
    vertical-align: middle;
  }
  .redDelIcon {
    color: #FB6D55;
  }
  .cur-po {
    cursor: pointer;
  }
  .component-item:first-child {
    margin-top: 32px;
  }
</style>

