{% comment %}

This is the template which generates src/js/hutmap/models.js
Context:
{ 
  'models': [
    {'name': 'model1', 'fields': ['field1', 'field2', ...]},
    ...
  ]
}

{% endcomment %}

// This file generated from the template at scripts/make/generate/templates/models.js
// Please do not edit by hand.
{% for model in models %}
goog.provide('hutmap.{{ model.name }}');
{% endfor %}

{% for model in models %}
hutmap.{{ model.name }} = function(values) {
  if (!values)
    values = {};

  {% for field in model.fields %}
  this.{{ field }} = values.{{ field }};
  {% endfor %}

  {% for field in model.fields %}
  this.{{ field }}_display = (values.{{ field }} !== null &&
    values.{{ field }} !== undefined &&
    values.{{ field }} !== '') ?
    values.{{ field }} : 'unknown';
  {% endfor %}
};

hutmap.{{ model.name }}.prototype.equals = function(other) {
  return 
  {% for field in model.fields %}
  {% if not forloop.last %}
  this.{{ field }} === other.{{ field }} &&
  {% else %}
  this.{{ field }} === other.{{ field }};
  {% endif %}
  {% endfor %}
};
{% endfor %}
