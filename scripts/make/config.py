from os.path import join, dirname, normpath
import os

LOCAL_PATH = normpath(join(dirname(__file__), '.'))
BASE_PATH = join(LOCAL_PATH, '..', '..')
SRC_PATH = join(BASE_PATH, 'src')

CSS_PATH = join(SRC_PATH, 'css')
HUTMAP_PATH = join(SRC_PATH, 'hutmap')
JS_PATH = join(SRC_PATH, 'js')
JS_TEST_PATH = join(SRC_PATH, 'js-test')

PUBLIC_PATH = join(BASE_PATH, 'public')
JS_DEST = join(PUBLIC_PATH, 'static', 'js')
CSS_DEST = join(PUBLIC_PATH, 'static', 'css')

CLOSURE_LIBRARY = join(PUBLIC_PATH, 'lib', 'closure-library')
CLOSURE_COMPILER = os.environ['HUTMAP_CLOSURE_COMPILER']
CLOSURE_TEMPLATES = os.environ['HUTMAP_CLOSURE_TEMPLATES']
DEV_PATH = os.environ['HUTMAP_DEV_PATH']

MODEL_LIST = [
  {'name': 'Hut',    'skip_fields': ['created', 'updated']},
  {'name': 'Agency', 'skip_fields': ['hut']},
  {'name': 'Region', 'skip_fields': ['hut']},
]
