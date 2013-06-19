
CSV_NA = 'NA'
CSV_NULL = ''

DB_NA_POS_NUM = -1
DB_NA_STRING = ''
DB_NA_LIST = []
DB_NA_VALUES = (DB_NA_POS_NUM, DB_NA_STRING, DB_NA_LIST)

def from_csv(value, val_na, val_eval):
  """
  Converts csv values to db types

  val_na   is the value to return for NAs
  val_eval is a function which coerces value to python type, if value is not
           null or NA
  """
  if value == CSV_NULL:
    return None
  elif value == CSV_NA:
    return val_na
  else:
    return val_eval(value)

def to_csv(value, vals_na, val_eval):
  """
  Converts db types to csv

  vals_na  is a list of values which constitute NA
  val_eval is a function which coerces value to text, if value is not null or
           NA
  """
  if value is None:
    return CSV_NULL
  elif value in vals_na:
    return CSV_NA
  else:
    return val_eval(value)

