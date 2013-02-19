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
goog.require('goog.structs.Map');
goog.require('goog.array');

{% for model in models %}
hutmap.{{ model.name }} = function(values) {
  if (!values)
    values = {};

  if (goog.DEBUG) {
    var map = new goog.structs.Map(values);
    keys = map.getKeys();
    fields = [
      {# put all methods added to the models here #}
      'equals',
      {% for field in model.fields %}
      '{{ field }}',
      {% if not forloop.last %}
      '{{ field }}_display',
      {% else %}
      '{{ field }}_display'
      {% endif %}
      {% endfor %}
    ];
    goog.array.forEach(keys, function(key, index, array) {
      if (!goog.array.contains(fields, key)) {
        throw "hutmap.{{ model.name }}(): Invalid field '" + key + "' given in values parameter.";
      }
    });
  }

  {% for field in model.fields %}
  this.{{ field }} = values.{{ field }};
  {% for model2 in models %}
  {% ifequal model2.name|lower field|lower %}
  {% ifnotequal model.name|lower field|lower %}
  this.{{ field }} = new hutmap.{{ model2.name }}(values.{{ field }});
  {% endifnotequal %}
  {% endifequal %}
  {% endfor %}
  {% endfor %}

  {% for field in model.fields %}
  if (this.{{ field }} !== undefined &&
      this.{{ field }} !== null &&
      this.{{ field }} !== '') {
    this.{{ field }}_display =  this.{{ field }};
  } else {
    this.{{ field }}_display = 'unknown';
    {% for model2 in models %}
    {% ifequal model2.name|lower field|lower %}
    {% ifnotequal model.name|lower field|lower %}
    this.{{ field }}_display = new hutmap.{{ model2.name }}();
    {% endifnotequal %}
    {% endifequal %}
    {% endfor %}
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
