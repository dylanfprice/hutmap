goog.provide('hutmap.RangeFilter');
goog.provide('hutmap.CompareFilter');
goog.provide('hutmap.BooleanFilter');
goog.provide('hutmap.SetFilter');
goog.provide('hutmap.FilterType');
goog.provide('hutmap.CompareType');

goog.require('goog.asserts');
goog.require('goog.structs.Set');

goog.scope(function() {
  var assert = goog.asserts.assert;
  var assertObject = goog.asserts.assertObject;
  var assertNumber = goog.asserts.assertNumber;
  var assertArray = goog.asserts.assertArray;
  var Set = goog.structs.Set;

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
    this.type = assertObject(type);
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
   * @param {number} start the beginning of the range
   * @param {number} end the end of the range. Does not necessarily need to be
   *                     greater than start.
   * @constructor
   */
  hutmap.RangeFilter = function(start, end) {
    goog.base(this, hutmap.FilterType.RANGE);
    assertNumber(start);
    assertNumber(end);
    this.lo = Math.min(start, end);
    this.hi = Math.max(start, end);
  };

  goog.inherits(hutmap.RangeFilter, hutmap.Filter);

  /**
   * @override
   */
  hutmap.RangeFilter.prototype.filter = function(value) {
    assertNumber(value);
    return (this.lo <= value && value <= this.hi);
  };

  /**
   * @enum {Object}
   */
  hutmap.CompareType = {
    LESS_THAN: {},
    LESS_THAN_OR_EQUAL: {},
    EQUAL: {},
    GREATER_THAN_OR_EQUAL: {},
    GREATER_THAN: {}
  };
  if (Object.freeze) { Object.freeze(hutmap.CompareType); }

  /**
   * Filter that tests how a value compares to another value
   * @param {hutmap.CompareType} compare_type the type of comparison to make
   * @param {number} value the value to compare to
   * @constructor
   */
  hutmap.CompareFilter = function(compare_type, value) {
    goog.base(this, hutmap.FilterType.COMPARE);
    this.compare_type = assertObject(compare_type);
    this.value = assertNumber(value);
  };

  goog.inherits(hutmap.CompareFilter, hutmap.Filter);

  /**
   * @override
   */
  hutmap.CompareFilter.prototype.filter = function(value) {
    assertNumber(value);
    switch (this.compare_type) {
      case hutmap.CompareType.LESS_THAN:
        return value < this.value;
        break;
      case hutmap.CompareType.LESS_THAN_OR_EQUAL:
        return value <= this.value;
        break;
      case hutmap.CompareType.EQUAL:
        return value == this.value;
        break;
      case hutmap.CompareType.GREATER_THAN_OR_EQUAL:
        return value >= this.value;
        break;
      case hutmap.CompareType.GREATER_THAN:
        return value > this.value;
        break;
      default:
        goog.asserts.fail("CompareFilter constructed with compare_type not of hutmap.CompareType.");
        break;
    }
  };

  /**
   * Filter that tests whether a value is true or false.
   */
  hutmap.BooleanFilter = function() {
    goog.base(this, hutmap.FilterType.BOOLEAN);
  };

  goog.inherits(hutmap.BooleanFilter, hutmap.Filter);

  /**
   * @override
   */
  hutmap.BooleanFilter.prototype.filter = function(value) {
    assert(value != null);
    return Boolean(value);
  };

  /**
   * Filter that tests whether a value is in a set of values.
   * @param {Array.<number>|Array.<string>} values the values for the set
   * @constructor
   */
  hutmap.SetFilter = function(values) {
    goog.base(this, hutmap.FilterType.SET);
    this.set = new Set(assertArray(values));
  };

  goog.inherits(hutmap.SetFilter, hutmap.Filter);

  /**
   * @override
   */
  hutmap.SetFilter.prototype.filter = function(value) {
    assert(value != null);
    return this.set.contains(value);
  };
});
