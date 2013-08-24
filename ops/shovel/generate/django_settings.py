from os.path import join, normpath, dirname
import imp
import sys

path = normpath(join(dirname(__file__)))
config = imp.load_source('config', join(path, '..', 'config.py'))
util = imp.load_source('util', join(path, 'util.py'))

sys.path.insert(0, config.HUTMAP_PATH)
from settings import *

TEMPLATE_DIRS = (
  join(config.BASE_PATH, 'scripts', 'shovel', 'generate', 'templates'),
)
