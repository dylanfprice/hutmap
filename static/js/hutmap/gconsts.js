goog.provide('hutmap.consts.g')

/**
 * Constants from the server-side of things.
 *
 * These are currently hand-generated from hutmap/huts/models.py, but in the
 * future there should be a script.
 */
hutmap.consts.g = {
  access: ['frontcountry year-round', 'winter backcountry',
  'backcountry year-round'],
  maxAccuracy: 4,
  hut: {
    id: 'id',
    created: 'created',
    updated: 'updated',
    region: 'region',
    location: 'location',
    location_accuracy: 'location_accuracy',
    altitude: 'altitude',
    name: 'name',
    access: 'access',
    type: 'type',
    num_structures: 'num_structures',
    capacity_max: 'capacity_max',
    capacity_hut_max: 'capacity_hut_max',
    capacity_hut_min: 'capacity_hut_min',
    fee_person_min: 'fee_person_min',
    fee_person_max: 'fee_person_max',
    fee_hut_min: 'fee_hut_min',
    fee_hut_max: 'fee_hut_max',
    reservations: 'reservations',
    hut_url: 'hut_url',
    photo_url: 'photo_url',
    references: 'references',
    agency: 'agency'
  }
};
