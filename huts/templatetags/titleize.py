from django import template
from django.template.defaultfilters import stringfilter
import re

register = template.Library()

@register.filter
@stringfilter
# camelCase => Camel case
def titleize(value):
    match = re.match(r'([a-z]+)([A-Z][a-z]+)', value)
    if match:
        value = ' '.join(map(lambda x: x.lower(), match.group(1, 2)))
    return value.capitalize()
