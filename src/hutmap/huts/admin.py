from django.contrib.gis import admin
from huts.models import Hut, HutSuggestion, HutEdit, Region, Agency
from huts.forms import HutForm, HutSuggestionForm, HutEditForm

class HutCommonAdmin(admin.ModelAdmin):
  list_display = ('name', 'updated')
  list_filter = ('updated',)
  search_fields = ('name', 'alternate_names', 'agency__name', 'agency__parent__name', 'region__region')

class HutAdmin(HutCommonAdmin):
  form = HutForm
  list_display = ('name', 'updated', 'published')
  list_filter = ('published', 'updated')

class HutSuggestionAdmin(HutCommonAdmin):
  form = HutSuggestionForm

class HutEditAdmin(HutCommonAdmin):
  form = HutEditForm

class RegionAdmin(admin.ModelAdmin):
  search_fields = ('region',)

class AgencyAdmin(admin.ModelAdmin):
  list_display = ('name', 'parent', 'updated')
  list_filter = ('updated',)
  search_fields = ('name', 'parent__name')

admin.site.register(Hut, HutAdmin)
admin.site.register(HutSuggestion, HutSuggestionAdmin)
admin.site.register(HutEdit, HutEditAdmin)
admin.site.register(Region, RegionAdmin)
admin.site.register(Agency, AgencyAdmin)

