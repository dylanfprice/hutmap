goog.provide('hutmap.ajax');

goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('goog.structs.Map');
goog.require('goog.Uri.QueryData');
           
hutmap.ajax.getHuts = function(query_map, callback) {
  var request = new goog.net.XhrIo();
  var data = goog.Uri.QueryData.createFromMap(new goog.structs.Map(query_map));

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
