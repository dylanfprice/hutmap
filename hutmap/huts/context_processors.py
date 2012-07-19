
def settings(request):
  from django.conf import settings
  return {'DEVELOPMENT': settings.DEVELOPMENT}
