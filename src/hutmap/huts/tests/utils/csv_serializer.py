from unittest import TestCase
from huts.utils.csv_serializer import CSVSerializer

class CSVSerializerTestCase(TestCase):

  def setUp(self):
    self.serializer = CSVSerializer()

  def test_to_csv(self):
    result = self.serializer.serialize({
        'meta': { 
          'total_count': 2, 
          'previous': None, 
          'limit': 20, 
          'offset': 0, 
          'next': None
        },
        'objects': [
          {
            'field1': 1,
            'field2': 'value2'
          },
          {
            'field1': 'value1-2',
            'field2': u'Margy\u2019s Hut',
          }
        ], 
      },
      format='text/csv'
    )
    self.assertEqual(
      "field2,field1\r\nvalue2,1\r\nMargy\xe2\x80\x99s Hut,value1-2\r\n",
      result
    )
