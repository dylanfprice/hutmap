from django.conf.urls.defaults import *
from tastypie.api import Api

from huts.api import HutResource, RegionResource, AgencyResource

api = Api(api_name='v1')
api.register(HutResource())
api.register(RegionResource())
api.register(AgencyResource())
#api.register(HutTypeResource())

urlpatterns = patterns('',
  (r'^api/', include(api.urls)),
)

urlpatterns += patterns('django.views.generic.simple',
  url(r'^map/', 'direct_to_template', {'template': 'huts/map.html'}, name='hutmap_map'),
)

