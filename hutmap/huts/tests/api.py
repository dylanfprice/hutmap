from django.test import TestCase
import json

class HutResourceTestCase(TestCase):
  fixtures = ['test_data.json']

  def test_query_bbox(self):
    response = self.client.get('/huts/api/v1/hut/?bbox=47.05814,-122.79683,49.05814,-120.79683')
    results = json.loads(response.content)
    self.assertEqual(7, results['meta']['total_count'])

  def test(self):
    response = self.client.get('/huts/api/v1/hut/?bbox=45.795034%2C-124.838039%2C49.636264%2C-116.642238') 
    results = json.loads(response.content)
    print(results)




