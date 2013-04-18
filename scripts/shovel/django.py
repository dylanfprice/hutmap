from shovel import task
import imp
import os

config_file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'config.py'))
common_file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'common.py'))
config = imp.load_source('config', config_file)
common = imp.load_source('common', common_file)

@task
def manage(*commands):
  """
  Sends given commands to the manage.py script. Note that interactive commands
  like 'dbshell' won't work.
  """
  os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
  cmd = [
    config.PYTHON,
    '{0}/manage.py'.format(config.HUTMAP_PATH),
  ]
  cmd.extend(commands)
  common.check_command_with_output(cmd, print_stdout=True)

