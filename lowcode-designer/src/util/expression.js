import mapper from '@/components/expression/map'
import { formatDate } from '@/util/index'
// 当前字段的字段依赖表
const curFieldDepTable = {
  curDataKey: '',
  dependencies: []
}
// 当前的表单字段映射表

let curFormFieldMapper = []
let specialComps = []
// 构建器生成表单字段映射关系表
/**
* from 默认为空 'relatedForm':关联表单
* */
export function setFormFieldMapper(curCompsData, sampleCompsData, isGeneratorFlag, from) {
  let FieldArr = []
  if (from === 'relatedForm') {
    FieldArr = curCompsData
  } else {
    curCompsData.forEach(m => {
      m.type === 'grid' && (FieldArr.push(...m.columns.list))
    })
  }
  const allComps = JSON.parse(JSON.stringify(FieldArr))
  specialComps = []
  curFormFieldMapper = sampleCompsData.reduce((arr, item) => {
    allComps.forEach(n => {
      if (item.dataKey === n.dataKey && n.options && n.options.defaultValue !== undefined) {
        if (isGeneratorFlag) {
          if (n.type === 'member' || n.type === 'relatedChoice' || n.type === 'date') {
            if (n.type === 'relatedChoice') {
              n.options.field = item.options.field
            }
            dealSpecialCompsData(n)
            specialComps.push({
              curItem: n,
              dataKey: n.dataKey,
              value: n.type === 'member' ? n.options.memberValue : n.type === 'date' ? n.options.dateValue : n.type === 'relatedChoice' ? n.options.relatedChoiceValue : ''
            })
          }
          const value = n.type === 'relatedChoice' ? n.options.relatedChoiceValue : n.type === 'member' ? n.options.memberValue : n.type === 'date' ? n.options.dateValue : n.options.defaultValue
          arr.push({
            dataKey: item.dataKey,
            value
          })
        } else {
          arr.push({
            dataKey: item.dataKey,
            value: n.options.defaultValue
          })
        }
      }
    })
    return arr
  }, [])
}
// 生成器初始化计算数据
/**
 * from 默认为空 'relatedForm':关联表单
 * */
export function generateInitData(curCompsData, from) {
  let allComps = []
  if (from === 'relatedForm') {
    allComps = curCompsData
  } else {
    curCompsData.forEach(m => {
      m.type === 'grid' && (allComps.push(...m.columns.list))
    })
  }
  const expressionComps = allComps.filter(item => item.options && item.options.expressionData)
  const dealsDataKeys = []
  expressionComps.forEach(n => {
    dealNestExpression(n, expressionComps, dealsDataKeys)
  })
}
// 表达式嵌套递归处理(利用树状结构，从底部往上赋值)
export async function dealNestExpression(curItem, expressionComps, dealsDataKeys) {
  const deps = getFieldDeps(curItem.options.expressionData)
  curItem.deps = deps
  const curMapItem = curFormFieldMapper.filter(item => item.dataKey === curItem.dataKey)[0]
  if (!curMapItem) {
    return
  }
  if (!deps.length) {
    curMapItem.value = eval(replaceKeyWord(curItem.options.expressionData, curItem.dataKey))
    if (!dealsDataKeys.includes(curMapItem.dataKey)) {
      dealsDataKeys.push(curMapItem.dataKey)
    }
  } else {
    if (dealsDataKeys.every(item => dealsDataKeys.includes(item))) {
      if (!curItem.options.expressionData.isDirty) {
        curMapItem.value = eval(replaceKeyWord(curItem.options.expressionData, curItem.dataKey))
      }
      if (!dealsDataKeys.includes(curMapItem.dataKey)) {
        dealsDataKeys.push(curMapItem.dataKey)
      }
    } else {
      deps.forEach(i => {
        const curCompData = expressionComps.find(item => item.dataKey === i)
        if (curCompData) {
          dealNestExpression(curCompData, expressionComps, dealsDataKeys)
        }
      })
    }
  }
}
// 生成器实时生成表单字段映射关系表
export function setGenerateFormFieldMapper(models, needDealedItem) {
  const result = []
  Object.entries(models).forEach(item => {
    const [key, value] = item
    if (needDealedItem && needDealedItem.dataKey === key) {
      dealSpecialCompsData(needDealedItem, value)
      result.push({
        dataKey: key,
        value: needDealedItem.type === 'member' ? needDealedItem.options.memberValue : needDealedItem.type === 'date' ? needDealedItem.options.dateValue : needDealedItem.options.relatedChoiceValue
      })
    } else {
      const specialItem = specialComps.find(m => m.dataKey === key)
      if (specialItem !== undefined) {
        const curItem = specialItem.curItem
        dealSpecialCompsData(curItem, value)
        specialItem.value = curItem.type === 'member' ? curItem.options.memberValue : curItem.type === 'date' ? curItem.options.dateValue : curItem.options.relatedChoiceValue
        result.push(specialItem)
      } else {
        result.push({
          dataKey: key,
          value
        })
      }
    }
  })
  curFormFieldMapper = result
}
// 特殊组件数据二次处理
function dealSpecialCompsData(curItem, value) {
  let curValue = curItem.options.defaultValue
  if (value !== undefined) {
    curValue = value
  }
  if (curItem.type === 'member') {
    if (typeof curValue === 'string') {
      if (!curValue.length) {
        curValue = []
      } else {
        curValue = curValue.split(',')
      }
    }
    // 成员
    curItem.options.memberValue = curValue.reduce((result, item, index) => {
      if (index === curValue.length - 1) {
        result += curItem.options.memberData.filter(m => m.userId === item)[0].name
      } else {
        result = result + curItem.options.memberData.filter(m => m.userId === item)[0].name + ','
      }
      return result
    }, '')
  } else if (curItem.type === 'relatedChoice') {
    // 关联选项
    curItem.options.relatedChoiceValue = ''
    curItem.options.relatedChoiceLabel && curItem.options.relatedChoiceLabel.forEach(r => {
      let str = ''
      Object.keys(r).forEach(d => {
        curItem.options.field.forEach(f => {
          if (f.dataKey === d) {
            if (f.type === 'member') {
              r[d] = r[d].reduce((result, item, index) => {
                if (index === curValue.length - 1) {
                  result += f.options.memberData.filter(m => m.userId === item)[0].name
                } else {
                  result = result + f.options.memberData.filter(m => m.userId === item)[0].name + ','
                }
                return result
              }, '')
            } else if (f.type === 'date') {
              r[d] = formatDate(new Date(r[d]), f.options.format)
            }
            str += r[d] + '，'
          }
        })
      })
      curItem.options.relatedChoiceValue += `${str.slice(0, str.length - 1)} `
    })
    // console.log(curItem.options.relatedChoiceValue, 222)
  } else if (curItem.type === 'date') {
    // 日期
    if (curValue !== '') {
      curItem.options.dateValue = formatDate(new Date(curValue), curItem.options.format)
    }
  }
}
// 校验表达式
export function validateExpression(expression, formData) {
  try {
    if (!hasClosedDependence(formData)) {
      if (eval(expression) !== undefined) {
        console.log('expression:', expression)
        console.log('eval结果:', eval(expression))
        // console.log('执行结果:', math.format(math.evaluate(expression), 14))
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  } catch (e) {
    console.log('报错:', e)
    return false
  }
}
// 替换表达式中的关键字
export function replaceKeyWord(expressionData, curDataKey) {
  curFieldDepTable.curDataKey = curDataKey
  let finalExpression = ''
  if (expressionData.lineData.length) {
    const curItemFieldDeps = getFieldDeps(expressionData)
    if (curItemFieldDeps.includes('')) {
      expressionData.isDirty = true
      return
    }
    expressionData.lineData.forEach(item => {
      const curLineExpression = item.curLineExpression
      finalExpression += replaceOneLineKeyWord(curLineExpression, item.curLineMarks)
    })
  } else {
    finalExpression = expressionData.expression
  }
  return finalExpression
}
// 替换每行表达式的关键字
function replaceOneLineKeyWord(expressionStr, markArr) {
  let count = 0 // 记录已经替换的造成的index差值
  markArr.forEach((item, index) => {
    let curFrom = 0 // 记录当前标识的实际初始位置
    let curTo = 0 // 记录当前标识的实际结束位置
    if (index === 0) {
      curFrom = item.from
      curTo = item.to
    } else {
      curFrom = item.from + count
      curTo = item.to + count
    }
    const keyword = expressionStr.substring(curFrom, curTo)
    if (item.dataKey !== '') {
      // 替换字段关键字
      const curItem = curFormFieldMapper.filter(i => i.dataKey === item.dataKey)[0]
      const value = curItem.value
      const dataKey = curItem.dataKey
      if (!curFieldDepTable.dependencies.includes(dataKey)) {
        curFieldDepTable.dependencies.push(dataKey)
      }
      let replaceStr = ''
      if (typeof value === 'string') {
        replaceStr = `"${value}"`
      } else if (typeof value === 'number') {
        replaceStr = value + ''
      } else {
        replaceStr = JSON.stringify(value)
      }
      const arr = expressionStr.split('')
      arr.splice(curFrom, curTo - curFrom, ...replaceStr.split(''))
      expressionStr = arr.join('')
      count = count + (replaceStr.length - keyword.length)
    } else {
      // 替换函数关键字
      const fnName = mapper.filter(m => m.keyword === keyword)[0].fnName
      const arr = expressionStr.split('')
      arr.splice(curFrom, curTo - curFrom, ...fnName.split(''))
      expressionStr = arr.join('')
      count = count + item.fnType.length + 1
    }
  })
  console.log('转换成的js代码：', expressionStr)
  return expressionStr
}
// 判断不同字段之间是否有闭合依赖关系(搜集依赖)
function hasClosedDependence(formData) {
  const key = curFieldDepTable.curDataKey
  const deps = curFieldDepTable.dependencies
  const allExpressions = formData.reduce((arr, item) => {
    if (item.type === 'grid') {
      arr.push(...item.columns.list.reduce((subArr, m) => {
        if (m.options && m.options.expressionData) {
          subArr.push({
            dataKey: m.dataKey,
            expressionData: m.options.expressionData
          })
        }
        return subArr
      }, []))
    }
    return arr
  }, [])
  if (!allExpressions.length) {
    return false
  }
  for (let i = 0; i < deps.length; i++) {
    const curItem = allExpressions.filter(m => m.dataKey === deps[i])
    if (!curItem.length) {
      return false
    }
    const curExpressionData = curItem[0].expressionData
    if (getFieldDeps(curExpressionData).includes(key)) {
      return true
    }
  }
  return false
}
// 获取字段的依赖项数组
function getFieldDeps(expressionData) {
  const result = []
  if (expressionData.lineData.length) {
    expressionData.lineData.forEach(item => {
      item.curLineMarks.forEach(m => {
        if (m.dataKey !== '') {
          const curItem = curFormFieldMapper.filter(i => i.dataKey === m.dataKey)
          let curDataKey = ''
          if (curItem.length) {
            curDataKey = curFormFieldMapper.filter(i => i.dataKey === m.dataKey)[0].dataKey
          }
          if (!result.includes(curDataKey)) {
            result.push(curDataKey)
          }
        }
      })
    })
  }
  return result
}
// 设置当前字段的订阅者
/**
 * from 默认为空 'relatedForm':关联表单
 * */
export function setCurFieldSubs(curCompsData, curDataKey, from) {
  const subs = []
  let allComps = []
  if (from === 'relatedForm') {
    allComps = curCompsData
  } else {
    curCompsData.forEach(m => {
      m.type === 'grid' && (allComps.push(...m.columns.list))
    })
  }
  allComps.forEach(item => {
    if (item.options && item.options.expressionData) {
      if (getFieldDeps(item.options.expressionData).includes(curDataKey)) {
        subs.push(item.dataKey)
      }
    }
  })
  return subs
}

