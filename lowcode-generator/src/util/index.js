
export function formatDate(date, fmt) {
  // if (!date) return null
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : str.padStart(2, '0'))
    }
  }
  return fmt
}

// 处理组件逻辑运算
export function getComparisonOpers(key) {
  switch (key) {
    case 'contains':
      return '包含'
    case 'not_contains':
      return '不包含'
    case 'start_with':
      return '开头是'
    case 'end_with':
      return '结尾是'
    case 'equals':
      return '等于'
    case 'not_equals':
      return '不等于'
    case 'is_empty':
      return '为空'
    case 'is_not_empty':
      return '不为空'
    case 'less':
      return '小于'
    case 'less_than':
      return '小于等于'
    case 'greater':
      return '大于'
    case 'greater_than':
      return '大于等于'
    case 'between':
      return '介于'
    case 'true':
      return '开'
    case 'false':
      return '关'
    default:
      return ''
  }
}
// 过滤器回显数据
export function showFilterCondition(workflowFilterDtoList, currentFieldsList, targetFieldsList) {
  if (workflowFilterDtoList.length <= 0) {
    return false
  }
  workflowFilterDtoList.forEach(item => {
    if (!item.connectionEnum) {
      item.connectionEnum = null
    }
    item.conditionDtoList.forEach((c, index) => {
      const currentFieldsListArr = JSON.parse(JSON.stringify(currentFieldsList))
      const target = targetFieldsList.filter(f => f.dataKey === c.fieldId)
      if (!c.connectionEnum) {
        c.connectionEnum = '&&'
      }
      c.currentFieldsList = currentFieldsListArr
      if (target.length) {
        c.comparisonOpersArr = target[0].comparisonOpersArr
        c.options = target[0].options
      }
      // 自定义
      if (c.valuesType === 0) {
        if (c.fieldType === 'number' &&
          c.comparisonOper === 'between'
        ) {
          // 1. 数字 - 介于 - 自定义 (需要处理)
          c.fieldValuesMin = c.fieldValues[0]
          c.fieldValuesMax = c.fieldValues[1]
        } else if (
          c.fieldType === 'input' ||
          c.fieldType === 'textarea' ||
          c.fieldType === 'radio' ||
          c.fieldType === 'number' && c.comparisonOper !== 'between' ||
          c.fieldType === 'date' && c.comparisonOper !== 'between' ||
          c.fieldType === 'member' && !c.options.multiple ||
          c.fieldType === 'editor'

        ) {
          c.fieldValues = c.fieldValues.join(',')
          // console.log(c.fieldType + '||' + c.fieldValues + '||' + typeof c.fieldValues)
        } else if (c.fieldType === 'switch') {
          c.fieldValues = Number(c.fieldValues.join(','))
        }
      } else {
        // 匹配
        // c.fieldValues = c.fieldValues.join(',')
        c.currentFieldsList.forEach(i => {
          if (i.dataKey === c.fieldValues) {
            i.isShowTip = true
          }
        })
      }
      /*
      *
      * 1. 数字 - 介于 - 自定义 (需要处理)
      *
      * 2. 日期 - 介于 - 自定义 (不需要处理)
      *    复选框 - 自定义
      *    地理位置 - 自定义
      *    成员 - 多选 - 自定义
      * 3. 单行，多行，富文本，单选项，开关逗号隔开
      * */
    })
  })
  return workflowFilterDtoList
}
// 过滤器提交数据
export function filterParameter(workflowFilterDtoListArr) {
  // 深拷贝 workflowFilterDtoList 过滤器数据
  const workflowFilterDtoListFilter = JSON.parse(JSON.stringify(workflowFilterDtoListArr))
  const workflowFilterDtoListResult = []
  // 删除过滤器多余属性
  if (workflowFilterDtoListFilter.length > 0) {
    workflowFilterDtoListFilter.forEach(item => {
      const obj = {
        connectionEnum: item.connectionEnum,
        conditionDtoList: []
      }
      item.conditionDtoList.forEach(f => {
        let fieldValuesArr = null
        if (f.valuesType === 0) {
          if (Array.isArray(f.fieldValues)) {
            fieldValuesArr = f.fieldValues
          } else {
            if (f.fieldValues || f.fieldValues === 0) {
              fieldValuesArr = [f.fieldValues]
            } else {
              fieldValuesArr = []
            }
          }
        } else {
          fieldValuesArr = f.fieldValues
        }

        obj.conditionDtoList.push({
          fieldId: f.fieldId,
          fieldType: f.fieldType,
          linkName: f.linkName,
          connectionEnum: f.connectionEnum,
          comparisonOper: f.comparisonOper,
          valuesType: f.valuesType,
          fieldValues: fieldValuesArr
        })
      })
      obj.conditionDtoList[0].connectionEnum = null
      workflowFilterDtoListResult.push(obj)
    })
    // 过滤器第一组的或更改成null
    workflowFilterDtoListResult[0].connectionEnum = null
  }
  return workflowFilterDtoListResult
}
// 根据url 下载文件和图片
export function downloadFile(path) {
  const re = new RegExp('(.jpg|.png|.gif|.ps|.jpeg|.pdf)$')
  if (re.test(path.toLowerCase())) {
    // 图片
    const x = new XMLHttpRequest()
    x.open('GET', path, true)
    x.responseType = 'blob'
    x.onload = function() {
      const url = window.URL.createObjectURL(x.response)
      const a = document.createElement('a')
      a.href = url
      a.download = ''
      a.click()
    }
    x.send()
  } else {
    // 文件
    window.location.href = path
  }
}

// Json数组按属性去重
export function unique(arr, key) {
  const new_arr = []
  const json_arr = []
  for (let i = 0; i < arr.length; i++) {
    if (new_arr.indexOf(arr[i][key]) === -1) { //  -1代表没有找到
      new_arr.push(arr[i][key]) // 如果没有找到就把这个name放到arr里面，以便下次循环时用
      json_arr.push(arr[i])
    }
  }
  return json_arr
}

// 格式化时间
export function formatTime(value, format) {
  const year = new Date(value).getFullYear()
  let month = new Date(value).getMonth() + 1 + ''
  let date = new Date(value).getDate() + ''
  let hours = new Date(value).getHours() + ''
  let minutes = new Date(value).getMinutes() + ''
  let seconds = new Date(value).getSeconds() + ''
  // 补0
  // month = ('00' + month).slice(-2)
  month = month.padStart(2, '0')
  date = ('00' + date).slice(-2)
  hours = ('00' + hours).slice(-2)
  minutes = ('00' + minutes).slice(-2)
  seconds = ('00' + seconds).slice(-2)
  //  按格式替换
  const formatY = format.replace('yyyy', year)
  const formatM = formatY.replace('MM', month)
  const formatD = formatM.replace('dd', date)
  const formatH = formatD.replace('HH', hours)
  const formatm = formatH.replace('mm', minutes)
  const formatDate = formatm.replace('ss', seconds)
  return formatDate
}

