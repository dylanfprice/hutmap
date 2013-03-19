from django.conf.urls import patterns, url, include
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

