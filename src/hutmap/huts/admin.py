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
  actions = ['publish']

  def publish(self, request, queryset):
    field_names = set(Hut._meta.get_all_field_names()) & set(HutSuggestion._meta.get_all_field_names())
    for hut_suggestion in queryset:
      hut = Hut()
      for field_name in field_names:
        value = getattr(hut_suggestion, field_name)
        setattr(hut, field_name, value)
      hut.save()
    num_huts = len(queryset)
    queryset.delete()
    self.message_user(request, '{} hut suggestions successfully published.'.format(num_huts))
  publish.short_description = 'Publish selected hut suggestions'

class HutEditAdmin(HutCommonAdmin):
  form = HutEditForm
  change_form_template = 'admin/huts/hut_edit/change_form.html'
  actions = ['accept']

  def change_view(self, request, object_id, form_url='', extra_context=None):
    extra_context = extra_context or {}

    hut = HutEdit.objects.get(pk=object_id)
    related_hut = hut.hut
    related_hut_form = HutForm(instance=related_hut)

    field_names = set(hut._meta.get_all_field_names()) & set(related_hut_form.fields.iterkeys())
    for field_name in field_names:
      hut_value = getattr(hut, field_name)
      related_value = getattr(related_hut, field_name)
      if hut_value != related_value:
        field = related_hut_form.fields[field_name]
        field.widget.attrs['class'] = 'different-value'

    extra_context['related_hut'] = related_hut_form
    return super(HutEditAdmin, self).change_view(request, object_id, 
      form_url, extra_context=extra_context)
    
  def accept(self, request, queryset):
    field_names = set(Hut._meta.get_all_field_names()) & set(HutEdit._meta.get_all_field_names())
    for hut_edit in queryset:
      hut = hut_edit.hut
      for field_name in field_names:
        value = getattr(hut_edit, field_name)
        setattr(hut, field_name, value)
      hut.save()
    num_huts = len(queryset)
    queryset.delete()
    self.message_user(request, '{} hut edits successfully accepted.'.format(num_huts))
  accept.short_description = 'Accept selected hut edits'

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

