from django.contrib.gis.db import models
from huts.model_fields import CountryField, ListField

class Hut(models.Model):
  LOCATION_ACCURACY_CHOICES = (
    (None, 'coordinates provided but unverified'),
    (1, 'wild guess'), 
    (2, 'guess'), 
    (3, 'found on satellite or topo'),
    (4, 'surveyed by GPS'), 
    (5, 'surveyed by GPS and found on satellite or topo'), 
  )

  BACKCOUNTRY_CHOICES = (
    (0, 'frontcountry'),
    (1, 'backcountry in snow'),
    (2, 'backcountry year-round'),
    (3, 'backcountry year-round and accessible by trail or more rugged terrain only'),
  )

  ## metadata ##
  created = models.DateField(auto_now_add=True)
  updated = models.DateField(auto_now=True)

  ## location ##
  location = models.PointField()
  # null if unknown, otherwise elevation in meters, datum unspecified
  altitude_meters = models.IntegerField('altitude (m)', null=True)
  location_accuracy = models.IntegerField(choices=LOCATION_ACCURACY_CHOICES, null=True)
  # whether to show the satellite image (null if not checked, switched to true
  # if hut was visible on Google Maps).
  show_satellite = models.NullBooleanField()

  # URLs used to determine location, meaningful only if location accuracy is < 3.
  # I wonder if it would be best to archive snapshots of these pages, lest the
  # links expire.
  location_references = ListField(null=True, blank=True)

  ## geopolitical ##
  country = CountryField()
  # State or province or governorate (etc) of hut location.
  state = models.CharField(max_length=50)
  region = models.ForeignKey('Region', null=True)
  # National forest, wilderness area, national park, state park, etc that
  # surround or border hut location.
  designations = ListField(null=True, blank=True)
  # Used both for systems internal to a hut agency, or for larger systems like
  # the Appalachian Trail shelters.
  systems = ListField(null=True, blank=True)

  agency = models.ForeignKey('Agency', null=True)

  ## hut details ##
  name = models.CharField(max_length=100, null=True, blank=True)
  alternate_names = ListField(null=True)
  hut_url = models.URLField(max_length=250, null=True)
  photo_url = models.URLField(max_length=300, null=True)
  photo_credit_name = models.CharField(max_length=150, null=True)
  photo_credit_url = models.URLField(max_length=250, null=True)
  backcountry = models.IntegerField(choices=BACKCOUNTRY_CHOICES, null=True)
  open_summer = models.NullBooleanField()
  open_winter = models.NullBooleanField()

  # Access method(s) when no snow on ground. Frontcountry options include Paved
  # Road, 4WD Road, 2WD Road, Unpaved Road (if unknown whether 2WD or 4WD).
  # Backcountry options include Gated/Private (Paved/2WD/4WD/Unpaved) Road,
  # Boat, Helicopter, (Ski/Float) Plane, Trail.  If technical terrain, the
  # hardest terrain is listed (Off Trail, Scramble, Glacier Travel, etc).
  access_no_snow = ListField(null=True)

  # Minimum non-motorized kilometers when no snow is present.
  no_snow_min_km = models.FloatField(null=True)
  # Non-motorized kilometers to nearest trailhead on plowed road (if applicable
  # and known).
  snow_min_km = models.FloatField(null=True)

  types = ListField()
  structures = models.IntegerField('number of structures', null=True)

  ## capacity ##
  capacity_max = models.IntegerField('total capacity', null=True)
  capacity_hut_min = models.IntegerField('minimum hut capacity', null=True)
  capacity_hut_max = models.IntegerField('maximum hut capacity', null=True)

  ## fees ##
  fee_person_min = models.FloatField('minimum fee per person per night', null=True)
  fee_person_max = models.FloatField('maximum fee per person per night', null=True)
  fee_person_occupancy_min = models.IntegerField('minimum occupancy when paying per person', null=True)
  fee_hut_min = models.FloatField('minimum fee per hut per night', null=True)
  fee_hut_max = models.FloatField('maximum fee per hut per night', null=True)
  fee_hut_occupancy_max = models.IntegerField('maximum occupancy when paying per hut', null=True)

  # null if unknown, NA if none, otherwise Transportation, Full Board, Half
  # Board, Guided, etc.
  services_included = ListField()

  # null if unknown, true if extra services are available at further cost,
  # false if extra services are not available
  optional_services_available = models.NullBooleanField()

  # null if unknown, NA if none, else Club Membership, Qualified User, etc.
  restriction = models.CharField(max_length=100, null=True, blank=True)

  reservations = models.NullBooleanField('reservations accepted')

  # false if not locked, true if building is kept locked. This is not known for
  # many sites, and better to not mention except for sites that specifically
  # mention they are unlocked.
  locked = models.NullBooleanField()

  # whether the hut is currently available for overnight stays.
  overnight = models.NullBooleanField()

  # false if not-for-profit, government, or managed by association, true if
  # private. Somewhat deprecated and ambiguous in many cases, unlikely to be
  # used as a search parameter.
  private = models.NullBooleanField()

  # a tag for sites that are potentially sensitive to being publicized. We can
  # choose to honor this or not when the time comes. I mostly only foresee this
  # as an issue for certain BC/Alberta huts that I learned about through
  # bivouac.com
  discretion = models.NullBooleanField()

  # true if we should display this hut on the site
  published = models.BooleanField()

  # for geodjango
  objects = models.GeoManager()

  def __unicode__(self):
    return u'{0}'.format(self.name)

class Region(models.Model):
  region = models.CharField(max_length=50, unique=True)
  created = models.DateField(auto_now_add=True)
  updated = models.DateField(auto_now=True)
  #parent = models.ForeignKey('Region')
  #area = models.PolygonField(null=True, spatial_index=False)
  objects = models.GeoManager()

  def __unicode__(self):
    return u'{0}'.format(self.region)

class Agency(models.Model):
  # Name of primary agency that manages and/or handles reservations for the
  # hut.
  name = models.CharField(max_length=100, unique=True, null=True)

  created = models.DateField(auto_now_add=True)
  updated = models.DateField(auto_now=True)

  # Parent agency for this agency. null if unknown or not relevant (e.g. this
  # agency is a parent to other agencies)
  parent = models.ForeignKey('Agency', null=True)
  # contact info
  url = models.URLField(max_length=250, null=True)
  phone = models.PositiveSmallIntegerField(null=True)
  email = models.CharField(max_length=100, null=True)

  objects = models.GeoManager()

  def __unicode__(self):
    return u'{0}'.format(self.name)

