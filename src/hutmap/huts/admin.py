from django.contrib.gis import admin
from huts.models import Hut, Region, Agency

class HutAdmin(admin.ModelAdmin):
  list_display = ('name', 'published', 'updated')
  list_filter = ('published', 'updated')
  search_fields = ('name', 'alternate_names', 'agency__name', 'agency__parent__name', 'region__region')

class RegionAdmin(admin.ModelAdmin):
  search_fields = ('region',)

class AgencyAdmin(admin.ModelAdmin):
  list_display = ('name', 'parent', 'updated')
  list_filter = ('updated',)
  search_fields = ('name', 'parent__name')

admin.site.register(Hut, HutAdmin)
admin.site.register(Region, RegionAdmin)
admin.site.register(Agency, AgencyAdmin)
