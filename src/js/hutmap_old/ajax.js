goog.provide('hutmap.Ajax');

goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('goog.net.XhrIoPool');
goog.require('goog.net.EventType');
goog.require('goog.debug.Logger');
           
/**
 * Constructs a new Ajax object to be used for retrieving data from the server.
 *
 * @constructor
 */
hutmap.Ajax = function() {
  /**
   * Pool of XhrIo objects for making XMLHttpRequests.
   *
   * @type goog.net.XhrIoPool
   */
  this.xhrioPool = new goog.net.XhrIoPool(
    {Accept: 'application/json'});
  this.logger = goog.debug.Logger.getLogger('hutmap.Ajax');
};

/**
 * Array of keys that are allowed in requests to getHuts.
 * 
 * @type Array
 */
hutmap.Ajax.getHutsFilter = [hutmap.consts.hk.bbox,
                             hutmap.consts.hk.limit,
                             hutmap.consts.hk.fee_person_min__lte, 
                             hutmap.consts.hk.capacity_max__gte,
                             hutmap.consts.hk.access__exact];

/**
 * Asynchronously retrieves a list of huts from the server.
 *
 * @param {goog.Uri.QueryData} queryData The GET parameters for the request.
 * @param {Function} callback Called when the request is completed. Callback
 *   should take one argument which is an object containing the huts requested.
 *   To see it's format, log it! It is self explanatory and the api is meant to
 *   be explored.
 */
hutmap.Ajax.prototype.getHuts = function(queryData, callback) {
  var self = this;
  this.xhrioPool.getObject(function(request) {
    goog.events.listenOnce(request, goog.net.EventType.COMPLETE, function(){
      if (request.isSuccess()) {
        callback(request.getResponseJson()); 
      } else {
        // print error info
        self.logger.severe(
            'Something went wrong in the ajax call. Error code: '+ 
            request.getLastErrorCode()+
            ' - message: '+ request.getLastError()+
            ' - last uri: '+ request.getLastUri()
        );
      }
      self.xhrioPool.releaseObject(request);
    });
    var ajaxData = queryData.filterKeys(hutmap.Ajax.getHutsFilter);
    request.send('/huts/api/v1/hut/?' + ajaxData.toString());
  });
};

