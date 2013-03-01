
(function() {
  var mapCtrl;
  angular.module('google-maps-test', ['google-maps']).

  factory('gmtestMapController', function() {
    return function() {
      return mapCtrl;
    };
  }).

  directive('gmtestGetMapController', function() {
    return {
      restrict: 'AE',
      require: '^googleMap',
      link: function(scope, element, attrs, controller) {
        mapCtrl = controller;
      }
    };
  });
})();
