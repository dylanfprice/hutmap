goog.require('hutmap.filters');

goog.require('goog.testing.jsunit');

hut = {
  priceHutMin: 6,
  priceHutMax: 12,
};

var testCreatePriceHutFilterRangeMatches = function() {
  var f = hutmap.filters.createPriceHutFilter(6, 12);
  assertTrue(f(hut));
};

var testCreatePriceHutFilterRangeWithin = function() {
  var f = hutmap.filters.createPriceHutFilter(7, 10);
  assertTrue(f(hut));
};

var testCreatePriceHutFilterRangeContains = function() {
  var f = hutmap.filters.createPriceHutFilter(5, 15);
  assertTrue(f(hut));
};

var testCreatePriceHutFilterRangeLowerOverlapping = function() {
  var f = hutmap.filters.createPriceHutFilter(3, 10);
  assertTrue(f(hut));
};

var testCreatePriceHutFilterRangeHigherOverlapping = function() {
  var f = hutmap.filters.createPriceHutFilter(8, 15);
  assertTrue(f(hut));
};

var testCreatePriceHutFilterRangeBelow = function() {
  var f = hutmap.filters.createPriceHutFilter(1, 5);
  assertFalse(f(hut));
};

var testCreatePriceHutFilterRangeAbove = function() {
  var f = hutmap.filters.createPriceHutFilter(13, 15);
  assertFalse(f(hut));
};
