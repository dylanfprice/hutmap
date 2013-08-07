from csv import DictWriter, DictReader
import codecs
import re
import validate
from csv_consts import CSV_NULL, CSV_NA, CSV_TRUE, CSV_FALSE

OLD_TO_NEW = {
  'Hut_ID': None,
  'Date_Added': None,
  'Status': None,
  'Date_Updated': 'date_updated',
  'Notes': None,
  'Discretion': 'discretion',
  'Country': 'country',
  'State': 'state',
  'Region': 'region',
  'Designations': 'designations',
  'Systems': 'systems',
  'Parent_Agency': 'agency_parent',
  'Agency': 'agency_name',
  'Agency_URL': 'agency_url',
  'Name': 'name',
  'Alternate_Names': 'alternate_names',
  'Hut_URL': 'hut_url',
  'Photo_URL': 'photo_url',
  'Photo_Credit_Name': 'photo_credit_name',
  'Photo_Credit_URL': 'photo_credit_url',
  'Hut_References': None,
  'Latitude': 'latitude',
  'Longitude': 'longitude',
  'Accuracy': 'location_accuracy',
  'Satview': None,
  'Location_References': 'location_references',
  'Altitude': 'altitude_meters',
  'Open_Summer': 'open_summer',
  'Open_Winter': 'open_winter',
  'Activities': None,
  'Backcountry': 'backcountry',
  'Access_NoSnow': 'access_no_snow',
  'NoSnow_minKM': 'no_snow_min_km',
  'Snow_minKM': 'snow_min_km',
  'Types': 'types',
  'Structures': 'structures',
  'Capacity_max': 'capacity_max',
  'Capacity_hutmin': 'capacity_hut_min',
  'Capacity_hutmax': 'capacity_hut_max',
  'Fee': None,
  'Fee_personmin': 'fee_person_min',
  'Fee_personmax': 'fee_person_max',
  'Fee_hutmin': 'fee_hut_min',
  'Fee_hutmax': 'fee_hut_max',
  'Reservations': 'reservations',
  'Locked': 'locked',
  'Services_Included': 'services',
  'Optional_Services_Available': 'has_optional_services',
  'Restrictions': 'restriction',
  'Private': 'private',
}

NEW = {
  'show_satellite': CSV_NULL,
  'is_snow_min_km': CSV_NULL,
  'is_fee_person': CSV_NULL,
  'is_fee_person_occupancy_min': CSV_NULL,
  'fee_person_occupancy_min': CSV_NULL, 
  'is_fee_hut': CSV_NULL,
  'is_fee_hut_occupancy_max': CSV_NULL,
  'fee_hut_occupancy_max': CSV_NULL,
  'has_services': CSV_NULL,
  'is_restricted': CSV_NULL,
  'published': CSV_TRUE,
}


def convert(csvfile):
  reader = DictReader(csvfile)
  new_rows = []
  for values in reader:
    new_row = {}

    for field in OLD_TO_NEW:
      if OLD_TO_NEW[field]:
        new_field = OLD_TO_NEW[field]
        value = values[field].strip()
        value = handle_special_fields(new_row, new_field, value)
        new_row[new_field] = value

    for col,default in NEW.iteritems():
      if col not in new_row:
        new_row[col] = default

    for field, value in new_row.items():
      value = convert_value(value)
      try:
        getattr(validate, 'validate_' + field)(value)
        new_row[field] = value
      except:
        print('field: {0}  field: {1}  value: {2}'.format(field, field, value))
        raise

    new_rows.append(new_row)
  return new_rows


def is_value(value):
  """
  Extracts 'is_value' information from value. If value is NA, is_value is
  false; if value is null, is_value is null; otherwise is_value is true.
  """
  if value == CSV_NA:
    return CSV_FALSE
  elif value == CSV_NULL:
    return CSV_NULL
  else:
    return CSV_TRUE


def handle_special_fields(row, field, value):
  """
  For special fields, e.g ones that we are splitting into two fields

  Returns the csv value that the given field should have.
  May modify row by adding new keys and values.
  """

  if field == 'snow_min_km':
    row['is_snow_min_km'] = is_value(value)
    return value

  if field == 'fee_person_min' or field == 'fee_person_max':
    row['is_fee_person'] = is_value(value)

    m = re.match(r'(\d+(.\d+)?) \((\d+)\)', value)
    if m:
      row['is_fee_person_occupancy_min'] = CSV_TRUE
      row['fee_person_occupancy_min'] = m.group(3)
      return m.group(1)
    else:
      row['is_fee_person_occupancy_min'] = CSV_FALSE
      row['fee_person_occupancy_min'] = CSV_NULL
      return value

  if field == 'fee_hut_min' or field == 'fee_hut_max':
    row['is_fee_hut'] = is_value(value)

    m = re.match(r'(\d+(.\d+)?) \((\d+)\)', value)
    if m:
      row['is_fee_hut_occupancy_max'] = CSV_TRUE
      row['fee_hut_occupancy_max'] = m.group(3)
      return m.group(1)
    else:
      row['is_fee_hut_occupancy_max'] = CSV_FALSE
      row['fee_hut_occupancy_max'] = CSV_NULL
      return value

  #if field == 'agency_parent':
  #  return CSV_NULL

  if field == 'locked' and value == 'Manned':
    return CSV_NULL

  if field.startswith('capacity') and value == 'various':
    return CSV_NULL

  if field == 'services':
    row['has_services'] = is_value(value)
    if value == '0': # special NA value for services
      row['has_services'] = CSV_FALSE

  if field == 'restriction':
    row['is_restricted'] = is_value(value)
    if value == '0': # special NA value for restriction
      row['is_restricted'] = CSV_FALSE
    elif value == '1':
      row['is_restricted'] = CSV_TRUE
      return CSV_NULL

  return value


def convert_value(value):
  """
  Convert csv representation of NA into null, turn numbers with
  commas into just numbers, etc. Returns the value that passed in value should
  have.
  """
  if value == CSV_NA:
    return CSV_NULL
  elif re.match(r'\d\d*,\d+', value): # 1,023 -> 1023
    return value.replace(',', '')
  elif re.match('- \d+(.\d+)?', value): # - 1.5 -> -1.5
    return value.replace(' ', '')
  elif value == '64 (Shuttle)':
    return '64'
  else:
    return value



if __name__ == '__main__':
  import sys
  fields = []
  for field in OLD_TO_NEW.values():
    if field:
      fields.append(field)
  fields.extend(NEW)
  fields.sort()
  filename = sys.argv[1]
  csvfile = open(filename, mode='r')
  outfile = sys.stdout
  new_rows = convert(csvfile)
  new_csvfile = DictWriter(outfile, fields)
  #outfile.write(codecs.BOM_UTF8)
  new_csvfile.writeheader()
  new_csvfile.writerows(new_rows)


