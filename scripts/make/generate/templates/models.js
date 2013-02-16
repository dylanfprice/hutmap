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
  if (this.{{ field }} !== undefined &&
      this.{{ field }} !== null &&
      this.{{ field }} !== '') {
    this.{{ field }}_display =  values.{{ field }};
  } else {
    this.{{ field }}_display = 'unknown';
  }
  {% endfor %}
};

hutmap.{{ model.name }}.prototype.equals = function(other) {
  {% for field in model.fields %}
  {% if forloop.first %}
  return this.{{ field }} === other.{{ field }} && 
  {% endif %}
  {% if not forloop.first and not forloop.last %}
    this.{{ field }} === other.{{ field }} && 
  {% endif %}
  {% if forloop.last %}
    this.{{ field }} === other.{{ field }};
  {% endif %}
  {% endfor %}
};
{% endfor %}
