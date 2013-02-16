# Builds the dependencies file for testing hutmap javascript

from os.path import join, normpath, dirname
import imp
import subprocess

config = imp.load_source('config', normpath(join(dirname(__file__), '../config.py')))

def generate():
  calc_deps = join(config.CLOSURE_LIBRARY, 'closure', 'bin', 'calcdeps.py')

  subprocess.check_call(
      ['python', calc_deps, 
       '--dep={0}'.format(config.CLOSURE_LIBRARY),
       '--path={0}'.format(config.JS_PATH),
       '--output_mode=deps',
       '--output_file={0}'.format(join(config.JS_TEST_PATH, 'deps.js'))])


if __name__ == '__main__':
  generate()
