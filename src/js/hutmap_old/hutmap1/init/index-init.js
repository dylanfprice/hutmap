goog.provide('hutmap.index');

goog.require('hutmap.Search');

hutmap.index.init = function() {
  var search = new hutmap.Search('hut_search_form', 'hut_search_box',
    'search_button', 'Go >', hutmap.index.searchButtonClicked);
};

hutmap.index.searchButtonClicked = function(queryData) {
  window.open('/huts/map/#' + queryData.toString(), '_self', false); 
}

