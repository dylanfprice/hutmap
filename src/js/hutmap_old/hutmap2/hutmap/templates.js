// This file was automatically generated from templates.soy.
// Please don't edit this file by hand.

goog.provide('hutmap.templates');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
hutmap.templates.hut_tooltip = function(opt_data, opt_ignored) {
  return '<div class="bold">' + soy.$$escapeHtml(opt_data.hut.name_display) + '</div><div>Agency: ' + soy.$$escapeHtml(opt_data.hut.agency_display.name_display) + '</div><div>Location accuracy: ' + soy.$$escapeHtml(opt_data.hut.location_accuracy_display) + '</div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
hutmap.templates.hut_info = function(opt_data, opt_ignored) {
  return '<h4 class="hut_info_title">' + soy.$$escapeHtml(opt_data.hut.name_display) + '</h3><span class="hut_info_detail_table"><div class="hut_info_img">' + hutmap.templates.hut_photo(opt_data) + '</div><table><tr><td class="hut_info_detail_title">Country:</td><td class="hut_info_detail">' + soy.$$escapeHtml(opt_data.hut.region_display.country_display) + '</td></tr><tr><td class="hut_info_detail_title">State:</td><td class="hut_info_detail">' + soy.$$escapeHtml(opt_data.hut.region_display.state_display) + '</td></tr><tr><td class="hut_info_detail_title">Location:</td><td class="hut_info_detail">' + soy.$$escapeHtml(opt_data.hut.location_display) + '</td></tr><tr><td class="hut_info_detail_title">Accuracy:</td><td class="hut_info_detail">' + soy.$$escapeHtml(opt_data.hut.location_accuracy_display) + '</td></tr><tr><td class="hut_info_detail_title">Agency:</td><td class="hut_info_detail">' + hutmap.templates.wrap_with_link({url: (opt_data.hut.agency == null) ? null : opt_data.hut.agency.url, value: opt_data.hut.agency_display.name_display, truncate_length: 20, escape: true}) + '</td></tr><tr><td class="hut_info_detail_title">Hut Url:</td><td class="hut_info_detail">' + hutmap.templates.wrap_with_link({url: opt_data.hut.hut_url, value: opt_data.hut.hut_url_display, truncate_length: 20, escape: true}) + '</td></tr></table>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
hutmap.templates.hut_list = function(opt_data, opt_ignored) {
  var output = '';
  if (opt_data.huts.length > 0) {
    output += '<ol class="huts">';
    var hutList41 = opt_data.huts;
    var hutListLen41 = hutList41.length;
    for (var hutIndex41 = 0; hutIndex41 < hutListLen41; hutIndex41++) {
      var hutData41 = hutList41[hutIndex41];
      output += '<li class="hut clearfix">' + hutmap.templates.hut_list_title({hut: hutData41}) + hutmap.templates.hut_list_meta({hut: hutData41}) + '</li>';
    }
    output += '</ol>';
  }
  return output;
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
hutmap.templates.hut_list_title = function(opt_data, opt_ignored) {
  return '<div class="title"><figure>' + hutmap.templates.hut_photo(opt_data) + '</figure><h5><a href="' + soy.$$escapeHtml(opt_data.hut.hut_url) + '">' + soy.$$escapeHtml(opt_data.hut.name_display) + '</a></h5><h6>' + soy.$$escapeHtml(opt_data.hut.region_display.region_display) + ', ' + soy.$$escapeHtml(opt_data.hut.region_display.state_display) + ', ' + soy.$$escapeHtml(opt_data.hut.region_display.country_display) + '</h6></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
hutmap.templates.hut_list_meta = function(opt_data, opt_ignored) {
  return '<div class="meta"><table><tbody><tr><td>Location:</td><td><span class="floatright">' + soy.$$escapeHtml(opt_data.hut.location_display) + '</span></td></tr><tr><td>Accuracy:</td><td><span class="rating-4star rating-' + soy.$$escapeHtml(opt_data.hut.location_accuracy * 10) + ' floatright up1"></span></td></tr></tbody></table></div><div class="meta"><table><tbody><tr><td>Agency:</td><td><a href="' + soy.$$escapeHtml((opt_data.hut.agency == null) ? null : opt_data.hut.agency.url) + '">' + soy.$$truncate(soy.$$escapeHtml(opt_data.hut.agency_display.name_display), 20, true) + '</a></td></tr></tbody></table></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
hutmap.templates.hut_photo = function(opt_data, opt_ignored) {
  return (opt_data.hut.photo_url != null) ? hutmap.templates.wrap_with_link({url: opt_data.hut.hut_url, value: '<img src="' + opt_data.hut.photo_url + '" alt="Broken photo link!"></img>', truncate_length: 0, escape: false}) : hutmap.templates.wrap_with_link({url: opt_data.hut.hut_url, value: '<img src="/static/img/no-image-available.gif" alt="No image available"></img>', truncate_length: 0, escape: false});
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
hutmap.templates.wrap_with_link = function(opt_data, opt_ignored) {
  return ((opt_data.url != null) ? '<a href="' + soy.$$escapeHtml(opt_data.url) + '" target="blank">' : '') + ((opt_data.truncate_length > 0 && opt_data.escape) ? soy.$$truncate(soy.$$escapeHtml(opt_data.value), opt_data.truncate_length, true) : (opt_data.truncate_length > 0 && ! opt_data.escape) ? soy.$$filterNoAutoescape(soy.$$truncate(opt_data.value, opt_data.truncate_length, true)) : (opt_data.truncate_length <= 0 && opt_data.escape) ? soy.$$escapeHtml(opt_data.value) : (opt_data.truncate_length <= 0 && ! opt_data.escape) ? soy.$$filterNoAutoescape(opt_data.value) : '') + ((opt_data.url != null) ? '</a>' : '');
};
