//goog.provide('hutmap.Huts');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.History');
goog.require('goog.history.EventType');
goog.require('goog.structs');
goog.require('goog.Uri.QueryData');
goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');

goog.require('hutmap.Ajax');
goog.require('hutmap.History');
goog.require('hutmap.consts');

hutmap.Huts = function() {
  this.huts = new goog.structs.Map();
  this.history = hutmap.History.getInstance();
  this.ajax = new hutmap.Ajax();
  /**
   * A comma-separated list of hut ids currently retrieved from the server.
   *
   * @type String
   */
  this.cachedIds = '';
  this.logger = goog.debug.Logger.getLogger('hutmap.Huts');

  this.history.setCallback(goog.bind(this.setHuts, this));
};

goog.inherits(hutmap.Huts, goog.events.EventTarget);

/**
 * Static configuration parameters for the hutmap.Huts object.
 */
hutmap.Huts.prototype.CONF = {
  maxHuts: 20
};

hutmap.Huts.prototype.setHuts = function(queryData) {
  this.huts.clear();
  //TODO: make more sophisticated?
  queryData.set(hutmap.consts.hk.limit, 0);
  var self = this;
  this.ajax.getHuts(queryData,
    function(data) {
      goog.array.forEach(data.objects,
        function(hut, index, array) {
          self.huts.set(hut.id, hut);
      });
      self.cachedIds = goog.iter.join(self.huts.getKeyIterator(), ',');
      self.dispatchEvent(hutmap.Huts.EventType.HUTS_CHANGED);
  });
};

hutmap.Huts.prototype.addHuts = function(queryData) {
  // TODO: Get huts we don't have and merge with huts we already have
  this.shouldRetrieveData = false;
  this.history.setToken(queryData.toString());
};

hutmap.Huts.prototype.getCount = function() {
  return this.huts.getCount();
};

hutmap.Huts.prototype.getHuts = function() {
  return this.huts.getValues();
};

hutmap.Huts.prototype.getHutIds = function() {
  return this.huts.getKeys();
};

/**
 * Event types for hutmap.Huts
 * @enum {string}
 */
hutmap.Huts.EventType = {
  HUTS_CHANGED: 'huts_changed'
};
