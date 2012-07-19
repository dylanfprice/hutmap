from django.contrib.gis.geos import LineString
from tastypie import fields
from tastypie.resources import ModelResource
from huts.models import Hut, Region, Agency

class RegionResource(ModelResource):
  class Meta:
    queryset = Region.objects.all()
    allowed_methods = ['get']

class AgencyResource(ModelResource):
  class Meta:
    queryset = Agency.objects.all()
    allowed_methods = ['get']

class HutResource(ModelResource):
  region = fields.ForeignKey(RegionResource, 'region')
  agency = fields.ForeignKey(AgencyResource, 'agency')

  class Meta:
    queryset = Hut.objects.all()
    allowed_methods = ['get']

  def build_filters(self, filters=None):
    if filters is None:
      filters = {}

    orm_filters = super(HutResource, self).build_filters(filters)

    if 'bbox' in filters:
      bbox = filters['bbox']
      lat_lo, lon_lo, lat_hi, lon_hi = [float(x) for x in bbox.split(',')]
      line = LineString((lat_lo, lon_lo), (lat_hi, lon_hi))
      orm_filters['location__within'] = line.envelope

    return orm_filters



