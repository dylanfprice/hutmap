from django.conf.urls.defaults import *
from django.conf import settings

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

# Serve static files through django if in debug
if settings.DEVELOPMENT:
  urlpatterns += patterns('',
    (r'^static/(?P<path>.*)$', 'django.views.static.serve', 
      {'document_root': settings.STATIC_DOC_ROOT, 'show_indexes': True}),

    (r'^closure/(?P<path>.*)$', 'django.views.static.serve',
     {'document_root': settings.CLOSURE_LIB, 'show_indexes': True}),
       
  )
