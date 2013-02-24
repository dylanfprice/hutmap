from os.path import join, relpath, normpath, dirname
import imp
import os
import subprocess

path = normpath(join(dirname(__file__)))
config = imp.load_source('config', join(path, '..', 'config.py'))
util = imp.load_source('util', join(path, 'util.py'))

os.environ['DJANGO_SETTINGS_MODULE'] = 'django_settings'
from django.template.loader import render_to_string

def generate_deps():
  """Generate deps.js"""
  calc_deps = join(config.CLOSURE_LIBRARY, 'closure', 'bin', 'calcdeps.py')

  deps_file = join(config.JS_TEST_PATH, 'deps.js')
  subprocess.check_call(
      ['python', calc_deps, 
       '--dep={0}'.format(config.CLOSURE_LIBRARY),
       '--path={0}'.format(config.JS_PATH),
       '--path={0}'.format(config.JS_TEST_PATH),
       '--output_mode=deps',
       '--output_file={0}'.format(deps_file)])
  os.chmod(deps_file, 0755)

def generate_alltests():
  """Generate alltests.js"""
  tests = []
  for dirpath,dirname,filenames in os.walk(config.JS_TEST_PATH):
    for filename in filenames:
      if filename.endswith('_test.html'):
        file = join(dirpath, filename)
        file = relpath(file, config.JS_TEST_PATH)
        tests.append(file)

  rendered = render_to_string('alltests.js', { 'tests': tests })
  path = join(config.JS_TEST_PATH, 'alltests.js')
  util.write_file(rendered, path, remove_blank_lines=True)

