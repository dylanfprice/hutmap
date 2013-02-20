from os.path import join, relpath
import os
import subprocess

os.environ['DJANGO_SETTINGS_MODULE'] = 'make.generate.django_settings'
from django.template.loader import render_to_string

import make.config as config
import util

def generate_deps():
  """Generate deps.js"""
  calc_deps = join(config.CLOSURE_LIBRARY, 'closure', 'bin', 'calcdeps.py')

  proc = subprocess.Popen(
      ['python', calc_deps, 
       '--dep={0}'.format(config.CLOSURE_LIBRARY),
       '--path={0}'.format(config.JS_PATH),
       '--path={0}'.format(config.JS_TEST_PATH),
       '--output_mode=deps'],
      stdout=subprocess.PIPE)
  deps,stderrdata = proc.communicate()
  dev_path = '../'*10 + config.DEV_PATH
  deps = deps.replace('/vagrant', dev_path)
  util.write_file(deps, join(config.JS_TEST_PATH, 'deps.js'))

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

