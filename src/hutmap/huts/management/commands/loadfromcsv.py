from csv import DictReader
from datetime import datetime
from django.core.management.base import BaseCommand
from huts.models import Hut, Agency, Region, Designation, System, AccessType,\
                        HutType, Service
from huts.model_fields import lookup_country_code
from huts.utils.csv_consts import CSV_NULL, CSV_TRUE


class Command(BaseCommand):
  args = '<csvfile>'
  help = 'Imports the given csvfile into the database.'

  def handle(self, *args, **options):
    if len(args) == 1:

      with open(args[0], 'r') as csvfile:
        reader = DictReader(csvfile)
        for values in reader:
          save_agency(values)

      with open(args[0], 'r') as csvfile:
        reader = DictReader(csvfile)
        for values in reader:
          save_hut(values)


def get(values, key, val_eval):
  value = values[key]
  if value == CSV_NULL:
    return None
  else:
    return val_eval(value)

def get_string(values, key):
  return get(values, key, lambda x: x)

def get_datetime(values, key):
  return get(values, key,
      lambda x: datetime.strptime(x, '%Y-%m-%d'))

def get_list(values, key):
  return get(values, key, 
      lambda values: [x.strip() for x in values.split(',')])

def get_bool(values, key):
  return get(values, key, lambda x: x == CSV_TRUE)

def get_pos_int(values, key):
  return get(values, key, lambda x: int(x))

def get_pos_float(values, key):
  return get(values, key, lambda x: float(x))

def get_float(values, key):
  return get(values, key, lambda x: float(x))

def get_hut_name(values):
  name = get_string(values, 'name')
  if name is None:
    types = get_list(values, 'types')
    if types:
      name = 'Unknown {}'.format(types[0])
    else:
      name = 'Unknown'
  return name

def save_m2m(model_inst, m2m_model, values, key):
  all_values = get_list(values, key)
  if not all_values:
    return None
  for value in all_values:
    identifier = value.replace(' ', '-').lower()
    obj, created = m2m_model.objects.get_or_create(
      name=value,
      identifier=identifier,
    )
    getattr(model_inst, key).add(obj)

def save_agency(values):
  agency_parent = get_string(values, 'agency_parent')
  parent_agency = None
  if agency_parent:
    parent_agency, created = Agency.objects.get_or_create(
      name = agency_parent,
    )

  agency_name = get_string(values, 'agency_name')
  if agency_name:
    agency, created = Agency.objects.get_or_create(
      name = agency_name,
      parent = parent_agency,
    )
    agency.url = get_string(values, 'agency_url')
    agency.email = get_string(values, 'agency_email')
    agency.phone = get_string(values, 'agency_phone')
    agency.address = get_string(values, 'agency_address')
    agency.save()


def save_hut(values):
  # only save huts from WA and CO
  #state = values['state']
  #if state not in ['Washington', 'Colorado']:
  #  return

  if not values['latitude'] or not values['longitude']:
    return

  try:
    region_name = get_string(values, 'region')
    region = None
    if region_name:
      region, created = Region.objects.get_or_create(
        region=region_name
      )

    agency_name = get_string(values, 'agency_name')
    agency = None
    if agency_name:
      agency = Agency.objects.get(name=get_string(values, 'agency_name'))

    hut, created = Hut.objects.get_or_create(
      updated = get_datetime(values, 'date_updated'),
      discretion = get_bool(values, 'discretion'),

      location = 'POINT({0} {1})'.format(get_float(values, 'longitude'), get_float(values, 'latitude')),
      altitude_meters = get_pos_int(values, 'altitude_meters'),
      location_accuracy = get_pos_int(values, 'location_accuracy'),
      show_satellite = get_bool(values, 'show_satellite'),
      show_topo = get_bool(values, 'show_topo'),
      location_references = get_list(values, 'location_references'),

      country = lookup_country_code(get_string(values, 'country')),
      state = get_string(values, 'state'),
      region = region,
      # designations is m2m
      # systems is m2m

      agency = agency,

      name = get_hut_name(values),
      alternate_names = get_list(values, 'alternate_names'),
      hut_url = get_string(values, 'hut_url'),
      hut_references = get_list(values, 'hut_references'),
      photo_url = get_string(values, 'photo_url'),
      photo_credit_name = get_string(values, 'photo_credit_name'),
      photo_credit_url = get_string(values, 'photo_credit_url'),
      backcountry = get_pos_int(values, 'backcountry'),
      open_summer = get_bool(values, 'open_summer'),
      open_winter = get_bool(values, 'open_winter'),

      # access_no_snow is m2m
      no_snow_min_km = get_pos_float(values, 'no_snow_min_km'),
      is_snow_min_km = get_bool(values, 'is_snow_min_km'),
      snow_min_km = get_pos_float(values, 'snow_min_km'),

      # types is m2m
      structures = get_pos_int(values, 'structures'),
      overnight = get_bool(values, 'overnight'),

      capacity_max = get_pos_int(values, 'capacity_max'),
      capacity_hut_min = get_pos_int(values, 'capacity_hut_min'),
      capacity_hut_max = get_pos_int(values, 'capacity_hut_max'),

      is_fee_person = get_bool(values, 'is_fee_person'),
      fee_person_min = get_pos_float(values, 'fee_person_min'),
      fee_person_max = get_pos_float(values, 'fee_person_max'),
      is_fee_person_occupancy_min = get_bool(values, 'is_fee_person_occupancy_min'),
      fee_person_occupancy_min  =  get_pos_int(values, 'fee_person_occupancy_min'),
      is_fee_hut = get_bool(values, 'is_fee_hut'),
      fee_hut_min = get_pos_float(values, 'fee_hut_min'),
      fee_hut_max = get_pos_float(values, 'fee_hut_max'),
      is_fee_hut_occupancy_max = get_bool(values, 'is_fee_hut_occupancy_max'),
      fee_hut_occupancy_max = get_pos_int(values, 'fee_hut_occupancy_max'),

      has_services = get_bool(values, 'has_services'),
      has_optional_services = get_bool(values, 'has_optional_services'),
      # services is m2m
      # optional_services is m2m
      is_restricted = get_bool(values, 'is_restricted'),
      restriction = get_string(values, 'restriction'),
      reservations = get_bool(values, 'reservations'),
      locked = get_bool(values, 'locked'),
      private = get_bool(values, 'private'),
      published = get_bool(values, 'published'),
    )
    if created:
      save_m2m(hut, Designation, values, 'designations')
      save_m2m(hut, System, values, 'systems')
      save_m2m(hut, AccessType, values, 'access_no_snow')
      save_m2m(hut, HutType, values, 'types')
      save_m2m(hut, Service, values, 'services')
      save_m2m(hut, Service, values, 'optional_services')

      hut.save()

  except Exception as e:
    print('Failure!: {0}'.format(e.args))
    print('Failed row was: {0}'.format(values))

