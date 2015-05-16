from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test


def is_superuser(user):
    return user.is_superuser


@user_passes_test(is_superuser, login_url='admin:login')
def style_guide(request):
    return render(request, 'ui_components/style_guide.html', {})
