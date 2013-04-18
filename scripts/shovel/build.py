from os.path import join
from shovel import task
import os
import imp
import shutil

config_file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'config.py'))
common_file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'common.py'))
config = imp.load_source('config', config_file)
common = imp.load_source('common', common_file)

@task
def js():#(nomin=False): #TODO: add minification
  """Minifies javascript using closure, into public/static/js/hutmap-{version}.min.js"""
  try:
    shutil.rmtree(config.JS_DEST, ignore_errors=True)
    os.makedirs(config.JS_DEST)
  except:
    pass

  js_files = []
  for dirpath,dirnames,filenames in os.walk(config.JS_PATH, topdown=True):
    # do not include old js files
    if 'hutmap_old' in dirnames:
      i = dirnames.index('hutmap_old')
      del dirnames[i]

    # make sure third party js gets processed last (so we can insert it as
    # first)
    if 'third-party' in dirnames:
      i = dirnames.index('third-party')
      del dirnames[i]
      dirnames.append('third-party')
      
    for filename in filenames:
      path = join(dirpath, filename)
      if filename.endswith('js'):
        if dirpath.endswith('third-party'):
          js_files.insert(0, path)
        elif filename.startswith('app') or filename.startswith('module'):
          js_files.insert(0, path)
        else:
          js_files.append(path)

  cmd = ['java', '-jar', config.CLOSURE_COMPILER]
  cmd.append('--js')
  cmd.extend(' --js '.join(js_files).split(' '))
  cmd.extend(['--compilation_level', 'SIMPLE_OPTIMIZATIONS'])
  cmd.extend(['--warning_level', 'VERBOSE'])
  cmd.extend(['--jscomp_off', 'checkVars'])
  cmd.extend(['--language_in', 'ECMASCRIPT5_STRICT'])
  cmd.extend(['--js_output_file', '{0}/hutmap-{1}.min.js'.format(config.JS_DEST, config.HUTMAP_VERSION)])

  common.check_command_with_output(cmd, print_stdout=True)

  set_permissions(config.JS_DEST)

  print('Successfully built js.')


@task
def css(nomin=False):
  """Compiles less files into public/static/css/hutmap-{version}.min.css"""
  try:
    shutil.rmtree(config.CSS_DEST, ignore_errors=True)
    os.makedirs(config.CSS_DEST)
  except:
    pass

  cmd = ['lessc']
  if str(nomin).lower() == 'false': cmd.append('--yui-compress')
  cmd.append(join(config.CSS_PATH, 'hutmap.less'))
  stdoutdata,stderrdata = common.check_command_with_output(cmd)

  with open(join(config.CSS_DEST, 'hutmap-{0}.min.css'.format(config.HUTMAP_VERSION)), 'w+') as file:
    file.writelines(stdoutdata)

  set_permissions(config.CSS_DEST)

  print('Successfully built css')


def set_permissions(folder):
  """Sets permissions in folder so Apache will serve files."""
  for dirpath,dirnames,filenames in os.walk(folder):
    os.chmod(dirpath, 0755)
    for filename in filenames:
      path = join(dirpath, filename)
      os.chmod(path, 0755)


