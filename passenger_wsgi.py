from platform import node
import django.core.handlers.wsgi
import logging
import os
import sys 

# run in our virtualenv
INTERP = os.path.join('/usr', 'local', 'pythonbrew', 'venvs', 'Python-2.7.3', 'hutmap', 'bin', 'python')

if node() == 'fulton': # special settings for dreamhost
  INTERP = os.path.join(os.environ['HOME'], '.pythonbrew', 'venvs', 'Python-2.7.3', 'hutmap', 'bin', 'python')

if sys.executable != INTERP:
  os.execl(INTERP, INTERP, *sys.argv)

cwd = os.getcwd()

# configure logging
logfilename = os.path.join(cwd, 'passenger_wsgi.log')
logging.basicConfig(filename=logfilename, level=logging.DEBUG)
logging.info("Running %s", __file__)
logging.info("environ: %s", str(os.environ))

# add hutmap dir to the python path
try:
  src_dir = os.path.join(cwd, 'src')
  hutmap_dir = os.path.join(src_dir, 'hutmap')
  sys.path.insert(0, src_dir)
  sys.path.insert(0, hutmap_dir)
except Exception as e:
  logging.exception(e) 
  raise e

# start django
try:
  os.environ['DJANGO_SETTINGS_MODULE'] = "hutmap.settings"
  application = django.core.handlers.wsgi.WSGIHandler()
  logging.info("application executed successfully")
except Exception as e:
  logging.exception("Error: %s", e)
  raise e
