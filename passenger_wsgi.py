import sys, os

# Added for paste to be on python path
#paste_dir = os.path.join(os.getcwd(), 'deps')
#sys.stdout = sys.stderr
#sys.path.insert(0, paste_dir)

# Add hutmap dir to the python path
src_dir = os.path.join(os.getcwd(), 'src')
hutmap_dir = os.path.join(src_dir, 'hutmap')
sys.path.append(hutmap_dir)

sys.path.append(src_dir)
os.environ['DJANGO_SETTINGS_MODULE'] = "hutmap.settings"

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

# Add paste middleware for uncaught exceptions from django
#from paste.exceptions.errormiddleware import ErrorMiddleware
#application = ErrorMiddleware(application, debug=True)
