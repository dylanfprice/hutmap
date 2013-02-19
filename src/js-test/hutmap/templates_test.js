goog.require('hutmap.templates');
goog.require('hutmap.Hut');
goog.require('hutmap.Agency');
goog.require('hutmap.Region');

goog.require('goog.testing.jsunit');


setUp = function() {
  this.empty_hut = new hutmap.Hut();
  this.incomplete_hut = new hutmap.Hut({name: "The Hut", location: "47, -120"});
  this.complete_hut = new hutmap.Hut({
    id: 0,
    name: "The Hut",
    agency: new hutmap.Agency({name: "USDA Forest Service", url: "http://fs.usda.gov"}),
    region: new hutmap.Region({country: "USA", state: "WA", region: "Snoqualmie National Forest"}),
    hut_url: "http://hutwebsite.com",
    photo_url: "http://hutphoto.com",
    location: "47, -120",
    location_accuracy: 3
  });
  this.list_empty_huts = [
    new hutmap.Hut(),
    new hutmap.Hut()
  ];
  this.list_null_huts = [
    null,
    null
  ];
  this.incomplete_list = [
    this.incomplete_hut,
    new hutmap.Hut({name: "The Hut2", agency: new hutmap.Agency({name: "USDA Forest Service", url: "http://fs.usda.gov"})})
  ];
  this.complete_list = [
    this.complete_hut,
    new hutmap.Hut({
      id: 1,
      name: "The Hut2",
      agency: new hutmap.Agency({name: "BC Mountaineering Club", url: "http://bcmountaineeringclub.com"}),
      region: new hutmap.Region({country: "Canada", state: "BC", region: "A Region"}),
      hut_url: "http://hutwebsite2.com",
      photo_url: "http://assets.alltrails.com/uploads/photo/image/10237683/icon_5b75a2d3d533177951eef43dd7cc5a75.jpg",
      location: "48, -125",
      location_accuracy: 0
    })
  ];
};

/** hut_tooltip */
 
var test_hut_tooltip_null = function() {
  var error = null;
  try {
    hutmap.templates.hut_tooltip({hut: null});
  } catch (err) {
    error = err;
  }
  assertEquals('opt_data.hut is null', error.message);
};

var test_hut_tooltip_empty_hut = function() {
  var expected = '<div class="bold">unknown</div><div>Agency: unknown</div><div>Location accuracy: unknown</div>'
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
  var error = null;
  try {
    hutmap.templates.hut_info({hut: null});
  } catch (err) {
    error = err;
  }
  assertEquals('opt_data.hut is null', error.message);
};

var test_hut_info_empty_hut = function() {
  var expected = '<h4 class="hut_info_title">unknown</h3><span class="hut_info_detail_table"><div class="hut_info_img"><img src="/static/img/no-image-available.gif" alt="No image available"></img></div><table><tr><td class="hut_info_detail_title">Country:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">State:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Location:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Accuracy:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Agency:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Hut Url:</td><td class="hut_info_detail">unknown</td></tr></table>'
  var actual = hutmap.templates.hut_info({hut: this.empty_hut});
  assertEquals(expected, actual);
};

var test_hut_info_incomplete_hut = function() {
  var expected = '<h4 class="hut_info_title">The Hut</h3><span class="hut_info_detail_table"><div class="hut_info_img"><img src="/static/img/no-image-available.gif" alt="No image available"></img></div><table><tr><td class="hut_info_detail_title">Country:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">State:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Location:</td><td class="hut_info_detail">47, -120</td></tr><tr><td class="hut_info_detail_title">Accuracy:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Agency:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Hut Url:</td><td class="hut_info_detail">unknown</td></tr></table>';
  var actual = hutmap.templates.hut_info({hut: this.incomplete_hut});
  assertEquals(expected, actual);
};

var test_hut_info_complete_hut = function() {
  var expected = '<h4 class="hut_info_title">The Hut</h3><span class="hut_info_detail_table"><div class="hut_info_img"><a href="http://hutwebsite.com" target="blank"><img src="http://hutphoto.com" alt="Broken photo link!"></img></a></div><table><tr><td class="hut_info_detail_title">Country:</td><td class="hut_info_detail">USA</td></tr><tr><td class="hut_info_detail_title">State:</td><td class="hut_info_detail">WA</td></tr><tr><td class="hut_info_detail_title">Location:</td><td class="hut_info_detail">47, -120</td></tr><tr><td class="hut_info_detail_title">Accuracy:</td><td class="hut_info_detail">3</td></tr><tr><td class="hut_info_detail_title">Agency:</td><td class="hut_info_detail"><a href="http://fs.usda.gov" target="blank">USDA Forest Service</a></td></tr><tr><td class="hut_info_detail_title">Hut Url:</td><td class="hut_info_detail"><a href="http://hutwebsite.com" target="blank">http://hutwebsite...</a></td></tr></table>'
  var actual = hutmap.templates.hut_info({hut: this.complete_hut});
  assertEquals(expected, actual);
};

/** hut_list */

var test_hut_list_null = function() {
  var error = null;
  try {
    hutmap.templates.hut_list({huts: null});
  } catch (err) {
    error = err;
  }
  assertTrue(/opt_data.huts is null/.test(error.message));
};

var test_hut_list_empty = function() {
  var expected = '';
  var actual = hutmap.templates.hut_list({huts: []});
  assertEquals(expected, actual);
};

var test_hut_list_list_empty_huts = function() {
  var error = null;
  try {
    hutmap.templates.hut_list({huts: this.list_empty_huts});
  } catch (err) {
    error = err;
  }
  //assertEquals('opt_data is undefined', error.message);
};

var test_hut_list_list_null_huts = function() {
  var error = null;
  try {
    hutmap.templates.hut_list({huts: this.list_null_huts});
  } catch (err) {
    error = err;
  }
  assertTrue(/opt_data.hut is null/.test(error.message));
};

var test_hut_list_incomplete_huts = function() {
  var expected = '<ol class="huts"><li class="hut clearfix"><div class="title"><figure><img src="/static/img/no-image-available.gif" alt="No image available"></img></figure><h5><a href="undefined">The Hut</a></h5><h6>unknown, unknown, unknown</h6></div><div class="meta"><table><tbody><tr><td>Location:</td><td><span class="floatright">47, -120</span></td></tr><tr><td>Accuracy:</td><td><span class="rating-4star rating-NaN floatright up1"></span></td></tr></tbody></table></div><div class="meta"><table><tbody><tr><td>Agency:</td><td><a href="undefined">unknown</a></td></tr></tbody></table></div></li><li class="hut clearfix"><div class="title"><figure><img src="/static/img/no-image-available.gif" alt="No image available"></img></figure><h5><a href="undefined">The Hut2</a></h5><h6>unknown, unknown, unknown</h6></div><div class="meta"><table><tbody><tr><td>Location:</td><td><span class="floatright">unknown</span></td></tr><tr><td>Accuracy:</td><td><span class="rating-4star rating-NaN floatright up1"></span></td></tr></tbody></table></div><div class="meta"><table><tbody><tr><td>Agency:</td><td><a href="http://fs.usda.gov">USDA Forest Service</a></td></tr></tbody></table></div></li></ol>';
  var actual = hutmap.templates.hut_list({huts: this.incomplete_list});
  assertEquals(expected, actual);
};

var test_hut_list_complete_huts = function() {
  var expected = '<ol class="huts"><li class="hut clearfix"><div class="title"><figure><a href="http://hutwebsite.com" target="blank"><img src="http://hutphoto.com" alt="Broken photo link!"></img></a></figure><h5><a href="http://hutwebsite.com">The Hut</a></h5><h6>Snoqualmie National Forest, WA, USA</h6></div><div class="meta"><table><tbody><tr><td>Location:</td><td><span class="floatright">47, -120</span></td></tr><tr><td>Accuracy:</td><td><span class="rating-4star rating-30 floatright up1"></span></td></tr></tbody></table></div><div class="meta"><table><tbody><tr><td>Agency:</td><td><a href="http://fs.usda.gov">USDA Forest Service</a></td></tr></tbody></table></div></li><li class="hut clearfix"><div class="title"><figure><a href="http://hutwebsite2.com" target="blank"><img src="http://assets.alltrails.com/uploads/photo/image/10237683/icon_5b75a2d3d533177951eef43dd7cc5a75.jpg" alt="Broken photo link!"></img></a></figure><h5><a href="http://hutwebsite2.com">The Hut2</a></h5><h6>A Region, BC, Canada</h6></div><div class="meta"><table><tbody><tr><td>Location:</td><td><span class="floatright">48, -125</span></td></tr><tr><td>Accuracy:</td><td><span class="rating-4star rating-0 floatright up1"></span></td></tr></tbody></table></div><div class="meta"><table><tbody><tr><td>Agency:</td><td><a href="http://bcmountaineeringclub.com">BC Mountaineering...</a></td></tr></tbody></table></div></li></ol>';
  var actual = hutmap.templates.hut_list({huts: this.complete_list});
  assertEquals(expected, actual);
};



