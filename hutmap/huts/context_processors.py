
def settings(request):
  """ Add extra variables to RequestContext objects for use in templates. """
  from django.conf import settings
  return {'DEVELOPMENT': settings.DEVELOPMENT}
