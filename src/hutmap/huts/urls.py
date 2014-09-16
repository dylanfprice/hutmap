from django.conf.urls import include, patterns, url

from huts.api import (AccessTypeResource, AgencyResource, DesignationResource,
                      HutResource, HutSuggestionResource, HutTypeResource,
                      RegionResource, ServiceResource, SystemResource)
from huts.views import BaseView, DynamicTemplateView
from tastypie.api import NamespacedApi

hut_patterns = patterns('',

  url(r'^$', BaseView.as_view(), name='home'),

  url(r'^map/$', BaseView.as_view(
      metadata='metadata/map.html'),
      name='map'
  ),

  url(r'^about/$', BaseView.as_view(
      metadata='metadata/about.html'),
      name='about'
  ),

  url(r'^hut/new/$', BaseView.as_view(
      metadata='metadata/hut_new.html'),
      name='hut_new'
  ),

  url(r'^partials/(?P<template>\w+)\.html$', DynamicTemplateView.as_view(folder='partials')),
)

# api
v1_api = NamespacedApi(api_name='v1', urlconf_namespace='huts_api')
v1_api.register(RegionResource())
v1_api.register(DesignationResource())
v1_api.register(SystemResource())
v1_api.register(AccessTypeResource())
v1_api.register(HutTypeResource())
v1_api.register(ServiceResource())
v1_api.register(AgencyResource())
v1_api.register(HutResource())
v1_api.register(HutSuggestionResource())

api_patterns = patterns('',
  url(r'', include(v1_api.urls)),
)
