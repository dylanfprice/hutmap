import itertools

from django.core.urlresolvers import reverse
from django.db.models import ManyToManyField

from huts.api_validation import HutValidation
from huts.forms import HutSuggestionForm
from huts.models import (AccessType, Agency, Designation, Hut, HutSuggestion,
                         HutType, Region, Service, System)
from tastypie import fields
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization
from tastypie.contrib.gis.resources import ModelResource
from tastypie.resources import NamespacedModelResource
from tastypie.validation import FormValidation


class NamespacedGeoModelResource(NamespacedModelResource, ModelResource):
    pass


class RegionResource(NamespacedGeoModelResource):
    class Meta:
        queryset = Region.objects.all()
        allowed_methods = ['get']


class LabelResourceMixin(object):
    class Meta:
        allowed_methods = ['get']
        fields = ['name', 'identifier']


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


class HutCommonResource(NamespacedGeoModelResource):
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

    def _add_choices(self, base_schema, field):
        base_schema['fields'][field.name].update({
            'choices': {
                choice: label
                for choice, label in field.get_choices()
            }
        })

    def _reverse_model(self, resource_name, pk):
        # TODO: this is a hack
        from huts.urls import v1_api
        return reverse(
            '{}:api_dispatch_detail'.format(v1_api.urlconf_namespace),
            kwargs={
                'api_name': v1_api.api_name,
                'resource_name': resource_name,
                'pk': pk
            }
        )

    def _add_m2m_choices(self, base_schema, field):
        # TODO: this is a hack
        resource_name = field.rel.to.__name__.lower()
        base_schema['fields'][field.name].update({
            'choices': {
                self._reverse_model(resource_name, pk): label
                for pk, label in field.get_choices()
                if pk != '' # remove blank choice
            }
        })

    def build_schema(self):
        base_schema = super(HutCommonResource, self).build_schema()
        object_class = self._meta.object_class

        for field in itertools.chain(
            object_class._meta.fields,
            object_class._meta.many_to_many
        ):
            included = field.name in base_schema['fields']
            if included:
                is_many_to_many = isinstance(field, ManyToManyField)
                if is_many_to_many:
                    self._add_m2m_choices(base_schema, field)

                has_choices = bool(field.choices)
                if has_choices:
                    self._add_choices(base_schema, field)

                for attr in ['blank', 'verbose_name', 'help_text']:
                    base_schema['fields'][field.name][attr] = getattr(field, attr)

        return base_schema


class HutResource(HutCommonResource):
    class Meta:
        max_limit = 0
        queryset = Hut.objects.published()
        list_allowed_methods = ['get']
        detail_allowed_methods = ['get']
        excludes = ['created', 'updated']
        filtering = {
            'name': ['startswith'],
        }


class HutSuggestionResource(HutCommonResource):
    class Meta:
        queryset = HutSuggestion.objects.all()
        allowed_methods = ['get', 'post']
        authentication = Authentication()
        authorization = Authorization()
        validation = HutValidation()
