import uwsgi
from uwsgidecorators import timer
from django.utils import autoreload

@timer(3)
def reload_on_code_change(sig):
    if autoreload.code_changed():
        uwsgi.reload()
