from optparse import make_option

from django.core.management.base import BaseCommand
from huts.utils import export


class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option(
            '--file',
            help='Write to file instead of stdout'
        ),
    )
    help = 'Dumps the huts, agencies, and regions in the json api format.'

    def handle(self, *args, **options):
        out = options['file'] or self.stdout
        out.write(export.db_as_json().encode('utf-8'))
