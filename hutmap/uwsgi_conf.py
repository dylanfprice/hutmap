from django.utils import autoreload
import uwsgi

from hutmap.settings import DEBUG


def get_free_signal():
    for signum in range(0, 256):
        if not uwsgi.signal_registered(signum):
            return signum

    raise Exception("No free uwsgi signal available")


class timer(object):
    def __init__(self, secs, **kwargs):
        self.num = kwargs.get('signum', get_free_signal())
        self.secs = secs
        self.target = kwargs.get('target', '')

    def __call__(self, f):
        uwsgi.register_signal(self.num, self.target, f)
        uwsgi.add_timer(self.num, self.secs)
        return f


if DEBUG:
    @timer(3)
    def reload_on_code_change(sig):
        if autoreload.code_changed():
            uwsgi.reload()
