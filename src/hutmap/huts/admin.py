from django.contrib.gis.db import models
from django.contrib.gis import admin
from huts.model_fields import ListField
from huts.models import Hut, Region, Agency
from huts.widgets import PointWidget, ListWidget, TextNAWidget, PosNumNAWidget

class HutAdmin(admin.ModelAdmin):
  list_display = ('name', 'published', 'updated')
  list_filter = ('published', 'updated')
  search_fields = ('name', 'alternate_names', 'agency__name', 'agency__parent__name', 'region__region')
  fieldsets = (
    ('Basic', {
      'classes': ('wide',),
      'fields': (('name', 'alternate_names'), 'hut_url', 'types', ('photo_url', 'photo_credit_name', 'photo_credit_url'))
    }),
    ('Location', {
      'classes': ('wide',),
      'fields': ('location', 'location_references', 'altitude_meters', 'location_accuracy', 'show_satellite')
    }),
    ('Geopolitical', {
      'classes': ('wide',), 
      'fields': (('country', 'state'), 'region', ('designations', 'systems'), 'agency')
    }),
    ('Access', {
      'classes': ('wide',), 
      'fields': ('backcountry', ('open_summer', 'open_winter'), 'access_no_snow', ('no_snow_min_km', 'snow_min_km'))
    }),
    ('Capacity', {
      'classes': ('wide',), 
      'fields': ('structures', ('capacity_max', 'capacity_hut_min', 'capacity_hut_max'))
    }),
    ('Fees', {
      'classes': ('wide',), 
      'fields': (('fee_person_min', 'fee_person_max', 'fee_person_occupancy_min'), 
        ('fee_hut_min', 'fee_hut_max', 'fee_hut_occupancy_max'))
    }),
    ('Services', {
      'classes': ('wide',), 
      'fields': (('services_included', 'optional_services_available')) 
    }),
    ('Availability', {
      'fields': (('restriction', 'reservations'), 'locked', 'overnight', 'private', 'discretion', 'published')
    })
  )
  formfield_overrides = {
      models.PointField: {
        'widget': PointWidget,
        'help_text': PointWidget.help_text
      },
      ListField: {
        'widget': ListWidget, 
        'help_text': ListWidget.help_text
      },
      models.CharField: {
        'widget': TextNAWidget,
        'help_text': TextNAWidget.help_text
      },
      models.IntegerField: {
        'widget': PosNumNAWidget,
        'help_text': PosNumNAWidget.help_text
      },
      models.FloatField: {
        'widget': PosNumNAWidget,
        'help_text': PosNumNAWidget.help_text
      },
  }

class RegionAdmin(admin.ModelAdmin):
  search_fields = ('region',)

class AgencyAdmin(admin.ModelAdmin):
  list_display = ('name', 'parent', 'updated')
  list_filter = ('updated',)
  search_fields = ('name', 'parent__name')

admin.site.register(Hut, HutAdmin)
admin.site.register(Region, RegionAdmin)
admin.site.register(Agency, AgencyAdmin)
