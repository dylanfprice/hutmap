from django.conf.urls import patterns, url, include
from django.views.generic.base import TemplateView
#from huts.api import HutSearchResource, HutResource, AgencyResource, RegionResource
#from tastypie.api import Api

from django.contrib.gis import admin
admin.autodiscover()

# main site
urlpatterns = patterns('',
  url(r'^$', TemplateView.as_view(template_name='base.html'), name='hutmap_home'),
  url(r'^(map/|about/)$', TemplateView.as_view(template_name='base.html')),
  url(r'^partials/home.html$', TemplateView.as_view(template_name='partials/home.html')),
  url(r'^partials/map.html$', TemplateView.as_view(template_name='partials/map.html')),
  url(r'^partials/about.html$', TemplateView.as_view(template_name='partials/about.html')),
)

# admin
urlpatterns += patterns('',
  url(r'^admin/doc/',  include('django.contrib.admindocs.urls')),
  url(r'^admin/',      include(admin.site.urls)),
)

# api
#api = Api(api_name='v1')
#api.register(HutSearchResource())
#api.register(HutResource())
#api.register(AgencyResource())
#api.register(RegionResource())
#
#urlpatterns += patterns('',
#  (r'^api/', include(api.urls)),
#)

