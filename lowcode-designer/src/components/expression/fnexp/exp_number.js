
/**
 * 表达式函数----数字函数
 * */

// 返回所有参与运算数字的平均值
export function number_average() {
  let sum = 0
  for (let i = 0, j = arguments.length; i < j; i++) {
    if (isNaN(Number(arguments[i]))) {
      throwError()
    }
    sum = number_accuracy(sum + arguments[i])
  }
  return number_accuracy(sum / arguments.length)
}

// 返回所有参与字段中数值的总和
export function number_sum() {
  let sum = 0
  for (let i = 0, j = arguments.length; i < j; i++) {
    if (isNaN(Number(arguments[i]))) {
      throwError()
    }
    sum = number_accuracy(sum + Number(arguments[i]))
  }
  return sum
}
// 返回所有参与字段中数值的乘积
export function number_product() {
  let sum = 1
  for (let i = 0, j = arguments.length; i < j; i++) {
    if (isNaN(Number(arguments[i]))) {
      throwError()
    }
    sum = number_accuracy(sum * Number(arguments[i]))
  }
  return sum
}
// 返回所有参与运算字段中值（字符串）的数量
export function number_count() {
  const arg = Array.from(arguments)
  let count = 0
  arg.forEach(item => {
    if (Array.isArray(item)) {
      count += item.length
    } else {
      count += 1
    }
  })
  return count
}

// 返回所有参与数字中的最大值
export function number_max() {
  for (let i = 0, j = arguments.length; i < j; i++) {
    if (isNaN(Number(arguments[i]))) {
      throwError()
    }
  }

  const arg = Array.from(arguments)
  return Math.max(...arg)
}

// 返回所有参与数字中的最小值
export function number_min() {
  for (let i = 0, j = arguments.length; i < j; i++) {
    if (isNaN(Number(arguments[i]))) {
      throwError()
    }
  }

  const arg = Array.from(arguments)
  return Math.min(...arg)
}
// 将数字四舍五入到指定的位数
/**
 * number 数字
 * num_digits：指定的位数
 * 均为必填项
 * */
export function number_round(number, num_digits) {
  if (isNaN(Number(number)) || isNaN(Number(num_digits))) {
    throwError()
  }
  const num = Number(number.toFixed(num_digits))
  return num
}
// 将数字向下取整
/**
 * number:数字字段或数字内容,number必填
 * */
export function number_int(number) {
  if (isNaN(Number(number))) {
    throwError()
  }
  return Math.floor(number)
}

// 返回两数相除的余数
/**
 * number:数字字段或数字内容,
 * divisor:除数,
 * 均为必填项，
 * */
export function number_mod(number, divisor) {
  if (isNaN(Number(number)) || isNaN(Number(divisor))) {
    throwError()
  }
  return number % divisor
}

// 在给定的数组中，将数组间对应的元素相乘，并返回乘积之和
/**
 * arr:内容为数字的数组
 * 至少一个
 * */
export function number_sumproduct() {
  for (let i = 0; i < arguments.length; i++) {
    if (Array.isArray(arguments[i])) {
      arguments[i].forEach(item => {
        if (typeof item !== 'number') {
          throwError()
        }
      })
    } else {
      throwError()
    }
  }

  const arg = Array.from(arguments).sort((a, b) => {
    return a.length - b.length
  })
  // console.log(arg)
  let sum = 0
  const length = arg[0].length

  for (let i = 0; i < length; i++) {
    let csum = 1
    arg.forEach(item => {
      csum = number_accuracy(csum * item[i])
    })
    sum = number_accuracy(sum + csum)
  }
  return sum
}
// 把数字转换为大写的中文金额
/**
 * number:需要转化的数字
 * */
export function number_rmbupper(amount) {
  if (isNaN(Number(amount))) {
    throwError()
  }
  if (isNaN(amount) || amount >= 1000000000000) return '无效金额！' // 数值最大不超过1万亿
  const sPrefix = amount < 0 ? '(负)' : '' // 将负号'-'显示成汉字'(负)'
  let sAmount = Math.abs(amount).toFixed(3) // 格式化成两位小数格式（两位小数对应“'角”和“分”）
  let sUnit = '仟佰拾亿仟佰拾万仟佰拾元角分毫' // 14个权位单位
  const sCapital = '零壹贰叁肆伍陆柒捌玖' // 10个大写数字
  sAmount = sAmount.replace('.', '') // 去除小数点（使数字与权位对应）
  sUnit = sUnit.substr(sUnit.length - sAmount.length) // 截取权位
  let sOutput = ''
  for (let i = 0, len = sAmount.length; i < len; i++) { // 拼接数字与权位单位
    sOutput += sCapital.substr(sAmount.substr(i, 1), 1) + sUnit.substr(i, 1)
  }
  return sPrefix + sOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, '零元')
}

/**
* 大写金额转换为数字
 * str : 大写的金额
*
*/
// rmbupper_number('叁拾万零壹佰贰拾叁元叁角叁分贰毫')
export function number_rmbToNum(str) {
  const test = '零壹贰叁肆伍陆柒捌玖仟佰拾亿仟佰拾万仟佰拾元角分毫'
  const arr = str.split('')
  // 验证字符串的正确性
  for (let i = 0; i < arr.length; i++) {
    if (test.includes(arr[i])) {
      continue
    } else {
      throwError()
      break
    }
  }

  const sCapital = '零壹贰叁肆伍陆柒捌玖'
  const sCapitalResultObj = { '零': 0, '壹': 1, '贰': 2, '叁': 3, '肆': 4, '伍': 5, '陆': 6, '柒': 7, '捌': 8, '玖': 9 }
  const sUnitResultObj = { '毫': 0.001, '分': 0.01, '角': 0.1, '元': 1, '拾': 10, '佰': 100, '仟': 1000, '万': 10000 }
  // 替换字符串中的数字后的字符串
  let strResult = ''
  // 替换字符串中的数字
  arr.forEach(item => {
    if (sCapital.includes(item)) {
      strResult += sCapitalResultObj[item]
    } else {
      strResult += item
    }
  })
  // 数字汉子分组
  const arrResult = strResult.match(/\d+\D{0,2}/g)
  const countArr = []
  arrResult.forEach((item, index) => {
    let countResult = 0
    // 计算arrResult数组中每个元素的结果
    for (let i = 0; i < item.length; i++) {
      // 数字
      if (!isNaN(item[i])) {
        countResult = item[i]
      } else { // 字符
        countResult *= sUnitResultObj[item[i]]
      }
    }
    countArr.push(countResult)
  })
  // 计算arrResult数组总和
  // console.log(arrResult)
  // console.log(countArr)
  // console.log(countArr.reduce(getSum))
  return countArr.reduce(getSum)
}
function getSum(total, num) {
  return number_accuracy(total + num)
}

// 将数字保留到指定的位数，最后一位向下取
/**
 * number:数字字段或数字内容
 * num_digits：保留的位数,
 * 均为必填项
 * */
export function number_rounddown(number, num_digits) {
  if (isNaN(Number(number)) || isNaN(Number(num_digits))) {
    throwError()
  }
  const n = Number(number)
  const d = Number(num_digits)
  return Math.floor(n * Math.pow(10, d)) / Math.pow(10, d)
}

// 将数字保留到指定的位数，最后一位向上取
/**
 * number:数字字段或数字内容
 * num_digits：保留的位数,
 * 均为必填项
 * */
export function number_roundup(number, num_digits) {
  if (isNaN(Number(number)) || isNaN(Number(num_digits))) {
    throwError()
  }
  return Math.ceil(number * Math.pow(10, num_digits)) / Math.pow(10, num_digits)
}

// 计算数字num的n次方，n可以为分数或者整数

/**
 * number:数字字段或数字内容
 * n：次方数,
 * 均为必填项
 * */
export function number_power(number, n) {
  if (isNaN(Number(number)) || isNaN(Number(n))) {
    throwError()
  }
  if (!isFinite(Math.pow(Number(number), Number(n)))){
    throwError()
  }
  return number_accuracy(Math.pow(Number(number), Number(n)))
}

// 计算指定数字的自然对数
/**
 * number:数字字段或数字内容,number必填
 * */
export function number_ln(number) {
  if (isNaN(Number(number))) {
    throwError()
  }
  if (!isFinite(Math.log(Number(number)))) {
    throwError()
  }
  return Math.log(Number(number))
}

// 计算指定数字的平方根
/**
 * number:数字字段或数字内容,number必填
 * */
export function number_sqrt(number) {
  if (isNaN(Number(number))) {
    throwError()
  }
  return Math.sqrt(Number(number))
}
// 消除表达式计算精度误差
export function number_accuracy(exp) {
  throwError(exp)
  return math.evaluate(math.format(exp, 14))
}
