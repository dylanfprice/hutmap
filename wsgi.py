import os
import sys 

cwd = os.getcwd()

# configure 'logging'
logs = os.path.join(cwd, 'logs')
try:
  os.makedirs(logs) 
except: 
  pass
logfilename = os.path.join(logs, 'passenger_wsgi.log')
logfile = open(logfilename, 'w')
logfile.write("Running {0}\n".format(__file__))
logfile.write("environ: {0}\n".format(str(os.environ)))

# add hutmap dir to the python path
try:
  src_dir = os.path.join(cwd, 'src')
  hutmap_dir = os.path.join(src_dir, 'hutmap')
  sys.path.insert(0, src_dir)
  sys.path.insert(0, hutmap_dir)
except Exception as e:
  raise e

# start django
try:
  from django.core.wsgi import get_wsgi_application
  os.environ['DJANGO_SETTINGS_MODULE'] = "hutmap.settings"
  application = get_wsgi_application()
except Exception as e:
  raise e

logfile.close()
