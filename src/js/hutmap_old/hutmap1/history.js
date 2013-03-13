//goog.provide('hutmap.History');

goog.require('goog.Uri.QueryData');
goog.require('goog.debug.Logger');

/**
 * Provides the ability to manipulate the url hash and trigger a callback when
 * the url hash has changed. Do not use this constructor, use
 * hutmap.History.getInstance().
 *
 * @constructor
 * @private
 */
hutmap.History = function() {
  if (arguments.callee.instance)
    return arguments.callee.instance;
  arguments.callee.instance = this;

  /**
   * Callback for when history has changed.
   *
   * @type Function
   */
  this.callback = null;
  /**
   * Flag that specifies whether the next history change should trigger a
   * callback.
   *
   * @type boolean
   */
  this.allowHashToTriggerCallback = true;
  /**
   * Logger for this class.
   *
   * @type goog.debug.Logger
   */
  this.logger = goog.debug.Logger.getLogger('hutmap.History');

  window.onhashchange = goog.bind(function(e) {
    // Update app only if hash change is allowed per flag.
    this.logger.fine('entering onhashchange');
    if (this.allowHashToTriggerCallback && this.callback) {
      var hashData = this.getHashData();
      if (!hashData.isEmpty()) {
        this.logger.fine('onhashchange: calling callback');
        this.callback(hashData);
      }
    } else {
      this.allowHashToTriggerCallback = true;
    }
  }, this);
};

/**
 * Get the current url hash.
 *
 * @returns goog.Uri.QueryData The url hash as query data.
 */
hutmap.History.prototype.getHashData = function() {
  return new goog.Uri.QueryData(window.location.hash.substring(1));
};

/**
 * Set the url hash.
 *
 * @param {goog.Uri.QueryData} queryData The query data to set the url hash to.
 * @param {boolean} opt_triggerCallback If true, will call the callback set
 *  with this.setCallback (Default is false).
 */
hutmap.History.prototype.setHashData = function(queryData, opt_triggerCallback) {
  this.allowHashToTriggerCallback = opt_triggerCallback || false;
  window.location.hash = queryData.toString();
};

/**
 * Set the callback that will get called when the url hash changes.
 *
 * @param {Function} callback The function to call when the url hash changes.
 */
hutmap.History.prototype.setCallback = function(callback) {
  this.callback = callback;
  window.onhashchange();
};

/**
 * @returns hutmap.History The singleton History instance.
 */
hutmap.History.getInstance = function() {
  var singleton = new hutmap.History();
  return singleton;
};


