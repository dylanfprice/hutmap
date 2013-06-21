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

hutmap_ssh = 'hutmap@ssh.hutmap.com'
vers = uuid.uuid1()

success1 = False
try:
  shutil.rmtree('public/static/css', ignore_errors=True)
  shutil.rmtree('public/static/js', ignore_errors=True)
  shell('git checkout dreamhost')
  shell('git pull origin dreamhost')
  shell('git merge -s resolve master -m"Merge master into branch dreamhost"')
  shell('git rm -r public/static/css/ public/static/js/')
  shell('python scripts/utils/shovel-server.py start')

  time.sleep(1)
  urllib2.urlopen('http://localhost:3000/build.css?version={0}'.format(vers))
  urllib2.urlopen('http://localhost:3000/build.js?version={0}'.format(vers))

  shell('git add public/static/css/ public/static/js/')
  shell('git commit -m"Version {0}"'.format(vers))
  shell('git push origin dreamhost')
  success1 = True
finally:
  shell('git checkout master')

if success1:
  success2 = False
  try:
    deploy_remote = open(os.path.join(base_path, 'scripts', 'utils', 'deploy-dreamhost-remote.sh', 'r'))
    subprocess.check_call(['ssWUT', hutmap_ssh, 'bash -s {}'.format(vers)], stdin=deploy_remote)
    success2 = True
  except:
    pass

  if success1 and success2:
    print('Deploy successful!')
  elif success1 and not success2:
    print('\nThere were errors but you can still complete the deployment\n')
    print('To complete, ssh in and run the following:')
    print('  hutmap.com/scripts/utils/deploy-dreamhost-remote.sh {}\n'.format(vers))
    print('Or all in one go:')
    print('  ssh {} "bash -s {}" < scripts/utils/deploy-dreamhost-remote.sh\n'.format(hutmap_ssh, vers))
  else:
    print('\n Deploy failed. Look at the stack trace printed below for more details.\n')
