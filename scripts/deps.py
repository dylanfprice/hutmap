#!/usr/bin/python
# Builds the dependencies file for testing hutmap javascript

import subprocess
import os
from os.path import join, dirname, normpath

LOCAL_PATH = normpath(join(dirname(__file__), '.'))
CLOSURE_LIBRARY = os.environ['HUTMAP_CLOSURE_LIBRARY']
SRC_PATH = join(LOCAL_PATH, '..', 'src')

JS_PATH = join(SRC_PATH, 'js')
JS_TEST_PATH = join(SRC_PATH, 'js-test')

calc_deps = join(CLOSURE_LIBRARY, 'closure', 
                       'bin', 'calcdeps.py')

retcode = subprocess.call(
    ['python', calc_deps, 
     '--dep={0}'.format(CLOSURE_LIBRARY),
     '--path={0}'.format(JS_PATH),
     '--output_mode=deps',
     '--output_file={0}'.format(join(JS_TEST_PATH, 'deps.js'))])

if retcode != 0:
  print("Error!")

