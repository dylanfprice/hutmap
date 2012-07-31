goog.provide('hutmap.map');

goog.require('hutmap.map.Map');
goog.require('hutmap.map.Search');

hutmap.map.initialize = function() {
  var map = new hutmap.map.Map('map_canvas');
  var search = new hutmap.map.Search('map_search', goog.bind(map.placeChanged, map));  
}

hutmap.map.loadScript = function() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&' +
      'libraries=places&' +
      'callback=initialize';
  document.body.appendChild(script);
}

