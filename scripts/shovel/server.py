from shovel import task
import imp
import os

config_file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'config.py'))
common_file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'common.py'))
config = imp.load_source('config', config_file)
common = imp.load_source('common', common_file)

@task
def reload():
  """
  Reload the hutmap server.
  """
  cmd = [
    'sudo', 'service', 'apache2', 'reload'
  ]
  common.check_command_with_output(cmd, print_stdout=True)

