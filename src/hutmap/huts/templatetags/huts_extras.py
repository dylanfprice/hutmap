from django.contrib.gis.geos import Point
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

class DjangoFileFieldEncoder(JSONEncoder):
  def default(self, o):
    if isinstance(o, forms.FileField):
      return o.url
    return super(DjangoFileFieldEncoder, self).default(o)

class PointEncoder(JSONEncoder):
  def default(self, o):
    if isinstance(o, Point):
      return point_display_value(o)
    return super(DjangoFileFieldEncoder, self).default(o)

class Encoder(DjangoFileFieldEncoder, PointEncoder):
  pass
encoder = Encoder()

@register.filter
def js(value):
  return encoder.encode(value)
