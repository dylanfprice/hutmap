goog.require('hutmap.RangeFilter');
goog.require('hutmap.CompareFilter');
goog.require('hutmap.BooleanFilter');
goog.require('hutmap.SetFilter');
goog.require('hutmap.FilterType');
goog.require('hutmap.CompareType');

goog.require('goog.testing.jsunit');

var setUp = function() {
  // range filters
  this.filter_0_to_0 = new hutmap.RangeFilter(0, 0);
  this.filter_1_to_10 = new hutmap.RangeFilter(1, 10);
  this.filter_10_to_1 = new hutmap.RangeFilter(10, 1);
  this.filter_n1_to_n10 = new hutmap.RangeFilter(-1, -10);
  this.filter_n1_to_10 = new hutmap.RangeFilter(-1, 10);
  this.filter_min_to_max = new hutmap.RangeFilter(Number.MIN_VALUE, Number.MAX_VALUE);
  // compare filters
  this.filter_lt_5 = new hutmap.CompareFilter(hutmap.CompareType.LESS_THAN, 5);
  this.filter_lte_n1 = new hutmap.CompareFilter(hutmap.CompareType.LESS_THAN_OR_EQUAL, -1);
  this.filter_eq_0 = new hutmap.CompareFilter(hutmap.CompareType.EQUAL, 0);
  this.filter_gte_max = new hutmap.CompareFilter(hutmap.CompareType.GREATER_THAN_OR_EQUAL, Number.MAX_VALUE);
  this.filter_gt_5 = new hutmap.CompareFilter(hutmap.CompareType.GREATER_THAN, 5);
  // boolean filters
  this.filter_bool = new hutmap.BooleanFilter();
  // set filters
  this.filter_empty_set = new hutmap.SetFilter([]);
  this.filter_in_n3_n1_1_3 = new hutmap.SetFilter([-3, -1, 1, 3]);
  this.filter_in_3pt25 = new hutmap.SetFilter([3.25]);
  this.filter_in_cat_dog_mouse = new hutmap.SetFilter(['cat', 'dog', 'mouse']);
};

/** RangeFilter **/

var test_range_filter_ctor = function() {
  assertNotThrows(function() {
    new hutmap.RangeFilter(0, 0);
  });
};

var test_range_filter_ctor_null = function() {
  var err = assertThrows(function() {
    new hutmap.RangeFilter(null, 0);
  });
  assertEquals('Assertion failed: Expected number but got null: null.',
    err.message);
};

var test_range_filter_null = function() {
  var error = assertThrows(function() {
    this.filter_0_to_0.filter(null);
  });
  assertEquals('Assertion failed: Expected number but got null: null.',
      error.message);
};

var test_range_filter_type = function() {
  assertEquals(this.filter_0_to_0.get_type(), hutmap.FilterType.RANGE);
};

var test_range_filter_inclusivity = function() {
  assertTrue(this.filter_0_to_0.filter(0));
  assertTrue(this.filter_1_to_10.filter(1));
  assertTrue(this.filter_1_to_10.filter(10));
};

var test_range_filter_non_integers = function() {
  assertTrue(this.filter_1_to_10.filter(1.25));
  assertFalse(this.filter_1_to_10.filter(10.25));
  assertTrue(this.filter_1_to_10.filter(5.75));
};

var test_range_filter_bidirectional = function() {
  assertTrue(this.filter_1_to_10.filter(5));
  assertTrue(this.filter_10_to_1.filter(5));
};

var test_range_filter_negatives = function() {
  assertTrue(this.filter_n1_to_n10.filter(-1));
  assertTrue(this.filter_n1_to_n10.filter(-5));
  assertFalse(this.filter_n1_to_n10.filter(-15));
};

var test_range_filter_negative_to_positive = function() {
  assertTrue(this.filter_n1_to_10.filter(0));
};

var test_range_filter_min_to_max = function() {
  assertTrue(this.filter_min_to_max.filter(Number.MAX_VALUE));
  assertTrue(this.filter_min_to_max.filter(Number.MIN_VALUE));
  assertTrue(this.filter_min_to_max.filter(Number.MAX_VALUE - 1));
  assertTrue(this.filter_min_to_max.filter(Number.MIN_VALUE + 1));
};

/** CompareFilter **/

var test_compare_filter_ctor = function() {
  assertNotThrows(function() {
    new hutmap.CompareFilter(hutmap.CompareType.EQUAL, 0);
  });
};

var test_compare_filter_ctor_null = function() {
  var error = assertThrows(function() {
    new hutmap.CompareFilter(null, null);
  });
  assertEquals('Assertion failed: Expected object but got null: null.',
      error.message);
};

var test_compare_filter_null = function() {
  var error = assertThrows(function() {
    this.filter_lt_5.filter(null);
  });
  assertEquals('Assertion failed: Expected number but got null: null.',
      error.message);
};

var test_compare_filter_type = function() {
  assertEquals(this.filter_lt_5.get_type(), hutmap.FilterType.COMPARE);
};

var test_compare_filter_lt = function() {
  assertTrue(this.filter_lt_5.filter(-2));
  assertFalse(this.filter_lt_5.filter(5));
  assertFalse(this.filter_lt_5.filter(15));
};

var test_compare_filter_lte = function() {
  assertTrue(this.filter_lte_n1.filter(-2.25));
  assertTrue(this.filter_lte_n1.filter(-1));
  assertFalse(this.filter_lte_n1.filter(-0.75));
  assertFalse(this.filter_lte_n1.filter(1));
};

var test_compare_filter_eq = function() {
  assertTrue(this.filter_eq_0.filter(0));
  assertFalse(this.filter_eq_0.filter(0.75));
  assertFalse(this.filter_eq_0.filter(-0.75));
};

var test_compare_filter_gte = function() {
  assertTrue(this.filter_gte_max.filter(Number.MAX_VALUE));
  assertFalse(this.filter_gte_max.filter(5));
  assertFalse(this.filter_gte_max.filter(Number.MIN_VALUE));
};

var test_compare_filter_gt = function() {
  assertTrue(this.filter_gt_5.filter(6));
  assertFalse(this.filter_gt_5.filter(4));
};

/** BooleanFilter **/

var test_boolean_filter_ctor = function() {
  assertNotThrows(function() {
    new hutmap.BooleanFilter();
  });
};

var test_boolean_filter_null = function() {
  var error = assertThrows(function() {
    this.filter_bool.filter(null);
  });
  assertEquals('Assertion failed', error.message);
};

var test_boolean_filter_type = function() {
  assertEquals(this.filter_bool.get_type(), hutmap.FilterType.BOOLEAN);
};

var test_boolean_filter = function() {
  assertTrue(this.filter_bool.filter(true));
  assertFalse(this.filter_bool.filter(false));
};

/** SetFilter **/

var test_set_filter_ctor = function() {
  assertNotThrows(function() {
    new hutmap.SetFilter([1,2,3]);
  });
};

var test_set_filter_ctor_null = function() {
  var error = assertThrows(function() {
    new hutmap.SetFilter(null);
  });
  assertEquals('Assertion failed: Expected array but got null: null.',
      error.message);
};

var test_set_filter_null = function() {
  var error = assertThrows(function() {
    this.filter_empty_set.filter(null);
  });
  assertEquals('Assertion failed', error.message);
};

var test_set_filter_type = function() {
  assertEquals(this.filter_empty_set.get_type(), hutmap.FilterType.SET);
};

var test_set_filter_empty_set = function() {
  assertFalse(this.filter_empty_set.filter(0));
  assertFalse(this.filter_empty_set.filter(''));
  assertFalse(this.filter_empty_set.filter(Number.MIN_VALUE));
};

var test_set_filter_in_n3_n1_1_3 = function() {
  assertTrue(this.filter_in_n3_n1_1_3.filter(-3));
  assertTrue(this.filter_in_n3_n1_1_3.filter(1));
  assertFalse(this.filter_in_n3_n1_1_3.filter(0));
  assertFalse(this.filter_in_n3_n1_1_3.filter(-3.25));
};

var test_set_filter_in_3pt25 = function() {
  assertTrue(this.filter_in_3pt25.filter(3.25));
  assertFalse(this.filter_in_3pt25.filter(3.00));
  assertFalse(this.filter_in_3pt25.filter(3.50));
};

var test_set_filter_in_cat_dog_mouse = function() {
  assertTrue(this.filter_in_cat_dog_mouse.filter('cat'));
  assertFalse(this.filter_in_cat_dog_mouse.filter('rabbit'));
  assertFalse(this.filter_in_cat_dog_mouse.filter(''));
};

