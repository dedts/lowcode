// 逻辑函数
const exp_logic_fns = [
  {
    keyword: 'IF',
    fnName: 'logic_if'
  },
  {
    keyword: 'IFS',
    fnName: 'logic_ifs'
  },
  {
    keyword: 'AND',
    fnName: 'logic_and'
  },
  {
    keyword: 'OR',
    fnName: 'logic_or'
  },
  {
    keyword: 'XOR',
    fnName: 'logic_xor'
  },
  {
    keyword: 'NOT',
    fnName: 'logic_not'
  },
  {
    keyword: 'ISEMPTY',
    fnName: 'logic_isempty'
  }
]
// 文本函数
const exp_text_fn = [
  {
    keyword: 'CONCAT',
    fnName: 'text_concat'
  },
  {
    keyword: 'MID',
    fnName: 'text_mid'
  },
  {
    keyword: 'LEFT',
    fnName: 'text_left'
  },
  {
    keyword: 'RIGHT',
    fnName: 'text_right'
  },
  {
    keyword: 'LEN',
    fnName: 'text_len'
  },
  {
    keyword: 'UPPER',
    fnName: 'text_upper'
  },
  {
    keyword: 'LOWER',
    fnName: 'text_lower'
  },
  {
    keyword: 'REPLACE',
    fnName: 'text_replace'
  },
  {
    keyword: 'SEARCH',
    fnName: 'text_search'
  }
]
// 数字函数
const exp_number_fn = [
  {
    keyword: 'AVERAGE',
    fnName: 'number_average'
  },
  {
    keyword: 'SUM',
    fnName: 'number_sum'
  },
  {
    keyword: 'PRODUCT',
    fnName: 'number_product'
  },
  {
    keyword: 'COUNT',
    fnName: 'number_count'
  },
  {
    keyword: 'MAX',
    fnName: 'number_max'
  },
  {
    keyword: 'MIN',
    fnName: 'number_min'
  },
  {
    keyword: 'ROUND',
    fnName: 'number_round'
  },
  {
    keyword: 'INT',
    fnName: 'number_int'
  },
  {
    keyword: 'MOD',
    fnName: 'number_mod'
  },
  {
    keyword: 'SUMPRODUCT',
    fnName: 'number_sumproduct'
  },
  {
    keyword: 'NUM',
    fnName: 'number_sum'
  },
  {
    keyword: 'RMBUPPER',
    fnName: 'number_rmbupper'
  },
  {
    keyword: 'RMBTONUM',
    fnName: 'number_rmbToNum'
  },
  {
    keyword: 'ROUNDDOWN',
    fnName: 'number_rounddown'
  },
  {
    keyword: 'ROUNDUP',
    fnName: 'number_roundup'
  },
  {
    keyword: 'POWER',
    fnName: 'number_power'
  },
  {
    keyword: 'LN',
    fnName: 'number_ln'
  },
  {
    keyword: 'SQRT',
    fnName: 'number_sqrt'
  },
  {
    keyword: 'ACCURACY',
    fnName: 'number_accuracy'
  }
]
// 时间函数
const exp_date_fns = [
  {
    keyword: 'YEAR',
    fnName: 'date_year'
  },
  {
    keyword: 'MONTH',
    fnName: 'date_month'
  },
  {
    keyword: 'DAY',
    fnName: 'date_day'
  },
  {
    keyword: 'HOUR',
    fnName: 'date_hour'
  },
  {
    keyword: 'MINUTE',
    fnName: 'date_minute'
  },
  {
    keyword: 'SECOND',
    fnName: 'date_second'
  },
  {
    keyword: 'DATE',
    fnName: 'date_date'
  },
  {
    keyword: 'CURDATE',
    fnName: 'date_curDate'
  },
  {
    keyword: 'NOW',
    fnName: 'date_now'
  },
  {
    keyword: 'DAYS',
    fnName: 'date_days'
  },
  {
    keyword: 'DATEDELTA',
    fnName: 'date_dateDelta'
  },
  {
    keyword: 'TEXT',
    fnName: 'date_text'
  }
]
// 高级函数
const exp_senior_fn = [
  {
    keyword: 'RDID',
    fnName: 'senior_rdid'
  },
  {
    keyword: 'RECNO',
    fnName: 'senior_recno'
  },
  {
    keyword: 'REGTEST',
    fnName: 'senior_regtest'
  }
]
export default [
  ...exp_logic_fns,
  ...exp_text_fn,
  ...exp_number_fn,
  ...exp_date_fns,
  ...exp_senior_fn
]
