#!/usr/bin/python
# Compiles javascript and copies js, css, and img files to the public folder of
# the hutmap website.

import config

import shutil
import subprocess
import os
from os.path import join


def compile_soy_templates():
  subprocess.check_call(
      ['java', '-jar',
        config.CLOSURE_TEMPLATES,
        '--shouldGenerateJsdoc',
        '--shouldProvideRequireSoyNamespaces',
        '--srcs', '{0}'.format(join(config.JS_PATH, 'hutmap', 'templates.soy')),
        '--outputPathFormat', '{0}'.format(join(config.JS_PATH, 'hutmap', 'templates.js'))])
  print('Successfully compiled soy templates')

def compile_js():
  closure_builder = join(config.CLOSURE_LIBRARY, 'closure', 
                         'bin', 'build', 'closurebuilder.py')

  try:
    shutil.rmtree(config.JS_DEST, ignore_errors=True)
    os.makedirs(config.JS_DEST)
  except:
    pass

  subprocess.check_call(
    ['python', closure_builder, 
     '--root={0}'.format(config.CLOSURE_LIBRARY),
     '--root={0}'.format(config.JS_PATH),
     '--namespace={0}'.format('hutmap.map'),
     '--namespace={0}'.format('hutmap.index'),
     '--output_mode=compiled',
     '--compiler_jar={0}'.format(config.CLOSURE_COMPILER),
     '--output_file={0}'.format(join(config.JS_DEST, 'hutmap-compiled.js'))])
  print('Successfully compiled javascript.')

def copy_css():
  # TODO: minify css
  shutil.rmtree(config.CSS_DEST, ignore_errors=True)
  shutil.copytree(config.CSS_PATH, config.CSS_DEST)
  print('Successfully copied css')

def set_permissions():
  for dirpath,dirnames,filenames in os.walk(config.PUBLIC_PATH):
    os.chmod(dirpath, 0755)
    for filename in filenames:
      path = join(dirpath, filename)
      os.chmod(path, 0755)
  print('Successfully set permissions')

if __name__ == '__main__':
  compile_soy_templates()
  compile_js()
  copy_css()
  set_permissions()
