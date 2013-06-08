from csv import DictReader
from datetime import datetime
from django.core.management.base import BaseCommand
from huts.models import Hut, Region, Agency
from huts.utils.countries import lookup_country_code
from huts.utils.validate import NA, NULL


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


def get_datetime(value):
  if value == 'null':
    return None
  else:
    return datetime.strptime(value, '%Y-%m-%d')


def get(values, key):
  value = values[key]
  if value == NULL:
    return None
  elif value == NA:
    return '-1'
  else:
    return value


def get_list(values, key):
  value = get(values, key)
  if value:
    return value.split(',')
  else:
    return value


def get_bool(values, key):
  value = get(values, key)
  if value == None:
    return None
  elif value == '0':
    return True
  else:
    return False


def save_agency(values):
  agency_parent = get(values, 'agency_parent')
  parent_agency = None
  if agency_parent:
    parent_agency, created = Agency.objects.get_or_create(
      name = agency_parent,
    )

  agency_name = get(values, 'agency_name')
  if agency_name:
    agency, created = Agency.objects.get_or_create(
      name = agency_name,
      parent = parent_agency,
    )
    agency.url = get(values, 'agency_url'),
    agency.save()


def save_hut(values):
  # only save huts from WA and CO
  #state = values['state']
  #if state not in ['Washington', 'Colorado']:
  #  return

  if not values['latitude'] or not values['longitude']:
    return

  try:
    region_name = get(values, 'region')
    region = None
    if region_name:
      region, created = Region.objects.get_or_create(
        region=region_name
      )

    agency_name = get(values, 'agency_name')
    agency = None
    if agency_name:
      agency = Agency.objects.get(name=get(values, 'agency_name'))

    hut, created = Hut.objects.get_or_create(
      updated=get_datetime(get(values, 'date_updated')),
      discretion = get_bool(values, 'discretion'),

      location='POINT({0} {1})'.format(get(values, 'longitude'), get(values, 'latitude')),
      altitude_meters=get(values, 'altitude_meters'),
      location_accuracy = get(values, 'location_accuracy'),
      show_satellite = get(values, 'show_satellite'),
      location_references = get_list(values, 'location_references'),

      country=lookup_country_code(get(values, 'country')),
      state=get(values, 'state'),
      region=region,
      designations=get_list(values, 'designations'),
      systems=get_list(values, 'systems'),

      agency=agency,

      name=get(values, 'name'),
      alternate_names = get_list(values, 'alternate_names'),
      hut_url=get(values, 'hut_url'),
      photo_url=get(values, 'photo_url'),
      photo_credit_name=get(values, 'photo_credit_name'),
      photo_credit_url=get(values, 'photo_credit_url'),
      backcountry=get(values, 'backcountry'),
      open_summer=get_bool(values, 'open_summer'),
      open_winter=get_bool(values, 'open_winter'),

      access_no_snow = get_list(values, 'access_no_snow'),
      no_snow_min_km = get(values, 'no_snow_min_km'),
      snow_min_km = get(values, 'snow_min_km'),

      types=get_list(values, 'types'),
      structures=get(values, 'structures'),

      capacity_max=get(values, 'capacity_max'),
      capacity_hut_min=get(values, 'capacity_hut_min'),
      capacity_hut_max=get(values, 'capacity_hut_max'),

      fee_person_min=get(values, 'fee_person_min'),
      fee_person_max=get(values, 'fee_person_max'),
      fee_person_occupancy_min = get(values, 'fee_person_occupancy_min'),
      fee_hut_min=get(values, 'fee_hut_min'),
      fee_hut_max=get(values, 'fee_hut_max'),
      fee_hut_occupancy_max = get(values, 'fee_hut_occupancy_max'),

      services_included = get_list(values, 'services_included'),
      optional_services_available = get_bool(values, 'optional_services_available'),
      restriction = get(values, 'restriction'),
      reservations = get_bool(values, 'reservations'),
      locked = get_bool(values, 'locked'),
      overnight = get_bool(values, 'overnight'),
      private = get_bool(values, 'private'),
      published = get_bool(values, 'published'),
    )
  except Exception as e:
    print('Failure!: {0}'.format(e.args))
    print('Failed row was: {0}'.format(values))

