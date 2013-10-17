from django import template

register = template.Library()

@register.filter
def css_classes(form, field_name):
  field = form.fields.get(field_name, None)
  if field is not None:
    return field.widget.attrs.get('class', '')
  return ''

