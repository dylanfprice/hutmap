from django.core.management.base import BaseCommand
from huts.utils import export

class Command(BaseCommand):
    args = ''
    help = 'Dumps the huts, agencies, and regions in the json api format.'

    def handle(self, *args, **options):
        print(export.db_as_json().encode('utf-8'))
