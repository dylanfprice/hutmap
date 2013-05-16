from os.path import join, dirname, normpath
from platform import node
import os


### Version ###

HUTMAP_VERSION = os.environ['HUTMAP_VERSION']


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

SECRET_KEY = os.environ['HUTMAP_SECRET_KEY']

GOOGLE_API_KEY = os.environ['HUTMAP_GOOGLE_API_KEY']

DEBUG = os.getenv('HUTMAP_DEBUG', 'false').lower() != 'false'
TEMPLATE_DEBUG = DEBUG

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 465
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ['HUTMAP_EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = os.environ['HUTMAP_EMAIL_HOST_PASSWORD']
EMAIL_SUBJECT_PREFIX = '[Django@{node}] '.format(node=node())


### All other settings ###

# Used to provide absolute paths. Normally the default is fine.
LOCAL_PATH = normpath(join(dirname(__file__), '.'))

ADMINS = (
    ('Dylan Price', 'the.dylan.price@gmail.com'),
)

MANAGERS = ADMINS

SERVER_EMAIL = 'django@hutmap.com'

ALLOWED_HOSTS = ['.hutmap.com']

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

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

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

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = ''

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
  'django.core.context_processors.debug',
  'django.core.context_processors.i18n',
  'django.core.context_processors.media',
  'django.core.context_processors.static',
  'django.contrib.auth.context_processors.auth',
  'django.contrib.messages.context_processors.messages',
  'huts.context_processors.settings',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.gzip.GZipMiddleware',
    'django.middleware.http.ConditionalGetMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware',
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

if DEBUG:
  CACHES = {
    'default': { 
      'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
  }
else:
  CACHES = {
    'default': {
      'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
      'LOCATION': '/var/tmp/hutmap-django-cache',
    }
  }

LOGGING = {
  'version': 1,
  'disable_existing_loggers': True,
  'formatters': {
    'verbose': {
      'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
    },
    'simple': {
      'format': '%(levelname)s %(message)s'
    },
  },
  'filters': {
    'require_debug_false': {
      '()': 'django.utils.log.RequireDebugFalse',
     }
  },
  'handlers': {
    'null': {
      'level': 'DEBUG',
      'class': 'logging.NullHandler',
    },
    'file':{
      'level': 'DEBUG',
      'formatter': 'simple',
      'class': 'logging.handlers.TimedRotatingFileHandler',
      'filename':  join(LOCAL_PATH, '..', '..', 'logs', 'django.log'),
      'when': 'midnight',
      'interval': 1,
      'backupCount': 5,
    },
    'mail_admins': {
      'level': 'ERROR',
      'filters': ['require_debug_false'],
      'class': 'django.utils.log.AdminEmailHandler',
      'include_html': True,
    }
  },
  'loggers': {
    'django': {
      'handlers': ['file'],
      'propagate': True,
      'level': 'DEBUG' if DEBUG else 'WARNING',
    },
    'django.request': {
      'handlers': ['mail_admins'],
      'level': 'ERROR',
      'propagate': True,
    },
  }
}
