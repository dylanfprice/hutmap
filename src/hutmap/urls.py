from django.conf.urls.defaults import *

from django.contrib.gis import admin
admin.autodiscover()

urlpatterns = patterns('django.views.generic.simple',
  url(r'^$',  'direct_to_template', {'template': 'index.html'}, name='hutmap_home'),
)

urlpatterns += patterns('',
  url(r'^huts/',       include('huts.urls')),
  #url(r'^blog/',       include('blog.urls'), name='hutmap_blog'),
  #url(r'^about/',      include('blog.urls'), name='hutmap_about'),
  url(r'^admin/',      include(admin.site.urls)),
  url(r'^admin/doc/',  include('django.contrib.admindocs.urls')),
)

