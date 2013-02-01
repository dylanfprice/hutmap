#!/usr/bin/python
# Compiles javascript and copies js, css, and img files to the public folder of
# the hutmap website.

import shutil
import subprocess
import os
import sys
from os.path import join, dirname, normpath


CLOSURE_LIBRARY = os.environ['HUTMAP_CLOSURE_LIBRARY']
CLOSURE_COMPILER = os.environ['HUTMAP_CLOSURE_COMPILER']
CLOSURE_TEMPLATES = os.environ['HUTMAP_CLOSURE_TEMPLATES']

LOCAL_PATH = normpath(join(dirname(__file__), '.'))
SRC_PATH = join(LOCAL_PATH, '..', 'src')

JS_PATH = join(SRC_PATH, 'js')
CSS_PATH = join(SRC_PATH, 'css')

PUBLIC_PATH = join(LOCAL_PATH, '..', 'public')
JS_DEST = join(PUBLIC_PATH, 'static', 'js')
CSS_DEST = join(PUBLIC_PATH, 'static', 'css')

def check_retcode(retcode, msg):
  if retcode != 0:
    print("Error!")
    sys.exit(retcode)
  else:
    print(msg)

def compile_soy_templates():
  retcode = subprocess.call(
      ['java', '-jar',
        CLOSURE_TEMPLATES,
        '--shouldGenerateJsdoc',
        '--shouldProvideRequireSoyNamespaces',
        '--srcs', '{0}'.format(join(JS_PATH, 'hutmap', 'templates.soy')),
        '--outputPathFormat', '{0}'.format(join(JS_PATH, 'hutmap', 'templates.js'))])
  check_retcode(retcode, 'Successfully compiled soy templates')

def compile_js():
  closure_builder = join(CLOSURE_LIBRARY, 'closure', 
                         'bin', 'build', 'closurebuilder.py')

  try:
    shutil.rmtree(JS_DEST, ignore_errors=True)
    os.makedirs(JS_DEST)
  except:
    pass

  retcode = subprocess.call(
    ['python', closure_builder, 
     '--root={0}'.format(CLOSURE_LIBRARY),
     '--root={0}'.format(JS_PATH),
     '--namespace={0}'.format('hutmap.map'),
     '--namespace={0}'.format('hutmap.index'),
     '--output_mode=compiled',
     '--compiler_jar={0}'.format(CLOSURE_COMPILER),
     '--output_file={0}'.format(join(JS_DEST, 'hutmap-compiled.js'))])
  check_retcode(retcode, 'Successfully compiled javascript.')

def copy_css():
  # TODO: minify css
  shutil.rmtree(CSS_DEST, ignore_errors=True)
  shutil.copytree(CSS_PATH, CSS_DEST)
  print('Successfully copied css')

def set_permissions():
  for dirpath,dirnames,filenames in os.walk(PUBLIC_PATH):
    os.chmod(dirpath, 0755)
    for filename in filenames:
      path = join(dirpath, filename)
      os.chmod(path, 0755)

if __name__ == '__main__':
  compile_soy_templates()
  compile_js()
  copy_css()
  set_permissions()
