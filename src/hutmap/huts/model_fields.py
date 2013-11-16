from django.contrib.gis.db import models
from huts.fields import ListFormField
from huts.constants import COUNTRIES_DICT, COUNTRIES
from south.modelsinspector import add_introspection_rules
import ast

add_introspection_rules([], ["^huts\.model_fields\.ListField"])
add_introspection_rules([], ["^huts\.model_fields\.CountryField"])
add_introspection_rules([], ["^huts\.model_fields\.UnhelpfulManyToManyField"])

class ListField(models.TextField):
  __metaclass__ = models.SubfieldBase
  description = "Stores a python list"

  def __init__(self, *args, **kwargs):
    super(ListField, self).__init__(*args, **kwargs)

  def to_python(self, value):
    if not value:
      value = []

    if isinstance(value, list):
      return value

    return ast.literal_eval(value)

  def get_prep_value(self, value):
    if value is None:
      return value

    return unicode(value)

  def value_to_string(self, obj):
    value = self._get_val_from_obj(obj)
    return self.get_db_prep_value(value, None)

  def formfield(self, **kwargs):
    defaults = {
      'form_class': ListFormField,
    }
    defaults.update(kwargs)
    return super(ListField, self).formfield(**defaults)

def lookup_country_code(country):
  return COUNTRIES_DICT[country]

class CountryField(models.CharField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('max_length', 2)
        kwargs.setdefault('choices', COUNTRIES)

        super(CountryField, self).__init__(*args, **kwargs)

    def get_internal_type(self):
        return "CharField"

class UnhelpfulManyToManyField(models.ManyToManyField):
  def __init__(self, *args, **kwargs):
    orig_help_text = getattr(self, 'help_text', '')
    super(UnhelpfulManyToManyField, self).__init__(*args, **kwargs)
    self.help_text = orig_help_text
