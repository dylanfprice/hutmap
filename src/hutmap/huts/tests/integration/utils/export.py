from django.test import TestCase
from huts.utils import export
import json

class ExportTestCase(TestCase):
    fixtures = ['test_data.json']

    def test_export_db_as_json(self):
        data = json.loads(export.db_as_json())
        self.assertEqual(50, data['huts']['meta']['total_count'])
        self.assertEqual(355, data['agencies']['meta']['total_count'])
        self.assertEqual(120, data['regions']['meta']['total_count'])

        self.assertEqual(u'First Creek Cabin', data['huts']['object_index']['1']['name'])
