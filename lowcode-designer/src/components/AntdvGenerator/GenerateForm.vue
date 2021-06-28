<template>
  <div>
    <a-form
      :form="form"
      :class="{
        [data.config.customClass]: data.config.customClass?true: false,
        'no-label-form': data.config.labelWidth == 0
      }"
      :label-col="{ span: data.config.labelCol }"
      :wrapper-col="{ span: 24 - data.config.labelCol}"

      :layout="data.config.labelPosition == 'top' ? 'vertical' : 'horizontal'"
    >
      <template v-for="item in data.list">
        <generate-col-item
          v-if="item.type == 'grid'"
          :key="item.key"
          :model.sync="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          :edit="edit"
          :remote-option="remoteOption"
          @input-change="onInputChange"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"/>
          </template>
        </generate-col-item>

        <generate-tab-item
          v-else-if="item.type == 'tabs'"
          :key="item.key"
          :model.sync="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
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
          :key="item.key"
          :models.sync="models"
          :rules="rules"
          :widget="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          :edit="edit"
          :remote-option="remoteOption"
          @input-change="onInputChange"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"/>
          </template>
        </generate-form-item>
      </template>
    </a-form>
  </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem'
import GenerateColItem from './GenerateColItem'
import GenerateTabItem from './GenerateTabItem'

export default {
  name: 'FmGenerateAntdForm',
  components: {
    GenerateFormItem,
    GenerateColItem,
    GenerateTabItem
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        'list': [],
        'config': {
          'labelWidth': 100,
          'labelPosition': 'right',
          'size': 'small',
          'customClass': ''
        }
      })
    },
    remote: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Object,
      default: () => ({})
    },
    edit: {
      type: Boolean,
      default: true
    },
    remoteOption: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      models: {},
      rules: {},
      blanks: [],
      displayFields: {},
      dataBindFields: [],
      generateShow: false,
      form: this.$form.createForm(this)
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        console.log(JSON.stringify(val))
        this.models = { ...this.models, ...val }
      }
    }
  },
  created() {
    if (Object.keys(this.data).length) {
      this.generateModel(this.data.list)
    } else {
      this.generateModel([])
    }
  },
  mounted() {
  },
  methods: {
    generateModel(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          this.displayFields[genList[i].model] = !genList[i].options.hidden

          genList[i].columns.forEach(item => {
            this.generateModel(item.list)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach(item => {
            this.generateModel(item.list)
          })

          this.displayFields[genList[i].model] = !genList[i].options.hidden
        } else {
          if (Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            // 处理老版本没有dataBind值的情况，默认绑定数据
            if (Object.keys(genList[i].options).indexOf('dataBind') < 0 || genList[i].options.dataBind) {
              this.models[genList[i].model] = this.value[genList[i].model]
              this.dataBindFields.push(genList[i].model)
            }

            this.displayFields[genList[i].model] = !genList[i].options.hidden

            if (genList[i].type === 'blank') {
              this.blanks.push({
                name: genList[i].model
              })
            }
          } else {
            if (genList[i].type === 'blank') {
              // bound the default value
              if (Object.keys(genList[i].options).indexOf('dataBind') < 0 || genList[i].options.dataBind) {
                this.models[genList[i].model] = genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : [])
                this.dataBindFields.push(genList[i].model)
              }
              this.displayFields[genList[i].model] = !genList[i].options.hidden

              this.blanks.push({
                name: genList[i].model
              })
            } else {
              if (Object.keys(genList[i].options).indexOf('dataBind') < 0 || genList[i].options.dataBind) {
                this.models[genList[i].model] = genList[i].type == 'table' ? [] : genList[i].options.defaultValue
                this.dataBindFields.push(genList[i].model)
              }
              this.displayFields[genList[i].model] = !genList[i].options.hidden
            }
          }

          genList[i].tableColumns && genList[i].tableColumns.length && genList[i].tableColumns.forEach(item => {
            if (item.type === 'blank') {
              this.blanks.push({
                name: item.model
              })
            }
          })

          if (this.rules[genList[i].model]) {
            this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules.map(item => {
              if (item.pattern) {
                return { ...item, pattern: eval(item.pattern) }
              } else {
                return { ...item }
              }
            })]
          } else {
            this.rules[genList[i].model] = [...genList[i].rules.map(item => {
              if (item.pattern) {
                return { ...item, pattern: eval(item.pattern) }
              } else {
                return { ...item }
              }
            })]
          }
        }
      }
    },
    _setDisabled(genList, fields, disabled) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this._setDisabled(item.list, fields, disabled)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach(item => {
            this._setDisabled(item.list, fields, disabled)
          })
        } else {
          if (fields.indexOf(genList[i].model) >= 0) {
            this.$set(genList[i].options, 'disabled', disabled)
          }
        }
      }
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            const resData = {}
            Object.keys(values).forEach(key => {
              if (this.displayFields[key] && this.dataBindFields.indexOf(key) >= 0) {
                resData[key] = values[key]
              }
            })
            resolve(JSON.parse(JSON.stringify(resData)))
          } else {
            reject(new Error(this.$t('fm.message.validError')).message)
          }
        })
      })
    },
    reset() {
      this.form.resetFields()
    },
    onInputChange(value, field) {
      console.log(field, value, this.models)
      this.$emit('on-change', field, value, this.models)
      this.$emit(`on-${field}-change`, value)
    },
    display(fields) {
      Object.keys(this.displayFields).forEach(key => {
        if (fields.indexOf(key) >= 0) {
          this.$set(this.displayFields, key, true)
        }
      })
      this.displayFields = { ...this.displayFields }
    },
    hide(fields) {
      Object.keys(this.displayFields).forEach(key => {
        if (fields.indexOf(key) >= 0) {
          this.$set(this.displayFields, key, false)
        }
      })

      this.displayFields = { ...this.displayFields }
    },
    disabled(fields, disabled) {
      this._setDisabled(this.data.list, fields, disabled)
    },
    refresh() {
    },
    setData(value) {
      this.models = { ...this.models, ...value }
    }
  }
}
</script>

<style lang="scss">
</style>
