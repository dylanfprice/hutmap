goog.require('hutmap.filters');

goog.require('goog.testing.jsunit');

hut = {
  price_hut_min: 6,
  price_hut_max: 12,
};

/** create_price_hut_filter **/

var test_create_price_hut_filter_range_matches = function() {
  var f = hutmap.filters.create_price_hut_filter(6, 12);
  assertTrue(f(hut));
};

var test_create_price_hut_filter_range_within = function() {
  var f = hutmap.filters.create_price_hut_filter(7, 10);
  assertTrue(f(hut));
};

var test_create_price_hut_filter_range_contains = function() {
  var f = hutmap.filters.create_price_hut_filter(5, 15);
  assertTrue(f(hut));
};

var test_create_price_hut_filter_range_lower_overlapping = function() {
  var f = hutmap.filters.create_price_hut_filter(3, 10);
  assertTrue(f(hut));
};

var test_create_price_hut_filter_range_higher_overlapping = function() {
  var f = hutmap.filters.create_price_hut_filter(8, 15);
  assertTrue(f(hut));
};

var test_create_price_hut_filter_range_below = function() {
  var f = hutmap.filters.create_price_hut_filter(1, 5);
  assertFalse(f(hut));
};

var test_create_price_hut_filter_range_above = function() {
  var f = hutmap.filters.create_price_hut_filter(13, 15);
  assertFalse(f(hut));
};
