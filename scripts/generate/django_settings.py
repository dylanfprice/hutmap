import util
import sys

config = util.get_config()
sys.path.insert(0, config.HUTMAP_PATH)
from settings import *


TEMPLATE_DIRS = (
  'templates',
)
