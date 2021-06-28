<template>
  <div class="form-config-container">
    <el-form label-position="top" size="small">
      <el-form-item label="UI">
        <el-radio-group v-model="data.ui">
          <el-radio-button label="element">Element</el-radio-button>
          <el-radio-button label="antd">Ant Design</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <template v-if="data.ui == 'antd'">
        <el-form-item :label="$t('fm.config.form.labelPosition.title')">
          <el-radio-group v-model="data.layout">
            <el-radio-button label="horizontal">{{ $t('fm.config.form.labelPosition.right') }}</el-radio-button>
            <el-radio-button label="vertical">{{ $t('fm.config.form.labelPosition.top') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('fm.config.form.labelWidth')">
          <el-slider v-model="data.labelCol" :min="0" :max="24" :step="1"/>
        </el-form-item>
      </template>

      <template v-else>
        <el-form-item :label="$t('fm.config.form.labelPosition.title')">
          <el-radio-group v-model="data.labelPosition">
            <el-radio-button label="left">{{ $t('fm.config.form.labelPosition.left') }}</el-radio-button>
            <el-radio-button label="right">{{ $t('fm.config.form.labelPosition.right') }}</el-radio-button>
            <el-radio-button label="top">{{ $t('fm.config.form.labelPosition.top') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('fm.config.form.labelWidth')">
          <el-input-number v-model="data.labelWidth" :min="0" :max="200" :step="10"/>
        </el-form-item>

        <el-form-item :label="$t('fm.config.form.size')">
          <el-radio-group v-model="data.size">
            <el-radio-button label="medium">medium</el-radio-button>
            <el-radio-button label="small">small</el-radio-button>
            <el-radio-button label="mini">mini</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </template>

      <el-form-item :label="$t('fm.config.form.customClass')" >
        <el-input v-model="data.customClass" clearable/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['data'],
  watch: {
    'data.layout': function(val) {
      if (val == 'horizontal' || !val) {
        this.data.labelPosition = 'right'
      } else {
        this.data.labelPosition = 'top'
      }
    },
    'data.labelPosition': function(val) {
      if (val == 'top') {
        this.data.layout = 'vertical'
        this.data.labelCol = 0
      } else {
        this.data.layout = 'horizontal'
        this.data.labelCol = 3
      }
    }
  }
}
</script>
