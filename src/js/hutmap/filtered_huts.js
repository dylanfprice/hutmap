goog.provide('hutmap.FilteredHuts');

goog.require('goog.asserts');
goog.require('goog.events');
goog.require('goog.events.EventTarget');

goog.scope(function() {
  var assertArray = goog.asserts.assertArray;

  /**
   * Applies a set of filters to a set of huts to obtain a new set of huts.
   *
   * @param {Array.<hutmap.Hut>} huts a list of hutmap.Hut objects
   * @param {Object.<string, hutmap.Filter>} filters an object mapping field
   *    names to filters. See set_filters for information on what can be used
   *    as field names.
   * @constructor
   */
  hutmap.FilteredHuts = function(huts, filters) {
    throw "not implemented";
    this.huts = assertArray(huts);
  };

  goog.inherits(hutmap.FilteredHuts, goog.events.EventTarget);

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
    throw "not implemented";
  };

  /**
   * @return {number} the number of huts which match all the filters.
   */
  hutmap.FilteredHuts.prototype.get_filtered_huts_count = function() {
    throw "not implemented";
  };

  /** Huts */

  /**
   * @param id {number} the id of the hut to retrieve
   * @return {hutmap.Hut} the hut specified by id
   */
  hutmap.FilteredHuts.prototype.get_hut = function(id) {
    throw "not implemented";
  };

  /**
   * @param id {number} the id of the hut to retrieve
   * @return {boolean} true if this contains a hut with given id
   */
  hutmap.FilteredHuts.prototype.contains_hut = function(id) {
    throw "not implemented";
  };

  /**
   * @return {Array.<hutmap.Hut> a list of the huts contained in this
   */
  hutmap.FilteredHuts.prototype.get_huts = function() {
    throw "not implemented";
  };

  /**
   * @return {number} the number of huts contained in this
   */
  hutmap.FilteredHuts.prototype.get_huts_count = function() {
    throw "not implemented";
  };

  /**
   * @param hut {hutmap.Hut} add the hut to this. If a hut with the same id as
   *    the given hut already exists, it will be replaced.
   */
  hutmap.FilteredHuts.prototype.add_hut = function(hut) {
    throw "not implemented";
  };

  /**
   * @param {Array.<hutmap.Hut> huts the huts to set for this. All previous huts
   *    will be cleared.
   */
  hutmap.FilteredHuts.prototype.set_huts = function(huts) {
    throw "not implemented";
  };

  /** Filters */

  /**
   * @return {Object.<string, hutmap.Filter>} the filters contained in this
   */
  hutmap.FilteredHuts.prototype.get_filters = function() {
    throw "not implemented";
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
    throw "not implemented";
  };

  /**
   * Clear all filters from this.
   */
  hutmap.FilteredHuts.prototype.clear_filters = function() {
    throw "not implemented";
  };
});

