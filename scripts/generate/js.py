import sys
import os

os.environ['DJANGO_SETTINGS_MODULE'] = 'django_settings'
from django.contrib.gis.db import models
from django.template.loader import render_to_string


def generate_models(model_list, out):
  """
  Generate models.js

  model_list: [
            {'name': 'Model', 'skip_field_names': ['field1', ...]},
            ...
          ]
  out: the file-like object to write to
  """
  model_fields = []
  for model in model_list:
    model_object = models.get_model('huts', model['name'])
    field_names = model_object._meta.get_all_field_names()

    fields = []
    for field_name in field_names:
      if field_name not in model['skip_field_names']:
        fields.append(field_name)

    model_fields.append({'name': model['name'], 'fields': fields})

  rendered = render_to_string('models.js', { 'models': model_fields })
  for line in rendered.splitlines():
    if line and not line.isspace():
      out.write(line + '\n')

generate_models([
    {'name': 'Hut',    'skip_field_names': ['created', 'updated']},
    {'name': 'Agency', 'skip_field_names': []},
    {'name': 'Region', 'skip_field_names': []},
  ], sys.stdout)
