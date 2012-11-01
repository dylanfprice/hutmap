goog.provide('hutmap.consts')

hutmap.consts.EARTH_MEAN_RADIUS_MILES = 3959;

/**
 * form search keys which are not in the url hash history
 */
hutmap.consts.sk = {
  distance: 'distance',
  location: 'location'
};

/**
 * url hash history keys
 */
hutmap.consts.hk = {
  map_location: 'map_location',
  bbox: 'bbox',
  limit: 'limit',
  fee_person_min__lte: 'fee_person_min__lte',
  capacity_max__gte: 'capacity_max__gte',
  access__exact: 'access__exact'
}

hutmap.consts.mapIds = {
  mapDivId: 'map_canvas',
  sidebarDivId: 'sidebar',
  sidebarContentDivId: 'sidebar_content',
  sidebarToggleDivId: 'sidebar_toggle',
  sidebarToggleIconDivId: 'sidebar_toggle_icon'
};
