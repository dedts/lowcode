<template>
  <div class="review-container">
    <div v-if="element.type === 'grid'" :style="{ height: element.options.isShowName ? '50px': '0px'}" class="gridName">{{ element.options.isShowName ? element.name : '' }}</div>
    <el-row
      v-if="display[element.dataKey]"
      :class="{
        [element.options.customClass]: element.options.customClass?true: false
      }"
      :gutter="element.options.gutter || 0"
      :justify="element.options.justify"
      :align="element.options.align"
      type="flex"
      class="p-12"
    >
      <el-col
        v-for="(item, index) in [element.columns]"
        :key="index"
        :span="24"
        class=""
      >
        <template v-for="col in item.list">
          <generate-col-item
            v-if="col.type == 'grid'"
            :key="col.dataKey"
            :model.sync="dataModels"
            :rules="rules"
            :element="col"
            :operation="operation"
            :blanks="blanks"
            :display="display"
            :edit="edit"
            @input-change="onInputChange"
          >
            <template v-slot:[blank.name]="scope" v-for="blank in blanks">
              <slot :name="blank.name" :model="scope.model"/>
            </template>
          </generate-col-item>

          <generate-form-item
            v-else
            :key="col.dataKey"
            :models.sync="dataModels"
            :rules="rules"
            :widget="col"
            :operation="operation"
            :blanks="blanks"
            :display="display"
            :edit="edit"
            @input-change="onInputChange"
          >
            <template v-slot:[blank.name]="scope" v-for="blank in blanks">
              <slot :name="blank.name" :model="scope.model"/>
            </template>
          </generate-form-item>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem'
// import GenerateTabItem from './GenerateTabItem'

export default {
  name: 'GenerateColItem',
  components: {
    GenerateFormItem
    // GenerateTabItem
  },
  props: ['element', 'model', 'rules', 'blanks', 'display', 'edit', 'operation'],
  data() {
    return {
      dataModels: this.model
    }
  },
  watch: {
    model: {
      deep: true,
      handler(val) {
        this.dataModels = this.model
      }
    },
    dataModels: {
      deep: true,
      handler(val) {
        this.$emit('update:model', val)
      }
    }
  },
  methods: {
    onInputChange(value, field, type) {
      this.$emit('input-change', value, field, type)
    }
  }
}
</script>
<style lang="scss" scoped>
.review-container {
  border-radius:2px;
  margin-bottom:5px;
  .gridName {
    width: 100%;
    height:50px;
    line-height:50px;
    font-weight: bold;
    border-bottom: 1px solid #E4E7ED;
  }
  .p-12 {
    padding:6px 0;
  }
}
</style>
