# -*- coding: utf-8 -*-
from csv_unicode import UnicodeDictReader, UnicodeDictWriter
import codecs
import re
import validate
import null_na

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
  'Services_Included': 'services_included',
  'Optional_Services_Available': 'optional_services_available',
  'Restrictions': 'restriction',
  'Private': 'private',
}


def convert(csvfile):
  reader = UnicodeDictReader(csvfile)
  new_rows = []
  for values in reader:
    new_row = {}
    for field in OLD_TO_NEW.keys():
      if OLD_TO_NEW[field]:
        new_field = OLD_TO_NEW[field]
        value = values[field]
        value = handle_special_fields(value, new_field, new_row)
        value = convert_value(value)
        try:
          getattr(validate, 'validate_' + new_field)(value)
          new_row[new_field] = value
        except:
          print('field: {0}  new_field: {1}  value: {2}'.format(field, new_field, value))
          raise

    new_row['published'] = '0'
    new_row['show_satellite'] = '0'
    new_row['overnight'] = '0'
    new_rows.append(new_row)
  return new_rows


def handle_special_fields(value, new_field, new_row):
  """
  For special fields, e.g ones that we are splitting into two fields

  Returns the value that the passed in value should have.
  May modify new_row by adding a new key and value.
  """

  if new_field.startswith('fee_person'):
    m = re.match(r'(\d+(.\d+)?) \((\d+)\)', value)
    if m:
      new_row['fee_person_occupancy_min'] = m.group(3)
      return m.group(1)
    else:
      new_row['fee_person_occupancy_min'] = null_na.CSV_NA
      return value

  if new_field.startswith('fee_hut'):
    m = re.match(r'(\d+(.\d+)?) \((\d+)\)', value)
    if m:
      new_row['fee_hut_occupancy_max'] = m.group(3)
      return m.group(1)
    else:
      new_row['fee_hut_occupancy_max'] = null_na.CSV_NA
      return value

  #if new_field == 'agency_parent':
  #  return null_na.CSV_NULL

  if new_field == 'locked' and value == 'Manned':
    return null_na.CSV_NULL

  if new_field.startswith('capacity') and value == 'various':
    return null_na.CSV_NULL

  if new_field == 'services_included' and value == '0':
    return null_na.CSV_NA

  return value


def convert_value(value):
  """Convert current representations of null and NA into new, turn numbers with
  commas into just numbers, etc. Returns the value that passed in value should
  have."""
  if value == '':
    return null_na.CSV_NULL
  elif value == 'NA':
    return null_na.CSV_NA
  elif re.match(r'\d\d*,\d+', value):
    return value.replace(',', '')
  elif re.match('- \d+(.\d+)?', value):
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
  fields.extend(['fee_person_occupancy_min', 'fee_hut_occupancy_max', 'published', 'show_satellite', 'overnight'])
  fields.sort()
  filename = sys.argv[1]
  csvfile = open(filename, mode='r')
  outfile = sys.stdout
  new_rows = convert(csvfile)
  new_csvfile = UnicodeDictWriter(outfile, fields)
  outfile.write(codecs.BOM_UTF8)
  new_csvfile.writeheader()
  new_csvfile.writerows(new_rows)


