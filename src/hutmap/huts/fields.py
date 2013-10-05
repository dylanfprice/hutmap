from django import forms
from widgets import ListWidget

class ListFormField(forms.Field):
  def __init__(self, *args, **kwargs):
    defaults = {'widget': ListWidget}
    defaults.update(kwargs)
    return super(ListFormField, self).__init__(**defaults)

