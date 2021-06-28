
/*
* IF(判断条件，真值，假值)
* 函数简介：
* 根据判断条件的正确(true)或错误(false)，返回不同的值。
* */
export function logic_if(condition, tValue, fValue) {
  if (arguments.length < 3) {
    throwError()
  }
  return eval(condition) ? tValue : fValue
}

/*
* IFS(判断条件1，真值1，判断条件2（可选），真值2（可选），···)
* 函数简介：
* 检查是否满足一个或多个条件，且返回符合第一个 TRUE 条件的值
* */
export function logic_ifs() {
  if (arguments.length < 3) {
    throwError()
  }
  let resultValue = ''
  // 递归
  for (let i = 0; i < arguments.length; i++) {
    if (i % 2 === 0 && eval(arguments[i])) {
      resultValue = arguments[i + 1]
      break
    }
  }
  return resultValue
}

/*
* AND(条件，条件)
* 函数简介：
* 任何一个参数的逻辑值为false，即返回false；只有当所有参数的逻辑值为true，才返回true。
* */
export function logic_and() {
  if (arguments.length < 1) {
    throwError()
    return false
  }
  const argArr = [...arguments]
  let resultValue = ''
  if (argArr.some(i => eval(i) === false)) {
    resultValue = false
  } else {
    resultValue = true
  }
  return resultValue
}

/*
* OR(条件，条件)
* 函数简介：
* 任何一个参数逻辑值为true，即返回true；只有当所有逻辑参数值为false，才返回false。
* */
export function logic_or() {
  if (arguments.length < 2) {
    throwError()
    return false
  }
  const argArr = [...arguments]
  let resultValue = null
  if (argArr.some(i => eval(i) === true)) {
    resultValue = true
  } else {
    resultValue = false
  }
  return resultValue
}

/*
* XOR(值1，值2)
* 函数简介：
* 返回所有参数的异或值。异或是指，两个值相同，返回false，两个值不同，返回true。
* */
export function logic_xor() {
  if (arguments.length < 2) {
    throwError()
    return false
  }
  return arguments[0] !== arguments[1]
}

/*
* NOT(值1)
* 函数简介：
* 返回参数逻辑值的反值。NOT(2>1)的结果就是false。
* */
export function logic_not() {
  if (arguments.length < 1) {
    throwError()
    return false
  }
  return !eval(arguments[0])
}

/*
* ISEMPTY(值1)
* 函数简介：
* 判断值是否为空字符串或者空数组。如果是空值，返回true, 否则返回false
*   arg : ' '
*   arg : ''
*   arg : null
*   arg : undefined
*   arg : []
*   arg : {}
* */
export function logic_isempty() {
  if (arguments.length < 1 || arguments.length > 1) {
    throwError()
    return false
  }
  if (arguments[0] && typeof arguments[0] === 'string') {
    return false
  }
  // 判断空字符串, null, undefined
  if (eval(arguments[0]) === '' || eval(arguments[0]) === ' ' || eval(arguments[0]) == null || eval(arguments[0]) === undefined) {
    return true
  }
  // 对象
  if (JSON.stringify(eval(arguments[0])) === '{}') {
    return true
  }
  // 数组
  if (Array.isArray(arguments[0]) && arguments[0].length === 0) {
    return true
  }
  return false
}

