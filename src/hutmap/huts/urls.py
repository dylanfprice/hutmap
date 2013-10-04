from django.conf.urls import patterns, url
from huts.views import DynamicTemplateView, BaseView
#from huts.api import HutSearchResource, HutResource, AgencyResource, RegionResource
#from tastypie.api import Api

urlpatterns = patterns('',

  url(r'^$',       BaseView.as_view(), name='home'),

  url(r'^map/$',   BaseView.as_view(metadata='metadata/map.html'), 
    name='map'),

  url(r'^about/$', BaseView.as_view(metadata='metadata/about.html'),
    name='about'),
  
  url(r'^partials/(?P<template>\w+)\.html$', DynamicTemplateView.as_view(folder='partials')),
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

