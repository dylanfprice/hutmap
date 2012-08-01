goog.provide('hutmap.map');

goog.require('goog.debug.Logger');

goog.require('hutmap.Huts');
goog.require('hutmap.History');
goog.require('hutmap.map.Map');
goog.require('hutmap.map.Search');

hutmap.map.initialize = function() {
  goog.debug.Logger.getLogger('hutmap.History').setLevel(goog.debug.Logger.Level.FINEST);

  var queryData = goog.Uri.QueryData.createFromMap({
    bbox: '47.05814,-122.79683,49.05814,-120.79683'
  });

  var map = new hutmap.map.Map('map_canvas');
  var search = new hutmap.map.Search('map_search', goog.bind(map.placeChanged, map));  
  var huts = new hutmap.Huts();
  goog.events.listen(huts, hutmap.Huts.EventType.HUTS_CHANGED, function() { 
    map.clearHuts();
    map.addHuts(huts.getHuts());
  });

  //hutmap.History.getInstance().setHashData(queryData, true);
}

hutmap.map.loadScript = function() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&' +
      'libraries=places&' +
      'callback=initialize';
  document.body.appendChild(script);
}

