from django.core.serializers import json
from huts.api import HutResource, AgencyResource, RegionResource
from huts.models import Hut, Agency, Region


def _get_objects_data(model, resource):
  objects = model.objects.all()
  objects_data = {
    'meta': { 'total_count': len(objects)},
    'object_index': {},
  }
  for object in objects:
    bundle = resource.build_bundle(obj=object)
    bundle = resource.full_dehydrate(bundle)
    objects_data['object_index'][bundle.data['id']] = bundle.data
  
  return objects_data


def db_as_json():
  data = {
    'huts': _get_objects_data(Hut, HutResource()),
    'agencies': _get_objects_data(Agency, AgencyResource()),
    'regions': _get_objects_data(Region, RegionResource()),
  }

  return json.json.dumps(data, cls=json.DjangoJSONEncoder, sort_keys=True,
      ensure_ascii=False)
