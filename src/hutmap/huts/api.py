from django.db.models.fields.related import RelatedField
from huts.models import Hut, Region, Agency, Designation, System, AccessType,\
                        HutType, Service, HutSuggestion
from huts.utils.csv_serializer import CSVSerializer
from huts.utils.csv_consts import CSV_NULL, CSV_TRUE, CSV_FALSE
from tastypie.contrib.gis.resources import ModelResource
from tastypie.resources import NamespacedModelResource
from tastypie.authorization import Authorization
from tastypie.validation import FormValidation
from tastypie import fields
from huts.forms import HutSuggestionForm

class NamespacedGeoModelResource(NamespacedModelResource, ModelResource):
    pass

class RegionResource(NamespacedGeoModelResource):
  class Meta:
    queryset = Region.objects.all()
    allowed_methods = ['get']
    serializer = CSVSerializer(formats=['json', 'csv'])

class LabelResourceMixin(object):
  class Meta:
    allowed_methods = ['get']
    serializer = CSVSerializer(formats=['json', 'csv'])
    fields = ['name', 'identifier']
    include_resource_uri = False

class DesignationResource(NamespacedGeoModelResource, LabelResourceMixin):
  class Meta(LabelResourceMixin.Meta):
    queryset = Designation.objects.all()

class SystemResource(NamespacedGeoModelResource, LabelResourceMixin):
  class Meta(LabelResourceMixin.Meta):
    queryset = System.objects.all()

class AccessTypeResource(NamespacedGeoModelResource, LabelResourceMixin):
  class Meta(LabelResourceMixin.Meta):
    queryset = AccessType.objects.all()

class HutTypeResource(NamespacedGeoModelResource, LabelResourceMixin):
  class Meta(LabelResourceMixin.Meta):
    queryset = HutType.objects.all()

class ServiceResource(NamespacedGeoModelResource, LabelResourceMixin):
  class Meta(LabelResourceMixin.Meta):
    queryset = Service.objects.all()

class AgencyResource(NamespacedGeoModelResource):
  parent = fields.ForeignKey('AgencyResource', 'agency', full=False, null=True)

  class Meta:
    max_limit = 0
    queryset = Agency.objects.all()
    allowed_methods = ['get']
    serializer = CSVSerializer(formats=['json', 'csv'])

class HutResource(NamespacedGeoModelResource):
  region = fields.ForeignKey(RegionResource, 'region', full=False, null=True)
  agency = fields.ForeignKey(AgencyResource, 'agency', full=False, null=True)
  # list fields
  location_references = fields.ListField(attribute='location_references', null=True)
  hut_references = fields.ListField(attribute='hut_references', null=True)
  alternate_names = fields.ListField(attribute='alternate_names', null=True)
  # m2m fields
  designations = fields.ToManyField(DesignationResource, 'designations', null=True, full=True)
  systems = fields.ToManyField(SystemResource, 'systems', null=True, full=True)
  access_no_snow = fields.ToManyField(AccessTypeResource, 'access_no_snow', null=True, full=True)
  types = fields.ToManyField(HutTypeResource, 'types', null=True, full=True)
  services = fields.ToManyField(ServiceResource, 'services', null=True, full=True)
  optional_services = fields.ToManyField(ServiceResource, 'optional_services', null=True, full=True)

  class Meta:
    max_limit = 0
    queryset = Hut.objects.published()
    list_allowed_methods = ['get']
    detail_allowed_methods = ['get']
    excludes = ['created', 'updated']
    serializer = CSVSerializer(formats=['json', 'csv'])
    filtering = {
      'name': ['startswith'],
    }

  def _add_choices(self, base_schema, field):
    base_schema['fields'][field.name].update({
      'choices': {
          choice: label
          for choice, label in field.get_choices()
      }
    })

  def build_schema(self):
    base_schema = super(HutResource, self).build_schema()
    object_class = self._meta.object_class

    for field in object_class._meta.fields:
      if field.name in base_schema['fields'] and field.choices:
          self._add_choices(base_schema, field)

    for field in object_class._meta.many_to_many:
      if field.name in base_schema['fields']:
          self._add_choices(base_schema, field)

    return base_schema

  def dehydrate(self, bundle):
    format = self.determine_format(bundle.request)
    if format == 'text/csv':
      # separate location into lat and lon
      location = bundle.data['location']
      del bundle.data['location']
      bundle.data['latitude'] = location['coordinates'][1]
      bundle.data['longitude'] = location['coordinates'][0]

      for key,value in bundle.data.iteritems():
        if isinstance(value, bool):
          bundle.data[key] = CSV_TRUE if value else CSV_FALSE
        elif isinstance(value, list):
          bundle.data[key] = ','.join(value)
        elif value == None:
          bundle.data[key] = CSV_NULL

    return bundle

class HutSuggestionResource(HutResource):

   class Meta:
     queryset = HutSuggestion.objects.all()
     list_allowed_methods = ['post']
     detail_allowed_methods = []
     authorization = Authorization()
     validation = FormValidation(form_class=HutSuggestionForm)
