
/**
 * 表达式函数----高级函数
 * */

// 返回一个32位随机码
/**
 * len 随机码位数  最大100
 * */
export function senior_rdid(length) {
  const len = Number(length)
  if(len>100){
    throwError()
  }
  const ALPHA_NUMBER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  // 字符串转成数组
  const symbols = []
  for (let i = 0; i < ALPHA_NUMBER.length; i++) {
    symbols[i] = ALPHA_NUMBER.charAt(i)
  }
  // 随机拼接字符串
  let stateCode = ''
  for (let i = 0; i < len; i++) {
    stateCode += symbols[Math.floor((Math.random() * symbols.length))]
  }
  return stateCode
}

// 根据用户指定的正则表达式，验证文本是否满足条件，满足返回true，不满足返回false
/**
 * str 文本字段/要验证的文本，
 * reg 正则表达式，
 * */
export function senior_regtest(str, reg) {
  return reg.test(str)
}

// 累计器

