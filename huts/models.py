from django.core.validators import RegexValidator
from django.contrib.gis.db import models
from django.core.files.base import ContentFile
from any_imagefield.models import AnyImageField
from huts.model_fields import CountryField, ListField
from huts.utils.image import retrieve_and_resize
from os import path
from urllib2 import HTTPError, URLError

class Region(models.Model):
    region = models.CharField(max_length=50, unique=True)
    created = models.DateField(auto_now_add=True)
    updated = models.DateField(auto_now=True)
    #parent = models.ForeignKey('Region')
    #area = models.PolygonField(null=True, spatial_index=False)
    objects = models.GeoManager()

    def __unicode__(self):
        return u'{0}'.format(self.region)

class Label(models.Model):
    name = models.CharField(max_length=100, blank=False)
    identifier = models.SlugField(
      unique=True,
      blank=False,
      validators=[RegexValidator(r'^[-a-zA-Z0-9]+$', 'Must contain only letters, numbers, and dashes')]
    )

    def __unicode__(self):
        return u'{0}'.format(self.name)

    class Meta:
        abstract = True

class Designation(Label):
    pass

class System(Label):
    pass

class AccessType(Label):
    pass

class HutType(Label):
    pass

class Service(Label):
    pass

class HutCommon(models.Model):
    LOCATION_ACCURACY_CHOICES = (
      (None, 'Provided by 3rd party'),
      (1, 'Wild guess (> 1 km)'),
      (2, 'Guess (< 1 km)'),
      (3, 'Found on photo or topo map'),
      (4, 'Surveyed by GPS'),
      (5, 'Surveyed by GPS and found on map'),
    )

    BACKCOUNTRY_CHOICES = (
      (0, 'frontcountry'),
      (1, 'backcountry in snow'),
      (2, 'backcountry year-round'),
      (3, 'backcountry year-round and accessible only by trail or rugged terrain'),
    )

    ## metadata ##
    created = models.DateField(auto_now_add=True)
    updated = models.DateField(auto_now=True)

    ## location ##
    # NOTE: change this to true if we ever do spatial queries (and mysql engine to MyISAM)
    location = models.PointField(spatial_index=False)
    altitude_meters = models.IntegerField('altitude (m)', null=True, blank=True)
    location_accuracy = models.IntegerField(choices=LOCATION_ACCURACY_CHOICES, null=True, blank=True)
    show_satellite = models.NullBooleanField()
    show_topo = models.NullBooleanField()

    location_references = ListField(null=True, blank=True)

    ## geopolitical ##
    country = CountryField(null=False)
    state = models.CharField(max_length=50, blank=False)
    region = models.ForeignKey('Region', null=True, blank=True)
    designations = models.ManyToManyField(Designation, blank=True)
    systems = models.ManyToManyField(System, blank=True)

    agency = models.ForeignKey('Agency', null=True, blank=True)

    ## hut details ##
    name = models.CharField(max_length=100)
    alternate_names = ListField(null=True, blank=True)
    hut_url = models.URLField(max_length=250, blank=True)
    hut_references = ListField(null=True, blank=True)

    # returns path to save photo, relative to MEDIA_ROOT
    def image_path(hut, filename):
        return path.join('huts', hut.country, hut.state, hut.name, filename)

    photo = AnyImageField(upload_to=image_path, null=True, blank=True)
    photo_url = models.URLField(max_length=250, null=True, blank=True)
    photo_credit_name = models.CharField(max_length=150, blank=True)
    photo_credit_url = models.URLField(max_length=250, null=True, blank=True)
    backcountry = models.IntegerField(choices=BACKCOUNTRY_CHOICES, null=True, blank=True)
    open_summer = models.NullBooleanField()
    open_winter = models.NullBooleanField()

    # Access method(s) when no snow on ground. Frontcountry options include Paved
    # Road, 4WD Road, 2WD Road, Unpaved Road (if unknown whether 2WD or 4WD).
    # Backcountry options include Gated/Private (Paved/2WD/4WD/Unpaved) Road,
    # Boat, Helicopter, (Ski/Float) Plane, Trail.  If technical terrain, the
    # hardest terrain is listed (Off Trail, Scramble, Glacier Travel, etc).
    access_no_snow = models.ManyToManyField(AccessType, blank=True)

    no_snow_min_km = models.FloatField('minimum non-motorized kilometers when no snow is present', null=True, blank=True)
    is_snow_min_km = models.NullBooleanField('is there ever snow on access roads?')
    snow_min_km = models.FloatField('non-motorized kilometers to nearest trailhead on plowed road', null=True, blank=True)

    types = models.ManyToManyField(HutType, blank=False)
    structures = models.IntegerField('number of structures', null=True, blank=True)
    overnight = models.NullBooleanField('available for overnight stays')

    ## capacity ##
    capacity_max = models.IntegerField('total capacity', null=True, blank=True)
    capacity_hut_min = models.IntegerField('minimum hut capacity', null=True, blank=True)
    capacity_hut_max = models.IntegerField('maximum hut capacity', null=True, blank=True)

    ## fees ##
    is_fee_person = models.NullBooleanField('can you pay per person?')
    fee_person_min = models.FloatField('minimum fee per person per night', null=True, blank=True)
    fee_person_max = models.FloatField('maximum fee per person per night', null=True, blank=True)
    is_fee_person_occupancy_min = models.NullBooleanField('is there a minimum occupancy when paying per person?')
    fee_person_occupancy_min = models.IntegerField('minimum occupancy when paying per person', null=True, blank=True)
    is_fee_hut = models.NullBooleanField('can you pay per structure?')
    fee_hut_min = models.FloatField('minimum fee per structure per night', null=True, blank=True)
    fee_hut_max = models.FloatField('maximum fee per structure per night', null=True, blank=True)
    is_fee_hut_occupancy_max = models.NullBooleanField('is there a maximum occupancy when paying per structure?')
    fee_hut_occupancy_max = models.IntegerField('maximum occupancy when paying per structure', null=True, blank=True)

    has_services = models.NullBooleanField('are services included?')
    has_optional_services = models.NullBooleanField('optional services are available at further cost')
    services = models.ManyToManyField(Service, blank=True, related_name='%(app_label)s_%(class)s_set')
    optional_services = models.ManyToManyField(Service, blank=True, related_name='optional_%(app_label)s_%(class)s_set')

    is_restricted = models.NullBooleanField('is access restricted?')
    restriction = models.CharField(max_length=100, blank=True)

    reservations = models.NullBooleanField('reservations accepted')
    locked = models.NullBooleanField()
    private = models.NullBooleanField()
    discretion = models.NullBooleanField()

    class Meta:
        abstract = True

    def __unicode__(self):
        return u'{0}'.format(self.name)


class HutManager(models.GeoManager):
    def published(self):
        return super(HutManager, self).get_query_set().filter(published=True)

class Hut(HutCommon):
    # true if we should display this hut on the site
    published = models.BooleanField()
    # for geodjango
    objects = HutManager()

    def cache_photo(self):
        """Store image locally if we have a URL"""
        if self.photo_url and not self.photo:
            try:
                image = retrieve_and_resize(self.photo_url, 200, 200)
                self.photo.save(
                  'photo_200x200.jpeg',
                  ContentFile(image.read()),
                  save=True
                )
            except (HTTPError, URLError, IOError):
                self.photo_url = None
                self.save()
            except:
                pass #TODO: log this


    def save(self, *args, **kwargs):
        super(Hut, self).save(*args, **kwargs) # Call the "real" save() method.
        self.cache_photo()

class HutSuggestion(HutCommon):
    '''User suggested hut'''
    user_email = models.EmailField('your email', blank=True)
    user_notes = models.TextField('notes for the Hutmap team', blank=True)
    objects = HutManager()

class HutEdit(HutCommon):
    '''User suggested hut edit'''
    user_email = models.EmailField('your email', blank=True)
    user_notes = models.TextField('notes for the Hutmap team', blank=True)
    hut = models.ForeignKey(Hut, related_name='+') # '+' disables backwards relation
    objects = HutManager()

class Agency(models.Model):
    name = models.CharField(max_length=100, unique=True)

    created = models.DateField(auto_now_add=True)
    updated = models.DateField(auto_now=True)

    # Parent agency for this agency. null if unknown or not relevant (e.g. this
    # agency is a parent to other agencies)
    parent = models.ForeignKey('Agency', null=True, blank=True)
    # contact info
    url = models.URLField(max_length=250, blank=True)
    email = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)

    objects = models.GeoManager()

    def __unicode__(self):
        return u'{0}'.format(self.name)
