from django.contrib.gis.geos import GEOSGeometry
from django.forms import widgets

class PointWidget(widgets.TextInput):
  """ Widget that renders a django.contrib.gis.db.models.PointField """

  def render(self, name, value, attrs=None):
    if isinstance(value, GEOSGeometry):
      value = "{}, {}".format(value.coords[1],
                                value.coords[0])
    
    return super(PointWidget, self).render(name, value, attrs)

  def value_from_datadict(self, data, files, name):
    value = data[name]
    if ',' in value:
      coords = value.split(',')
      value = GEOSGeometry('POINT({} {})'.format(coords[1], coords[0]))
    else:
      value = None

    return value

class ListWidget(widgets.TextInput):
  """ Widget that renders values from huts.model_fields.ListField """

  def render(self, name, value, attrs=None):
    if isinstance(value, (list, tuple)):
      value = ', '.join(value)
    return super(ListWidget, self).render(name, value, attrs)

  def value_from_datadict(self, data, files, name):
    value = data[name]
    if value:
      return [x.strip() for x in value.split(',')]
    else:
      return None

