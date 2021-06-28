export const expressionJson = [
  {
    category: '逻辑函数',
    fnType: 'logic',
    funcs: [
      {
        value: 'IF()',
        label: 'IF',
        detailDesc: '根据判断条件的正确(true)或错误(false)，返回不同的值',
        guideDesc: '判断条件，真值，假值均为必填项，否则函数无法运算',
        args: [{
          name: '判断条件', type: Boolean
        }, {
          name: '真值', type: String
        }, {
          name: '假值', type: String
        }],
        returnType: Boolean
      }, {
        value: 'IFS()',
        label: 'IFS',
        detailDesc: '检查是否满足一个或多个条件，且返回符合第一个 TRUE 条件的值',
        guideDesc: `1、判断条件1，真值1，为必填项，否则函数无法运算；\n' +
          '   2、判断条件1不符合时，会进入判断条件2，如果判断条件1符合，则不会进入判断条件2；\n' +
          '\n' +
          '   3、IFS函数不需要输入假值，如果不满足所有判断条件，则输出“ ”空值作为默认假值；`,
        args: [{
          name: '判断条件', type: Boolean
        }, {
          name: '真值', type: String
        }, {
          name: '判断条件2', type: Boolean
        }, {
          name: '真值2', type: String
        }],
        returnType: Boolean
      }, {
        value: 'AND()',
        label: 'AND',
        detailDesc: '任何一个参数的逻辑值为false，即返回false；只有当所有参数的逻辑值为true，才返回true。',
        guideDesc: 'logical:逻辑值，例如，2>1的逻辑值为true。',
        args: [{
          name: 'logical1', type: Boolean
        }, {
          name: 'logical2', type: Boolean
        }],
        returnType: Boolean
      }, {
        value: 'OR()',
        label: 'OR',
        detailDesc: '任何一个参数逻辑值为true，即返回true；只有当所有逻辑参数值为false，才返回false。',
        guideDesc: 'logical:逻辑值，例如，2>1的逻辑值为true',
        args: [{
          name: 'logical1', type: Boolean
        }, {
          name: 'logical2', type: Boolean
        }],
        returnType: Boolean
      }, {
        value: 'XOR()',
        label: 'XOR',
        detailDesc: '返回所有参数的异或值。异或是指，两个值相同，返回false，两个值不同，返回true。',
        guideDesc: 'logical:逻辑值，例如，2>1的逻辑值为true',
        args: [{
          name: 'logical1', type: Boolean
        }, {
          name: 'logical2', type: Boolean
        }],
        returnType: Boolean
      }, {
        value: 'NOT()',
        label: 'NOT',
        detailDesc: '返回参数逻辑值的反值。NOT(2>1)的结果就是false。',
        guideDesc: 'logical:逻辑值，例如，2>1的逻辑值为true，1>2的逻辑值为false',
        args: [{
          name: 'logical', type: Boolean
        }],
        returnType: Boolean
      }, {
        value: 'ISEMPTY()',
        label: 'ISEMPTY',
        detailDesc: '判断值是否为空字符串或者空数组。如果是空值，返回true。',
        guideDesc: '可以判断字段是否填写。单选，多选，下拉选择，图片选择，成员字段有没有选值。附件有没有上传。',
        args: [{
          name: 'text', type: String
        }],
        returnType: Boolean
      }
    ]
  }, {
    category: '文本函数',
    fnType: 'text',
    funcs: [
      {
        value: 'CONCAT()',
        label: 'CONCAT',
        detailDesc: '字符串连接函数，连接函数中的所有字段',
        guideDesc: 'text:字段或内容。至少要有一个及以上字段或内容，否则函数无法运算。被连接的字段或者函数之间，用逗号隔开。如果是字符串，需要用引号包裹起来。',
        args: [{
          name: 'text1', type: String
        }, {
          name: 'text2', type: String
        }],
        returnType: String
      }, {
        value: 'MID()',
        label: 'MID',
        detailDesc: '返回字符串中从指定位置开始的特定数目的字符，该数目由用户指定',
        guideDesc: '字段或内容,startnum:指定的位置,.numchars:指定的字符数量。均为必填项，否则函数无法运算。',
        args: [{
          name: 'text', type: String
        }, {
          name: 'startnum', type: Number
        }, {
          name: 'numchars', type: Number
        }],
        returnType: String
      }, {
        value: 'LEFT()',
        label: 'LEFT',
        detailDesc: '从一个字段的左数第一个字符开始返回指定个数的字符',
        guideDesc: 'text:字段或内容,num_chars:指定的字符数量。均为必填项，否则函数无法运算。',
        args: [{
          name: 'text', type: String
        }, {
          name: 'num_chars', type: Number
        }],
        returnType: String
      }, {
        value: 'RIGHT()',
        label: 'RIGHT',
        detailDesc: '从一个字段的右数第一个字符开始返回指定个数的字符',
        guideDesc: 'text:字段或内容,num_chars:指定的字符数量,均为必填项，否则函数无法运算。',
        args: [{
          name: 'text', type: String
        }, {
          name: 'num_chars', type: Number
        }],
        returnType: String
      }, {
        value: 'LEN()',
        label: 'LEN',
        detailDesc: '返回文本字符串中的字符个数。',
        guideDesc: 'text:想要计算长度的字段或字符串，必填。',
        args: [{
          name: 'text', type: String
        }],
        returnType: Number
      }, {
        value: 'UPPER()',
        label: 'UPPER',
        detailDesc: '将文本字符串中的小写字母变成大写。',
        guideDesc: 'text:文本字段或字符串，必填。',
        args: [{
          name: 'text', type: String
        }],
        returnType: String
      }, {
        value: 'LOWER()',
        label: 'LOWER',
        detailDesc: '将文本字符串中的大写字母变成小写。',
        guideDesc: 'text:文本字段或字符串，必填。',
        args: [{
          name: 'text', type: String
        }],
        returnType: String
      }, {
        value: 'REPLACE()',
        label: 'REPLACE',
        detailDesc: '根据指定的字符数，将字符串中部分内容替换为不同的字符串。',
        guideDesc: 'oldtext:想要替换的字段或内容,startnum:指定的位置,numchars:指定的字符数量,newtext:替换的字段或内容,均为必填项，否则函数无法运算。',
        args: [{
          name: 'oldtext', type: String
        }, {
          name: 'startnum', type: Number
        }, {
          name: 'numchars', type: Number
        }, {
          name: 'newtext', type: String
        }],
        returnType: String
      }, {
        value: 'SEARCH()',
        label: 'SEARCH',
        detailDesc: '在第二个字段中查找第一个字段，并返回第一个字段字符串的起始位置的编号，该编号从第二个字段字符串的第一个字符算起。返回0则表示没有查到。',
        guideDesc: 'findtext:要查找的字段或者字符串，必填项,withintext:被查询的字段或者字符串，必填项,[start_num]：查询的起始位置，不填默认为1。填写小于1的整数都算作是1。',
        args: [{
          name: 'findtext', type: String
        }, {
          name: 'withintext', type: String
        }, {
          name: 'start_num', type: Number
        }],
        returnType: Number
      }
    ]
  }, {
    category: '数字函数',
    fnType: 'number',
    funcs: [
      {
        value: 'AVERAGE()',
        label: 'AVERAGE',
        detailDesc: '返回所有参与运算数字的平均值',
        guideDesc: 'number:数字字段或数字内容,至少要有一个及以上字段或内容，否则函数无法运算。',
        args: [{
          name: 'number1', type: Number
        }, {
          name: 'number2', type: Number
        }],
        returnType: Number
      }, {
        value: 'COUNT()',
        label: 'COUNT',
        detailDesc: '返回所有参与运算字段中值（字符串）的数量',
        guideDesc: '字段,至少要有一个及以上字段或内容，否则函数无法运算。',
        args: [{
          name: 'value1', type: String
        }, {
          name: 'value2', type: String
        }],
        returnType: Number
      }, {
        value: 'MAX()',
        label: 'MAX',
        detailDesc: '返回所有参与数字中的最大值',
        guideDesc: '数字字段或数字内容,至少要有一个及以上字段或内容，否则函数无法运算。',
        args: [{
          name: 'number1', type: Number
        }, {
          name: 'number2', type: Number
        }],
        returnType: Number
      }, {
        value: 'MIN()',
        label: 'MIN',
        detailDesc: '返回所有参与数字中的最小值，用法同MAX()',
        guideDesc: '数字字段或数字内容,至少要有一个及以上字段或内容，否则函数无法运算。',
        args: [{
          name: 'number1', type: Number
        }, {
          name: 'number2', type: Number
        }],
        returnType: Number
      }, {
        value: 'ROUND()',
        label: 'ROUND',
        detailDesc: '将数字四舍五入到指定的位数',
        guideDesc: 'number:数字字段或数字内容,num_digits：保留的位数,均为必填项，否则函数无法运算。',
        args: [{
          name: 'number', type: Number
        }, {
          name: 'num_digits', type: Number
        }],
        returnType: Number
      }, {
        value: 'INT()',
        label: 'INT',
        detailDesc: '将数字向下取整',
        guideDesc: 'number:数字字段或数字内容,number必填，否则函数无法运算。',
        args: [{
          name: 'number', type: Number
        }],
        returnType: Number
      }, {
        value: 'MOD()',
        label: 'MOD',
        detailDesc: '返回两数相除的余数',
        guideDesc: 'number:数字字段或数字内容,divisor:除数,均为必填项，否则函数无法运算。',
        args: [{
          name: 'number', type: Number
        }, {
          name: 'divisor', type: Number
        }],
        returnType: Number
      }, {
        value: 'PRODUCT()',
        label: 'PRODUCT',
        detailDesc: '返回所有参与字段中数值的乘积',
        guideDesc: 'number:数字字段或数字内容,至少要有一个及以上字段或内容，否则函数无法运算。',
        args: [{
          name: 'number1', type: Number
        }, {
          name: 'number2', type: Number
        }],
        returnType: Number
      }, {
        value: 'SUM()',
        label: 'SUM',
        detailDesc: '返回所有参与字段中数值的总和',
        guideDesc: 'number：数字字段或数字内容,至少要有一个及以上字段或内容，否则函数无法运算。',
        args: [{
          name: 'number1', type: Number
        }, {
          name: 'number2', type: Number
        }],
        returnType: Number
      }, {
        value: 'SUMPRODUCT()',
        label: 'SUMPRODUCT',
        detailDesc: '在给定的数组中，将数组间对应的元素相乘，并返回乘积之和',
        guideDesc: 'array:数字数组,至少要有一个及以上字段或内容，否则函数无法运算。如果数组内值的数量不一样，以最少的为准。例{1,2,3,4}，{1,2}，{1,2}的乘积之和是9=1*1*1+2*2*2。',
        args: [{
          name: 'array1', type: Array
        }, {
          name: 'array2', type: Array
        }],
        returnType: Number
      },
      // {
      //   value: 'SUMIF()',
      //   label: 'SUMIF',
      //   detailDesc: '统计表格中符合条件的数值，并求和',
      //   guideDesc: 'array:数字数组,至少要有一个及以上字段或内容，否则函数无法运算。',
      //   args: [{
      //     name: 'array1', type: Array
      //   }, {
      //     name: 'text', type: String
      //   }, {
      //     name: 'array2', type: Array
      //   }],
      //   returnType: Number
      // },
      // {
      //   value: 'NUM()',
      //   label: 'NUM',
      //   detailDesc: '返回文本中的数字',
      //   guideDesc: '可以获取单行文本，单项选择，下拉选择，数据关联字段中的数字。',
      //   args: [{
      //     name: 'text', type: String
      //   }],
      //   returnType: Number
      // },
      {
        value: 'RMBUPPER()',
        label: 'RMBUPPER',
        detailDesc: '把数字转换为大写的中文金额。',
        guideDesc: '35457.567,转化结果：叁万伍仟肆佰伍拾柒元伍角陆分柒毫',
        args: [{
          name: 'number', type: Number
        }],
        returnType: String
      }, {
        value: 'RMBTONUM()',
        label: 'RMBTONUM',
        detailDesc: '把大写的中文金额转换为数字。',
        guideDesc: '叁万伍仟肆佰伍拾柒元伍角陆分柒毫, 转化结果：35457.567',
        args: [{
          name: 'str', type: String
        }],
        returnType: Number
      },
      {
        value: 'ROUNDUP()',
        label: 'ROUNDUP',
        detailDesc: '将数字保留到指定的位数，最后一位向上取。',
        guideDesc: 'number:数字字段或数字内容,num_digits：保留的位数,均为必填项，否则函数无法运算。',
        args: [{
          name: 'number', type: Number
        }, {
          name: 'num_digits', type: Number
        }],
        returnType: Number
      }, {
        value: 'ROUNDDOWN()',
        label: 'ROUNDDOWN',
        detailDesc: '将数字保留到指定的位数，最后一位向下取。',
        guideDesc: 'number:数字字段或数字内容,num_digits：保留的位数,均为必填项，否则函数无法运算。',
        args: [{
          name: 'number', type: Number
        }, {
          name: 'num_digits', type: Number
        }],
        returnType: Number
      }, {
        value: 'POWER()',
        label: 'POWER',
        detailDesc: '计算数字num的n次方，n可以为分数或者整数',
        guideDesc: 'number:数字字段或数字内容,均为必填项，否则函数无法运算。',
        args: [{
          name: 'number', type: Number
        }, {
          name: 'number', type: Number
        }],
        returnType: Number
      }, {
        value: 'LN()',
        label: 'LN',
        detailDesc: '计算指定数字的自然对数',
        guideDesc: 'number:数字字段或数字内容,number必填，否则函数无法运算',
        args: [{
          name: 'number', type: Number
        }],
        returnType: Number
      }, {
        value: 'SQRT()',
        label: 'SQRT',
        detailDesc: '计算指定数字的平方根',
        guideDesc: 'number:数字字段或数字内容,number必填，否则函数无法运算。',
        args: [{
          name: 'number', type: Number
        }],
        returnType: Number
      },
      {
        value: 'ACCURACY()',
        label: 'ACCURACY',
        detailDesc: '消除计算精度误差',
        guideDesc: 'exp:计算表达式,exp必填，否则函数无法运算。',
        args: [{
          name: 'number', type: Number
        }],
        returnType: Number
      }
    ]
  }, {
    category: '时间函数',
    fnType: 'date',
    funcs: [
      {
        value: 'YEAR()',
        label: 'YEAR',
        detailDesc: '返回日期中的年份',
        guideDesc: 'date:日期字段，必填',
        args: [{
          name: 'date', type: Date
        }],
        returnType: Date
      }, {
        value: 'MONTH()',
        label: 'MONTH',
        detailDesc: '返回日期中的月份，用法同YEAR()',
        guideDesc: 'date:日期字段，必填',
        args: [{
          name: 'date', type: Date
        }],
        returnType: Date
      }, {
        value: 'DAY()',
        label: 'DAY',
        detailDesc: '返回日期中的月份，用法同YEAR()',
        guideDesc: 'date:日期字段，必填',
        args: [{
          name: 'date', type: Date
        }],
        returnType: Date
      }, {
        value: 'HOUR()',
        label: 'HOUR',
        detailDesc: '返回日期中的小时，用法同YEAR()',
        guideDesc: 'date:日期字段，必填',
        args: [{
          name: 'date', type: Date
        }],
        returnType: Date
      }, {
        value: 'MINUTE()',
        label: 'MINUTE',
        detailDesc: '返回日期中的分钟，用法同YEAR()',
        guideDesc: 'date:日期字段，必填',
        args: [{
          name: 'date', type: Date
        }],
        returnType: Date
      }, {
        value: 'SECOND()',
        label: 'SECOND',
        detailDesc: '返回日期中的秒，用法同YEAR()',
        guideDesc: 'date:日期字段，必填',
        args: [{
          name: 'date', type: Date
        }],
        returnType: Date
      }, {
        value: 'DATE()',
        label: 'DATE',
        detailDesc: '将数字拼接成为年份',
        guideDesc: 'year:数字字段或数字内容,month:数字字段或数字内容,day:数字字段或数字内容,hour:数字字段或数字内容,minute:数字字段或数字内容,均为必填项，否则函数无法运算。',
        args: [{
          name: 'year', type: String
        }, {
          name: 'month', type: String
        }, {
          name: 'day', type: String
        }, {
          name: 'hour', type: String
        }, {
          name: 'minute', type: String
        }],
        returnType: Date
      }, {
        value: 'CURDATE()',
        label: 'CURDATE',
        detailDesc: '返回当前日期，可以在单行文本字段和日期字段中使用。',
        guideDesc: '括号中无需填写内容，可以直接使用',
        returnType: Date
      }, {
        value: 'NOW()',
        label: 'NOW',
        detailDesc: '返回当前日期时间,精准到时／分／秒，用法同CURDATE()。(日期字段需要勾选“精确到时／分／秒”，才能显示精准时间)',
        guideDesc: '括号中无需填写内容，可以直接使用',
        returnType: Date
      }, {
        value: 'DAYS()',
        label: 'DAYS',
        detailDesc: '返回两个日期字段之间的天数，可返回负值。例如，2018/1/30与2018/1/28相差2天。',
        guideDesc: 'end_timestamp: 必填项。结束日期。start_timestamp: 必填项。起始日期。',
        args: [{
          name: 'end_timestamp', type: Date
        }, {
          name: 'start_timestamp', type: Date
        }],
        returnType: Date
      }, {
        value: 'DATEDELTA()',
        label: 'DATEDELTA',
        detailDesc: '将指定日期加/减指定天数，并显示目标日期。',
        guideDesc: 'timestamp: 必填项。初始日期。deltadays: 必填项。需要加减的天数。正数为增加，负数为减少。',
        args: [{
          name: 'timestamp', type: Date
        }, {
          name: 'deltadays', type: Number
        }],
        returnType: Date
      }, {
        value: 'TEXT()',
        label: 'TEXT',
        detailDesc: '将字段的值转化为特定格式的文本或数字',
        guideDesc: `value:字段或内容,text_format:特定的格式,目前提供以下格式：
 1.将日期时间字段的『 年月日，时分秒 』转化为『 YYYY MM DD,HH mm ss 』的特定格式(不填写时分秒也可以执行)。value,text_format均为必填项，否则函数无法运算。年月日时分秒对应 YYYY, MM, DD, HH, mm, ss。
2.将日期时间字段转化为星期格式。『 EEE 』,E表示星期，结果为0~6，分别表示星期日~星期六,EE表示星期，例如：周日、周一、周二等,EEE表示星期，例如：星期日、星期一、星期二等`,
        args: [{
          name: 'value', type: String
        }, {
          name: 'text_format', type: String
        }],
        returnType: String
      }
    ]
  }, {
    category: '高级函数',
    fnType: 'senior',
    funcs: [{
      value: 'RDID()',
      label: 'RDID',
      detailDesc: '返回一个随机码，是字符串，请在文本字段里使用。',
      guideDesc: '括号中无需填写内容，可以直接使用',
      returnType: Date
    },
    //   {
    //   value: 'RECNO()',
    //   label: 'RECNO',
    //   detailDesc: '累计器，依据当前表单被新打开的次数进行不断累加计算，起始值为1。',
    //   guideDesc: '可用于流水号的自动生成。',
    //   returnType: Date
    // },
    {
      value: 'REGTEST()',
      label: 'REGTEST',
      detailDesc: '根据用户指定的正则表达式，验证文本是否满足条件，满足返回true，不满足返回false，可以与IF等逻辑方法结合使用',
      guideDesc: '根据用户指定的正则表达式，验证文本是否满足条件，满足返回true，不满足返回false，可以与IF等逻辑方法结合使用',
      args: [{
        name: 'text', type: String
      }, {
        name: 'verify', type: String
      }, {
        name: 'verify', type: String
      }],
      returnType: Boolean
    }]
  }
]
