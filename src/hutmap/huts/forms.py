from django import forms
from djangular.forms.angular_model import NgModelFormMixin
from huts.models import Hut, Agency, Region

class HutAdminForm(forms.ModelForm):
  class Meta:
    model = Hut
    exclude = ['created', 'updated']

class HutForm(NgModelFormMixin, forms.ModelForm):

  class Meta:
    model = Hut

  def __init__(self, *args, **kwargs):
    kwargs.update(scope_prefix='hut')
    super(HutForm, self).__init__(*args, **kwargs)
    for name, field in self.fields.iteritems():
      if name == 'agency':
        field.widget.attrs['ui-select2'] = 'select2Options'

