from django import forms
from widgets import ListWidget

class ListFormField(forms.Field):
  widget = ListWidget
