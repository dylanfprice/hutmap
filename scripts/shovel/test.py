from shovel import task
import os
import imp
import subprocess

file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'config.py'))
config = imp.load_source('config', file)

@task
def hutmapjs():
  """Tests hutmap javascript application"""
  subprocess.check_call([
    'testacular', 'start',
    '{0}/hutmap/config/testacular.conf.js'.format(config.JS_TEST_PATH),
    '--single-run'])

  subprocess.check_call([
    'testacular', 'start',
    '{0}/hutmap/config/testacular-e2e.conf.js'.format(config.JS_TEST_PATH)])

