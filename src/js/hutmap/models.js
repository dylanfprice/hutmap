// This file generated from the template at scripts/make/generate/templates/models.js
// Please do not edit by hand.
goog.provide('hutmap.models');
goog.provide('hutmap.Hut');
goog.provide('hutmap.Agency');
goog.provide('hutmap.Region');
goog.require('goog.asserts');
goog.require('goog.array');
goog.require('goog.object');
hutmap.Hut = function(values) {
  if (!values)
    values = {};
  if (goog.DEBUG) {
    this._check_ctor_args(values);
  }
  this.agency = (values.agency == undefined) ? null : values.agency;
  this.agency = new hutmap.Agency(this.agency);
  this.hut_references = (values.hut_references == undefined) ? null : values.hut_references;
  this.hut_url = (values.hut_url == undefined) ? null : values.hut_url;
  this.id = (values.id == undefined) ? null : values.id;
  this.location = (values.location == undefined) ? null : values.location;
  this.location_accuracy = (values.location_accuracy == undefined) ? null : values.location_accuracy;
  this.name = (values.name == undefined) ? null : values.name;
  this.photo_url = (values.photo_url == undefined) ? null : values.photo_url;
  this.region = (values.region == undefined) ? null : values.region;
  this.region = new hutmap.Region(this.region);
  if (this.agency !== undefined &&
      this.agency !== null &&
      this.agency !== '') {
    this.agency_display =  this.agency;
  } else {
    this.agency_display = 'unknown';
    this.agency_display = new hutmap.Agency();
  }
  if (this.hut_references !== undefined &&
      this.hut_references !== null &&
      this.hut_references !== '') {
    this.hut_references_display =  this.hut_references;
  } else {
    this.hut_references_display = 'unknown';
  }
  if (this.hut_url !== undefined &&
      this.hut_url !== null &&
      this.hut_url !== '') {
    this.hut_url_display =  this.hut_url;
  } else {
    this.hut_url_display = 'unknown';
  }
  if (this.id !== undefined &&
      this.id !== null &&
      this.id !== '') {
    this.id_display =  this.id;
  } else {
    this.id_display = 'unknown';
  }
  if (this.location !== undefined &&
      this.location !== null &&
      this.location !== '') {
    this.location_display =  this.location;
  } else {
    this.location_display = 'unknown';
  }
  if (this.location_accuracy !== undefined &&
      this.location_accuracy !== null &&
      this.location_accuracy !== '') {
    this.location_accuracy_display =  this.location_accuracy;
  } else {
    this.location_accuracy_display = 'unknown';
  }
  if (this.name !== undefined &&
      this.name !== null &&
      this.name !== '') {
    this.name_display =  this.name;
  } else {
    this.name_display = 'unknown';
  }
  if (this.photo_url !== undefined &&
      this.photo_url !== null &&
      this.photo_url !== '') {
    this.photo_url_display =  this.photo_url;
  } else {
    this.photo_url_display = 'unknown';
  }
  if (this.region !== undefined &&
      this.region !== null &&
      this.region !== '') {
    this.region_display =  this.region;
  } else {
    this.region_display = 'unknown';
    this.region_display = new hutmap.Region();
  }
  if (goog.DEBUG) {
    this._check_rep();
  }
};
hutmap.Hut.prototype._check_ctor_args = function(values) {
  keys = goog.object.getKeys(values);
  fields = [
    'equals',
    '_check_ctor_args',
    '_check_rep',
    'agency',
    'agency_display',
    'hut_references',
    'hut_references_display',
    'hut_url',
    'hut_url_display',
    'id',
    'id_display',
    'location',
    'location_display',
    'location_accuracy',
    'location_accuracy_display',
    'name',
    'name_display',
    'photo_url',
    'photo_url_display',
    'region',
    'region_display'
  ];
  goog.array.forEach(keys, function(key, index, array) {
    if (!goog.array.contains(fields, key)) {
      throw "hutmap.Hut(): Invalid field '" + key + "' given in values parameter.";
    }
  });
};
hutmap.Hut.prototype._check_rep = function() {
  if (this.id != null) {
    goog.asserts.assertNumber(this.id);
    goog.asserts.assert(this.id >= 0);
  }
};
hutmap.Hut.prototype.equals = function(other) {
  return hutmap.models.equals(this.agency, other.agency) && 
    hutmap.models.equals(this.hut_references, other.hut_references) &&
    hutmap.models.equals(this.hut_url, other.hut_url) &&
    hutmap.models.equals(this.id, other.id) &&
    hutmap.models.equals(this.location, other.location) &&
    hutmap.models.equals(this.location_accuracy, other.location_accuracy) &&
    hutmap.models.equals(this.name, other.name) &&
    hutmap.models.equals(this.photo_url, other.photo_url) &&
    hutmap.models.equals(this.region, other.region);
};
hutmap.Agency = function(values) {
  if (!values)
    values = {};
  if (goog.DEBUG) {
    this._check_ctor_args(values);
  }
  this.id = (values.id == undefined) ? null : values.id;
  this.name = (values.name == undefined) ? null : values.name;
  this.url = (values.url == undefined) ? null : values.url;
  if (this.id !== undefined &&
      this.id !== null &&
      this.id !== '') {
    this.id_display =  this.id;
  } else {
    this.id_display = 'unknown';
  }
  if (this.name !== undefined &&
      this.name !== null &&
      this.name !== '') {
    this.name_display =  this.name;
  } else {
    this.name_display = 'unknown';
  }
  if (this.url !== undefined &&
      this.url !== null &&
      this.url !== '') {
    this.url_display =  this.url;
  } else {
    this.url_display = 'unknown';
  }
  if (goog.DEBUG) {
    this._check_rep();
  }
};
hutmap.Agency.prototype._check_ctor_args = function(values) {
  keys = goog.object.getKeys(values);
  fields = [
    'equals',
    '_check_ctor_args',
    '_check_rep',
    'id',
    'id_display',
    'name',
    'name_display',
    'url',
    'url_display'
  ];
  goog.array.forEach(keys, function(key, index, array) {
    if (!goog.array.contains(fields, key)) {
      throw "hutmap.Agency(): Invalid field '" + key + "' given in values parameter.";
    }
  });
};
hutmap.Agency.prototype._check_rep = function() {
  if (this.id != null) {
    goog.asserts.assertNumber(this.id);
    goog.asserts.assert(this.id >= 0);
  }
};
hutmap.Agency.prototype.equals = function(other) {
  return hutmap.models.equals(this.id, other.id) && 
    hutmap.models.equals(this.name, other.name) &&
    hutmap.models.equals(this.url, other.url);
};
hutmap.Region = function(values) {
  if (!values)
    values = {};
  if (goog.DEBUG) {
    this._check_ctor_args(values);
  }
  this.country = (values.country == undefined) ? null : values.country;
  this.id = (values.id == undefined) ? null : values.id;
  this.region = (values.region == undefined) ? null : values.region;
  this.state = (values.state == undefined) ? null : values.state;
  if (this.country !== undefined &&
      this.country !== null &&
      this.country !== '') {
    this.country_display =  this.country;
  } else {
    this.country_display = 'unknown';
  }
  if (this.id !== undefined &&
      this.id !== null &&
      this.id !== '') {
    this.id_display =  this.id;
  } else {
    this.id_display = 'unknown';
  }
  if (this.region !== undefined &&
      this.region !== null &&
      this.region !== '') {
    this.region_display =  this.region;
  } else {
    this.region_display = 'unknown';
  }
  if (this.state !== undefined &&
      this.state !== null &&
      this.state !== '') {
    this.state_display =  this.state;
  } else {
    this.state_display = 'unknown';
  }
  if (goog.DEBUG) {
    this._check_rep();
  }
};
hutmap.Region.prototype._check_ctor_args = function(values) {
  keys = goog.object.getKeys(values);
  fields = [
    'equals',
    '_check_ctor_args',
    '_check_rep',
    'country',
    'country_display',
    'id',
    'id_display',
    'region',
    'region_display',
    'state',
    'state_display'
  ];
  goog.array.forEach(keys, function(key, index, array) {
    if (!goog.array.contains(fields, key)) {
      throw "hutmap.Region(): Invalid field '" + key + "' given in values parameter.";
    }
  });
};
hutmap.Region.prototype._check_rep = function() {
  if (this.id != null) {
    goog.asserts.assertNumber(this.id);
    goog.asserts.assert(this.id >= 0);
  }
};
hutmap.Region.prototype.equals = function(other) {
  return hutmap.models.equals(this.country, other.country) && 
    hutmap.models.equals(this.id, other.id) &&
    hutmap.models.equals(this.region, other.region) &&
    hutmap.models.equals(this.state, other.state);
};
hutmap.models.equals = function(a, b) {
  var not_null = (a != null && b != null);
  var has_equals = not_null && (a.equals && b.equals);
  if (has_equals) {
    return a.equals(b);
  } else {
    return a === b;
  }
};
