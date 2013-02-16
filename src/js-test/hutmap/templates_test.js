goog.require('hutmap.templates');
goog.require('hutmap.Hut');

goog.require('goog.testing.jsunit');


setUp = function() {
  this.empty_hut = new hutmap.Hut();
  this.incomplete_hut = new hutmap.Hut({name: "The Hut", latlon: "47, -120"});
  this.complete_hut = new hutmap.Hut({
    id: 0,
    name: "The Hut",
    country: "USA",
    state: "WA",
    agency: {name: "USDA Forest Service", url: "http://fs.usda.gov"},
    url: "http://hutwebsite.com",
    photo_url: "http://hutphoto.com",
    latlon: "47, -120",
    location_accuracy: 3
  });
};

/** hut_tooltip */
 
var test_hut_tooltip_null = function() {
  var error = false;
  try {
    hutmap.templates.hut_tooltip({hut: null});
  } catch (err) {
    error = true;
  }
  assertTrue(error);
};

var test_hut_tooltip_empty_hut = function() {
  var expected = '<div class="bold">Unknown Hut</div><div>Agency: unknown</div><div>Location accuracy: unknown</div>'
  var actual = hutmap.templates.hut_tooltip({hut: this.empty_hut});  
  assertEquals(expected, actual);
};

var test_hut_tooltip_incomplete_hut = function() {
  var expected = '<div class="bold">The Hut</div><div>Agency: unknown</div><div>Location accuracy: unknown</div>'
  var actual = hutmap.templates.hut_tooltip({hut: this.incomplete_hut});  
  assertEquals(expected, actual);
};

var test_hut_tooltip_complete_hut = function() {
  var expected = '<div class="bold">The Hut</div><div>Agency: USDA Forest Service</div><div>Location accuracy: 3</div>'
  var actual = hutmap.templates.hut_tooltip({hut: this.complete_hut}); 
  assertEquals(expected, actual);
};

/** hut_info */

var test_hut_info_null = function() {
  var error = false;
  try {
    hutmap.template.hut_info({hut: null});
  } catch (err) {
    error = true;
  }
  assertTrue(error);
};

var test_hut_info_empty_hut = function() {
  var actual = hutmap.templates.hut_info({hut: this.empty_hut});
  console.log(actual);
};

var test_hut_info_incomplete_hut = function() {
  var actual = hutmap.templates.hut_info({hut: this.incomplete_hut});
  console.log(actual);
};

var test_hut_info_complete_hut = function() {
  var expected = '<h4 id="sidebar_title">The Hut</h3><span class="hut_detail_table"><div id="sidebar_img"><a href="http://hutwebsite.com" target="blank"><img src="http://hutphoto.com" alt="Broken photo link!"></img></a></div><table><tr><td class="hut_detail_title">Country:</td><td class="hut_detail">USA</td></tr><tr><td class="hut_detail_title">State:</td><td class="hut_detail">WA</td></tr><tr><td class="hut_detail_title">Location:</td><td class="hut_detail">47, -120</td></tr><tr><td class="hut_detail_title">Accuracy:</td><td class="hut_detail">3</td></tr><tr><td class="hut_detail_title">Agency:</td><td class="hut_detail"><a href="http://fs.usda.gov">USDA Forest Service</a></td></tr><tr><td class="hut_detail_title">Hut Url:</td><td class="hut_detail"><a href="http://hutwebsite.com">http://hutwebsite...</a></td></tr></table>'
  var actual = hutmap.templates.hut_info({hut: this.complete_hut});
  assertEquals(expected, actual);
};
