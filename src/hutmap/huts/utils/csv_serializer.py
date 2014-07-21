from csv import DictWriter
from tastypie.serializers import Serializer
import StringIO

class CSVSerializer(Serializer):
    formats = ['json', 'jsonp', 'xml', 'yaml', 'html', 'plist', 'csv']
    content_types = {
      'json': 'application/json',
      'jsonp': 'text/javascript',
      'xml': 'application/xml',
      'yaml': 'text/yaml',
      'html': 'text/html',
      'plist': 'application/x-plist',
      'csv': 'text/csv',
    }

    def to_csv(self, data, options=None):
        options = options or {}
        data = self.to_simple(data, options)
        raw_data = StringIO.StringIO()
        if 'objects' in data:
            objects = data['objects']
            if len(objects) >= 1:
                writer = DictWriter(raw_data, objects[0].keys())
                writer.writeheader()
                for item in objects:
                    writer.writerow(dict((k, v if isinstance(v, basestring) else str(v)) for k, v in item.iteritems()))
        return raw_data.getvalue()
