#

import os
from os.path import join, dirname, normpath

CLOSURE_LIBRARY = os.environ['HUTMAP_CLOSURE_LIBRARY']
CLOSURE_COMPILER = os.environ['HUTMAP_CLOSURE_COMPILER']
CLOSURE_TEMPLATES = os.environ['HUTMAP_CLOSURE_TEMPLATES']

LOCAL_PATH = normpath(join(dirname(__file__), '.'))
SRC_PATH = join(LOCAL_PATH, '..', 'src')

CSS_PATH = join(SRC_PATH, 'css')
HUTMAP_PATH = join(SRC_PATH, 'hutmap')
JS_PATH = join(SRC_PATH, 'js')
JS_TEST_PATH = join(SRC_PATH, 'js-test')

PUBLIC_PATH = join(LOCAL_PATH, '..', 'public')
JS_DEST = join(PUBLIC_PATH, 'static', 'js')
CSS_DEST = join(PUBLIC_PATH, 'static', 'css')

