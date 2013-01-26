#!/usr/bin/python
# Builds the dependencies file for testing hutmap javascript

import subprocess
from os.path import join, dirname, normpath

LOCAL_PATH = normpath(join(dirname(__file__), '.'))
CLOSURE_LIB = join(LOCAL_PATH, '..', '..', 'javascript', 'closure-library')
SRC_PATH = join(LOCAL_PATH, '..', 'src')

JS_PATH = join(SRC_PATH, 'js')
JS_TEST_PATH = join(SRC_PATH, 'js-test')

calc_deps = join(CLOSURE_LIB, 'closure', 
                       'bin', 'calcdeps.py')

retcode = subprocess.call(
    ['python', calc_deps, 
     '--dep={0}'.format(CLOSURE_LIB),
     '--path={0}'.format(JS_PATH),
     '--output_mode=deps',
     '--output_file={0}'.format(join(JS_TEST_PATH, 'deps.js'))])

if retcode != 0:
  print("Error!")

