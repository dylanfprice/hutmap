from django.contrib.gis.geos import GEOSGeometry
from django.forms import widgets
from huts.utils.display import point_display_value

class PointWidget(widgets.TextInput):
  """ Widget that renders a django.contrib.gis.db.models.PointField """

  def render(self, name, value, attrs=None):
    if isinstance(value, GEOSGeometry):
      value = point_display_value(value)
    
    return super(PointWidget, self).render(name, value, attrs)

class ListWidget(widgets.Textarea):
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

