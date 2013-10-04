from django.conf import settings
from django.conf.urls import patterns, url, include
from django.conf.urls.static import static
from django.contrib.gis import admin

admin.autodiscover()

# main site
urlpatterns = patterns('',
  url(r'', include('huts.urls', namespace='huts')),
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

