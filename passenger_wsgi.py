import sys 
import os
import logging
import django.core.handlers.wsgi

CWD = os.getcwd()

# configure logging
logfilename = os.path.join(CWD, 'passenger_wsgi.log')
logging.basicConfig(filename=logfilename, level=logging.DEBUG)
logging.info("Running %s", __file__)
logging.info("environ: %s", str(os.environ))

# add hutmap dir to the python path
try:
  src_dir = os.path.join(CWD, 'src')
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
