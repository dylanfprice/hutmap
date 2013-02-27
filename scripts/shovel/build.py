from os.path import join
from shovel import task
import os
import imp
import shutil
import subprocess

file = os.path.normpath(os.path.join(os.path.dirname(__file__), 'config.py'))
config = imp.load_source('config', file)


#TODO: rewrite to use closure compiler.jar
#@task
#def js():
#  """Compiles javascript using closure"""
#  closure_builder = join(config.CLOSURE_LIBRARY, 'closure', 
#                         'bin', 'build', 'closurebuilder.py')
#
#  try:
#    shutil.rmtree(config.JS_DEST, ignore_errors=True)
#    os.makedirs(config.JS_DEST)
#  except:
#    pass
#
#  subprocess.check_call(
#    ['python', closure_builder, 
#     #'--root={0}'.format(config.CLOSURE_LIBRARY),
#     '--root={0}'.format(config.JS_PATH),
#     #'--namespace={0}'.format('hutmap.map'),
#     #'--namespace={0}'.format('hutmap.index'),
#     '--namespace={0}'.format('hutmap.test'),
#     '--output_mode=compiled',
#     '--compiler_jar={0}'.format(config.CLOSURE_COMPILER),
#     '--output_file={0}'.format(join(config.JS_DEST, 'hutmap-compiled.js'))])
#
#  set_permissions(config.JS_DEST)

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

  with open(join(config.CSS_DEST, 'hutmap.min.css'), 'w+') as file:
    file.writelines(stdoutdata)

  set_permissions(config.CSS_DEST)


def set_permissions(folder):
  """Sets permissions in public folder so Apache will serve files."""
  for dirpath,dirnames,filenames in os.walk(folder):
    os.chmod(dirpath, 0755)
    for filename in filenames:
      path = join(dirpath, filename)
      os.chmod(path, 0755)


