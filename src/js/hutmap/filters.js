'use strict';

(function () {
  angular.module('hutmapFilters', []).

  /**
  * Truncate Filter
  * @Param string
  * @Param int, default = 10
  * @Param string, default = "..."
  * @return string
  */
  filter('truncate', function () {
    return function (text, length, end) {
      if (isNaN(length))
        length = 10;
         
      if (end === undefined)
        end = "...";
         
      if (text == null || text.length == 0) {
        return null;
      } else if (text.length <= length || text.length - end.length <= length) {
        return text;
      }
      else {
        return String(text).substring(0, length-end.length) + end;
      }
    };
  });

})();
