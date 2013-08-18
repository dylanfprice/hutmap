from django.test import TestCase
from huts.utils.convert import convert
from StringIO import StringIO

class ConvertTestCase(TestCase):
  test1 = """Hut_ID,Date_Added,Status,Date_Updated,Notes,Discretion,Country,State,Region,Designations,Systems,Parent_Agency,Agency,Agency_URL,Name,Alternate_Names,Hut_URL,Photo_URL,Photo_Credit_Name,Photo_Credit_URL,Hut_References,Latitude,Longitude,Accuracy,Satview,Location_References,Altitude,Open_Summer,Open_Winter,Activities,Backcountry,Access_NoSnow,NoSnow_minKM,Snow_minKM,Types,Structures,Capacity_max,Capacity_hutmin,Capacity_hutmax,Fee,Fee_personmin,Fee_personmax,Fee_hutmin,Fee_hutmax,Reservations,Locked,Services_Included,Optional_Services_Available,Restrictions,Private
,2012-11-27,1,2012-11-27,,0,United States,Colorado,Front Range,Arapaho National Forest,,,,,First Creek Cabin,,http://www.onlyskiing.com/?id=Blog&post=177,http://www.onlyskiing.com/Uploads/Uploads-BlogPhotos/177-FirstCreekCabin.jpg,,,,39.83257,-105.76895,3,,,"3,328",0,0,,2,Trail,1.1,1.1,Hut,1,8,8,8,,NA,NA,22.5 (2),25 (2),0,,0,0,0,0"""

  def test_convert(self):
    csvfile = StringIO(self.test1)
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

