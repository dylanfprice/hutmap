from django.test import TestCase
import json

class HutResourceTestCase(TestCase):
  fixtures = ['test_data.json']

  def test_query_bbox(self):
    response = self.client.get('/huts/api/v1/hut/?bbox=-122.79683,47.05814,-120.79683,49.05814')
    results = json.loads(response.content)
    self.assertEqual(7, results['meta']['total_count'])

