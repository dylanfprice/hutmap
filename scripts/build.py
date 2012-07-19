import shutil
import sys
import subprocess
import os
from os.path import join, dirname, normpath

LOCAL_PATH = normpath(join(dirname(__file__), '.'))
HUTMAP_PATH = join(LOCAL_PATH, '..', 'hutmap')
PUBLIC_PATH = join(LOCAL_PATH, '..', 'public')
JS_DEST = join(PUBLIC_PATH, 'static', 'js')
CSS_DEST = join(PUBLIC_PATH, 'static', 'css')

sys.path.append(HUTMAP_PATH)
import settings


def compile_js():
  closure_builder = join(settings.CLOSURE_LIB, 'closure', 
                         'bin', 'build', 'closurebuilder.py')

  try:
    shutil.rmtree(JS_DEST, ignore_errors=True)
    os.makedirs(JS_DEST)
  except:
    pass

  retcode = subprocess.call(
    ['python', closure_builder, 
     '--root={0}'.format(settings.CLOSURE_LIB),
     '--root={0}'.format(settings.STATIC_DOC_ROOT),
     '--namespace={0}'.format('hutmap.Map'),
     '--namespace={0}'.format('hutmap.ajax'),
     '--output_mode=compiled',
     '--compiler_jar={0}'.format(join(settings.CLOSURE_LIB, 'compiler.jar')),
     '--output_file={0}'.format(join(JS_DEST, 'hutmap-compiled.js'))])
  if retcode != 0:
    print("Error!")

def copy_css():
  shutil.rmtree(CSS_DEST, ignore_errors=True)
  shutil.copytree(join(settings.STATIC_DOC_ROOT, 'css'), CSS_DEST)

if __name__ == '__main__':
  compile_js()
  print('Successfully compiled javascript.')
  copy_css()
  print('Successfully copied css')
