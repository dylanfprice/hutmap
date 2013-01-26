goog.provide('hutmap.filters');

hutmap.filters.create_price_hut_filter = function(price_low, price_hi) {
  var price_low = price_low;
  var price_hi = price_hi;
  return function(hut) {
    if (hut.price_hut_min <= price_low)
      return hut.price_hut_max >= price_low;
    else 
      return hut.price_hut_min <= price_hi;
  };
};
