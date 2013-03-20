from django.contrib.gis.db import models
from huts.utils.countries import CountryField

class Hut(models.Model):
  ACCURACY_CHOICES = (
    (0, 'wild ass guess'), 
    (1, 'hut not found on map, only word description of location'), 
    (2, 'hut not found on imagery or topo, but location eyeballed from agency \
     provided static map'), 
    (3, 'hut located on satellite view in Google Maps or on topo'), 
    (4, 'surveyed in situ'), 
    (None, 'coordinates provided and yet unverified')
  )

  #BACKCOUNTRY_CHOICES = (
  #  (0, 'frontcountry year-round'),
  #  (1, 'backcountry in snow'),
  #  (2, 'backcountry year-round'),
  #  (3, 'backcountry year-round and accessible by trail or more rugged terrain only'),
  #)

  # metadata
  created = models.DateField(auto_now_add=True)
  updated = models.DateField(auto_now=True)
  # location
  region = models.ForeignKey('Region')
  location = models.PointField()
  accuracy = models.IntegerField(choices=ACCURACY_CHOICES)
  #altitude_m = models.IntegerField('altitude (m)',
  #                              null=True, blank=True)

  # new fields
  #status = models.IntegerField(choices=STATUS_CHOICES)
    #???
  #discretion = models.BooleanField()
    #A tag for sites that are potentially sensitive
    #to being publicized. We can choose to honor this or not when the time
    #comes. I mostly only foresee this as an issue for certain BC/Alberta
    #huts that I learned about through bivouac.com
  #designation = models.CharField(max_length=100)
    #National forest, wilderness
    #area, national park, state park, etc that surround or border hut
    #location.
  #system = models.ForeignKey('System')
    #Used both for systems internal to a
    #hut agency, or for larger systems like the Appalachian Trail shelters.
  #alternate_names = models.??
  #photo_credit = models.??
    #[name (url)] Name of author, along with link of origin
    #(flickr page, wikicommons, library of congress, etc).
  #location_references = models.??
  #open_summer = models.BooleanField()
  #open_winter = models.BooleanField()
  #activities = models.CharField(max_length=500)
  #access_no_snow = models.??
    #[string, multiple entry] Access method(s) when no snow
    #on ground. Frontcountry options include Paved Road, 4WD Road, 2WD
    #Road, Unpaved Road (if unknown whether 2WD or 4WD). Backcountry
    #options include Gated/Private (Paved/2WD/4WD/Unpaved) Road, Boat,
    #Helicopter, (Ski/Float) Plane, Trail. If technical terrain, the
    #hardest terrain is listed (Off Trail, Scramble, Glacier Travel, etc).
  #no_snow_min_km = models.FloatField()
    #[numeric] Minimum non-motorized kilometers when no snow
    #is present.
  #snow_min_km = models.FloatField()
    #[numeric] Non-motorized kilometers to nearest trailhead
    #on plowed road (if applicable and known).
  #locked
    #[boolean] 0 if not locked, 1 if building is kept locked. This
    #is not known for many sites, and better to not mention except for
    #sites that specifically mention they are unlocked.
  #services
    #[string, multiple entry] Specified if included in
    #price (Transportation, Full Board, Half Board, Guided, etc). 0 if none
    #included. 1 if optional services are available.
  #restrictions
    #[mixed factor] 0 if none, otherwise values so far: Club
    #Membership, Qualified User, etc...
  #private
    #[boolean] 0 if not-for-profit, government, or managed by
    #association, 1 if private. Somewhat deprecated and ambiguous in many
    #cases, unlikely to be used as a search parameter.


  # details
  name = models.CharField(max_length=100)
  #backcountry = models.IntegerField(choices=BACKCOUNTRY_CHOICES)
  #type = models.ForeignKey('HutType')
  #num_structures = models.IntegerField('number of structures')
  # capacity
  #capacity_max = models.IntegerField('total capacity')
  #capacity_hut_min = models.IntegerField('minimum hut capacity')
  #capacity_hut_max = models.IntegerField('maximum hut capacity')
  # fees
  #fee_person_min = models.FloatField('minimum fee per person per night',
  #                                   null=True, blank=True)
  #fee_person_max = models.FloatField('maximum fee per person per night',
  #                                   null=True, blank=True)
  #fee_hut_min = models.FloatField('minimum fee per hut per night',
  #                                null=True, blank=True)
  #fee_hut_max = models.FloatField('maximum fee per hut per night',
  #                                null=True, blank=True)
  #reservations = models.BooleanField('reservations accepted')
  # urls
  hut_url = models.URLField(max_length=250)
  photo_url = models.URLField(max_length=250)
  hut_references = models.CharField(max_length=300)
  # agency
  agency = models.ForeignKey('Agency')
  # for geodjango
  objects = models.GeoManager()

  def __unicode__(self):
    return self.name

class Region(models.Model):
  country = CountryField()
  state = models.CharField(max_length=50, blank=True)
  region = models.CharField(max_length=50)
  #area = models.PolygonField(null=True, spatial_index=False)
  objects = models.GeoManager()

  def __unicode__(self):
    return '{0}, {1}, {2}'.format(self.region, self.state, self.country)

class Agency(models.Model):
  name = models.CharField(max_length=100)
  url = models.URLField()
  objects = models.GeoManager()

  def __unicode__(self):
    return self.name

#class HutType(models.Model):
#  name = models.CharField(max_length=50, primary_key=True)
#  objects = models.GeoManager()
#
#  def __unicode__(self):
#    return self.name
