#!/usr/bin/python
# Deploys the master branch to the hutmap.com dreamhost account. See
# 'Deploying' in README.md for usage.
#
# Assumptions:
# - you are running this from the vagrant vm
# - you have stored ssh.hutmap.com's public key in the vm's known_hosts

from os.path import join, dirname, normpath
import os
import shlex
import subprocess
import uuid

def shell(cmd, **kwargs):
  args = shlex.split(cmd) 
  subprocess.check_call(args, **kwargs)


base_path = normpath(join(dirname(__file__), '..', '..'))
os.chdir(base_path)

hutmap_ssh = 'hutmap@ssh.hutmap.com'
vers = uuid.uuid1()

os.chdir('ops')
shell("workon_hutmap")
shell("./manage.py collectstatic --noinput -i '*.less' -i 'js-test'")
shell("./manage.py compress -f")
shell("rsync -ave ssh /vagrant/public/static hutmap@ssh.hutmap.com:hutmap.com/public/")
    #   rsync $public_dir/static 
#shell('workon_hutmap')
#shell('ls')

