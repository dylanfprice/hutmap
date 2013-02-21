goog.require('hutmap.Agency');
goog.require('hutmap.BooleanFilter');
goog.require('hutmap.CompareFilter');
goog.require('hutmap.CompareType');
goog.require('hutmap.FilterType');
goog.require('hutmap.FilteredHuts');
goog.require('hutmap.Hut');
goog.require('hutmap.RangeFilter');
goog.require('hutmap.Region');
goog.require('hutmap.SetFilter');
goog.require('hutmap.test_data');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.structs.Map');
goog.require('goog.testing.jsunit');

var setUp = function() {
  this.td = hutmap.test_data;
  this.huts = [
    this.td.hut0(),
    this.td.hut1(),
    this.td.hut2()
  ];
  this.filters = {
    'id': new hutmap.CompareFilter(hutmap.CompareType.LESS_THAN_OR_EQUAL, 1),
    'region.country': new hutmap.SetFilter(['USA'])
  };
  this.fh = new hutmap.FilteredHuts(this.huts, this.filters);
};

var expect_error = function(func, msg) {
  var error = assertThrows(func);
  assertEquals(msg, error.message);
};

var test_constructor_empty_lists = function() {
  assertNotThrows(function() {
    new hutmap.FilteredHuts([], []);
  });
};

var test_constructor = function() {
  assertNotThrows(function() {
    new hutmap.FilteredHuts(this.huts, this.filters);
  });
};

var test_constructor_null = function() {
  expect_error(function() {
    new hutmap.FilteredHuts(null, null);
  }, 
  'Assertion failed: Expected array but got null: null.');
};

var test_get_filtered_huts = function() {
  var filtered_huts = this.fh.get_filtered_huts();
  assertTrue(this.td.hut0().equals(filtered_huts[0]));
};

var test_get_filtered_huts_count = function() {
  assertEquals(1, this.fh.get_filtered_huts_count());
};

var test_get_filtered_huts_updates = function() {
  this.fh.get_filtered_huts(); // to trigger computing of filtered huts
  this.fh.set_filter('id', new hutmap.SetFilter([1, 2]));
  var filtered_huts = this.fh.get_filtered_huts();
  assertTrue(this.td.hut2().equals(filtered_huts[0]));
};

var test_get_hut_null = function() {
  expect_error(function() {
    this.fh.get_hut(null);
  }, 
  'Assertion failed: Expected number but got null: null.');
};

var test_get_hut = function() {
  var expected = this.td.hut0();
  var actual = this.fh.get_hut(0);
  assertTrue(expected.equals(actual));
};

var test_get_hut_not_there = function() {
  var hut = this.fh.get_hut(999);
  assertEquals(null, hut);
};

var test_contains_hut_null = function() {
  expect_error(function() {
    this.fh.contains_hut(null);
  }, 
  'Assertion failed: Expected number but got null: null.');
};

var test_contains_hut = function() {
  assertTrue(this.fh.contains_hut(1));
};

var test_get_huts = function() {
  var huts = this.fh.get_huts();
  goog.array.sortObjectsByKey(huts, 'id');
  var hut0 = huts[0];
  var hut1 = huts[1];
  var hut2 = huts[2];
  assertTrue(this.td.hut0().equals(hut0));
  assertTrue(this.td.hut1().equals(hut1));
  assertTrue(this.td.hut2().equals(hut2));
};

var test_get_huts_count = function() {
  assertEquals(3, this.fh.get_huts_count());
};

var test_add_hut_null = function() {
  expect_error(function() {
    this.fh.add_hut(null);
  }, 
  'Assertion failed: instanceof check failed.');
};

var test_add_hut = function() {
  this.fh.add_hut(this.td.hut3());
  assertTrue(this.fh.contains_hut(3));
};

var test_add_hut_replace = function() {
  var new_hut = this.td.hut1();
  new_hut.name = 'test_name';
  this.fh.add_hut(new_hut);
  var hut = this.fh.get_hut(1);
  assertEquals('test_name', hut.name);
};

var test_set_huts_null = function() {
  expect_error(function() {
    this.fh.set_huts(null);
  }, 
  'Assertion failed: Expected array but got null: null.');
};

var test_set_huts = function() {
  var new_huts = [this.td.hut1(), this.td.hut2()];
  this.fh.set_huts(new_huts);
  assertEquals(2, this.fh.get_huts_count());
  assertEquals(0, this.fh.get_filtered_huts_count()); 
};

var test_get_filters = function() {
  var filters = this.fh.get_filters();
  assertEquals(hutmap.FilterType.COMPARE, filters['id'].get_type());
  assertEquals(hutmap.FilterType.SET, filters['region.country'].get_type());
};

var test_set_filter_null = function() {
  expect_error(function() {
    this.fh.set_filter(null, null);
  }, 
  'Assertion failed: Expected string but got null: null.');
};

var test_set_filter = function() {
  this.fh.set_filter('region.state', new hutmap.CompareFilter(hutmap.CompareType.EQUAL, 'BC Mountaineering Club'));
  var filters = this.fh.get_filters();
  assertEquals(hutmap.FilterType.COMPARE, filters['region.state'].get_type());
};

var test_set_filter_replace = function() {
  this.fh.set_filter('id', new hutmap.SetFilter([0, 1]));
  var filters = this.fh.get_filters();
  assertEquals(hutmap.FilterType.SET, filters['id'].get_type());
};

var test_clear_filters = function() {
  this.fh.clear_filters();
  var filters = new goog.structs.Map(this.fh.get_filters());
  assertTrue(filters.isEmpty());
};

var test_huts_changed_event = function() {
  var callback_call_count = 0;
  goog.events.listen(this.fh, hutmap.FilteredHuts.EventType.HUTS_CHANGED, function() {
    callback_call_count++;
  });    
  this.fh.add_hut(this.td.hut3());
  this.fh.set_huts([]);
  assertEquals(2, callback_call_count);
};

var test_filters_changed_event = function() {
  var callback_call_count = 0;
  goog.events.listen(this.fh, hutmap.FilteredHuts.EventType.FILTERS_CHANGED, function() {
    callback_call_count++;
  });    
  this.fh.set_filter('id', new hutmap.SetFilter([0, 1]));
  this.fh.clear_filters();
  assertEquals(2, callback_call_count);
};

