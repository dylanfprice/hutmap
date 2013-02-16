// This file generated from the template at scripts/make/generate/templates/models.js
// Please do not edit by hand.
goog.provide('hutmap.Hut');
goog.provide('hutmap.Agency');
goog.provide('hutmap.Region');
hutmap.Hut = function(values) {
  if (!values)
    values = {};
  this.agency = values.agency;
  this.hut_references = values.hut_references;
  this.hut_url = values.hut_url;
  this.id = values.id;
  this.location = values.location;
  this.location_accuracy = values.location_accuracy;
  this.name = values.name;
  this.photo_url = values.photo_url;
  this.region = values.region;
  this.agency_display = (values.agency !== null &&
    values.agency !== undefined &&
    values.agency !== '') ?
    values.agency : 'unknown';
  this.hut_references_display = (values.hut_references !== null &&
    values.hut_references !== undefined &&
    values.hut_references !== '') ?
    values.hut_references : 'unknown';
  this.hut_url_display = (values.hut_url !== null &&
    values.hut_url !== undefined &&
    values.hut_url !== '') ?
    values.hut_url : 'unknown';
  this.id_display = (values.id !== null &&
    values.id !== undefined &&
    values.id !== '') ?
    values.id : 'unknown';
  this.location_display = (values.location !== null &&
    values.location !== undefined &&
    values.location !== '') ?
    values.location : 'unknown';
  this.location_accuracy_display = (values.location_accuracy !== null &&
    values.location_accuracy !== undefined &&
    values.location_accuracy !== '') ?
    values.location_accuracy : 'unknown';
  this.name_display = (values.name !== null &&
    values.name !== undefined &&
    values.name !== '') ?
    values.name : 'unknown';
  this.photo_url_display = (values.photo_url !== null &&
    values.photo_url !== undefined &&
    values.photo_url !== '') ?
    values.photo_url : 'unknown';
  this.region_display = (values.region !== null &&
    values.region !== undefined &&
    values.region !== '') ?
    values.region : 'unknown';
};
hutmap.Hut.prototype.equals = function(other) {
  return 
  this.agency === other.agency &&
  this.hut_references === other.hut_references &&
  this.hut_url === other.hut_url &&
  this.id === other.id &&
  this.location === other.location &&
  this.location_accuracy === other.location_accuracy &&
  this.name === other.name &&
  this.photo_url === other.photo_url &&
  this.region === other.region;
};
hutmap.Agency = function(values) {
  if (!values)
    values = {};
  this.id = values.id;
  this.name = values.name;
  this.url = values.url;
  this.id_display = (values.id !== null &&
    values.id !== undefined &&
    values.id !== '') ?
    values.id : 'unknown';
  this.name_display = (values.name !== null &&
    values.name !== undefined &&
    values.name !== '') ?
    values.name : 'unknown';
  this.url_display = (values.url !== null &&
    values.url !== undefined &&
    values.url !== '') ?
    values.url : 'unknown';
};
hutmap.Agency.prototype.equals = function(other) {
  return 
  this.id === other.id &&
  this.name === other.name &&
  this.url === other.url;
};
hutmap.Region = function(values) {
  if (!values)
    values = {};
  this.country = values.country;
  this.id = values.id;
  this.region = values.region;
  this.state = values.state;
  this.country_display = (values.country !== null &&
    values.country !== undefined &&
    values.country !== '') ?
    values.country : 'unknown';
  this.id_display = (values.id !== null &&
    values.id !== undefined &&
    values.id !== '') ?
    values.id : 'unknown';
  this.region_display = (values.region !== null &&
    values.region !== undefined &&
    values.region !== '') ?
    values.region : 'unknown';
  this.state_display = (values.state !== null &&
    values.state !== undefined &&
    values.state !== '') ?
    values.state : 'unknown';
};
hutmap.Region.prototype.equals = function(other) {
  return 
  this.country === other.country &&
  this.id === other.id &&
  this.region === other.region &&
  this.state === other.state;
};
