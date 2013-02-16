from django.contrib.gis.geos import Polygon, MultiPolygon
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

#class HutTypeResource(ModelResource):
#  class Meta:
#    queryset = HutType.objects.all()
#    allowed_methods = ['get']

class HutResource(ModelResource):
  region = fields.ForeignKey(RegionResource, 'region', full=True)
  agency = fields.ForeignKey(AgencyResource, 'agency', full=True)
  #type = fields.ForeignKey(HutTypeResource, 'type', full=True)

  class Meta:
    queryset = Hut.objects.all()
    allowed_methods = ['get']
    filtering = {
      'id' : ('in',),
      'fee_person_min' : ('lte',),
      'capacity_max' : ('gte',),
      'access' : ('exact'),
    }

  def build_filters(self, filters=None):
    if filters is None:
      filters = {}

    applicable_filters = {}
    # Normal filtering
    filter_params = dict([(x, filters[x]) for x in filters if not x.startswith('!')])
    applicable_filters['filter'] = super(HutResource, self).build_filters(filter_params)
    # Exclude filtering
    exclude_params =  dict([(x[1:], filters[x]) for x in filters if x.startswith('!')])
    applicable_filters['exclude'] = super(HutResource, self).build_filters(exclude_params)

    # Custom bbox filter
    if 'bbox' in filters:
      bbox = filters['bbox']
      lat_lo, lng_lo, lat_hi, lng_hi = [float(x) for x in bbox.split(',')]
      # latitude first from request, longitude first for database!
      if lng_lo > 0 and lng_hi < 0:
        p1 = Polygon.from_bbox((lng_lo, lat_lo, 180, lat_hi))
        p2 = Polygon.from_bbox((-180, lat_lo, lng_hi, lat_hi))
        polygon = MultiPolygon(p1, p2)
      else:
        polygon = Polygon.from_bbox((lng_lo, lat_lo, lng_hi, lat_hi))

      applicable_filters['filter']['location__within'] = polygon

    return applicable_filters

  def apply_filters(self, request, applicable_filters):
    objects = self.get_object_list(request)

    f = applicable_filters.get('filter')
    if f:
        objects = objects.filter(**f)
    e = applicable_filters.get('exclude')
    if e:
        objects = objects.exclude(**e)
    return objects
