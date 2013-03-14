import os
import sys 

cwd = os.getcwd()

# configure 'logging'
logfilename = os.path.join(cwd, 'logs', 'passenger_wsgi.log')
logfile = open(logfilename, 'w')
logfile.write("Running {0}\n".format(__file__))
logfile.write("environ: {0}\n".format(str(os.environ)))


# run in our virtualenv
INTERP = os.path.join(os.environ['HOME'], '.pythonbrew', 'venvs', 'Python-2.7.3', 'hutmap', 'bin', 'python')
if sys.executable != INTERP:
  logfile.write("sys.executable ({0}) was not {1}. Re-executing.\n".format(sys.executable, INTERP))
  os.execl(INTERP, INTERP, *sys.argv)


# add hutmap dir to the python path
try:
  src_dir = os.path.join(cwd, 'src')
  hutmap_dir = os.path.join(src_dir, 'hutmap')
  sys.path.insert(0, src_dir)
  sys.path.insert(0, hutmap_dir)
except Exception as e:
  logfile.write("ERROR: {0}\n".format(e))
  raise e

# start django
try:
  from django.core.wsgi import get_wsgi_application
  os.environ['DJANGO_SETTINGS_MODULE'] = "hutmap.settings"
  application = get_wsgi_application()
  logfile.write("application executed successfully\n")
except Exception as e:
  logfile.write("ERROR: {0}\n".format(e))
  raise e

logfile.close()
