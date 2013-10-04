from django.contrib.gis.db import models
from django.contrib.gis import admin
from huts.model_fields import ListField
from huts.models import Hut, HutSuggestion, HutEdit, Region, Agency
from huts.widgets import PointWidget, ListWidget
from huts.forms import HutForm

def hut_fieldsets(other_fields=None):
  other_fields = other_fields or []
  return (
    ('Basic', {
      'classes': ('collapse',),
      'fields': ('name', 'alternate_names', 'hut_url', 'types', 'photo_url', 'photo_credit_name', 'photo_credit_url')
    }),
    ('Location', {
      'classes': ('collapse',),
      'fields': ('location', 'location_references', 'altitude_meters', 'location_accuracy', 'show_satellite')
    }),
    ('Geopolitical', {
      'classes': ('collapse',), 
      'fields': ('country', 'state', 'region', 'designations', 'systems', 'agency')
    }),
    ('Access', {
      'classes': ('collapse',), 
      'fields': ('backcountry', 'open_summer', 'open_winter', 'access_no_snow', 'no_snow_min_km', 'is_snow_min_km', 'snow_min_km')
    }),
    ('Capacity', {
      'classes': ('collapse',), 
      'fields': ('structures', 'capacity_max', 'capacity_hut_min', 'capacity_hut_max')
    }),
    ('Fees', {
      'classes': ('collapse',), 
      'fields': ('is_fee_person', 'fee_person_min', 'fee_person_max', 'is_fee_person_occupancy_min', 'fee_person_occupancy_min', 
                 'is_fee_hut', 'fee_hut_min', 'fee_hut_max', 'is_fee_hut_occupancy_max', 'fee_hut_occupancy_max')
    }),
    ('Services', {
      'classes': ('collapse',), 
      'fields': ('has_services', 'services', 'has_optional_services') 
    }),
    ('Availability', {
      'classes': ('collapse',),
      'fields': ('is_restricted', 'restriction', 'reservations', 'locked', 'private', 'discretion')
    }),
    ('Other', {
      'classes': ('collapse',),
      'fields': tuple(field for field in other_fields)
    }),
  )

class HutCommonAdmin(admin.ModelAdmin):
  list_display = ('name', 'updated')
  list_filter = ('updated',)
  search_fields = ('name', 'alternate_names', 'agency__name', 'agency__parent__name', 'region__region')
  formfield_overrides = {
      models.PointField: {
        'widget': PointWidget,
        'help_text': PointWidget.help_text
      },
#      models.ForeignKey: {
#        'widget': django_select2.widgets.Select2Widget
#      },
      ListField: {
        'widget': ListWidget, 
        'help_text': ListWidget.help_text
      },
  }

  #def get_form(self, request, obj=None, **kwargs):
  #  form = super(HutCommonAdmin, self).get_form(request, obj, **kwargs)
  #  form.fields['agency'] = django_select2.fields.Select2ChoiceField()
  #  return form

class HutAdmin(admin.ModelAdmin):
  #list_display = ('name', 'published', 'updated')
  #list_filter = ('published', 'updated')
  #fieldsets = hut_fieldsets(other_fields=['published'])
  form = HutForm

class HutSuggestionAdmin(HutCommonAdmin):
  fieldsets = hut_fieldsets()

class HutEditAdmin(HutCommonAdmin):
  fieldsets = hut_fieldsets(other_fields=['hut'])

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

