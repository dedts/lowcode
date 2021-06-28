<template>
  <div>
    <el-cascader
      :key="key"
      :options="options"
      v-model="address"
      :disabled="disabled"
      :separator="' '"
      filterable
      clearable
      @change="handleChange"
    />
  </div>
</template>
<script>
import options from './data'
export default {
  name: 'ProvinceCityCounty',
  props: {
    type: {
      type: String,
      default: '国家-地区-城市'
    },
    value: {
      type: Array,
      default: () => []
    },
    isDefault: { // 预览时不需要默认值
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      address: this.value,
      key: 0,
      options: JSON.parse(JSON.stringify(options)) // 存放城市数据
    }
  },
  watch: {
    type: {
      handler() {
        this.selectData()
      },
      immediate: true
    },
    options: {
      handler(val) {
        this.key++
      },
      deep: true
    },
    value: {
      handler(val) {
        this.address = val
      },
      deep: true
    },
    address: {
      handler(val) {
        this.$emit('input', val)
        this.$emit('update:value', val)
      },
      deep: true
    }
  },
  methods: {
    handleChange(val) {
      if (this.isDefault) {
        this.$emit('update:value', val)
        this.$emit('input', val)
      }
      if (this.from !== 'generator') {
        this.$emit('saveFormData')
      }
      this.$emit('change')

    },
    selectData() {
      if (this.type === '地区-城市') {
        this.options = JSON.parse(JSON.stringify(options))[0].children
        this.options.forEach(item => {
          item.children && item.children.forEach(m => {
            m.children && (delete m.children)
          })
        })
      } else if (this.type === '地区-城市-区县') {
        this.options = JSON.parse(JSON.stringify(options))[0].children
      } else {
        this.options = JSON.parse(JSON.stringify(options))
      }
    },
  }
}
</script>
<style lang="scss" scoped>
  /deep/ .el-cascader{width: 100%;}
</style>
