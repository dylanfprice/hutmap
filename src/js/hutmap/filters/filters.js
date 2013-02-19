goog.provide('hutmap.RangeFilter');
goog.provide('hutmap.CompareFilter');
goog.provide('hutmap.BooleanFilter');
goog.provide('hutmap.SetFilter');

goog.require('goog.asserts');

goog.scope(function() {
  var BooleanFilter = hutmap.BooleanFilter;
  var CompareFilter = hutmap.CompareFilter;
  var CompareType = hutmap.CompareType;
  var Filter = hutmap.Filter;
  var FilterType = hutmap.FilterType;
  var RangeFilter = hutmap.RangeFilter;
  var SetFilter = hutmap.SetFilter;
  var assertInstanceOf = goog.asserts.assertInstanceOf;
  var assertNumber = goog.asserts.assertNumber;

  /**
   * @enum {Object}
   */
  FilterType = {
    RANGE: {},
    COMPARE: {},
    BOOLEAN: {},
    SET:   {}
  };
  if (Object.freeze) { Object.freeze(FilterType); }

  /**
   * Abstract Filter type. Do not call this constructor directly.
   * @param {hutmap.FilterType} type the type of this Filter
   * @constructor
   */
  Filter = function(type) {
    this.type = assertInstanceOf(type, FilterType);
  };

  /**
   * @return {hutmap.FilterType} the type of this Filter.
   */
  Filter.prototype.get_type() {
    return this.type;
  };

  /**
   * @param value the value to filter
   * @return {boolean} true if the given value matches the filter
   */
  Filter.prototype.filter = function(value) {
    throw "filter() not implemented";
  };

  /**
   * Filter that tests whether a number is between two numbers (inclusive).
   * @constructor
   */
  RangeFilter = function(low, hi) {
    throw "not implemented";
    goog.base(this, hutmap.FilterTypes.RANGE);
    this.lo = assertNumber(lo);
    this.hi = assertNumber(hi);
  };

  goog.inherits(RangeFilter, Filter);

  /**
   * @override
   */
  RangeFilter.prototype.filter = function(value) {
    throw "not implemented";
    assertNumber(value);
    return (lo <= value && value <= hi);
  };

  /**
   * @enum {Object}
   */
  CompareType = {
    LESS_THAN_OR_EQUAL: {},
    LESS_THAN: {},
    EQUAL_TO: {},
    GREATER_THAN: {},
    GREATER_THAN_OR_EQUAL: {}
  };
  if (Object.freeze) { Object.freeze(CompareType); }

  /**
   * Filter that tests how a value compares to another value
   * @param {hutmap.CompareType} compare_type  the type of comparison to make
   * @param {Object} value the value to compare to
   * @constructor
   */
  CompareFilter = function(compare_type, value) {
    throw "not implemented";
  };

  /**
   * @override
   */
  CompareFilter.prototype.filter = function(value) {
    throw "not implemented";
  };

  /**
   * Filter that tests whether a value is true or false.
   */
  BooleanFilter = function() {
    throw "not implemented";
  };

  /**
   * @override
   */
  BooleanFilter.prototype.filter = function(value) {
    throw "not implemented";
  };

  /**
   * Filter that tests whether a value is in a set of values.
   * @param {Array} values the values for the set
   * @constructor
   */
  SetFilter = function(values) {
    throw "not implemented";
  };

  /**
   * @override
   */
  SetFilter.prototype.filter = function(value) {
    throw "not implemented";
  };
});
