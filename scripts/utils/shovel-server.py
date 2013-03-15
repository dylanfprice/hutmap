#!/usr/bin/python
# Start shovel-server on Vagrant vm

from os.path import join, dirname, normpath
import os
import subprocess
import sys

base = normpath(join(dirname(__file__), '..'))
os.chdir(base)

def help_text(retcode):
  print("Usage: shovel-server.py start|stop")
  sys.exit(retcode)

def start():
  run_server = ' && '.join([
    'cd /vagrant/scripts/',
    'echo "$HOME/.pythonbrew/venvs/Python-2.7.3/hutmap/bin/shovel-server --port 3000" | at now'
  ])
  cmd = "vagrant ssh -c '{0}'".format(run_server)
  print(cmd)
  subprocess.check_call([cmd], shell=True)

def stop():
  return subprocess.call(['vagrant', 'ssh', '-c', 'killall shovel-server'])

if len(sys.argv) < 2:
  help_text(1)

try:
  command = sys.argv[1]
except:
  help_text(1)

if command == '-h' or command == '--help' or command == 'help':
  help_text(0)
elif command == 'start':
  stop()
  start()
  print('Shovel server started. Try going to http://localhost:3000/help in your browser.')
elif command == 'stop':
  if stop() == 0:
    print('Shovel server stopped.')
else:
  help_text(1)

