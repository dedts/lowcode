import * as exp_date_fn from './exp_date'
import * as exp_logic_fn from './exp_logic'
import * as exp_number_fn from './exp_number'
import * as exp_senior_fn from './exp_senior'
import * as exp_text_fn from './exp_text'

const AllFn = {
  ...exp_date_fn,
  ...exp_logic_fn,
  ...exp_number_fn,
  ...exp_senior_fn,
  ...exp_text_fn
}
for (const i in AllFn) {
  window[i] = AllFn[i]
}
