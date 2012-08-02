goog.provide('hutmap.map');

goog.require('hutmap.History');
goog.require('hutmap.Huts');
goog.require('hutmap.map.Map');
goog.require('hutmap.Search');
goog.require('goog.array');
goog.require('goog.debug.Logger');
goog.require('goog.dom.query');

hutmap.map.init = function() {
  var logger = goog.debug.Logger.getLogger('hutmap.map');
  var huts = new hutmap.Huts();
  var map = new hutmap.map.Map('map_canvas', huts);
  var search = new hutmap.Search('hut_search_form', 'hut_search_box',
    'small_search_button', 'Go >', hutmap.map.searchButtonClicked);

  goog.events.listen(huts, hutmap.Huts.EventType.HUTS_CHANGED,
      goog.bind(hutmap.map.updateSummary, null, logger, huts));
}

hutmap.map.searchButtonClicked = function(queryData) {
  hutmap.History.getInstance().setHashData(queryData, true);
}

hutmap.map.updateSummary = function(logger, huts) {
  var p = goog.dom.query('#summary_info p')[0];
  p.innerHTML = 'Showing ' + huts.getCount() + ' Huts';
}

hutmap.map.fromBbox = function(bbox) {
  var values = goog.array.map(bbox.split(','),
      function(value, index, array) {
        return parseFloat(value);
      });
  var sw = new google.maps.LatLng(values[0], values[1]);
  var ne = new google.maps.LatLng(values[2], values[3]);
  var bounds = new google.maps.LatLngBounds(sw, ne);
  return bounds;
};

hutmap.map.loadScript = function() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&' +
      'libraries=places&' +
      'callback=initialize';
  document.body.appendChild(script);
}
