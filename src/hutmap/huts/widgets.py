from django.contrib.gis.geos import GEOSGeometry
from django.forms import widgets
from huts.utils.null_na import to_csv, from_csv, DB_NA_LIST, DB_NA_STRING, DB_NA_POS_NUM, CSV_NA

class PointWidget(widgets.TextInput):
  """ Widget that renders a django.contrib.gis.db.models.PointField """
  help_text = "Format: 'latitude, longitude'"

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

  help_text = 'Enter a comma separated list of values, {0}, or leave blank for null'.format(CSV_NA)
  
  def render(self, name, value, attrs=None):
    value = to_csv(value, (DB_NA_LIST,),
        lambda value: ', '.join(value) if isinstance(value, (list, tuple)) else value)

    return super(ListWidget, self).render(name, value, attrs)


  def value_from_datadict(self, data, files, name):
    value = data[name]
    value = from_csv(value, DB_NA_LIST, 
      lambda value: [x.strip() for x in value.split(',')])

    return value

class TextNAWidget(widgets.TextInput):
  """ Widget that render NA string values from the db in a user-friendly way """

  help_text = 'Use NA for NA or leave blank for null.'

  def render(self, name, value, attrs=None):
    value = to_csv(value, (DB_NA_STRING,), lambda value: value)
    return super(TextNAWidget, self).render(name, value, attrs)

  def value_from_datadict(self, data, files, name):
    value = data[name]
    value = from_csv(value, DB_NA_STRING, lambda value: value)
    return value

class PosNumNAWidget(widgets.TextInput):
  """ Widget that renders NA positive number values from the db in a user-friendly way """

  help_text = 'Use NA for NA or leave blank for null.'

  def render(self, name, value, attrs=None):
    value = to_csv(value, (DB_NA_POS_NUM,), lambda value: value)
    return super(PosNumNAWidget, self).render(name, value, attrs)

  def value_from_datadict(self, data, files, name):
    value = data[name]
    value = from_csv(value, DB_NA_POS_NUM, lambda value: value)
    return value

