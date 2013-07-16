from django.contrib.gis.db import models
from django.core.files.base import ContentFile
from huts.model_fields import CountryField, ListField
from huts.utils.image import retrieve_and_resize
from os import path
from urllib2 import HTTPError

class HutManager(models.GeoManager):
  def published(self):
    return super(HutManager, self).get_query_set().filter(published=True)

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
  altitude_meters = models.IntegerField('altitude (m)', null=True, blank=True)
  location_accuracy = models.IntegerField(choices=LOCATION_ACCURACY_CHOICES, null=True, blank=True)
  show_satellite = models.NullBooleanField()

  location_references = ListField(null=True, blank=True)

  ## geopolitical ##
  country = CountryField(null=False)
  state = models.CharField(max_length=50, null=False)
  region = models.ForeignKey('Region', null=True, blank=True)
  designations = ListField(null=True, blank=True)
  systems = ListField(null=True, blank=True)

  agency = models.ForeignKey('Agency', null=True, blank=True)

  ## hut details ##
  name = models.CharField(max_length=100, null=True, blank=True)
  alternate_names = ListField(null=True, blank=True)
  hut_url = models.URLField(max_length=250, null=True, blank=True)

  # returns path to save photo, relative to MEDIA_ROOT
  def image_path(self, hut, filename):
    return path.join('huts', hut.country, hut.state, hut.name, filename)

  photo = models.ImageField(upload_to=image_path, null=True, blank=True)
  photo_url = models.URLField(max_length=250, null=True, blank=True)
  photo_credit_name = models.CharField(max_length=150, null=True, blank=True)
  photo_credit_url = models.URLField(max_length=250, null=True, blank=True)
  backcountry = models.IntegerField(choices=BACKCOUNTRY_CHOICES, null=True, blank=True)
  open_summer = models.NullBooleanField()
  open_winter = models.NullBooleanField()

  # Access method(s) when no snow on ground. Frontcountry options include Paved
  # Road, 4WD Road, 2WD Road, Unpaved Road (if unknown whether 2WD or 4WD).
  # Backcountry options include Gated/Private (Paved/2WD/4WD/Unpaved) Road,
  # Boat, Helicopter, (Ski/Float) Plane, Trail.  If technical terrain, the
  # hardest terrain is listed (Off Trail, Scramble, Glacier Travel, etc).
  access_no_snow = ListField(null=True, blank=True)

  no_snow_min_km = models.FloatField('minimum non-motorized kilometers when no snow is presetn', null=True, blank=True)
  is_snow_min_km = models.NullBooleanField('snow on access roads')
  snow_min_km = models.FloatField('non-motorized kilometers to nearest trailhead on plowed road', null=True, blank=True)

  types = ListField()
  structures = models.IntegerField('number of structures', null=True, blank=True)

  ## capacity ##
  capacity_max = models.IntegerField('total capacity', null=True, blank=True)
  capacity_hut_min = models.IntegerField('minimum hut capacity', null=True, blank=True)
  capacity_hut_max = models.IntegerField('maximum hut capacity', null=True, blank=True)

  ## fees ##
  is_fee_person = models.NullBooleanField('payment per person')
  fee_person_min = models.FloatField('minimum fee per person per night', null=True, blank=True)
  fee_person_max = models.FloatField('maximum fee per person per night', null=True, blank=True)
  is_fee_person_occupancy_min = models.NullBooleanField('is there a minimum occupancy when paying per person')
  fee_person_occupancy_min = models.IntegerField('minimum occupancy when paying per person', null=True, blank=True)
  is_fee_hut = models.NullBooleanField('payment per structure')
  fee_hut_min = models.FloatField('minimum fee per structure per night', null=True, blank=True)
  fee_hut_max = models.FloatField('maximum fee per structure per night', null=True, blank=True)
  is_fee_hut_occupancy_max = models.NullBooleanField('is there a maximum occupancy when paying per structure')
  fee_hut_occupancy_max = models.IntegerField('maximum occupancy when paying per structure', null=True, blank=True)

  has_services = models.NullBooleanField('services are included')
  has_optional_services = models.NullBooleanField('optional services are available at further cost')
  services = ListField(null=True, blank=True)

  is_restricted = models.NullBooleanField()
  restriction = models.CharField(max_length=100, null=True, blank=True)

  reservations = models.NullBooleanField('reservations accepted')
  locked = models.NullBooleanField()
  overnight = models.NullBooleanField()
  private = models.NullBooleanField()
  discretion = models.NullBooleanField()

  # true if we should display this hut on the site
  published = models.BooleanField()

  # for geodjango
  objects = HutManager()

  def __unicode__(self):
    return u'{0}'.format(self.name)

  def cache_photo(self):
    """Store image locally if we have a URL"""
    if self.photo_url and not self.photo:
      try:
        image = retrieve_and_resize(self.photo_url)
        self.photo.save(
          'bottombar.jpeg',
          ContentFile(image.read()),
          save=True
        )
      except HTTPError:
        self.photo_url = None
        self.save()
      except:
        pass

  def save(self, *args, **kwargs):
    super(Hut, self).save(*args, **kwargs) # Call the "real" save() method.
    self.cache_photo()


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
  name = models.CharField(max_length=100, unique=True)

  created = models.DateField(auto_now_add=True)
  updated = models.DateField(auto_now=True)

  # Parent agency for this agency. null if unknown or not relevant (e.g. this
  # agency is a parent to other agencies)
  parent = models.ForeignKey('Agency', null=True, blank=True)
  # contact info
  url = models.URLField(max_length=250, null=True, blank=True)
  phone = models.PositiveSmallIntegerField(null=True, blank=True)
  email = models.CharField(max_length=100, null=True, blank=True)

  objects = models.GeoManager()

  def __unicode__(self):
    return u'{0}'.format(self.name)

