<template>
  <el-tabs
    v-if="display[element.model]"
    v-model="tabActive"
    :type="element.options.type"
    :tab-position="element.options.tabPosition"
    :class="{
      [element.options.customClass]: element.options.customClass?true: false
    }"
    style="margin-bottom: 18px;"
  >
    <el-tab-pane
      v-for="item in element.tabs"
      :key="item.name"
      :label="item.label"
      :name="item.name"
    >
      <template v-for="tab in item.list">
        <generate-col-item
          v-if="tab.type == 'grid'"
          :key="tab.key"
          :model.sync="dataModels"
          :rules="rules"
          :element="tab"
          :remote="remote"
          :blanks="blanks"
          :operatio="operation"
          :display="display"
          :edit="edit"
          :remote-option="remoteOption"
          @input-change="onInputChange"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"/>
          </template>
        </generate-col-item>

        <generate-tab-item
          v-else-if="tab.type == 'tabs'"
          ref="generateTabItem"
          :key="tab.key"
          :model.sync="dataModels"
          :rules="rules"
          :element="tab"
          :remote="remote"
          :blanks="blanks"
          :display="display"
          :operatio="operation"
          :edit="edit"
          :remote-option="remoteOption"
          @input-change="onInputChange"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"/>
          </template>
        </generate-tab-item>

        <generate-form-item
          v-else
          :key="tab.key"
          :models.sync="dataModels"
          :rules="rules"
          :widget="tab"
          :remote="remote"
          :blanks="blanks"
          :display="display"
          :operatio="operation"
          :edit="edit"
          :remote-option="remoteOption"
          @input-change="onInputChange"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"/>
          </template>
        </generate-form-item>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import GenerateFormItem from './GenerateFormItem'

export default {
  name: 'GenerateTabItem',
  components: {
    GenerateFormItem,
    GenerateColItem: () => import('./GenerateColItem.vue')
  },
  props: ['element', 'model', 'rules', 'remote', 'blanks', 'display', 'edit', 'remoteOption','operation'],
  data() {
    return {
      dataModels: this.model,
      tabActive: this.element.tabs.length ? this.element.tabs[0].name : ''
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
    onInputChange(value, field) {
      this.$emit('input-change', value, field)
    }
  }
}
</script>
