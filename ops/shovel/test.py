from shovel import task
import os
import imp

config_file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'config.py'))
common_file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'common.py'))
config = imp.load_source('config', config_file)
common = imp.load_source('common', common_file)

@task
def hutmapjs():
  """Tests hutmap javascript application"""
  common.check_command_with_output(
    [
      'karma', 'start',
      '{0}/hutmap/config/karma.conf.js'.format(config.JS_TEST_PATH),
      '--single-run'
    ],
    print_stdout=True)

  #subprocess.check_call([
  #  'karma', 'start',
  #  '{0}/hutmap/config/karma-e2e.conf.js'.format(config.JS_TEST_PATH)])


@task
def hutmappy():
  """Tests hutmap django application"""
  os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
  common.check_command_with_output(
    [
      config.PYTHON,
      '{0}/manage.py'.format(config.HUTMAP_PATH),
      'test', 'huts'
    ],
    print_stdout=True)

