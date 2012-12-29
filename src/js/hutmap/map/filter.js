goog.provide('hutmap.map.Filter');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.ui.TwoThumbSlider');
goog.require('goog.ui.Slider');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Component');

goog.require('hutmap.consts');
goog.require('hutmap.consts.g');

/**
 * Sets up the filtering widgets in the filter box on the map. The
 * hutmap.map.Filter.filter function can be called from code to force
 * refreshing of the filters.
 *
 * @param {hutmap.Huts} huts 
 * @param {hutmap.map.Map} map
 * @constructor
 */
hutmap.map.Filter = function(huts, map) {
  this.logger = goog.debug.Logger.getLogger('hutmap.map.Filter');
  this.h = hutmap.consts.g.hut;
  this.huts = huts;
  this.map = map;
  this.hutCountElt = goog.dom.getElement(hutmap.consts.mapIds.hutCountSpanId);
  this.personSlider = new goog.ui.TwoThumbSlider();
  this.hutSlider = new goog.ui.TwoThumbSlider();
  this.capacitySlider = new goog.ui.Slider();
  this.accessCheckboxes = [];

  // Set up fee per person slider
  var personSliderElt = goog.dom.getElement(hutmap.consts.mapIds.feePersonSliderId);
  this.personSlider.setMoveToPointEnabled(true);
  this.personSlider.decorate(personSliderElt);
  this.personSlider.setBlockIncrement(1);
  this.personSlider.setMinimum(0);
  this.personSlider.setMaximum(50);

  // Set up fee per hut slider
  var hutSliderElt = goog.dom.getElement(hutmap.consts.mapIds.feeHutSliderId);
  this.hutSlider.setMoveToPointEnabled(true);
  this.hutSlider.decorate(hutSliderElt);
  this.hutSlider.setBlockIncrement(1);
  this.hutSlider.setMinimum(0);
  this.hutSlider.setMaximum(80);

  // Set up capacity slider
  var capacitySliderElt = goog.dom.getElement(hutmap.consts.mapIds.capacitySliderId);
  this.capacitySlider.setMoveToPointEnabled(true);
  this.capacitySlider.decorate(capacitySliderElt);
  this.capacitySlider.setBlockIncrement(1);
  this.capacitySlider.setMinimum(1);
  this.capacitySlider.setMaximum(40);

  // Make slider labels update when thumbs are moved
  var updatePersonSlider = this.createUpdateFeeSliderFn(this.personSlider, personSliderElt);  
  var updateHutSlider = this.createUpdateFeeSliderFn(this.hutSlider, hutSliderElt);  
  var updateCapacitySlider = this.createUpdateSingleSliderFn(this.capacitySlider, capacitySliderElt);
  goog.events.listen(this.personSlider, goog.ui.Component.EventType.CHANGE, updatePersonSlider);
  goog.events.listen(this.hutSlider, goog.ui.Component.EventType.CHANGE, updateHutSlider);
  goog.events.listen(this.capacitySlider, goog.ui.Component.EventType.CHANGE, updateCapacitySlider);
  updatePersonSlider();
  updateHutSlider();
  updateCapacitySlider();

  // Set up hut access checkboxes
  var access = goog.dom.getElement('map_filter_hut_access');
  goog.array.forEach(hutmap.consts.g.access, function(elt, index, array) {
    var checkbox = new goog.ui.Checkbox();
    checkbox.decorate(goog.dom.getElement('map_filter_hut_access_' + index));
    checkbox.setLabel(checkbox.getElement().parentNode);
    checkbox.setChecked(true);
    this.accessCheckboxes[index] = checkbox;
  }, this);
 
  // Make filter fn called on changes
  goog.events.listen(this.personSlider, goog.ui.Component.EventType.CHANGE,
      goog.bind(this.filter, this));
  goog.events.listen(this.hutSlider, goog.ui.Component.EventType.CHANGE,
      goog.bind(this.filter, this));
  goog.events.listen(this.capacitySlider, goog.ui.Component.EventType.CHANGE,
      goog.bind(this.filter, this));
  goog.array.forEach(this.accessCheckboxes, function(checkbox, index, array) {
    goog.events.listen(checkbox, goog.ui.Component.EventType.CHANGE,
      goog.bind(this.filter, this));
  }, this);

  // attach listener to when new huts are loaded
  goog.events.listen(this.huts, hutmap.Huts.EventType.HUTS_CHANGED,
      goog.bind(this.filter, this));
};

/**
 * Filter the visible huts on the map according to the current values of the
 * filtering widgets in the filter box.
 */
hutmap.map.Filter.prototype.filter = function() {
  var hutIds = [];

  var personLo = this.personSlider.getValue();
  var personHi = this.personSlider.getValue() + this.personSlider.getExtent();
  var hutLo = this.hutSlider.getValue();
  var hutHi = this.hutSlider.getValue() + this.hutSlider.getExtent();
  var capacityValue = this.capacitySlider.getValue();
  
  goog.array.forEach(this.huts.getHuts(), function(hut, index, array) {
    // filter fee/person
    var isPersonMin = this.isHutInRange(hut, this.h.fee_person_min,
      personLo, personHi, true);
    var isPersonMax = this.isHutInRange(hut, this.h.fee_person_max,
      personLo, personHi, true);
    // filter fee/hut
    var isHutMin = this.isHutInRange(hut, this.h.fee_hut_min,
      hutLo, hutHi, true);
    var isHutMax = this.isHutInRange(hut, this.h.fee_hut_max,
      hutLo, hutHi, true);
    // filter capacity
    var isCapacity = hut[this.h.capacity_max] >= capacityValue;
    // filter hut access
    var hutAccess = hut[this.h.access];
    var access = true;
    if (hutAccess != null) {
      access = this.accessCheckboxes[parseInt(hutAccess)].isChecked();
    }
    
    if ((isPersonMin || isPersonMax) && (isHutMin || isHutMax) && isCapacity &&
      access) {
      hutIds.push(hut[this.h.id]);
    }
  }, this);
  this.map.setVisibleHuts(hutIds);
  this.hutCountElt.innerHTML = hutIds.length;
};

/**
 * Checks if the value of hut[prop] is between lo (inclusive) and hi
 * (inclusive).
 *
 * @param {Object} hut The hut to check
 * @param {String} prop The name of a numeric property on the hut
 * @param {Number} lo
 * @param {Number} hi
 * @param {boolean} includeNulls True if a null value for hut[prop] should be
 *    considered 'within' the given range.
 * @return {boolean} true if the value of hut[prop] is within the given range
 *
 * @private
 */
hutmap.map.Filter.prototype.isHutInRange = function(hut, prop, lo, hi, includeNulls) {
  var value = hut[prop];
  return (value == null && includeNulls) || (value != null && (lo <= value &&
        value <= hi));
};

/**
 * Returns a function which will update the thumbs of a goog.ui.TwoThumbSlider
 * with the values they are currently at on the slider.
 *
 * @param {goog.ui.TwoThumbSlider} feeSlider
 * @param {Element} feeSliderElt
 * @return {Function}
 * 
 * @private
 */
hutmap.map.Filter.prototype.createUpdateFeeSliderFn = function(feeSlider, feeSliderElt) {
  var updateFeeSlider = function() {
    var lowFeeElt = goog.dom.getElementByClass(hutmap.consts.googCss.twoThumbSliderValueThumb, feeSliderElt);
    var highFeeElt = goog.dom.getElementByClass(hutmap.consts.googCss.twoThumbSliderExtentThumb, feeSliderElt);  
    lowFeeElt.innerHTML = '$' + feeSlider.getValue();
    highFeeElt.innerHTML = '$' + (feeSlider.getValue() + feeSlider.getExtent());
  };
  return updateFeeSlider;
};

/**
 *
 */
hutmap.map.Filter.prototype.createUpdateSingleSliderFn = function(slider, sliderElt) {
  var updateSlider = function() {
    var valueElt = goog.dom.getElementByClass(hutmap.consts.googCss.sliderThumb, sliderElt);
    valueElt.innerHTML = slider.getValue();
  };
  return updateSlider;
};

