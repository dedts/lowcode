import { formatDate } from '@/util/index'
// YEAR
export function date_year(date) {
  throwError(date)
  return new Date(date).getFullYear()
}
// MONTH
export function date_month(date) {
  throwError(date)
  return new Date(date).getMonth() + 1
}
// DAY
export function date_day(date) {
  throwError(date)
  return new Date(date).getDate()
}
// HOUR
export function date_hour(date) {
  throwError(date)
  return new Date(date).getHours()
}
// MINUTE
export function date_minute(date) {
  throwError(date)
  return new Date(date).getMinutes()
}
// SECOND
export function date_second(date) {
  throwError(date)
  return new Date(date).getSeconds()
}
// DATE
export function date_date(format, year, month, day, hour, minute, second) {
  const basicYmr = `${year}-${addZero(month)}-${addZero(day)}`
  let basicFormat = `${year}-${month}-${day}`
  if (hour && minute) {
    if (second) {
      basicFormat += ` ${hour}:${minute}:${second}`
    } else {
      basicFormat += ` ${hour}:${minute}`
    }
  }
  const date = new Date(basicFormat)
  if (new Date(date) + '' === 'Invalid Date' || !checkDate(basicYmr)) {
    throwError(undefined, '参数不合法')
  }
  return formatDate(date, format)
}
// CURDATE
export function date_curDate(format) {
  return formatDate(new Date(), format)
}
// NOW
export function date_now(format) {
  return formatDate(new Date(), format)
}
// DAYS
export function date_days(end_timestamp, start_timestamp) {
  const endSeconds = new Date(end_timestamp).getTime()
  const startSeconds = new Date(start_timestamp).getTime()
  if (endSeconds >= startSeconds) {
    return Math.floor((endSeconds - startSeconds) / 1000 / 3600 / 24)
  } else {
    return -Math.floor((startSeconds - endSeconds) / 1000 / 3600 / 24)
  }
}
// DATEDELTA
export function date_dateDelta(timestamp, deltadays, format) {
  return formatDate(new Date(new Date(timestamp).getTime() + deltadays * 24 * 3600 * 1000), format)
}

// 将日期的值转化为特定格式的文本或数字
/**
 * format 支持4种格式
 * 年月日时分秒对应 yyyy, MM, dd, HH, mm, ss
 * 『 EEE 』,
 * E表示星期，结果为0~6，分别表示星期日~星期六,
 * EE表示星期，例如：周日、周一、周二等,
 * EEE表示星期，例如：星期日、星期一、星期二等
 * */

export function date_text(value, format) {
  throwError(value)
  const year = new Date(value).getFullYear()
  let month = new Date(value).getMonth() + 1 + ''
  let date = new Date(value).getDate() + ''
  let hours = new Date(value).getHours() + ''
  let minutes = new Date(value).getMinutes() + ''
  let seconds = new Date(value).getSeconds() + ''
  // 补0
  month = month.padStart(2, '0')
  date = ('00' + date).slice(-2)
  hours = ('00' + hours).slice(-2)
  minutes = ('00' + minutes).slice(-2)
  seconds = ('00' + seconds).slice(-2)
  //  按格式替换
  let formatDate = ''
  const week = new Date(value).getDay()
  const arr = ['日', '一', '二', '三', '四', '五', '六']
  if (format === 'E') {
    formatDate = week
  } else if (format === 'EE') {
    formatDate = '周' + arr[week]
  } else if (format === 'EEE') {
    formatDate = '星期' + arr[week]
  } else {
    const formatY = format.replace('yyyy', year)
    const formatM = formatY.replace('MM', month)
    const formatD = formatM.replace('dd', date)
    const formatH = formatD.replace('HH', hours)
    const formatm = formatH.replace('mm', minutes)
    formatDate = formatm.replace('ss', seconds)
  }

  return formatDate
}
// 验证日期(yyyy-MM-dd)的合法性
function checkDate(date) {
  const curDay = new Date(date).getDate()
  let digit = 2
  if (curDay < 10) {
    digit = 1
  }
  return curDay + '' === date.substring(date.length - digit)
}
// 补0
function addZero(str) {
  return (str + '').padStart(2, '0')
}

