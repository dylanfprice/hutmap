goog.provide('hutmap.map.Sidebar');

goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.string');

goog.require('hutmap.consts');
goog.require('hutmap.consts.g');
goog.require('Wkt.Wkt');
goog.require('Wkt.gmap3');

/**
 * Allows manipulation of data displayed in the sidebar.
 *
 * @param {String} sidebarContentDivId The id of the sidebar content div.
 * @constructor
 */
hutmap.map.Sidebar = function(sidebarContentDivId) {
  this.sidebarDiv = goog.dom.getElement(sidebarContentDivId);
  this.h = hutmap.consts.g.hut;
};

/**
 * Updates the sidebar to display information on the given hut.
 *
 * @param {Object} hut the hut to display information about.
 */
hutmap.map.Sidebar.prototype.setHut = function(hut) {
  var elt = null;
  var textContent = '';
  // Set the title
  var name = goog.object.get(hut, 'name', 'Unknown hut');
  var hutUrl = goog.object.get(hut, this.h.hut_url, '');
  textContent = '<a href="' + hutUrl + '" target="blank">' + name + '</a>';
  elt = goog.dom.getElement('sidebar_title');
  elt.innerHTML = textContent;
  // Set the image
  var photoUrl = goog.object.get(hut, this.h.photo_url);
  if (photoUrl === '' || photoUrl == null)
    photoUrl = '/static/img/no-image-found.jpeg';
  textContent = '<a href="' + hutUrl + '" target="blank"><img src="' + photoUrl + '" alt="No photo"></img></a>';
  elt = goog.dom.getElement('sidebar_img');
  elt.innerHTML = textContent;
  // Set the fee per person
  textContent = this.getFeeRange(hut, this.h.fee_person_min,
      this.h.fee_person_max);
  elt = goog.dom.getElement('sidebar_fee_person');
  goog.dom.setTextContent(elt, textContent);
  // Set the fee per hut
  textContent = this.getFeeRange(hut, this.h.fee_hut_min, this.h.fee_hut_max);
  elt = goog.dom.getElement('sidebar_fee_hut');
  goog.dom.setTextContent(elt, textContent);
  // Set the hut capacity
  textContent = this.getCapacityRange(hut);
  elt = goog.dom.getElement('sidebar_capacity_hut');
  goog.dom.setTextContent(elt, textContent);
  // Set the total capacity
  textContent = goog.object.get(hut, this.h.capacity_max, 'Unknown');
  elt = goog.dom.getElement('sidebar_total_capacity');
  goog.dom.setTextContent(elt, textContent);
  // Set the number of structures
  textContent = goog.object.get(hut, this.h.num_structures, 'Unknown');
  elt = goog.dom.getElement('sidebar_structures');
  goog.dom.setTextContent(elt, textContent);
  // Set whether reservations are accepted
  textContent = this.getBooleanAsYesNo(hut, this.h.reservations);
  elt = goog.dom.getElement('sidebar_reservations');
  goog.dom.setTextContent(elt, textContent);
  // Set the region
  var region = goog.object.get(hut, this.h.region, null);
  if (region == null) {
    textContent = 'Unknown';
  } else {
    textContent = region['region'];
  }
  elt = goog.dom.getElement('sidebar_region');
  goog.dom.setTextContent(elt, textContent);
  // Set the location
  var location = goog.object.get(hut, this.h.location, null);
  if (location == null) {
    textContent = 'Unknown';
  } else {
    var point = this.getWktPointAsLatLon(location);
    textContent = point.lat().toFixed(2) + ', ' + point.lng().toFixed(2);
  }
  elt = goog.dom.getElement('sidebar_location');
  goog.dom.setTextContent(elt, textContent);
  // Set the accuracy
  var locationAccuracy = goog.object.get(hut, this.h.location_accuracy, null);
  if (locationAccuracy == null) {
    textContent = 'Unknown';
  } else {
    // TODO: convert to text or visual
    textContent = locationAccuracy + '/' + hutmap.consts.g.maxAccuracy;
  }
  elt = goog.dom.getElement('sidebar_accuracy');
  goog.dom.setTextContent(elt, textContent);
  // Set the altitude
  var altitude = goog.object.get(hut, this.h.altitude, null);
  if (altitude == null) {
    textContent = 'Unknown';
  } else {
    textContent = altitude + 'm';
  }
  elt = goog.dom.getElement('sidebar_altitude');
  goog.dom.setTextContent(elt, textContent);
  // Set the access
  var access = goog.object.get(hut, this.h.access, null);
  if (access == null) {
    textContent = 'Unknown';
  } else {
    var accessString = hutmap.consts.g.access[parseInt(access)];
    textContent = goog.string.toTitleCase(accessString);
  }
  elt = goog.dom.getElement('sidebar_access');
  goog.dom.setTextContent(elt, textContent);
  var type = goog.object.get(hut, 'type', null);
  if (type == null) {
    textContent = 'Unknown';
  } else {
    textContent = type['name'];
  }
  elt = goog.dom.getElement('sidebar_type');
  goog.dom.setTextContent(elt, textContent);
  // Set the agency
  var agency = goog.object.get(hut, this.h.agency, null);
  if (agency == null) {
    textContent = 'Unknown';
  } else {
    textContent = '<a href="' + agency['url'] + '" target="blank">' +
      goog.string.truncate(agency['name'], 20) + '</a>';
  }
  elt = goog.dom.getElement('sidebar_agency');
  elt.innerHTML = textContent;
  // Set the url
  var url = goog.object.get(hut, this.h.hut_url, null);
  if (url == null) {
    textContent = 'Unknown';
  } else {
    textContent = '<a href="' + url + '" target="blank">' +
      goog.string.truncate(url, 20) + '</a>';
  }
  elt = goog.dom.getElement('sidebar_hut_url');
  elt.innerHTML = textContent;

  // Unhide the html
  var span = goog.dom.getElementsByTagNameAndClass('span', 'hidden', this.sidebarDiv)[0];
  span.style.display = 'block';
};

/**
 * @private
 */
hutmap.map.Sidebar.prototype.getFeeRange = function(hut, feeMinProp, feeMaxProp) {
  var feeMin = hut[feeMinProp];
  var feeMax = hut[feeMaxProp];

  var textContent = '$' + feeMin + '-' + '$' + feeMax;
  if (feeMin == null || feeMax == null) {
    if (feeMin == null && feeMax == null)
      textContent = 'N/A';
    else if (feeMin == null)
      textContent = '$' + feeMax;
    else
      textContent = '$' + feeMin;
  } else if (feeMin === feeMax) {
    textContent = '$' + feeMin;
  }
  return textContent;
};

/**
 * @private
 */
hutmap.map.Sidebar.prototype.getCapacityRange = function(hut) {
  var capMin = hut[this.h.capacity_hut_min];
  var capMax = hut[this.h.capacity_hut_max];

  var textContent = capMin + '-' + capMax;
  if (capMin == null || capMax == null) {
    if (capMin == null && capMax == null)
      textContent = 'Unknown';
    else if (capMin == null)
      textContent = capMax;
    else
      textContent = capMin;
  } else if (capMin == capMax) {
    textContent = capMin;
  }
  return textContent;
};

/**
 * @private
 */
hutmap.map.Sidebar.prototype.getBooleanAsYesNo = function(bool) {
  if (bool)
    return 'yes';
  else
    return 'no';
};

/**
 * @private
 */
hutmap.map.Sidebar.prototype.getWktPointAsLatLon = function(wkt_point) {
  var point = new Wkt.Wkt(wkt_point);
  return point.toObject().getPosition();
};

