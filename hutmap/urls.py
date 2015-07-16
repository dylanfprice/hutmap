from django.conf import settings
from django.conf.urls import include, patterns, url
from django.conf.urls.static import static
from django.contrib.auth.decorators import user_passes_test
from django.contrib.gis import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from huts.urls import api_patterns, hut_patterns
from ui_components.views import style_guide

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'', include((hut_patterns, 'huts', 'huts'))),
    url(r'^api/', include((api_patterns, 'huts_api', 'huts_api'))),
)


# admin
urlpatterns += patterns(
    '',
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^admin/style-guide/', style_guide),
)

# serve static and media files during development
urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
