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

