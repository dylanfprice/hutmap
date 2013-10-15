import itertools
from django.core.management.base import BaseCommand
from django.core import serializers
from huts.models import Hut, Agency, Region

class Command(BaseCommand):
  args = ''
  help = 'Dumps all agencies and regions and the first 50 huts in the django serialization format.'

  def handle(self, *args, **options):
    huts = Hut.objects.all()[:51]
    agencies = Agency.objects.all()
    regions = Region.objects.all()
    print(serializers.serialize("json", itertools.chain(huts, agencies, regions)))
