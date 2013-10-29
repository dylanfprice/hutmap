from django.contrib.gis.geos import GEOSGeometry
from django.test import TestCase
from django.core.exceptions import ValidationError
from huts.fields import PointFormField

class PointFormFieldTestCase(TestCase):

  def setUp(self):
    self.pf = PointFormField()

  def test_to_python_valid_value(self):
    value = '45, -120'
    expected = GEOSGeometry('POINT(-120 45)')
    actual = self.pf.to_python(value)
    self.assertEqual(expected, actual)

  def test_to_python_not_numbers(self):
    value = 'not, numbers'
    with self.assertRaises(ValidationError):
      self.pf.to_python(value)

  def test_to_python_no_comma(self):
    value = 'no comma here'
    with self.assertRaises(ValidationError):
      self.pf.to_python(value)

  def test_to_python_empty_string(self):
    value = ''
    actual = self.pf.to_python(value)
    self.assertEquals(None, actual)

