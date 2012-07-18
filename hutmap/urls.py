from django.conf.urls.defaults import *
from django.conf import settings

from django.contrib.gis import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'^polls/', include('polls.urls')),
    (r'^admin/', include(admin.site.urls)),
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
)

if settings.DEBUG:
  urlpatterns += patterns('',
    (r'^media/(?P<path>.*)$', 
      'django.views.static.serve', 
      {'document_root': settings.MEDIA_ROOT}),
  )
