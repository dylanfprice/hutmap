from django.conf.urls import patterns, url

from ui_components.views import style_guide

urlpatterns = patterns('',
  url(r'^$', style_guide, name='style_guide'),
)

