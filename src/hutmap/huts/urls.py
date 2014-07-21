from django.conf.urls import patterns, url, include
from huts.views import DynamicTemplateView, BaseView
from huts.api import HutResource, AgencyResource, RegionResource, HutSuggestionResource
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
v1_api.register(HutResource())
v1_api.register(HutSuggestionResource())
v1_api.register(AgencyResource())
v1_api.register(RegionResource())

api_patterns = patterns('',
  url(r'', include(v1_api.urls)),
)
