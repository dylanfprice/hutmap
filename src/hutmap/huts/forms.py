from django.forms import ModelForm
from huts.models import Hut, Agency, Region

class HutAdminForm(ModelForm):
  class Meta:
    model = Hut
    exclude = ['created', 'updated']

class HutForm(ModelForm):
  class Meta:
    model = Hut
    fields = ['discretion', 'location', 'altitude_meters', 'location_accuracy',
        'show_satellite', 'location_references', 'country', 'state', 'region',
        'designations', 'systems', 'agency', 'name', 'alternate_names',
        'hut_url', 'photo_url', 'photo_credit_name', 'photo_credit_url',
        'backcountry', 'open_summer', 'open_winter', 'access_no_snow',
        'no_snow_min_km', 'snow_min_km', 'types', 'structures', 'capacity_max',
        'capacity_hut_min', 'capacity_hut_max', 'fee_person_min',
        'fee_person_max', 'fee_person_occupancy_min', 'fee_hut_min',
        'fee_hut_max', 'fee_hut_occupancy_max', 'services_included',
        'optional_services_available', 'restriction', 'reservations', 'locked',
        'overnight', 'private', 'published']


