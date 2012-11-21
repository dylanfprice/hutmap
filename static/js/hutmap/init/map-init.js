goog.provide('hutmap.map');

goog.require('hutmap.History');
goog.require('hutmap.Huts');
goog.require('hutmap.Search');
goog.require('hutmap.consts');
goog.require('hutmap.map.Map');

goog.require('goog.array');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.ui.Zippy');
goog.require('goog.ui.TwoThumbSlider');

hutmap.map.init = function() {
  var console = new goog.debug.Console();
  console.setCapturing(true);

  var logger = goog.debug.Logger.getLogger('hutmap.map');
  var huts = new hutmap.Huts();

  if (window.google && window.google.maps) {
    var map = new hutmap.map.Map(hutmap.consts.mapIds, huts);
  } else {
    mapDiv = goog.dom.getElement(hutmap.consts.mapIds.mapDivId);
    goog.dom.setTextContent(mapDiv, "Ooops! Could not load Google Maps.");
    logger.info("google.maps is not defined");
  } 

  goog.events.listen(huts, hutmap.Huts.EventType.HUTS_CHANGED,
      goog.bind(hutmap.map.updateSummary, null, logger, huts));

  // set map to be at Seattle (static location query)
  var history = hutmap.History.getInstance();
  var queryData = new goog.Uri.QueryData();
  queryData.set(hutmap.consts.hk.bbox, '47,-125,50,-120');
  history.setHashData(queryData, true);
}

hutmap.map.updateSummary = function(logger, huts) {
  /**
  var p = goog.dom.query('#summary_info p')[0];
  p.innerHTML = 'Showing ' + huts.getCount() + ' Huts';
  **/
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

