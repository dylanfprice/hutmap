from django.test import TestCase
from huts.utils import export
import json

class ExportTestCase(TestCase):
  fixtures = ['test_data.json']

  def test_export_db_as_json(self):
    data = json.loads(export.db_as_json())
    self.assertEqual(data['huts']['meta']['total_count'], 49)
    self.assertEqual(data['agencies']['meta']['total_count'], 355)
    self.assertEqual(data['regions']['meta']['total_count'], 120)

    self.assertEqual(data['huts']['object_index']['1']['name'], u'First Creek Cabin')
