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
goog.requier('goog.asserts');
goog.require('goog.array');
goog.require('goog.structs.Map');

{% for model in models %}
hutmap.{{ model.name }} = function(values) {
  if (!values)
    values = {};

  if (goog.DEBUG) {
    this._check_ctor_args(values);
  }

  {% for field in model.fields %}
  this.{{ field }} = (values.{{ field }} == undefined) ? null : values.{{ field }};
  {% for model2 in models %}
  {% ifequal model2.name|lower field|lower %}
  {% ifnotequal model.name|lower field|lower %}
  this.{{ field }} = new hutmap.{{ model2.name }}(this.{{ field }});
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

  if (goog.DEBUG) {
    this._check_rep();
  }
};

hutmap.{{ model.name }}.prototype._check_ctor_args = function(values) {
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
};

hutmap.{{ model.name }}.prototype._check_rep = function() {
  {% if 'id' in model.fields %}
  goog.asserts.assertNumber(this.id);
  goog.asserts.assert(this.id >= 0);
  {% endif %}
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
