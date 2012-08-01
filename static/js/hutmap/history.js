goog.provide('hutmap.History');

goog.require('goog.Uri.QueryData');
goog.require('goog.debug.Logger');

hutmap.History = function() {
  if (arguments.callee.instance)
    return arguments.callee.instance;
  arguments.callee.instance = this;

  this.callback = null;
  this.allowHashToTriggerCallback = true;
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

hutmap.History.prototype.getHashData = function() {
  return new goog.Uri.QueryData(window.location.hash.substring(1));
};

hutmap.History.prototype.setHashData = function(queryData, opt_triggerCallback) {
  this.allowHashToTriggerCallback = opt_triggerCallback || false;
  window.location.hash = queryData.toString();
};

hutmap.History.prototype.setCallback = function(callback) {
  this.callback = callback;
  window.onhashchange();
};

hutmap.History.getInstance = function() {
  var singleton = new hutmap.History();
  return singleton;
};


