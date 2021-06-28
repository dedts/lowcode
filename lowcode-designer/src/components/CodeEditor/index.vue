<template>
  <div v-loading="loading" :id="id" :style="{width: width, height: height}" class="fm-code-editor">{{ codeValue }}</div>
</template>

<script>
import { loadJs } from '../../util'

export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    mode: {
      type: String,
      default: 'xml'
    },
    value: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      id: 'code_' + Math.random().toString(36).slice(-8),
      codeValue: this.value,
      loading: true
    }
  },
  computed: {
    aceMode() {
      switch (this.mode) {
        case 'xml':
          return 'ace/mode/xml'
        case 'html':
          return 'ace/mode/html'
        case 'json':
          return 'ace/mode/json'
        default:
          return 'ace/mode/xml'
      }
    }
  },
  watch: {
    value(val) {
      this.codeValue = val
    },
    codeValue(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    setTimeout(() => {
      if (window.ace) {
        this.loadEditor()
      } else {
        loadJs('https://unpkg.com/form-making/public/lib/ace/ace.js').then(() => {
          this.loadEditor()
        })
      }
    }, 0)
  },
  methods: {
    loadEditor() {
      this.loading = false

      const editor = ace.edit(this.id)

      editor.session.setMode(this.aceMode)

      editor.on('change', (e) => {
        console.log(editor.getValue())
        this.codeValue = editor.getValue()
      })
    }
  }
}
</script>

<style lang="scss">
.fm-code-editor{
  border: 1px solid #DCDFE6;
}
</style>
