goog.provide('hutmap.FilteredHuts');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.object');
goog.require('goog.structs');
goog.require('goog.structs.Map');

goog.scope(function() {
  var array = goog.array;
  var assert = goog.asserts.assert;
  var assertArray = goog.asserts.assertArray;
  var assertInstanceof = goog.asserts.assertInstanceof;
  var assertNumber = goog.asserts.assertNumber;
  var assertObject = goog.asserts.assertObject;
  var assertString = goog.asserts.assertString;
  var object = goog.object;
  var structs = goog.structs;

  /**
   * Applies a set of filters to a set of huts to obtain a filtered set of huts.
   * FilteredHuts fires two types of events:
   *  - hutmap.FilteredHuts.EventType.HUTS_CHANGED when the huts are modified
   *  - hutmap.FilteredHuts.EventType.FILTERS_CHANGED when the filters are
   *    modified.
   * Neither of these events carry any extra data when they are fired.
   *
   * @param {Array.<hutmap.Hut>} huts a list of hutmap.Hut objects
   * @param {Object.<string, hutmap.Filter>} filters an object mapping field
   *    names to filters. See set_filters for information on what can be used
   *    as field names.
   * @constructor
   */
  hutmap.FilteredHuts = function(huts, filters) {
    this._set_huts(assertArray(huts));
    this.filters = new structs.Map(assertObject(filters));
    this.recompute_filtered_huts = true;
    this.filtered_huts = [];

    if (goog.DEBUG) {
      this._check_rep();
    }
  };

  goog.inherits(hutmap.FilteredHuts, goog.events.EventTarget);

  hutmap.FilteredHuts.prototype._check_rep = function() {
    array.forEach(this.huts, function(hut, index, array) {
      assertInstanceof(hut, hutmap.Hut, "hut not an instance of hutmap.Hut");
      assert(index === hut.id, "index of array not the hut id");
    }, this);

    structs.forEach(this.filters, function(filter, field, filters) {
      assertString(field, "field not a string");
      assertInstanceof(filter, hutmap.Filter, 
        "filter not an instance of hutmap.Filter");
    }, this);
  };

  /**
   * Event types for hutmap.FilteredHuts
   * @enum {string}
   */
  hutmap.FilteredHuts.EventType = {
    HUTS_CHANGED: 'huts_changed',
    FILTERS_CHANGED: 'filters_changed'
  };

  /**
   * @return {Array.<hutmap.Hut>} the set of huts which match all the filters.
   */
  hutmap.FilteredHuts.prototype.get_filtered_huts = function() {
    if (this.recompute_filtered_huts)  {
      this._compute_filtered_huts();
    }
    return object.createImmutableView(this.filtered_huts);
  };

  /**
   * @return {number} the number of huts which match all the filters.
   */
  hutmap.FilteredHuts.prototype.get_filtered_huts_count = function() {
    if (this.recompute_filtered_huts)  {
      this._compute_filtered_huts();
    }
    return this.filtered_huts.length;
  };

  /**
   * @private
   */
  hutmap.FilteredHuts.prototype._compute_filtered_huts = function() {
    this.filtered_huts = array.filter(this.huts, 
      function(hut, index, huts) {
        return this._apply_filters(hut);
      }, this);
    this.recompute_filtered_huts = false;
  };

  /**
   * @private
   */
  hutmap.FilteredHuts.prototype._apply_filters = function(hut) {
    return structs.every(this.filters, 
      function(filter, field, filters) {
        field_array = field.split('.');
        var value = object.getValueByKeys(hut, field_array);
        return filter.filter(value);
      }, this);
  };

  /** Huts */

  /**
   * @param id {number} the id of the hut to retrieve
   * @return {hutmap.Hut} the hut specified by id, or null if there is no hut
   *    with the given id
   */
  hutmap.FilteredHuts.prototype.get_hut = function(id) {
    assertNumber(id);
    var hut = this.huts[id];
    return (hut) ? hut : null;
  };

  /**
   * @param id {number} the id of the hut to retrieve
   * @return {boolean} true if this contains a hut with given id
   */
  hutmap.FilteredHuts.prototype.contains_hut = function(id) {
    assertNumber(id);
    return (id in this.huts);
  };

  /**
   * @return {Array.<hutmap.Hut> a list of the huts contained in this
   */
  hutmap.FilteredHuts.prototype.get_huts = function() {
    return array.filter(this.huts, function(elt, index, array) {
        return elt != null;
      }, this);
  };

  /**
   * @return {number} the number of huts contained in this
   */
  hutmap.FilteredHuts.prototype.get_huts_count = function() {
    var count = 0;
    array.forEach(
        this.huts, 
        function(elt, i, array) { count++; },
        this);
    return count;
  };

  /**
   * @param hut {hutmap.Hut} add the hut to this. If a hut with the same id as
   *    the given hut already exists, it will be replaced.
   */
  hutmap.FilteredHuts.prototype.add_hut = function(hut) {
    assertInstanceof(hut, hutmap.Hut);
    assertNumber(hut.id);
    this.huts[hut.id] = hut;
    this._huts_changed();
  };

  /**
   * @param {Array.<hutmap.Hut> huts the huts to set for this. All previous huts
   *    will be cleared.
   */
  hutmap.FilteredHuts.prototype.set_huts = function(huts) {
    assertArray(huts);
    this._set_huts(huts);
    this._huts_changed();
  };

  /**
   * @private
   */
  hutmap.FilteredHuts.prototype._set_huts = function(huts) {
    this.huts = [];
    array.forEach(huts, function(hut, index, array) {
      var id = hut.id;
      assert(id != null, "all given huts must have an id");
      this.huts[id] = hut;  
    }, this);
  };

  /**
   * @private
   */
  hutmap.FilteredHuts.prototype._huts_changed = function() {
    this._check_rep();
    this.recompute_filtered_huts = true;
    this.dispatchEvent(hutmap.FilteredHuts.EventType.HUTS_CHANGED);
  };

  /** Filters */

  /**
   * @return {Object.<string, hutmap.Filter>} the filters contained in this
   */
  hutmap.FilteredHuts.prototype.get_filters = function() {
    return object.createImmutableView(this.filters.toObject());
  };

  /**
   * @param {string} field the field of a hutmap.Hut the filter should be
   *                       applied to. You may include dots in the field name
   *                       to traverse into other objects. For example,
   *                       'agency.name' will be translated into an access to
   *                       hut['agency']['name']. If a filter for the given
   *                       field already exists, it will be replaced.
   * @param {hutmap.Filter} filter the filter
   */
  hutmap.FilteredHuts.prototype.set_filter = function(field, filter) {
    assertString(field);
    assertInstanceof(filter, hutmap.Filter);
    this.filters.set(field, filter);
    this._filters_changed();
  };

  /**
   * Clear all filters from this.
   */
  hutmap.FilteredHuts.prototype.clear_filters = function() {
    this.filters.clear();
    this._filters_changed();
  };

  /**
   * @private
   */
  hutmap.FilteredHuts.prototype._filters_changed = function() {
    this._check_rep(); 
    this.recompute_filtered_huts = true;
    this.dispatchEvent(hutmap.FilteredHuts.EventType.FILTERS_CHANGED);
  };
});

