from django.conf.urls.defaults import *

from django.contrib.gis import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'^polls/', include('polls.urls')),
    (r'^admin/', include(admin.site.urls)),
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
)
