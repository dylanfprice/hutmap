from django import forms
from widgets import ListWidget

class ListFormField(forms.Field):
  def __init__(self, *args, **kwargs):
    defaults = {}
    defaults.update(kwargs)
    # something in kwargs was overriding, so fight back
    defaults['widget'] = ListWidget
    super(ListFormField, self).__init__(**defaults)

