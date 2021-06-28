<template>
  <div>
    <!--todo----------------------------------------搜索框-------------------------------->
    <div v-if="from==='search'">
      <template v-if="searchItem.type==='input'|| searchItem.type==='editor'">
        <el-input v-model="searchItem.fieldValues" @input="validate"/>
      </template>
      <template v-if="searchItem.type==='number'">
        <div v-if="searchItem.comparisonOper==='between'" style="display: flex;justify-content: space-between">
          <span class="inlineBlock mr10">
            <el-input-number
              v-model="minNumber"
              :max="maxNumber"
              :controls="false"
              controls-position="right"
              placeholder="最小值"
              style="width: 100%"
              @change="numberChange"
            />
          </span>
          <span>
            <el-input-number
              v-model="maxNumber"
              :controls="false"
              :min="minNumber"
              controls-position="right"
              placeholder="最大值"
              style="width: 100%"
              @change="numberChange"
            />
          </span>
        </div>

        <el-input-number
          v-else
          v-model="searchItem.fieldValues"
          :controls="false"
          controls-position="right"
          style="width: 100%;"
          @input.native="validate"
        />
      </template>
      <template v-if="searchItem.type == 'textarea'">
        <el-input
          v-model="searchItem.fieldValues"
          type="textarea"
          @input="validate"
        />
      </template>
      <template v-if="searchItem.type == 'autonumber'">
        <div v-if="searchItem.comparisonOper==='between'" style="display: flex;justify-content: space-between">
          <div style="display: flex" class="mr10">
            <!--<div class="unit">{{ searchItem.options.autoNumberPrefix }}</div>-->
            <el-input-number
              v-model="autoNumberMin"
              :controls="false"
              :max="autoNumberMax"
              placeholder="最小值"
              style="width: 100%;"
              @change="autoNumberChange"
            />
          </div>
          <div style="display: flex">
            <!--<div class="unit">{{ searchItem.options.autoNumberPrefix }}</div>-->
            <el-input-number
              v-model="autoNumberMax"
              :min="autoNumberMin"
              :controls="false"
              placeholder="最大值"
              style="width: 100%;"
              @change="autoNumberChange"
            />
          </div>
        </div>
        <div v-else style="display: flex">
          <!--<div class="unit">{{ searchItem.options.autoNumberPrefix }}</div>-->
          <el-input-number
            v-model="searchItem.fieldValues"
            :controls="false"
            style="width: 100%;"
            @input.native="validate"
          />
        </div>
      </template>
      <template v-if="searchItem.type == 'switch'">
        <el-switch v-model="searchItem.fieldValues" @change="validate"/>
      </template>
      <template v-if="searchItem.type == 'radio'">
        <el-radio-group v-model="searchItem.fieldValues" @change="validate">
          <el-radio v-for="(item,index) in formItem.options.options" :key="index" :label="item.value">{{ item.value }}</el-radio>
        </el-radio-group>
      </template>
      <template v-if="searchItem.type == 'checkbox' && searchItem.fieldValues !== null">
        <el-checkbox-group v-model="searchItem.fieldValues" @change="validate">
          <el-checkbox v-for="item in formItem.options.options" :key="item.value" :label="item.value"/>
        </el-checkbox-group>
      </template>
      <template v-if="searchItem.type=='date'" style="position: relative;">
        <el-date-picker
          v-if="searchItem.comparisonOper==='between'"
          v-model="searchItem.fieldValues"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%"
        />
        <el-date-picker
          v-else
          v-model="searchItem.fieldValues"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"
          style="width: 100%"
        />
      </template>
      <template v-if="searchItem.type=='cascader'">
        <province-city-county v-model="searchItem.fieldValues" :type="formItem.options.type" :is-default="true" from="generator" style="width:100%" @change="validate"/>
      </template>
      <template v-if="searchItem.type=='member'">
        <member v-model="searchItem.fieldValues" :is-hover-detail="formItem.options&&formItem.options.isHoverDetail" :multiple="formItem.options&&formItem.options.multiple" :member-range="formItem.options&&formItem.options.memberRange" style="width:100%" @change="validate"/>
      </template>
      <template v-if="searchItem.type=='relatedChoice'">
        <related-choice v-model="searchItem.fieldValues" :widget="formItem" from="listSearch" width="100%"/>
      </template>
    </div>
    <!--todo----------------------------------------批量编辑-------------------------------->
    <div v-if="from==='batchEdit'">
      <template v-if="formItem.type==='input'">
        <el-input
          v-model="formValue"
          :placeholder="formItem.options.placeholder"
          :disabled="formItem.options.disabled"
          :maxlength="formItem.options.maxlength"
          :show-password="formItem.options.showPassword"
          clearable
        />
      </template>
      <template v-if="formItem.type==='number'">
        <div style="display:flex;width: 100%">
          <el-input-number
            v-model="formValue"
            :controls="formItem.options.controls"
            :step="formItem.options.step"
            :disabled="formItem.options.disabled"
            :min="formItem.options.min ? formItem.options.min : -Infinity"
            :max="formItem.options.max ? formItem.options.max : Infinity"
            :precision="formItem.options.integer ? 0 : formItem.options.float"
            controls-position="right"
            style="width: 100%"
          />
          <div v-if="formItem.options.unit" class="unit" style="width: 60px;">{{ formItem.options.unit }}</div>
        </div>
      </template>
      <template v-if="formItem.type == 'textarea'">
        <el-input
          v-model="formValue"
          :disabled=" formItem.options.disabled || formItem.isDuplicated"
          :placeholder="formItem.options.placeholder"
          :maxlength="formItem.options.maxlength"
          type="textarea"
        />
      </template>
      <template v-if="formItem.type == 'editor'">
        <el-input
          v-model="formValue"
          :disabled=" formItem.options.disabled"
          :placeholder="formItem.options.placeholder"
        />
      </template>
      <template v-if="formItem.type == 'switch'">
        <el-switch
          v-model="formValue"
          :disabled=" formItem.options.disabled"
        />
      </template>
      <template v-if="formItem.type == 'radio'">
        <el-radio-group v-model="formValue">
          <el-radio v-for="(item,index) in formItem.options.options" :key="index" :label="item.value">{{ item.value }}</el-radio>
        </el-radio-group>
      </template>
      <template v-if="formItem.type == 'checkbox' && formValue !== null ">
        <el-checkbox-group v-model="formValue">
          <el-checkbox v-for="item in formItem.options.options" :key="item.value" :label="item.value"/>
        </el-checkbox-group>
      </template>
      <template v-if="formItem.type=='date'" style="position: relative;">
        <el-date-picker
          v-model="formValue"
          :type="formItem.options.type"
          :disabled=" formItem.options.disabled"
          :format="formItem.options.format"
          placeholder="选择日期"
          style="width: 100%"
          clearable
        />
      </template>
      <template v-if="formItem.type=='cascader'">
        <province-city-county v-model="formValue" :disabled="formItem.options.disabled" :type="formItem.options.type" :is-default="true" from="generator" style="width:100%"/>
      </template>
      <template v-if="formItem.type=='member'">
        <member v-model="formValue" :is-hover-detail="formItem.options.isHoverDetail" :multiple="formItem.options.multiple" :member-range="formItem.options.memberRange" style="width:100%"/>
      </template>
      <template v-if="formItem.type=='relatedChoice'">
        <related-choice v-model="formValue" :widget="formItem" from="listEdit" width="100%"/>
      </template>
    </div>
  </div>
</template>
<script>
import ProvinceCityCounty from '@/components/provinceCityCounty/index'
import RelatedChoice from '../../../components/relatedChoice'
export default {
  components: {
    ProvinceCityCounty,
    Member: () => import('@/components/member'),
    RelatedChoice
  },
  props: {
    formItem: { // 组件数据
      type: Object,
      default: () => {
        return {}
      }
    },
    searchItem: { // 搜索数据
      type: Object,
      default: () => {
        return {}
      }
    },
    from: {
      type: String,
      default: ''
    },
    value: {
      type: String | Array,
      default: null
    }
  },
  data() {
    return {
      minNumber: undefined,
      maxNumber: undefined,
      autoNumberMin: undefined,
      autoNumberMax: undefined,
      formValue: this.value,
      searchValue: ''
    }
  },
  watch: {
    'formValue': function(val) {
      this.$emit('input', val)
      this.$emit('update:value', val)
    }
  },
  mounted: function() {
    if (this.from === 'search') {
      if (this.searchItem.type === 'number' && this.searchItem.comparisonOper === 'between' || this.searchItem.type === 'checkbox' || (this.formItem.type === 'member' && this.formItem.options.multiple || this.searchItem.type === 'autonumber' && this.searchItem.comparisonOper === 'between')) {
        this.searchItem.fieldValues = []
      }
      if(this.searchItem.type === 'date' && this.searchItem.comparisonOper !== 'between'){
        this.searchItem.fieldValues = ''
      }
    } else {
      if (this.formItem.type === 'checkbox' || (this.formItem.type === 'member' && this.formItem.options.multiple)) {
        this.formValue = []
      }
    }
  },
  methods: {
    numberChange() {
      if (!this.maxNumber && this.maxNumber !== 0) {
        this.maxNumber = this.minNumber
      }
      if (!this.minNumber && this.minNumber !== 0) {
        this.minNumber = 0
      }
      this.$set(this.searchItem.fieldValues, 0, this.minNumber)
      this.$set(this.searchItem.fieldValues, 1, this.maxNumber)
      this.validate()
    },
    autoNumberChange() {
      if (!this.autoNumberMax && this.autoNumberMax !== 0) {
        this.autoNumberMax = this.autoNumberMin
      }
      if (!this.autoNumberMin && this.autoNumberMin !== 0) {
        this.autoNumberMin = 0
      }
      this.$set(this.searchItem.fieldValues, 0, this.autoNumberMin)
      this.$set(this.searchItem.fieldValues, 1, this.autoNumberMax)
      this.validate()
    },
    validate() {
      let fieldValues = null
      if (typeof this.searchItem.fieldValues === 'string') {
        fieldValues = this.searchItem.fieldValues.split(',')
      } else if (typeof this.searchItem.fieldValues === 'number' || typeof this.searchItem.fieldValues === 'boolean') {
        fieldValues = [this.searchItem.fieldValues]
      } else {
        fieldValues = this.searchItem.fieldValues || []
      }
      if (fieldValues.length) {
        this.searchItem.errorTip = false
      } else {
        this.searchItem.errorTip = true
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .unit {padding: 0 10px;background: #F4F4F5;border: 1px solid #E4E7ED;height: 28px;line-height: 28px;text-align: center;}
  /*.autoNumber { line-height:28px; overflow:hidden; }*/
  /deep/ .el-input-number .el-input__inner{text-align: left}
</style>
