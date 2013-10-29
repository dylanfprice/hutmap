from django import forms
from djangular.forms.angular_model import NgModelFormMixin
from huts.models import Hut, HutSuggestion, HutEdit
from huts.fields import PointFormField

SELECT_ATTRS = {'ui-select2': 'select2Options'}

class HutCommonForm(NgModelFormMixin, forms.ModelForm):
  location = PointFormField()

  def __init__(self, *args, **kwargs):
    kwargs.update(scope_prefix='hut')
    super(HutCommonForm, self).__init__(*args, **kwargs)

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
    }

class HutForm(HutCommonForm):
  class Meta(HutCommonForm.Meta):
    model = Hut

class HutSuggestionForm(HutCommonForm):
  class Meta(HutCommonForm.Meta):
    model = HutSuggestion

class HutEditForm(HutCommonForm):
  class Meta(HutCommonForm.Meta):
    model = HutEdit
    widgets = dict(
      [('hut', forms.widgets.Select(attrs=SELECT_ATTRS))] +
      HutCommonForm.Meta.widgets.items()
    )

