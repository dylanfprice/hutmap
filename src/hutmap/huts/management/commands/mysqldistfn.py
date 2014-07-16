from django.core.management.base import BaseCommand
from django.conf import settings
import subprocess

def add_distance_fn():
    # TODO: this is a hack
    # Create the 'distance' function in mysql
    cmd = ["mysql -u {user} -p'{passw}' < /etc/mysql/hutmap_fns.sql".format(
             user=settings.DATABASES['default']['USER'],
             passw=settings.DATABASES['default']['PASSWORD'])]
    subprocess.check_call(cmd, shell=True)
    print("Added 'distance' function to mysql")

class Command(BaseCommand):
    args = ''
    help = 'Creates a distance function in the mysql database'

    def handle(self, *args, **options):
        add_distance_fn()
