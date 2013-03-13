from django.conf.urls import patterns, url, include
from django.views.generic.base import TemplateView
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

urlpatterns += patterns('',
  url(r'^map/', TemplateView.as_view(template_name='huts/map.html'), name='hutmap_map'),
)

