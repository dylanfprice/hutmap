from shovel import task
import os
import imp
import subprocess

file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'config.py'))
config = imp.load_source('config', file)


@task
def hutmap_js():
  """Tests hutmap javascript application"""
  subprocess.check_call([
    'testacular', 'start', '--no-auto-watch',
    '{0}/hutmap/config/testacular.conf.js'].format(config.JS_TEST_PATH))

  subprocess.check_call([
    'testacular', 'start',
    '{0}/hutmap/config/testacular-e2e.conf.js'].format(config.JS_TEST_PATH))


@task
def gmaps_js():
  """Tests google-maps angular module"""
  subprocess.check_call([
    'testacular', 'start', '--no-auto-watch',
    '{0}/google-maps/config/testacular.conf.js'].format(config.JS_TEST_PATH))
