goog.provide('hutmap.map.Search');

/**
 * Handles setting up the google maps autocomplete search box.
 *
 * @param {String} searchBoxId The id of the input element to add autocomplete
 *  behavior to.
 * @param {Function} callback Called when a place is found. The function must
 *  take one argument which will be equivalent to a PlaceGeometry object
 *  (https://developers.google.com/maps/documentation/javascript/reference#PlaceGeometry).
 * @constructor
 */
hutmap.map.Search = function(searchBoxId, callback) {
  this.autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(searchBoxId), 
        {});
  this.geocoder = new google.maps.Geocoder();
  this.callback = callback;

  google.maps.event.addListener(
      this.autocomplete, 
      'place_changed', 
      goog.bind(this.placeChanged, this)
  );

};

/**
 * Callback for the place_changed event of a google.maps.places.Autocomplete
 * object.
 *
 * @private
 */
hutmap.map.Search.prototype.placeChanged = function() {
  var placeResult = this.autocomplete.getPlace();
  if (placeResult != null && placeResult.name !== undefined) {
    if (placeResult.geometry !== undefined) {
      this.callback(placeResult.geometry);
    } else {
      var req = {address: placeResult.name};
      this.geocoder.geocode(req, goog.bind(
          function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              this.callback(results[0].geometry);
            } else {
              log("Geocode was not successful for the following reason: " + status)
            }
          }, this));
    } 
  }
};

