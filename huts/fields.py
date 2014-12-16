from django.contrib.gis.geos import GEOSGeometry
from django.core.exceptions import ValidationError
from django import forms
from widgets import ListWidget, PointWidget

class PointFormField(forms.CharField):
    help_text = 'Format: "latitude, longitude"'

    def __init__(self, *args, **kwargs):
        defaults = {}
        defaults['widget'] = PointWidget
        defaults.update(kwargs)
        # something in kwargs was overriding, so fight back
        defaults['help_text'] = self.help_text
        super(PointFormField, self).__init__(*args, **defaults)

    def to_python(self, value):
        if value is None or value == '':
            return None
        if ',' in value:
            coords = value.split(',')
            try:
                py_value = GEOSGeometry('POINT({} {})'.format(coords[1], coords[0]))
            except ValueError:
                raise ValidationError('Please use the {}'.format(self.help_text.lower()))
            return py_value
        else:
            raise ValidationError('Please use the {}'.format(self.help_text.lower()))

class ListFormField(forms.Field):
    help_text = 'Enter a comma separated list of values or leave blank'

    def __init__(self, *args, **kwargs):
        defaults = {}
        defaults.update(kwargs)
        # something in kwargs was overriding, so fight back
        defaults['widget'] = ListWidget
        defaults['help_text'] = self.help_text
        super(ListFormField, self).__init__(*args, **defaults)
