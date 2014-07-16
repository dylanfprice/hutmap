from django.test import RequestFactory
from huts.api import HutResource, AgencyResource, RegionResource
from huts.models import Hut, Agency, Region

request_factory = RequestFactory()

def _serialize_queryset(queryset, resource):
    objects_data = {
      'meta': { 'total_count': len(queryset)},
      'object_index': {},
    }
    for obj in queryset:
        # have to make a fake request so tastypie doesn't blow up on m2m stuff
        bundle = resource.build_bundle(obj=obj, request=request_factory.get('/'))
        bundle = resource.full_dehydrate(bundle)
        objects_data['object_index'][bundle.data['id']] = bundle.data

    return resource.serialize(None, objects_data, 'application/json')

def db_as_json():
    json_template = u'''
      {{
        "huts": {},
        "agencies": {},
        "regions": {}
      }}
    '''

    return json_template.format(
        _serialize_queryset(Hut.objects.published(), HutResource()),
        _serialize_queryset(Agency.objects.all(), AgencyResource()),
        _serialize_queryset(Region.objects.all(), RegionResource()),
    )
