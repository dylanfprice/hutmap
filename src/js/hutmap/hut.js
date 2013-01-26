goog.provide('hutmap.Hut');

hutmap.Hut = function(opt_name, opt_priceHutMin, opt_priceHutMax) {
  this.name = opt_name;
  this.priceHutMin = opt_priceHutMin;
  this.priceHutMax = opt_priceHutMax;
};

hutmap.Hut.prototype.equals = function(other) {
  return this.name == other.name &&
    this.priceHutMin == other.priceHutMin &&
    this.priceHutMax == other.priceHutMax;
};
