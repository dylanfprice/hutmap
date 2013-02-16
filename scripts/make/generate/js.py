from os.path import join
import os
import subprocess

os.environ['DJANGO_SETTINGS_MODULE'] = 'make.generate.django_settings'
from django.contrib.gis.db import models
from django.template.loader import render_to_string

import make.config as config
import util

def generate_soy():
  """Generates templates.js"""
  subprocess.check_call(
      ['java', '-jar',
        config.CLOSURE_TEMPLATES,
        '--shouldGenerateJsdoc',
        '--shouldProvideRequireSoyNamespaces',
        '--srcs', '{0}'.format(join(config.JS_PATH, 'hutmap', 'templates.soy')),
        '--outputPathFormat', '{0}'.format(join(config.JS_PATH, 'hutmap', 'templates.js'))])

def generate_models(model_list):
  """
  Generate models.js

  model_list: [
            {'name': 'Model', 'skip_fields': ['field1', ...]},
            ...
          ]
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
  util.write_file(rendered, join(config.JS_PATH, 'hutmap', 'models.js'), remove_blank_lines=True)

