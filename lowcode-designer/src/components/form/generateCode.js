function findRemoteFunc(list, funcList, tokenFuncList, blankList, optionList) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].type == 'grid') {
      list[i].columns.forEach(item => {
        findRemoteFunc(item.list, funcList, tokenFuncList, blankList, optionList)
      })
    } else {
      if (list[i].type == 'blank') {
        if (list[i].model) {
          blankList.push({
            name: list[i].model,
            label: list[i].name,
            dataBind: list[i].options.dataBind
          })
        }
      } else if (list[i].type == 'imgupload') {
        if (list[i].options.tokenFunc) {
          tokenFuncList.push({
            func: list[i].options.tokenFunc,
            label: list[i].name,
            model: list[i].model
          })
        }
      } else {
        if (list[i].options.remote && list[i].options.remoteType == 'func' && list[i].options.remoteFunc) {
          funcList.push({
            func: list[i].options.remoteFunc,
            label: list[i].name,
            model: list[i].model
          })
        }

        if (list[i].options.remote && list[i].options.remoteType == 'option' && list[i].options.remoteOption) {
          optionList.push({
            option: list[i].options.remoteOption,
            label: list[i].name,
            model: list[i].model
          })
        }
      }
    }
  }
}

export default function(data, type = 'html') {
  const funcList = []

  const tokenFuncList = []

  const blankList = []

  const optionList = []

  findRemoteFunc(JSON.parse(data).list, funcList, tokenFuncList, blankList, optionList)

  let funcTemplate = ''

  let blankTemplate = ''

  let optionTemplate = ''

  for (let i = 0; i < optionList.length; i++) {
    optionTemplate += `
          ${optionList[i].option} : [], // ${optionList[i].label} option data
    `
  }

  for (let i = 0; i < funcList.length; i++) {
    funcTemplate += `
            ${funcList[i].func} (resolve) {
              // ${funcList[i].label} ${funcList[i].model}
              // resolve(data)
            },
    `
  }

  for (let i = 0; i < tokenFuncList.length; i++) {
    funcTemplate += `
            ${tokenFuncList[i].func} (resolve) {
              // ${tokenFuncList[i].label} ${tokenFuncList[i].model}
              // resolve(token)
            },
    `
  }

  for (let i = 0; i < blankList.length; i++) {
    if (blankList[i].dataBind) {
      blankTemplate += `
        <template slot="${blankList[i].name}" slot-scope="scope">
          <!-- ${blankList[i].label || blankList[i].name} -->
          <!-- use v-model="scope.model.${blankList[i].name}" to bind data -->
        </template>
      `
    } else {
      blankTemplate += `
        <template slot="${blankList[i].name}" slot-scope="scope">
          <!-- ${blankList[i].label || blankList[i].name} -->
        </template>
      `
    }
  }

  if (type == 'html') {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
  <link rel="stylesheet" href="https://unpkg.com/form-making/dist/FormMaking.css">
</head>
<body>
  <div id="app">
    <fm-generate-form 
      :data="jsonData" 
      :remote="remoteFuncs" 
      :value="editData" 
      :remote-option="dynamicData"
      ref="generateForm"
    >${blankTemplate}
    </fm-generate-form>
    <el-button type="primary" @click="handleSubmit">Submit</el-button>
  </div>
  <script src="https://unpkg.com/vue/dist/vue.js"></script>
  <script src="https://unpkg.com/element-ui/lib/index.js"></script>
  <script src="https://unpkg.com/form-making/dist/FormMaking.umd.js"></script>
  <script>
    new Vue({
      el: '#app',
      data: {
        jsonData: ${data},
        editData: {},
        remoteFuncs: {
          ${funcTemplate}
        },
        dynamicData: {
          ${optionTemplate}
        }
      },
      methods: {
        handleSubmit () {
          this.$refs.generateForm.getData().then(data => {
            // Data verification succeeded
            alert(JSON.stringify(data))
          }).catch(e => {
            // Data verification failed
          })
        }
      }
    })
  </script>
</body>
</html>`
  } else {
    return `<template>
  <div>
    <fm-generate-form 
      :data="jsonData" 
      :remote="remoteFuncs" 
      :value="editData" 
      :remote-option="dynamicData"
      ref="generateForm"
    >${blankTemplate}
    </fm-generate-form>
    <el-button type="primary" @click="handleSubmit">Submit</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      jsonData: ${data},
      editData: {},
      remoteFuncs: {
        ${funcTemplate}
      },
      dynamicData: {
        ${optionTemplate}
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.generateForm.getData().then(data => {
        // Data verification succeeded
        alert(JSON.stringify(data))
      }).catch(e => {
        // Data verification failed
      })
    }
  }
}
</script>`
  }
}
