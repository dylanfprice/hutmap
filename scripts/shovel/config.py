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

DEPS_PATH = join(BASE_PATH, 'deps')
CLOSURE_COMPILER = join(DEPS_PATH, 'closure-compiler', 'compiler.jar')

HUTMAP_VERSION = os.environ['HUTMAP_VERSION']

PYTHON = normpath(join(os.environ['HOME'], '.pythonbrew', 'venvs',
                       'Python-2.7.3', 'hutmap', 'bin', 'python'))
