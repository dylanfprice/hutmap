from platform import node
import os
from os.path import join, dirname, normpath


### Per machine settings ###

DATABASES = {
    'default': {
        'ENGINE':   'django.contrib.gis.db.backends.mysql',
        'NAME':     os.environ['HUTMAP_DB_NAME'],
        'USER':     os.environ['HUTMAP_DB_USER'], 
        'PASSWORD': os.environ['HUTMAP_DB_PASSWORD'],
        'HOST':     os.environ['HUTMAP_DB_HOST'],
        'PORT':     os.environ['HUTMAP_DB_PORT'],
    }
}

# Set this to something random, long, and secret
SECRET_KEY = os.environ['HUTMAP_SECRET_KEY']

DEBUG = os.getenv('HUTMAP_DEBUG', 'false').lower() != 'false'
TEMPLATE_DEBUG = DEBUG

# Special setting for dreamhost account
if node() == 'fulton':
  GEOS_LIBRARY_PATH = '/home/hutmap/hutmap.com/deps/geos-3.3.0/lib/libgeos_c.so'
  GDAL_LIBRARY_PATH = '/home/hutmap/hutmap.com/deps/gdal-1.8.0/lib/libgdal.so'


### All other settings ###

# Used to provide absolute paths. Normally the default is fine.
LOCAL_PATH = normpath(join(dirname(__file__), '.'))

ADMINS = (
    ('Dylan Price', 'the.dylan.price@gmail.com'),
)

MANAGERS = ADMINS

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Los_Angeles'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = join(LOCAL_PATH, '..', 'media')

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = '/media/'

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/admin_static/'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
  'django.contrib.auth.context_processors.auth',
  'huts.context_processors.settings',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'urls'

TEMPLATE_DIRS = (
  join(LOCAL_PATH, '..', 'templates')
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.admin',
    'django.contrib.admindocs',
    'django.contrib.gis',
    'huts',
)

