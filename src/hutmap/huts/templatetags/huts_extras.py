from django.contrib.gis.geos import Point
from django.db.models.fields.files import FieldFile
from django import forms, template
from json import JSONEncoder
from huts.utils.display import point_display_value

register = template.Library()

@register.filter
def css_classes(form, field_name):
  field = form.fields.get(field_name, None)
  if field is not None:
    return field.widget.attrs.get('class', '')
  return ''

class Encoder(JSONEncoder):
  def default(self, o):
    if isinstance(o, (forms.FileField, FieldFile)):
      return o.url
    elif isinstance(o, Point):
      return point_display_value(o)
    return super(Encoder, self).default(o)

encoder = Encoder()

@register.filter
def js(value):
  return encoder.encode(value)
