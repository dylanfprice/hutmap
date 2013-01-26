goog.provide('hutmap.Hut');

hutmap.Hut = function(id, name, country, state, agency, url, photo_url, latlon,
                      location_accuracy) {
  this.id = id;
  this.name = name;
  this.country = country;
  this.state = state;
  this.agency = agency;
  this.url = url;
  this.photo_url = photo_url;
  this.latlon = latlon;
  this.location_accuracy = location_accuracy;
};

hutmap.Hut.prototype.equals = function(other) {
  return this.id === other.id;
};
