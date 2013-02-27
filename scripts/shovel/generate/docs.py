from os.path import join, normpath, dirname
from shovel import task
import imp
import os

path = normpath(join(dirname(__file__)))
config = imp.load_source('config', join(path, '..', 'config.py'))
util = imp.load_source('util', join(path, 'util.py'))

os.environ['DJANGO_SETTINGS_MODULE'] = 'django_settings'
from django.template.loader import render_to_string

@task
def readme():
  """Generates README.md"""
  rendered = render_to_string('README.md', {})
  util.write_file(rendered, join(config.BASE_PATH, 'README.md'), remove_blank_lines=False)

