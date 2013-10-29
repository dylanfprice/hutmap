(function () {
'use strict';

  angular.module('hutmap.services').

  factory('MarkerTooltip', [function() {
    /*
    Constructor for the tooltip
    @ param options an object containing: marker(required), content(required)
    @ see google.maps.OverlayView()
    */
    function MarkerTooltip(options) {

      // Now initialize all properties.
      this.marker_ = options.marker;
      this.content_ = options.content;
      this.map_ = options.marker.get('map');

      // We define a property to hold the content's
      // div. We'll actually create this div
      // upon receipt of the add() method so we'll
      // leave it null for now.
      this.div_ = null;

      //Explicitly call setMap on this overlay
      this.setMap(this.map_);
      var me = this;
    }

    // Now we extend google.maps.OverlayView()
    MarkerTooltip.prototype = new google.maps.OverlayView();

    // onAdd is one of the functions that we must implement, 
    // it will be called when the map is ready for the overlay to be attached.
    MarkerTooltip.prototype.onAdd = function() {

      // Create the DIV and set some basic attributes.
      var outerDiv = document.createElement('DIV');
      var innerDiv = document.createElement('DIV');
      outerDiv.appendChild(innerDiv);
      outerDiv.style.position = "absolute";

      outerDiv.className += " tooltip fade in";
      innerDiv.className += " tooltip-inner";

      //Attach content to the DIV.
      innerDiv.innerHTML = this.content_;

      // Set the overlay's div_ property to this DIV
      this.div_ = outerDiv;

      // We add an overlay to a map via one of the map's panes.
      // We'll add this overlay to the floatPane pane.
      var panes = this.getPanes();
      panes.floatPane.appendChild(this.div_);
    
    }

    // Here we implement draw
    MarkerTooltip.prototype.draw = function() {

        // Position the overlay. We use the position of the marker
        // to peg it to the correct position, just northeast of the marker.
        // We need to retrieve the projection from this overlay to do this.
        var overlayProjection = this.getProjection();

        // Retrieve the coordinates of the marker
        // in latlngs and convert them to pixels coordinates.
        // We'll use these coordinates to place the DIV.
        var ne = overlayProjection.fromLatLngToDivPixel(this.marker_.getPosition());

        // Position the DIV.
        var div = this.div_;
        div.style.left = ne.x + 'px';
        div.style.top = ne.y + 'px';
        
    }
    
    // Here we implement onRemove
    MarkerTooltip.prototype.onRemove = function() {
        this.div_.parentNode.removeChild(this.div_);
    }

    // Note that the visibility property must be a string enclosed in quotes
    MarkerTooltip.prototype.hide = function() {
        if (this.div_) {
          this.div_.style.visibility = "hidden";
        }
    }

    MarkerTooltip.prototype.show = function() {
        if (this.div_) {
          this.div_.style.visibility = "visible";
        }
    }

    return MarkerTooltip;
  }]);

})();
