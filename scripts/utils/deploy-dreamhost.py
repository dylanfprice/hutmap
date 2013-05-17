#!/usr/bin/python

from os.path import join, dirname, normpath
import os
import shlex
import subprocess
import time
import urllib2
import uuid

def shell(cmd, **kwargs):
  args = shlex.split(cmd) 
  subprocess.check_call(args, **kwargs)


base_path = normpath(join(dirname(__file__), '..', '..'))
os.chdir(base_path)

vers = uuid.uuid1()
print(vers)

try:
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
finally:
  shell('git checkout master')

  print('\nTo compltete, log on to hutmap.com and run the following:')
  print('  hutmap.com/scripts/utils/deploy-dreamhost-remote.sh {0}\n'.format(vers))
  print('Or all in one go:')
  print('  ssh hutmap@hutmap.com "bash -s {0}" < scripts/utils/deploy-dreamhost-remote.sh\n'.format(vers))
