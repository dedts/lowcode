<template>
  <!-- 下拉框 模糊搜索加分页-->
  <el-select
    v-more="loadMore"
    ref="selectFiltter"
    v-model="selectData"
    :remote-method="remoteMethod"
    :disabled="disabled"
    :placeholder="placeholder"
    clearable
    multiple
    filterable
    remote
    @focus="focusData"
    @change="change"
  >
    <el-option
      v-for="item in dataList"
      :key="item[optionValue]"
      :label="item[optionLabel]"
      :value="item[optionValue]"/>
    <transition name="fade">
      <div v-show="loading" class="loading">
        <i class="el-icon-loading"/><span>加载中...</span>
      </div>
    </transition>
  </el-select>
</template>

<script>
export default {
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
  props: {
    dataList: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: Array,
      default() {
        return []
      },
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    optionLabel: {
      type: String,
      default: 'label'
    },
    optionValue: {
      type: String,
      default: 'value'
    }

  },
  data() {
    return {
      options: [],
      selectData: this.value,
      placeholder: '请选择'
    }
  },
  watch: {
    selectData: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    value(val) {
      if (!val) {
        this.clearData()
      }
    }
  },
  mounted() {
    this.$on('clear', () => {
      const obj = {}
      obj.stopPropagation = () => {}
      this.$refs.selectFiltter.handleClearClick(obj)
    })
    this.$on('setVal', (val) => {
      this.placeholder = val
    })
  },
  methods: {
    remoteMethod(query) {
      if (query) {
        this.$emit('remote-method', query)
      } else {
        this.$emit('init')
      }
    },
    change(val) {
      this.$emit('change', val)
    },
    loadMore() {
      this.$emit('pageChange')
    },
    clearData() {
      this.$emit('update:dataList', [])
    },
    focusData() {
      this.$emit('init')
    }

  }
}
</script>

<style lang="scss" scoped>
  .loading{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background: rgba(255,255,255,.8);
    display: flex;
    align-items: center;
    justify-content: center;
    span{
      margin-left: 5px;

    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
