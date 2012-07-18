from platform import node
from os.path import join, dirname, normpath

from settings_local import *

# Used to provide absolute paths. Normally the default is fine.
LOCAL_PATH = normpath(join(dirname(__file__), '.'))

# These are the hostnames as returned by platform.node().
# If you aren't sure what to put, leave them blank and the error message should tell you which hostname Python sees.
DEVELOPMENT_HOST = 'dylan-desktop'
PRODUCTION_HOST = ''

if node() == DEVELOPMENT_HOST:
    from settings_development import *
elif node() == PRODUCTION_HOST:
    from settings_production import *
else:
    raise Exception("Cannot determine execution mode for host '%s'.  Please check DEVELOPMENT_HOST and PRODUCTION_HOST in settings.py." % node())

