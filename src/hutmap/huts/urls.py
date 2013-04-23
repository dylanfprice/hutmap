from django.conf.urls import patterns, include
from huts.api import HutSearchResource
from tastypie.api import Api

api = Api(api_name='v1')
api.register(HutSearchResource())

urlpatterns = patterns('',
  (r'^api/', include(api.urls)),
)

