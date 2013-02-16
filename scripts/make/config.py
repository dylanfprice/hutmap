from os.path import join, dirname, normpath
import os

CLOSURE_LIBRARY = os.environ['HUTMAP_CLOSURE_LIBRARY']
CLOSURE_COMPILER = os.environ['HUTMAP_CLOSURE_COMPILER']
CLOSURE_TEMPLATES = os.environ['HUTMAP_CLOSURE_TEMPLATES']

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

MODEL_LIST = [
  {'name': 'Hut',    'skip_fields': ['created', 'updated']},
  {'name': 'Agency', 'skip_fields': []},
  {'name': 'Region', 'skip_fields': []},
]
