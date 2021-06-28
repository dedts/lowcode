<template>
  <!-- 表达式编辑器 -->
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" class="express-dialog" top="25vh" title="表达式编辑器" width="1000px">
    <div class="express-content">
      <div class="left">
        <el-tabs v-model="expressionDialog.fieldActiveName" @tab-click="expressionTabClick">
          <el-tab-pane label="字段" name="first">
            <div class="expression-collapse">
              <div v-for="item in formPageGetFields" :key="item.dataKey" class="flex-between pl15 pr15 lh40" @click="selectText(item)">
                <div style="color: #232E37;">{{ item.name }}</div>
                <div class="textTip">{{ showFieldType(item) }}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="公式" name="second">
            <el-collapse v-model="expressionDialog.collapseActiveName" class="expression-collapse" accordion>
              <el-collapse-item v-for="(item, index) in expressionJson" :key="item.fnType" :title="item.category" :name="index">
                <div v-for="cItem in item.funcs" :key="cItem.label" class="select-option" @click="selectExpression(cItem, item.fnType)">
                  <div class="p1">{{ cItem.label }}</div>
                  <div class="p2">{{ cItem.detailDesc }}</div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <div class="r-top">
          <el-button v-for="item in logical" @click="clickLogicalBtn(item)"> {{ item }} </el-button>
        </div>
        <div class="r-content">
          <codemirror
            ref="myCm"
            :options = "cmOptions"
            class="code"
            @changes="changes"
          />
          <div v-if="expressionErrorVisible" class="errorBox">
            <div class="errorTitle">
              <span>公式中存在错误</span>
              <i class="el-icon-close closeIcon" @click="closeErrBox"/>
            </div>
            <div class="tip">您可以检查以下内容</div>
            <div class="errorTipContent">
              <div class="item">参数传递是否合法(时间)</div>
              <div class="item">参数传递是否正确</div>
              <div class="item">计算符号是否为英文字符</div>
              <div class="item">表达式书写是否符合js规则</div>
              <div class="item">表达式是否有返回值</div>
              <div class="item">表达式返回值是否符合当前字段数据格式</div>
              <div class="item">表达式字段之间是否存在循环关系</div>
            </div>
          </div>
        </div>
        <div class="r-footer">
          <el-button type="primary" @click="saveExpression">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { expressionJson } from './expressionConfig'
import { setFormFieldMapper, validateExpression, replaceKeyWord } from '@/util/expression'
import { codemirror } from 'vue-codemirror'
import { formPageGetFields, formPageFixedFields, formFieldList } from '@/api/builder'
import { showFieldTypeDesc } from '@/util/index'
// import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/mode/css/css.js'
// import 'codemirror/mode/xml/xml.js'
// import 'codemirror/mode/clike/clike.js'
// import 'codemirror/mode/markdown/markdown.js'
// import 'codemirror/mode/python/python.js'
// import 'codemirror/mode/r/r.js'
// import 'codemirror/mode/shell/shell.js'
// import 'codemirror/mode/sql/sql.js'
// import 'codemirror/mode/swift/swift.js'
// import 'codemirror/mode/vue/vue.js'
// import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/mode/css/css.js'
// import 'codemirror/mode/xml/xml.js'
// import 'codemirror/mode/clike/clike.js'
// import 'codemirror/mode/markdown/markdown.js'
// import 'codemirror/mode/python/python.js'
// import 'codemirror/mode/r/r.js'
// import 'codemirror/mode/shell/shell.js'
// import 'codemirror/mode/sql/sql.js'
// import 'codemirror/mode/swift/swift.js'
// import 'codemirror/mode/vue/vue.js'
// const CodeMirror = require('codemirror/lib/codemirror')
import { number_sumproduct } from './fnexp/exp_number'
import _ from 'lodash'

export default {
  components: {
    codemirror
  },
  props: {
    showExpression: Boolean,
    templateDataId: String,
    expressionData: {
      type: Object,
      default() {
        return {}
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  inject: ['compsData'],
  data() {
    return {
      expressionErrorVisible: false,
      dialogVisible: this.showExpression,
      expressionDialog: {
        fieldActiveName: 'first',
        collapseActiveName: '1'
      },
      expressionJson: expressionJson,
      cmOptions: {
        // mode: "text/x-mysql", // 以什么格式进行代码高亮
        indentUnit: 4, // 缩进单位
        smartIndent: true, // 自动缩进
        tabSize: 4, // tab字符的宽度
        lineNumbers: false, // 是否显示行
        firstLineNumber: 1, // 第一行的行号
        showCursorWhenSelecting: true, // 在选择时是否显示光标
        autofocus: true,
        autocapitalize: true, // 输入时是否启用大写
        addModeClass: true, // 启用时（默认情况下为off），将为每个标记添加一个额外的CSS类，指示生成它的（内部）模式，前缀为"cm-m-"。例如，来自XML模式的标记将获得cm-m-xml该类
        // extraKeys: {
        //   "Ctrl": "autocomplete"
        // },
        // hintOptions: {//自定义提示选项
        //   tables: {
        //     users: ['name', 'score', 'birthDate'],
        //     countries: ['name', 'population', 'size']
        //   }
        // },
        // specialChars: /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff]/,
        // specialCharPlaceholder: function(char) {
        //   return `<span style="color:red">char</span>`
        // },
        resetSelectionOnContextMenu: false, // 控制当在当前选择之外单击打开上下文菜单时，是否将光标移动到单击点。默认为true。
        matchBrackets: true // 匹配括号

      },
      textValue: '',
      logical: ['+', '-', '*', '/', '()', '&&', '||', '==', '!=', '>', '<', '>=', '<='],
      allMarks: [],
      formPageGetFields: [], // 表单字段
      formPageFixedFields: [] // 系统字段
    }
  },
  computed: {
    curCompsData() {
      return this.compsData()
    }
  },
  watch: {
    myCmValue(newV, oldV) {
      // this.$refs.myCm.codemirror.focus()
      // this.$refs.myCm.codemirror.setCursor(0, 3)
      // this.$nextTick(()=> {
      //   this.$refs.myCm.codemirror.refresh();
      // })
    },
    dialogVisible(newValue) {
      this.$emit('update:showExpression', newValue)
    },
    showExpression(val) {
      this.dialogVisible = val
    },
    templateDataId: {
      handler() {
        this.getFields()
      },
      immediate: true
    }
  },
  mounted() {
    this.getFields()
    this.getFixedFields()
  },
  methods: {
    showFieldType: showFieldTypeDesc,
    // 表达式回显
    dealExpressionEcho() {
      console.log('当前表达式数据为:', this.expressionData)
      this.$nextTick(() => {
        const cm = this.$refs.myCm.codemirror
        cm.setValue(this.expressionData.expression)
        const lastLine = this.expressionData.lineConut - 1
        if (this.expressionData.lineData.length) {
          let finalCursorPos = 0
          this.expressionData.lineData.forEach((item, index) => {
            if (index === this.expressionData.lineData.length - 1) {
              finalCursorPos = item.curLineExpression.length
            }
            const curLine = item.curLine
            let count = 0 // 记录已经替换的造成的index差值
            item.curLineMarks.forEach((m, dIndex) => {
              let curFrom = 0 // 记录当前标识的实际初始位置
              let curTo = 0 // 记录当前标识的实际结束位置
              if (dIndex === 0) {
                curFrom = m.from
                curTo = m.to
              } else {
                curFrom = m.from + count
                curTo = m.to + count
              }
              const value = item.curLineExpression.substring(curFrom, curTo)
              let newValue = value
              if (m.className === 'lc-field') {
                const curItem = this.formPageGetFields.filter(n => n.dataKey === m.dataKey)
                if (curItem.length) {
                  newValue = this.formPageGetFields.filter(n => n.dataKey === m.dataKey)[0].name
                } else {
                  cm.setValue('')
                  return
                }
              }
              const indexInterval = newValue.length - value.length
              count += indexInterval
              cm.replaceRange(newValue, { line: curLine, ch: curFrom }, { line: curLine, ch: curTo })
              item.curLineExpression = cm.getValue()
              cm.markText({ line: curLine, ch: curFrom }, { line: curLine, ch: curTo + indexInterval }, {
                className: m.className,
                atomic: true,
                dataKey: m.dataKey,
                fnType: m.fnType
              })
            })
          })
          cm.setCursor(lastLine, finalCursorPos)
        } else {
          cm.setCursor(lastLine, cm.getLine(lastLine).length)
        }
      })
    },
    // 校验type 对应的数据格式
    validateType(str, type) {
      if (typeof str === 'string') {
        if (type === 'date') {
          const text = new Date(str).getMonth()
          if (isNaN(text)) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      } else if (type === 'number' && typeof str === 'number') {
        if (isNaN(str)) {
          return false
        } else {
          return true
        }
      }
    },
    saveExpression() {
      // console.log(666, this.curCompsData)
      const cm = this.$refs.myCm.codemirror
      const expressionStr = cm.getValue()
      if (expressionStr === '') {
        this.dialogVisible = false
        this.$emit('save', null)
        return
      }
      const lineConut = cm.lineCount()
      const expressionData = {
        expression: expressionStr,
        lineConut: lineConut,
        lineData: []
      }
      setFormFieldMapper(this.curCompsData, this.formPageGetFields) // 生成当前表单字段映射
      for (let i = 0; i < lineConut; i++) {
        const curExpression = cm.getLine(i) // 当前行内容
        let isAddDataFlag = true
        const curMarks = cm.findMarks({ line: i, ch: 0 }, { line: i, ch: curExpression.length }) // 当前行标记数组
        if (!curMarks.length) {
          if (i === lineConut - 1) {
            this.validateFn(cm, expressionData)
            return
          } else {
            isAddDataFlag = false
          }
        }
        if (isAddDataFlag) {
          const curLineMarks = curMarks[0].lines[0].markedSpans.reduce((arr, item) => {
            arr.push({
              from: item.from,
              to: item.to,
              className: item.marker.className,
              fnType: item.marker.fnType || '',
              dataKey: item.marker.dataKey || ''
            })
            return arr
          }, [])
          expressionData.lineData.push({
            curLine: i,
            curLineExpression: curExpression,
            curLineMarks: curLineMarks
          })
        }
      }
      this.validateFn(cm, expressionData)
    },
    // 校验
    validateFn(cm, expressionData) {
      const finalExp = replaceKeyWord(expressionData, this.data.dataKey)
      if (validateExpression(finalExp, this.curCompsData) && this.validateType(eval(finalExp), this.data.type)) {
        this.dialogVisible = false
        this.expressionErrorVisible = false
        cm.setValue('')
        this.$emit('save', expressionData)
      } else {
        this.expressionErrorVisible = true
      }
    },
    // 关闭表达式错误提示
    closeErrBox() {
      this.expressionErrorVisible = false
    },
    // 获取系统字段
    getFixedFields() {
      formPageFixedFields().then((res) => {
        if (res.code === 200) {
          this.formPageFixedFields = res.body
        }
      })
    },
    // 获取表单字段列表
    getFields() {
      const data = {
        templateDataId: this.templateDataId
      }
      formPageGetFields(data).then((res) => {
        if (res.code === 200) {
          const noValidFields = ['imgupload', 'fileupload', 'relatedForm', 'html', 'editor', 'autonumber']
          this.formPageGetFields = res.body.filter(f => !f.sysAdd && !noValidFields.includes(f.type))
          if (JSON.stringify(this.expressionData) !== '{}') {
            this.dealExpressionEcho()
          }
          // 获取formFieldList中的options并插入到formPageGetFields中
          formFieldList(this.templateDataId).then(resp => {
            if (resp.code === 200) {
              resp.body.forEach(itemResp => {
                this.formPageGetFields.forEach(itemForm => {
                  if (itemResp.dataKey === itemForm.dataKey) {
                    itemForm.options = itemResp.options
                  }
                })
              })
            }
          })
        }
      })
    },
    expressionTabClick(tab, event) {
      console.log(tab, event)
    },
    changes() {
      const cm = this.$refs.myCm.codemirror
      const lineInfo = cm.lineInfo(0)
      const lineHandle = cm.getLineHandle(0)
    },
    selectExpression(item, fnType) {
      const cm = this.$refs.myCm.codemirror
      const valueLen = item.value.length
      const cursorPos = cm.getCursor()
      cm.replaceRange(item.value, { line: cursorPos.line, ch: cursorPos.ch }, { line: cursorPos.line, ch: cursorPos.ch })
      cm.markText({ line: cursorPos.line, ch: cursorPos.ch }, { line: cursorPos.line, ch: cursorPos.ch + valueLen - 2 }, { className: 'lc-formula', atomic: true, fnType: fnType })
      cm.focus()
      cm.setCursor(cursorPos.line, cursorPos.ch + valueLen - 1)
    },
    // 选择字段
    selectText(value) {
      const cm = this.$refs.myCm.codemirror
      const valueLen = value.name.length
      const cursorPos = cm.getCursor()
      cm.replaceRange(value.name, { line: cursorPos.line, ch: cursorPos.ch }, { line: cursorPos.line, ch: cursorPos.ch })
      cm.markText({ line: cursorPos.line, ch: cursorPos.ch }, { line: cursorPos.line, ch: cursorPos.ch + valueLen }, { className: 'lc-field', atomic: true, dataKey: value.dataKey })
      cm.focus()
      cm.setCursor(cursorPos.line, cursorPos.ch + valueLen)
      this.$nextTick(() => {
        cm.refresh()
      })
      // const aa = cm.getAllMarks()
      // const values = cm.getValue()
      // const lineInfo = cm.lineInfo(0)
      // console.log(aa, 'aa', values, 'values', lineInfo, 'lineInfo')
    },
    // 选择逻辑运算符
    clickLogicalBtn(logicalText) {
      const cm = this.$refs.myCm.codemirror
      const valueLen = logicalText.length
      const cursorPos = cm.getCursor()
      if (logicalText === '()') {
        cm.replaceRange('(', { line: cursorPos.line, ch: cursorPos.ch }, { line: cursorPos.line, ch: cursorPos.ch })
        cm.replaceRange(')', { line: cursorPos.line, ch: cursorPos.ch + 1 }, { line: cursorPos.line, ch: cursorPos.ch + 1 })
        // cm.markText({ line: cursorPos.line, ch: cursorPos.ch }, { line: cursorPos.line, ch: cursorPos.ch + valueLen - 1 }, { className: 'lc-operator' })
        // cm.markText({ line: cursorPos.line, ch: cursorPos.ch + valueLen - 1 }, { line: cursorPos.line, ch: cursorPos.ch + valueLen }, { className: 'lc-operator' })
        cm.focus()
        cm.setCursor(cursorPos.line, cursorPos.ch + valueLen - 1)
      } else {
        cm.replaceRange(logicalText, { line: cursorPos.line, ch: cursorPos.ch }, {
          line: cursorPos.line,
          ch: cursorPos.ch
        })
        // cm.markText({ line: cursorPos.line, ch: cursorPos.ch }, {
        //   line: cursorPos.line,
        //   ch: cursorPos.ch + valueLen
        // }, { className: 'lc-operator' })
        cm.focus()
        cm.setCursor(cursorPos.line, cursorPos.ch + valueLen)
      }
      this.$nextTick(() => {
        cm.refresh()
      })
    },
    cancel() {
      this.dialogVisible = false
      const cm = this.$refs.myCm.codemirror
      cm.setValue('')
      this.$emit('cancel')
    },
    save() {
      this.dialogVisible = false
      const cm = this.$refs.myCm.codemirror
      cm.setValue('')
      this.$emit('save')
    }
  }
}
</script>
<style lang="scss">
  .express-content{overflow: hidden;border-top:1px solid #e5e5e5;height: 515px;}
  .express-content .left{width: 240px;float:left; border-right:1px solid #e5e5e5;height: 515px;}
  .express-content .right{width: 760px;float:right;}
  .express-content .label-title { height:30px;line-height:30px;background:#f1f3f7;font-weight:bolder;padding-left: 20px;}
  .express-content .el-tabs__header{margin:0;}
  .textTip{text-align: right;font-size: 12px;color:#A9AFB5;}
  .el-collapse-item__content .select-option {background-color: #f7f8f9;padding:5px 20px}
  .select-option .p1{font-size:14px;}
  .select-option .p2{font-size:12px;color: #9fa5ac;}
  .express-content .right{
    .r-top{padding:6px 20px; background: #ffffff;
      .el-button{background:#f7f8f9;border:none;}
    }
    .r-content{position: relative;height: 410px;background: #f7f8f9;}
    .r-footer {text-align: right;padding:20px 20px 0 0;border-top:1px solid #e5e5e5;}
  }
  .expression-collapse{height:475px;overflow-y: scroll;}
  .el-collapse-item__header{border: none;}
  .el-collapse{border: none;}
  .el-collapse-item__header{display: inline-block !important;}
  .el-collapse-item__arrow{float:left;margin-top:19px;font-weight: bolder;}
</style>

<style>
  .CodeMirror{background: none !important; height:300px !important;}
  .lc-field{color: #FFFFFF !important; background: #62b199;border-radius: 3px;padding:3px 5px !important; margin:5px;line-height: 25px;}
  .lc-formula{color:#708;}
  .lc-operator{color:#2A8DC9;}
  .CodeMirror pre.CodeMirror-line, .CodeMirror pre.CodeMirror-line-like{line-height:25px}
</style>
<style lang="scss" scoped>
  .errorBox {
    position: absolute;
    width: calc(100% - 40px);
    bottom: 15px;
    margin: 0 20px;
    padding: 10px 10px 20px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,.1);
    z-index: 100;
    .errorTitle {
      color: #e66060;
      font-size: 17px;
      border: 1px solid #ff9b9b;
      border-radius: 3px;
      background: #fff3f3;
      padding: 0 0  0 17px;
      height: 45px;
      line-height: 45px;
      .closeIcon {
        cursor: pointer;
        float: right;
        width: 43px;height: 43px;
        line-height: 43px;
        text-align: center;
      }
    }
    .tip {
      color: #b0b0b9;
      font-size: 14px;
      margin: 10px;
    }
    .errorTipContent {
      .item {
        color: #2b3441;
        font-size: 14px;
        margin-left: 15px;
        margin-top: 10px;
      }
      .item:before {
        content: '';
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #f5bc21;
        margin-right: 10px;
        vertical-align: middle;
      }
    }
  }
</style>

