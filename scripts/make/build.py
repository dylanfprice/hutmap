# Compiles javascript and copies js, css, and img files to the public folder of
# the hutmap website.

from os.path import join
import config
import os
import shutil
import subprocess

def set_permissions(folder):
  """Sets permissions in public folder so Apache will serve files."""
  for dirpath,dirnames,filenames in os.walk(folder):
    os.chmod(dirpath, 0755)
    for filename in filenames:
      path = join(dirpath, filename)
      os.chmod(path, 0755)

def build_js():
  """Compiles javascript using closure"""
  closure_builder = join(config.CLOSURE_LIBRARY, 'closure', 
                         'bin', 'build', 'closurebuilder.py')

  try:
    shutil.rmtree(config.JS_DEST, ignore_errors=True)
    os.makedirs(config.JS_DEST)
  except:
    pass

  subprocess.check_call(
    ['python', closure_builder, 
     #'--root={0}'.format(config.CLOSURE_LIBRARY),
     '--root={0}'.format(config.JS_PATH),
     #'--namespace={0}'.format('hutmap.map'),
     #'--namespace={0}'.format('hutmap.index'),
     '--namespace={0}'.format('hutmap.test'),
     '--output_mode=compiled',
     '--compiler_jar={0}'.format(config.CLOSURE_COMPILER),
     '--output_file={0}'.format(join(config.JS_DEST, 'hutmap-compiled.js'))])

  set_permissions(config.JS_DEST)

def build_css():
  """Copies css files into public/css"""
  # TODO: minify css
  shutil.rmtree(config.CSS_DEST, ignore_errors=True)
  shutil.copytree(config.CSS_PATH, config.CSS_DEST)
  set_permissions(config.CSS_DEST)


