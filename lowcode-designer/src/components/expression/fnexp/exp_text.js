/**
 * 表达式函数----文本函数
 * */

// 连接函数中的所有字段
/*
  * text:字段或内容。至少要有一个及以上字段或内容，否则函数无法运算。
  * 被连接的字段或者函数之间，用逗号隔开。如果是字符串，需要用引号包裹起来。*/
export function text_concat() {
  const arg = Array.from(arguments)
  let text = ''
  arg.forEach((item, index) => {
    if (typeof (item) === 'string') {
      if (index !== 0) {
        text += `,'` + item + `'`
      } else {
        text += `'` + item + `'`
      }
    } else {
      if (index !== 0) {
        text += `,` + item
      } else {
        text += item
      }
    }
  })
  return text
}

// 返回字符串中从指定位置开始的特定数目的字符，该数目由用户指定
/**
 * text:字段或内容,
 * start:指定的位置,
 * len:指定的字符长度
 * */
export function text_mid(text, start, len) {
  if (Object.keys(arguments).length !== 3 || typeof text !== 'string' || typeof start !== 'number' || typeof len !== 'number') {
    throwError()
  }
  return text.substr(start, len)
}

// 从一个字段的左数第一个字符开始返回指定个数的字符
/**
 * text:字段或内容,
 * len:指定的字符长度
 * */
export function text_left(text, len) {
  if (Object.keys(arguments).length !== 2 || typeof len !== 'number' || typeof text !== 'string') {
    throwError()
  }
  return text.substr(0, len)
}

// 从一个字段的右数第一个字符开始返回指定个数的字符
/**
 * text:字段或内容,
 * len:指定的字符长度
 * */
export function text_right(text, len) {
  if (Object.keys(arguments).length !== 2 || typeof len !== 'number' || typeof text !== 'string') {
    throwError()
  }
  return text.substr(0 - len, len)
}

// 返回文本字符串中的字符个数。
/**
 * text:字段或内容,
 * */
export function text_len(text) {
  return text.length
}
// 将文本字符串中的小写字母变成大写
/**
 * text:字段或内容,
 * */
export function text_upper(text) {
  return text.toUpperCase()
}

// 将文本字符串中的大写字母变成小写。
/**
 * text:字段或内容,
 * */
export function text_lower(text) {
  return text.toLowerCase()
}

// 根据指定的字符数，将字符串中部分内容替换为不同的字符串
/**
 * oldtext:想要替换的字段或内容,
 * start:指定开始的位置,
 * len:指定的字符长度,
 * newtext:替换的字段或内容
 * */
export function text_replace(oldText, start, len, newText) {
  const oldTextLen = oldText.length
  const before = oldText.substr(0, start)
  const after = oldText.substr(start + len, oldTextLen)
  return before + newText + after
}

// 在第二个字段中查找第一个字段，并返回第一个字段字符串的起始位置的编号，该编号从第二个字段字符串的第一个字符算起。返回-1则表示没有查到
/**
 * findtext:要查找的字段或者字符串，必填项,
 * withintext:被查询的字段或者字符串，必填项,
 * start_num：查询的起始位置，不填默认为0。填写小于0的整数都算作是0。
 * */
export function text_search(findText, withinText, start_num = 0) {
  if (!findText || !withinText || typeof findText !== 'string' || typeof withinText !== 'string') {
    throwError()
  }
  if (start_num < 0) {
    start_num = 0
  }
  console.log(withinText)
  return withinText.indexOf(findText, start_num)
}

