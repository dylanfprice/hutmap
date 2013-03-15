from django.contrib.gis.geos import Polygon, Point, MultiPolygon, GEOSGeometry
from django.utils.datastructures import SortedDict
from huts.models import Hut, Region, Agency
from tastypie import fields
from tastypie.cache import SimpleCache
from tastypie.resources import ModelResource

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
      'id' : ('in', 'exact'),
    }
    cache = SimpleCache()

  def dehydrate_location(self, bundle):
    point = GEOSGeometry(bundle.data['location'])
    coords = point.coords
    return { 'lat': coords[1], 'lng': coords[0] };

  def hydrate_location(self, bundle):
    coords = bundle.data['location']
    return 'POINT({0}, {1})'.format(coords['lng'], coords['lat'])
    
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

  def apply_sorting(self, objects, options=None):
    # custom order_by_distance
    if options and 'order_by_distance' in options:
      sel = SortedDict([('distance', 'distance(location, geomfromtext(%s))')])
      lat_lng = options['order_by_distance'].split(',')
      pt = Point(float(lat_lng[1]), float(lat_lng[0]))
      sel_p = (pt.wkt,)
      return objects.extra(select=sel, select_params=sel_p, order_by=['distance'])
    
    return super(HutResource, self).apply_sorting(objects, options)
