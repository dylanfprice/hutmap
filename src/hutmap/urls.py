from django.conf.urls import patterns, url, include
from django.views.generic.base import TemplateView

from django.contrib.gis import admin
admin.autodiscover()

urlpatterns = patterns('',
  url(r'^$', TemplateView.as_view(template_name='base.html'), name='hutmap_home'),
  url(r'^(map/|about/)$', TemplateView.as_view(template_name='base.html')),
  url(r'^partials/index.html$', TemplateView.as_view(template_name='partials/index.html')),
  url(r'^partials/map.html$', TemplateView.as_view(template_name='partials/map.html')),
  url(r'^partials/about.html$', TemplateView.as_view(template_name='partials/about.html')),
  (r'^huts/', include('huts.urls')),
  url(r'^test$',  TemplateView.as_view(template_name='test.html')),
  url(r'^admin/',      include(admin.site.urls)),
  url(r'^admin/doc/',  include('django.contrib.admindocs.urls')),
)

