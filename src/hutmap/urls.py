from django.conf.urls import *
from django.conf import settings

from django.contrib.gis import admin
admin.autodiscover()

urlpatterns = patterns('django.views.generic.simple',
  url(r'^$',  'direct_to_template', {'template': 'index.html'}, name='hutmap_home'),
  url(r'^test$',  'direct_to_template', {'template': 'test.html'}),
)

urlpatterns += patterns('',
  url(r'^huts/',       include('huts.urls')),
  #url(r'^browse/',    include('blog.urls'), name='hutmap_browse'),
  #url(r'^about/',     include('blog.urls'), name='hutmap_about'),
  url(r'^admin/',      include(admin.site.urls)),
  url(r'^admin/doc/',  include('django.contrib.admindocs.urls')),
)

