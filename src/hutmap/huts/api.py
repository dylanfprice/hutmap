from django.contrib.gis.geos import Polygon, Point, MultiPolygon
from django.utils.datastructures import SortedDict
from huts.models import Hut, Region, Agency
from huts.utils.csv_serializer import CSVSerializer
from huts.utils.csv_consts import CSV_NULL, CSV_TRUE, CSV_FALSE
from tastypie.cache import SimpleCache
from tastypie.contrib.gis.resources import ModelResource
from tastypie import fields

class RegionResource(ModelResource):
  class Meta:
    queryset = Region.objects.all()
    allowed_methods = ['get']
    serializer = CSVSerializer(formats=['json', 'csv'])

class AgencyResource(ModelResource):
  parent = fields.ForeignKey('AgencyResource', 'agency', full=False, null=True)

  class Meta:
    max_limit = 0
    queryset = Agency.objects.all()
    allowed_methods = ['get']
    serializer = CSVSerializer(formats=['json', 'csv'])

class HutResource(ModelResource):
  region = fields.ForeignKey(RegionResource, 'region', full=False, null=True)
  agency = fields.ForeignKey(AgencyResource, 'agency', full=False, null=True)
  # list fields
  location_references = fields.ListField(attribute='location_references', null=True)
  designations = fields.ListField(attribute='designations', null=True)
  systems = fields.ListField(attribute='systems', null=True)
  alternate_names = fields.ListField(attribute='alternate_names', null=True)
  access_no_snow = fields.ListField(attribute='access_no_snow', null=True)
  types = fields.ListField(attribute='types', null=True)
  services = fields.ListField(attribute='services', null=True)

  class Meta:
    max_limit = 0
    queryset = Hut.objects.published()
    list_allowed_methods = ['get']
    detail_allowed_methods = ['get']
    #excludes = ['created', 'updated']
    serializer = CSVSerializer(formats=['json', 'csv'])
    filtering = {
      'name': ['startswith'],
    }

  def dehydrate(self, bundle):
    format = self.determine_format(bundle.request)
    if format == 'text/csv':
      # separate location into lat and lon
      location = bundle.data['location']
      del bundle.data['location']
      bundle.data['latitude'] = location['coordinates'][1]
      bundle.data['longitude'] = location['coordinates'][0]

      for key,value in bundle.data.iteritems():
        if isinstance(value, bool):
          bundle.data[key] = CSV_TRUE if value else CSV_FALSE
        elif isinstance(value, list):
          bundle.data[key] = ','.join(value)
        elif value == None:
          bundle.data[key] = CSV_NULL

    return bundle

