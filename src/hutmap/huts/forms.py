from django import forms

from djangular.forms import NgModelFormMixin

from huts.fields import PointFormField
from huts.models import Hut, HutEdit, HutSuggestion
from huts.widgets import PointWidget

SELECT_ATTRS = {'ui-select2': 'select2Options'}

class HutCommonForm(NgModelFormMixin, forms.ModelForm):
  location = PointFormField(widget=PointWidget(attrs={'ng-change': 'huts = [hut]'}))

  def __init__(self, *args, **kwargs):
    kwargs.update(scope_prefix='hut')
    super(HutCommonForm, self).__init__(*args, **kwargs)
    for field in self.fields.values():
      if isinstance(field, forms.ModelMultipleChoiceField):
        field.help_text = unicode(field.help_text).replace(
          'Hold down "Control", or "Command" on a Mac, to select more than one.',
          ''
        )

  class Media:
    css = {
      'all': ('hutmap/css/admin.css',),
    }
  class Meta:
    widgets = {
      'region': forms.widgets.Select(attrs=SELECT_ATTRS),
      'country': forms.widgets.Select(attrs=SELECT_ATTRS),
      'agency': forms.widgets.Select(attrs=SELECT_ATTRS),
      'photo': forms.widgets.FileInput(attrs={'ng-file-select': 'hut.photo = $files[0]'}),
      'designations': forms.widgets.SelectMultiple(attrs=SELECT_ATTRS),
      'systems': forms.widgets.SelectMultiple(attrs=SELECT_ATTRS),
      'access_no_snow': forms.widgets.SelectMultiple(attrs=SELECT_ATTRS),
      'types': forms.widgets.SelectMultiple(attrs=SELECT_ATTRS),
      'services': forms.widgets.SelectMultiple(attrs=SELECT_ATTRS),
      'optional_services': forms.widgets.SelectMultiple(attrs=SELECT_ATTRS),
    }

class HutForm(HutCommonForm):
  class Meta(HutCommonForm.Meta):
    model = Hut

class HutSuggestionForm(HutCommonForm):
  class Meta(HutCommonForm.Meta):
    model = HutSuggestion
    fields = (
        'location',
        'country',
        'state',
        'name',
        'types',
    )

class HutEditForm(HutCommonForm):
  class Meta(HutCommonForm.Meta):
    model = HutEdit
    widgets = dict(
      [('hut', forms.widgets.Select(attrs=SELECT_ATTRS))] +
      HutCommonForm.Meta.widgets.items()
    )
