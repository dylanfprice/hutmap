from django.contrib.gis.geos import GEOSGeometry
from django.test import TestCase
from huts.widgets import PointWidget, ListWidget

class PointWidgetTestCase(TestCase):

  def setUp(self):
    self.pw = PointWidget()

  def test_render(self):
    location = GEOSGeometry('POINT(-120 45)')
    expected = '<input name="location" type="text" value="45.0, -120.0" />'
    actual = self.pw.render('location', location)
    self.assertEqual(expected, actual)

  def test_value_from_datadict(self):
    data = { 'location': '45, -120' }
    expected = GEOSGeometry('POINT(-120 45)')
    actual = self.pw.value_from_datadict(data, None, 'location')
    self.assertEqual(expected, actual)


class ListWidgetTestCase(TestCase):

  def setUp(self):
    self.lw = ListWidget()

  def test_render_none(self):
    expected = '<input name="list" type="text" />'
    actual = self.lw.render('list', None)
    self.assertEqual(expected, actual)

  def test_render_list(self):
    expected = '<input name="list" type="text" value="a, b, c" />'
    actual = self.lw.render('list', ['a', 'b', 'c'])
    self.assertEqual(expected, actual)

  def test_value_from_datadict_none(self):
    data = { 'list': '' }
    actual = self.lw.value_from_datadict(data, None, 'list')
    self.assertEqual(None, actual)

  def test_value_from_datadict_list(self):
    data = { 'list': 'a, b, c' }
    actual = self.lw.value_from_datadict(data, None, 'list')
    self.assertEqual(['a', 'b', 'c'], actual)

