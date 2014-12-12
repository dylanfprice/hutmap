from django.test import TestCase
from huts.utils.convert import convert
from StringIO import StringIO

class ConvertTestCase(TestCase):
    test_row = {
      'Hut_ID' : '',
      'Notes' : '',
      'Status' : '',
      'Date_Added' : '',
      'Date_Updated' : '2013-09-21',
      'Discretion' : '',
      'Country' : 'United States',
      'State' : 'Colorado',
      'Region' : 'Front Range',
      'Designations' : 'Arapaho National Forest',
      'Systems' : '',
      'Parent_Agency' : '',
      'Agency' : '',
      'Agency_URL' : '',
      'Phone' : '',
      'Email' : '',
      'Address' : '',
      'Name' : 'First Creek Cabin',
      'Alternate_Names' : '',
      'Hut_URL' : '',
      'Hut_References' : '',
      'Photo_URL' : 'http://www.onlyskiing.com/?id=Blog&post=177',
      'Photo_Credit_Name' : '',
      'Photo_Credit_URL' : '',
      'Latitude' : '39.83527',
      'Longitude' : '-105.76895',
      'Accuracy' : '3',
      'Satview' : '',
      'Topoview' : '',
      'Location_References' : '',
      'Altitude' : '"3,328"',
      'Open_Summer' : '0',
      'Open_Winter' : '0',
      'Backcountry' : '2',
      'Access_NoSnow' : 'Trail',
      'NoSnow_minKM' : '1.1',
      'Snow_minKM' : '1.1',
      'Types' : 'Hut',
      'Structures' : '1',
      'Overnight' : '',
      'Capacity_max' : '8',
      'Capacity_hutmin' : '8',
      'Capacity_hutmax' : '8',
      'Fee' : '',
      'Fee_personmin' : 'NA',
      'Fee_personmax' : 'NA',
      'Fee_hutmin' : '22.5 (2)',
      'Fee_hutmax' : '25 (2)',
      'Reservations' : '0',
      'Services_Included' : '0',
      'Optional_Services_Available' : '',
      'Restrictions' : '',
      'Locked' : '',
      'Private' : '',
      'Publish' : '',
    }


    def setUp(self):
        col_names = ','.join(self.test_row.keys())
        values = ','.join(self.test_row.values())
        self.test_csv_row = col_names + '\n' + values

    def test_convert(self):
        csvfile = StringIO(self.test_csv_row)
        new_rows = convert(csvfile)
        row = new_rows[0]
        self.assertEqual(row['altitude_meters'], '3328')
        self.assertEqual(row['is_fee_person'], '0')
        self.assertEqual(row['fee_person_min'], '')
        self.assertEqual(row['is_fee_person_occupancy_min'], '0')
        self.assertEqual(row['fee_person_occupancy_min'], '')
        self.assertEqual(row['is_fee_hut'], '1')
        self.assertEqual(row['fee_hut_min'], '22.5')
        self.assertEqual(row['fee_hut_max'], '25')
        self.assertEqual(row['is_fee_hut_occupancy_max'], '1')
        self.assertEqual(row['fee_hut_occupancy_max'], '2')
