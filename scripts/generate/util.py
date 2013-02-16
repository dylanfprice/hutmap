import imp
from os.path import normpath, join, dirname

def get_config():
  return imp.load_source('config', normpath(join(dirname(__file__), '../config.py')))
