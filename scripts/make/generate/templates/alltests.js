{% comment %}

This is the template which generates src/js-test/alltests.js
Context:
{ 
  'tests': [
    'path/to/test1.html',
    'e.g.hutmap/templates_test.html',
    ...
  ]
}

The paths are relative to src/js-test/

{% endcomment %}

// This file generated from the template at scripts/make/generate/templates/alltests.js
// Please do not edit by hand.

_allTests = [
  {% for test in tests %}
  "{{ test }}",
  {% endfor %}
];

