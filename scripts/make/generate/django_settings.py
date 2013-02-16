from os.path import join
import sys

import make.config as config

sys.path.insert(0, config.HUTMAP_PATH)
from settings import *

TEMPLATE_DIRS = (
  join(config.BASE_PATH, 'scripts', 'make', 'generate', 'templates'),
)
