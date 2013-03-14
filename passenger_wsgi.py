import logging
import os
import sys 

cwd = os.getcwd()

# configure logging
logfilename = os.path.join(cwd, 'passenger_wsgi.log')
logging.basicConfig(filename=logfilename, level=logging.WARNING)
logging.info("Running %s", __file__)
logging.info("environ: %s", str(os.environ))


# run in our virtualenv
INTERP = os.path.join(os.environ['HOME'], '.pythonbrew', 'venvs', 'Python-2.7.3', 'hutmap', 'bin', 'python')
if sys.executable != INTERP:
  logging.info("sys.executable ({0}) was not {1}. Re-executing.".format(sys.executable, INTERP))
  os.execl(INTERP, INTERP, *sys.argv)


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
  from django.core.wsgi import get_wsgi_application
  os.environ['DJANGO_SETTINGS_MODULE'] = "hutmap.settings"
  application = get_wsgi_application()
  logging.info("application executed successfully")
except Exception as e:
  logging.exception("Error: %s", e)
  raise e
