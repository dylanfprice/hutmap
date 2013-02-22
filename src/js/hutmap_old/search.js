goog.provide('hutmap.Search');

goog.require('goog.debug.Logger');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.forms');
goog.require('goog.ui.Css3ButtonRenderer');
goog.require('goog.ui.CustomButton');
goog.require('goog.Uri.QueryData');
goog.require('goog.string');
goog.require('goog.structs');

goog.require('hutmap.consts');

/**
 * Handles setting up the google maps autocomplete search box.
 *
 * @param {String} formId
 * @param {String} searchBoxId The id of the input element to add autocomplete
 *  behavior to.
 * @param {String} searchButtonId
 * @param {String searchButtonText
 * @param {Function} searchButtonClicked
 * @constructor
 */
hutmap.Search = function(formId, searchBoxId, searchButtonId, searchButtonText, searchButtonClicked) {
  this.domHelper = new goog.dom.DomHelper(document);
  this.searchBoxId = searchBoxId;
  this.autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(searchBoxId), 
        {});
  this.geocoder = new google.maps.Geocoder();
  this.formId = formId;
  this.searchButtonClicked = searchButtonClicked;
  this.logger = goog.debug.Logger.getLogger('hutmap.Search');

  var buttonElt = goog.dom.getElement(searchButtonId);
  var button = new goog.ui.CustomButton(searchButtonText,
      goog.ui.Css3ButtonRenderer.getInstance());
  button.render(buttonElt); 
  goog.events.listen(button, goog.ui.Component.EventType.ACTION,
      goog.bind(this.onSearch, this));
};

hutmap.Search.prototype.onSearch = function() {
  var form = goog.dom.getElement(this.formId);
  var data = goog.dom.forms.getFormDataMap(form);
  var queryData = goog.Uri.QueryData.createFromMap(data);

  // remove form search keys
  for (var key in hutmap.consts.sk) {
    if (hutmap.consts.sk.hasOwnProperty(key)) {
      queryData.remove(key);
    }
  }

  // remove empty values
  queryData = goog.Uri.QueryData.createFromMap(
    goog.structs.filter(queryData,
    function(value, key, collection) {
      return !goog.string.isEmptySafe(value);
    }));

  this.logger.info(queryData.toString());
  
  this.getPlaceGeometry(goog.bind(function(placeGeometry) {
    if (placeGeometry !== null) {
      var distance = parseFloat(data.get(hutmap.consts.sk.distance));
      var sw = google.maps.geometry.spherical.computeOffset(
        placeGeometry.location, distance, 45,
        hutmap.consts.EARTH_MEAN_RADIUS_MILES)
      var ne = google.maps.geometry.spherical.computeOffset(
        placeGeometry.location, distance, 225,
        hutmap.consts.EARTH_MEAN_RADIUS_MILES)
      queryData.set(hutmap.consts.hk.bbox, [sw.toUrlValue(),
        ne.toUrlValue()].join(','));
      queryData.set(hutmap.consts.hk.map_location,
        placeGeometry.location.toUrlValue());
    } 
    this.searchButtonClicked(queryData);
  }, this));
}

/**
 * @private
 */
hutmap.Search.prototype.getPlaceGeometry = function(callback) {
  var placeResult = this.autocomplete.getPlace();
  if (placeResult !== undefined && placeResult !== null 
      && placeResult.name !== undefined) {
    if (placeResult.geometry !== undefined) {
      callback(placeResult.geometry);
    } else {
      this.geocodeLookup(placeResult.name, callback);
    } 
  } else {
    this.logger.info("PlaceResult was empty.");
    element = this.domHelper.getElement(this.searchBoxId);
    this.logger.info(element.innerText);
    this.logger.info(element.textContent);
    place = this.domHelper.getTextContent(element);
    if (!goog.string.isEmptySafe(place)) {
      this.geocodeLookup(place, callback);
    } else {
      this.logger.info("Search box was empty.");
      callback(null);
    }
  }
};

/**
 * @private
 */
hutmap.Search.prototype.geocodeLookup = function(place, callback) {
  var req = {address: place};
  this.geocoder.geocode(req, goog.bind(
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          callback(results[0].geometry);
        } else {
          this.logger.info("Geocode was not successful for the following reason: " + status)
          callback(null);
        }
      }, this));
};
  

