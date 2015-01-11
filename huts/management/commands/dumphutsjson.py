import os
from optparse import make_option

from django.conf import settings
from django.core.management.base import BaseCommand

from huts.utils import export


class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option(
            '--update',
            action='store_true',
            default=False,
            help='Write to live huts.json file instead of writing to stdout',
        ),
    )
    help = 'Dumps the huts, agencies, and regions in the json api format.'

    def handle(self, *args, **options):
        huts_json = export.db_as_json().encode('utf-8'))
        if options['update']:
            path = os.path.join(settings.STATIC_ROOT, 'data')
            json_file = os.path.join(path, 'huts.json')
            tmp_file = os.path.join(path, 'huts.new.json')

            out = open(tmp_file, 'w')
            out.write(huts_json)

            os.replace(tmp_file, json_file)
        else:
            self.stdout.write(huts_json)
