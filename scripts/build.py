#!/usr/bin/python
# Compiles javascript and copies js, css, and img files to the public folder of
# the hutmap website.

import shutil
import subprocess
import os
from os.path import join, dirname, normpath


LOCAL_PATH = normpath(join(dirname(__file__), '.'))
CLOSURE_LIB = join(LOCAL_PATH, '..', '..', 'javascript', 'closure-library')
SRC_PATH = join(LOCAL_PATH, '..', 'src')

JS_PATH = join(SRC_PATH, 'js')
CSS_PATH = join(SRC_PATH, 'css')

PUBLIC_PATH = join(LOCAL_PATH, '..', 'public')
JS_DEST = join(PUBLIC_PATH, 'static', 'js')
CSS_DEST = join(PUBLIC_PATH, 'static', 'css')

def compile_js():
  closure_builder = join(CLOSURE_LIB, 'closure', 
                         'bin', 'build', 'closurebuilder.py')

  try:
    shutil.rmtree(JS_DEST, ignore_errors=True)
    os.makedirs(JS_DEST)
  except:
    pass

  retcode = subprocess.call(
    ['python', closure_builder, 
     '--root={0}'.format(CLOSURE_LIB),
     '--root={0}'.format(JS_PATH),
     '--namespace={0}'.format('hutmap.map'),
     '--namespace={0}'.format('hutmap.index'),
     '--output_mode=compiled',
     '--compiler_jar={0}'.format(join(CLOSURE_LIB, 'compiler.jar')),
     '--output_file={0}'.format(join(JS_DEST, 'hutmap-compiled.js'))])
  if retcode != 0:
    print("Error!")
  else:
    print('Successfully compiled javascript.')

def copy_css():
  shutil.rmtree(CSS_DEST, ignore_errors=True)
  shutil.copytree(CSS_PATH, CSS_DEST)
  print('Successfully copied css')

if __name__ == '__main__':
  compile_js()
  copy_css()
