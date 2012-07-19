from django.conf.urls.defaults import *
from django.conf import settings

from django.contrib.gis import admin
admin.autodiscover()

urlpatterns = patterns('django.views.generic.simple',
  (r'^$',  'direct_to_template', {'template': 'index.html'}),
)

urlpatterns += patterns('',
  (r'^huts/',       include('huts.urls')),
  (r'^admin/',      include(admin.site.urls)),
  (r'^admin/doc/',  include('django.contrib.admindocs.urls')),
)

# Serve static files through django if in debug
if settings.DEBUG:
  urlpatterns += patterns('',
    (r'^static/(?P<path>.*)$', 
      'django.views.static.serve', 
      {'document_root': settings.STATIC_DOC_ROOT}),
  )
