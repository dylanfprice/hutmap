from django.conf.urls import patterns, url, include
from django.views.generic.base import TemplateView

from django.contrib.gis import admin
admin.autodiscover()

urlpatterns = patterns('',
  url(r'^$', TemplateView.as_view(template_name='index.html'), name='hutmap_home'),
  url(r'^test$',  TemplateView.as_view(template_name='test.html')),
)

urlpatterns += patterns('',
  url(r'^huts/',       include('huts.urls')),
  #url(r'^about/',     include('blog.urls'), name='hutmap_about'),
  url(r'^admin/',      include(admin.site.urls)),
  url(r'^admin/doc/',  include('django.contrib.admindocs.urls')),
)

