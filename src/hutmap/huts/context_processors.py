from django.conf import settings as django_settings

def settings(request):
  return {
      'DEBUG': django_settings.DEBUG,
      'GOOGLE_API_KEY': django_settings.GOOGLE_API_KEY,
  }


