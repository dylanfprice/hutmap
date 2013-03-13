import unittest
from django.conf import settings
from os.path import join, dirname, normpath

def suite():
  return unittest.TestLoader().discover(
    normpath(join(dirname(__file__), '.')),
    pattern='*.py',
    top_level_dir=settings.LOCAL_PATH
  )
