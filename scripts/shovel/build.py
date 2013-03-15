from os.path import join
from shovel import task
import os
import imp
import shutil
import subprocess

file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'config.py'))
config = imp.load_source('config', file)


@task
def js():#(nomin=False): #TODO: add minification
  """Minifies javascript using closure"""
  try:
    shutil.rmtree(config.JS_DEST, ignore_errors=True)
    os.makedirs(config.JS_DEST)
  except:
    pass

  js_files = []
  for dirpath,dirnames,filenames in os.walk(config.JS_PATH, topdown=True):
    if 'hutmap_old' in dirnames:
      i = dirnames.index('hutmap_old')
      del dirnames[i]
    if 'third-party' in dirnames:
      i = dirnames.index('third-party')
      del dirnames[i]
      
    for filename in filenames:
      path = join(dirpath, filename)
      if filename.endswith('js'):
        if filename.startswith('app') or filename.startswith('module'):
          js_files.insert(0, path)
        else:
          js_files.append(path)

  cmd = ['java', '-jar', config.CLOSURE_COMPILER]
  cmd.append('--js')
  cmd.extend(' --js '.join(js_files).split(' '))
  cmd.extend(['--compilation_level', 'WHITESPACE_ONLY'])
  cmd.extend(['--language_in', 'ECMASCRIPT5_STRICT'])
  cmd.extend(['--js_output_file', '{0}/hutmap-{1}.min.js'.format(config.JS_DEST, config.HUTMAP_VERSION)])

  subprocess.check_call(cmd)

  set_permissions(config.JS_DEST)

  print('Successfully built js.')


@task
def css(nomin=False):
  """Compiles less files into public/static/css/hutmap.min.css"""
  try:
    shutil.rmtree(config.CSS_DEST, ignore_errors=True)
    os.makedirs(config.CSS_DEST)
  except:
    pass

  cmd = ['lessc']
  if str(nomin).lower() == 'false': cmd.append('--yui-compress')
  cmd.append(join(config.CSS_PATH, 'hutmap.less'))
  proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
  stdoutdata,stderrdata = proc.communicate()
  if proc.returncode != 0:
    raise subprocess.CalledProcessError(proc.returncode, cmd)

  with open(join(config.CSS_DEST, 'hutmap-{0}.min.css'.format(config.HUTMAP_VERSION)), 'w+') as file:
    file.writelines(stdoutdata)

  set_permissions(config.CSS_DEST)

  print('Successfully built css')


def set_permissions(folder):
  """Sets permissions in public folder so Apache will serve files."""
  for dirpath,dirnames,filenames in os.walk(folder):
    os.chmod(dirpath, 0755)
    for filename in filenames:
      path = join(dirpath, filename)
      os.chmod(path, 0755)


