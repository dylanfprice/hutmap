from django import template
from django.template.defaultfilters import stringfilter
import re

register = template.Library()

@register.filter
@stringfilter
def titleize(value):
    match = re.match(r'([a-z]+)([A-Z][a-z]+)', value)
    if match:
        value = ' '.join(map(lambda x: x.capitalize(), match.group(1, 2)))
    else:
        value = value.capitalize()
    return value
