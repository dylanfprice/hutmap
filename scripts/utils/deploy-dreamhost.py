#!/usr/bin/python

from os.path import join, dirname, normpath
import os
import shlex
import subprocess
import time
import urllib2
import uuid
import shutil

def shell(cmd, **kwargs):
  args = shlex.split(cmd) 
  subprocess.check_call(args, **kwargs)


base_path = normpath(join(dirname(__file__), '..', '..'))
os.chdir(base_path)

vers = uuid.uuid1()

successful = False
try:
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
  shell('rm public/static/css/* public/static/js/*', shell=True)
>>>>>>> 107f4d3... shell=True
=======
  shutil.rmtree('public/static/css', ignore_errors=True)
  shutil.rmtree('public/static/js', ignore_errors=True)
>>>>>>> 2f3e6d0... rmtree
=======
  shell('rm public/static/css/* public/static/js/*')
>>>>>>> b51b284... Remove css and js.
  shell('git pull origin dreamhost')
  shell('git checkout dreamhost')
  shell('git merge -s resolve master')
  shell('git rm -r public/static/css/ public/static/js/')
  shell('python scripts/utils/shovel-server.py start')

  time.sleep(1)
  urllib2.urlopen('http://localhost:3000/build.css?version={0}'.format(vers))
  urllib2.urlopen('http://localhost:3000/build.js?version={0}'.format(vers))

  shell('git add public/static/css/ public/static/js/')
  shell('git commit -m"Version {0}"'.format(vers))
  shell('git push origin dreamhost')
  successful = True
finally:
  shell('git checkout master')

  if successful:
    print('\nTo complete, log on to hutmap.com and run the following:')
    print('  hutmap.com/scripts/utils/deploy-dreamhost-remote.sh {0}\n'.format(vers))
    print('Or all in one go:')
    print('  ssh hutmap@hutmap.com "bash -s {0}" < scripts/utils/deploy-dreamhost-remote.sh\n'.format(vers))
  else:
    print('\n Deploy failed. Look at the stack trace printed below for more details.\n')
