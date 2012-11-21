goog.provide('hutmap.map.Filter');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.ui.TwoThumbSlider');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Component');

goog.require('hutmap.consts');

/**
 * 
 */
hutmap.map.Filter = function(huts, map) {
  this.logger = goog.debug.Logger.getLogger('hutmap.map.Filter');

  // Set up price slider
  var price = goog.dom.getElement('map_filter_price_slider');
  var priceSlider = new goog.ui.TwoThumbSlider;
  priceSlider.setMoveToPointEnabled(true);
  priceSlider.decorate(price);
  priceSlider.setBlockIncrement(1);
  priceSlider.setMinimum(0);
  priceSlider.setMaximum(50);

  var updatePriceSlider = function() {
    var lowPrice = goog.dom.getElementByClass('goog-twothumbslider-value-thumb', price);
    var highPrice = goog.dom.getElementByClass('goog-twothumbslider-extent-thumb', price);  
    lowPrice.innerHTML = '$' + priceSlider.getValue();
    highPrice.innerHTML = '$' + (priceSlider.getValue() + priceSlider.getExtent());
  };
  goog.events.listen(priceSlider, goog.ui.Component.EventType.CHANGE, updatePriceSlider);
  updatePriceSlider();

  // Set up capacity slider
  var capacity = goog.dom.getElement('map_filter_capacity_slider');
  var capacitySlider = new goog.ui.TwoThumbSlider;
  capacitySlider.setMoveToPointEnabled(true);
  capacitySlider.decorate(capacity);
  capacitySlider.setBlockIncrement(1);
  capacitySlider.setMinimum(1);
  capacitySlider.setMaximum(50);

  var updateCapacitySlider = function() {
    var lowCapacity = goog.dom.getElementByClass('goog-twothumbslider-value-thumb', capacity);
    var highCapacity = goog.dom.getElementByClass('goog-twothumbslider-extent-thumb', capacity);  
    lowCapacity.innerHTML = capacitySlider.getValue();
    highCapacity.innerHTML = capacitySlider.getValue() + capacitySlider.getExtent();
  };
  goog.events.listen(capacitySlider, goog.ui.Component.EventType.CHANGE, updateCapacitySlider);
  updateCapacitySlider();

  // Set up priceSlider and capacitySlider listeners
  var self = this;
  var checkboxes = [];
  var filterFn = function() {
    self.filter(self, huts, map, priceSlider, capacitySlider, checkboxes);
  };

  goog.events.listen(priceSlider, goog.ui.Component.EventType.CHANGE, filterFn);
  goog.events.listen(capacitySlider, goog.ui.Component.EventType.CHANGE, filterFn);

  // Set up hut access checkboxes
  var access = goog.dom.getElement('map_filter_hut_access');
  goog.array.forEach(hutmap.consts.g.access, function(elt, index, array) {
    var checkbox = new goog.ui.Checkbox();
    self.logger.info('Index is ' + index);
    checkbox.decorate(goog.dom.getElement('map_filter_hut_access_' + index));
    checkbox.setLabel(checkbox.getElement().parentNode);
    checkbox.setChecked(true);
    checkboxes[index] = checkbox;
    goog.events.listen(checkbox, goog.ui.Component.EventType.CHANGE, filterFn);
  });
};

hutmap.map.Filter.prototype.filter = function(filter, huts, map, priceSlider, capacitySlider, checkboxes) {
  var hutIds = [];

  var priceLo = priceSlider.getValue();
  var priceHi = priceSlider.getValue() + priceSlider.getExtent();
  var capacityLo = capacitySlider.getValue();
  var capacityHi = capacitySlider.getValue() + capacitySlider.getExtent();
  
  goog.array.forEach(huts.getHuts(), function(hut, index, array) {
    // filter price/hut
    var priceMin = filter.isHutInRange(hut, 'fee_person_min', priceLo, priceHi, true);
    var priceMax = filter.isHutInRange(hut, 'fee_person_max', priceLo, priceHi, true);
    // filter capacity
    var capacity = filter.isHutInRange(hut, 'capacity_max', capacityLo, capacityHi, true);
    // filter hut access
    var hutAccess = hut['access'];
    var access = true;
    if (hutAccess != null) {
      access = checkboxes[parseInt(hutAccess)].isChecked();
    }
    
    if ((priceMin || priceMax) && capacity && access) {
      hutIds.push(hut['id']);
    } 
  });
  map.setVisibleHuts(hutIds);
};

/**
 * Inclusive
 */
hutmap.map.Filter.prototype.isHutInRange = function(hut, prop, lo, hi, includeNulls) {
  var value = hut[prop];
  return (value == null && includeNulls) || (value != null && (lo <= value &&
        value <= hi));
};
