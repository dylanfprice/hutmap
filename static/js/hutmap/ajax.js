goog.provide('hutmap.ajax');

goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('goog.structs.Map');
goog.require('goog.Uri.QueryData');
           
/**
 * Retrieves a list of huts from the server.
 *
 * @param {Object} queryMap The GET parameters for the request.
 * @param {Function} callback Called when the request is completed. Callback
 *   should take one argument which is an object containing the huts requested.
 *   To see it's format, log it! It is self explanatory and the api is meant to
 *   be explored.
 */
hutmap.ajax.getHuts = function(queryMap, callback) {
  var request = new goog.net.XhrIo();
  var data = goog.Uri.QueryData.createFromMap(new goog.structs.Map(queryMap));

  goog.events.listen(request, 'complete', function(){
    if (request.isSuccess()) {
      callback(request.getResponseJson()); 
    } else {
      // print error info to the console
      console.log(
          'Something went wrong in the ajax call. Error code: ', 
          request.getLastErrorCode(),
          ' - message: ', request.getLastError()
      );
    }
  });
             
  request.send('/huts/api/v1/hut?' + data.toString(), 'GET', {},
      { Accept: 'application/json' });
             
}
