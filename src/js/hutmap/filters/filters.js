goog.provide('hutmap.RangeFilter');
goog.provide('hutmap.CompareFilter');
goog.provide('hutmap.BooleanFilter');
goog.provide('hutmap.SetFilter');

goog.require('goog.asserts');

goog.scope(function() {
  var assertInstanceOf = goog.asserts.assertInstanceOf;
  var assertNumber = goog.asserts.assertNumber;

  /**
   * @enum {Object}
   */
  hutmap.FilterType = {
    RANGE: {},
    COMPARE: {},
    BOOLEAN: {},
    SET:   {}
  };
  if (Object.freeze) { Object.freeze(hutmap.FilterType); }

  /**
   * Abstract Filter type. Do not call this constructor directly.
   * @param {hutmap.FilterType} type the type of this Filter
   * @constructor
   */
  hutmap.Filter = function(type) {
    this.type = assertInstanceOf(type, hutmap.FilterType);
  };

  /**
   * @return {hutmap.FilterType} the type of this Filter.
   */
  hutmap.Filter.prototype.get_type = function() {
    return this.type;
  };

  /**
   * @param value the value to filter
   * @return {boolean} true if the given value matches the filter
   */
  hutmap.Filter.prototype.filter = function(value) {
    throw "filter() not implemented";
  };

  /**
   * Filter that tests whether a number is between two numbers (inclusive).
   * @constructor
   */
  hutmap.RangeFilter = function(low, hi) {
    throw "not implemented";
    goog.base(this, hutmap.FilterType.RANGE);
    this.lo = assertNumber(lo);
    this.hi = assertNumber(hi);
  };

  goog.inherits(hutmap.RangeFilter, hutmap.Filter);

  /**
   * @override
   */
  hutmap.RangeFilter.prototype.filter = function(value) {
    throw "not implemented";
    assertNumber(value);
    return (lo <= value && value <= hi);
  };

  /**
   * @enum {Object}
   */
  hutmap.CompareType = {
    LESS_THAN_OR_EQUAL: {},
    LESS_THAN: {},
    EQUAL_TO: {},
    GREATER_THAN: {},
    GREATER_THAN_OR_EQUAL: {}
  };
  if (Object.freeze) { Object.freeze(hutmap.CompareType); }

  /**
   * Filter that tests how a value compares to another value
   * @param {hutmap.CompareType} compare_type  the type of comparison to make
   * @param {Object} value the value to compare to
   * @constructor
   */
  hutmap.CompareFilter = function(compare_type, value) {
    throw "not implemented";
  };

  /**
   * @override
   */
  hutmap.CompareFilter.prototype.filter = function(value) {
    throw "not implemented";
  };

  /**
   * Filter that tests whether a value is true or false.
   */
  hutmap.BooleanFilter = function() {
    throw "not implemented";
  };

  /**
   * @override
   */
  hutmap.BooleanFilter.prototype.filter = function(value) {
    throw "not implemented";
  };

  /**
   * Filter that tests whether a value is in a set of values.
   * @param {Array} values the values for the set
   * @constructor
   */
  hutmap.SetFilter = function(values) {
    throw "not implemented";
  };

  /**
   * @override
   */
  hutmap.SetFilter.prototype.filter = function(value) {
    throw "not implemented";
  };
});
