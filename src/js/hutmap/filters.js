goog.provide('hutmap.filters');

hutmap.filters.createPriceHutFilter = function(priceLow, priceHi) {
  var priceLow = priceLow;
  var priceHi = priceHi;
  return function(hut) {
    if (hut.priceHutMin <= priceLow)
      return hut.priceHutMax >= priceLow;
    else 
      return hut.priceHutMin <= priceHi;
  };
};
