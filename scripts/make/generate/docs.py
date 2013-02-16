from os.path import join
import os

os.environ['DJANGO_SETTINGS_MODULE'] = 'make.generate.django_settings'
from django.template.loader import render_to_string

import make.config as config
import util

def generate_readme():
  """Generates README.md"""
  rendered = render_to_string('README.md', {})
  util.write_file(rendered, join(config.BASE_PATH, 'README.md'), remove_blank_lines=False)

