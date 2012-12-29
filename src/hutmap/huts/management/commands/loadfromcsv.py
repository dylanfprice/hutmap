from csv import DictReader
from datetime import datetime
from django.core.management.base import BaseCommand, CommandError
from huts.models import Hut, Region, Agency, HutType
from util.countries import lookup_country_code


class Command(BaseCommand):
  args = '<csvfile>'
  help = 'Imports the given csvfile into the database.'

  def handle(self, *args, **options):
    if len(args) == 1:
      csvfile = open(args[0], 'r')
      reader = DictReader(csvfile)
      reader.next()
      values = reader.next()
      for values in reader:
        save_hut(values)

def save_hut(values):
  try:
    region, created = Region.objects.get_or_create(
      country=lookup_country_code(values['Country']),
      state=values['State'],
      region=values['Region']
    )

    agency, created = Agency.objects.get_or_create(
      name=values['Agency'],
      url=values['Agency_URL']
    )

    type, created = HutType.objects.get_or_create(name=values['Type'])

    hut, created = Hut.objects.get_or_create(
      id=values['Hut_ID'],
      created=datetime.strptime(values['Date_Added'], '%Y-%m-%d'),
      updated=datetime.strptime(values['Date_Updated'], '%Y-%m-%d'),
      region=region,
      location='POINT({0} {1})'.format(values['Longitude'], values['Latitude']),
      location_accuracy=values['Location_Accuracy'] or None,
      altitude=values['Altitude'] or None,
      name=values['Name'],
      access=values['Backcountry'],
      type=type,
      num_structures=values['Structures'] or None,
      capacity_max=values['Capacity_max'] or None,
      capacity_hut_min=values['Capacity_hutmin'] or None,
      capacity_hut_max=values['Capacity_hutmax'] or None,
      fee_person_min=values['Fee_personmin'] or None,
      fee_person_max=values['Fee_personmax'] or None,
      fee_hut_min=values['Fee_hutmin'] or None,
      fee_hut_max=values['Fee_hutmax'] or None,
      reservations=values['Reservations'] or None,
      hut_url=values['Hut_URL'],
      photo_url=values['Photo_URL'],
      references=values['Hut_References'],
      agency=agency,
    )
  except Exception as e:
    print('Failure!: {0}'.format(e.args))
    print('Failed row was: {0}'.format(values))
