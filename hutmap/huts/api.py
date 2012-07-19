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


