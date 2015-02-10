import os

from django.conf import settings
from django.core.management.base import BaseCommand
from django.template.loader import render_to_string


class Command(BaseCommand):
    help = 'Generates the 50x.html page for serving by nginx'

    def handle(self, *args, **options):
        error_content = render_to_string('50x_template.html', {})
        filename = os.path.join(settings.STATIC_ROOT, '50x.html')
        with open(filename, 'w') as error_page:
            error_page.write(error_content)
