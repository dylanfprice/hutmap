from django.conf import settings
from django.conf.urls import patterns, url, include
from django.conf.urls.static import static
from django.contrib.gis import admin
from huts.views import DynamicTemplateView, BaseView
#from huts.api import HutSearchResource, HutResource, AgencyResource, RegionResource
#from tastypie.api import Api

admin.autodiscover()

# main site
urlpatterns = patterns('',

  url(r'^$',       BaseView.as_view(), name='hutmap_home'),

  url(r'^map/$',   BaseView.as_view(metadata='metadata/map.html'), 
    name='hutmap_map'),

  url(r'^about/$', BaseView.as_view(metadata='metadata/about.html'),
    name='hutmap_about'),
  
  url(r'^partials/(?P<template>\w+)\.html$', DynamicTemplateView.as_view(folder='partials')),
)

# admin
urlpatterns += patterns('',
  url(r'^admin/doc/',  include('django.contrib.admindocs.urls')),
  url(r'^admin/',      include(admin.site.urls)),
)

# serve data and media files during development
urlpatterns += static('{}/hutmap/data/'.format(settings.STATIC_URL),
    document_root='{}/hutmap/data/'.format(settings.STATIC_ROOT))
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

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

