from django.conf.urls import patterns, include
from huts.api import HutSearchResource, HutResource, AgencyResource, RegionResource
from tastypie.api import Api

api = Api(api_name='v1')
api.register(HutSearchResource())
api.register(HutResource())
api.register(AgencyResource())
api.register(RegionResource())

urlpatterns = patterns('',
  (r'^api/', include(api.urls)),
)

