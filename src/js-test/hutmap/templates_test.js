goog.require('hutmap.templates');
goog.require('hutmap.test_data');

goog.require('goog.testing.jsunit');


var setUp = function() {
  var td = hutmap.test_data;
  this.empty_hut = td.empty_hut();
  this.incomplete_hut = td.incomplete_hut0();
  this.complete_hut = td.hut0();  
  this.list_empty_huts = [
    td.empty_hut(),
    td.empty_hut()
  ];
  this.list_null_huts = [
    null,
    null
  ];
  this.incomplete_list = [
    td.incomplete_hut0(),
    td.incomplete_hut1()
  ];
  this.complete_list = [
    td.hut0(),
    td.hut1()
  ];
};

/** hut_tooltip */
 
var test_hut_tooltip_null = function() {
  var error = assertThrows(function() {
    hutmap.templates.hut_tooltip({hut: null});
  });   
  assertEquals('opt_data.hut is null', error.message);
};

var test_hut_tooltip_empty_hut = function() {
  var expected = '<div class="bold">unknown</div><div>Agency: unknown</div><div>Location accuracy: unknown</div>'
  var actual = hutmap.templates.hut_tooltip({hut: this.empty_hut});  
  assertHTMLEquals(expected, actual);
};

var test_hut_tooltip_incomplete_hut = function() {
  var expected = '<div class="bold">The Hut</div><div>Agency: unknown</div><div>Location accuracy: unknown</div>'
  var actual = hutmap.templates.hut_tooltip({hut: this.incomplete_hut});  
  assertHTMLEquals(expected, actual);
};

var test_hut_tooltip_complete_hut = function() {
  var expected = '<div class="bold">The Hut</div><div>Agency: USDA Forest Service</div><div>Location accuracy: 3</div>'
  var actual = hutmap.templates.hut_tooltip({hut: this.complete_hut}); 
  assertHTMLEquals(expected, actual);
};

/** hut_info */

var test_hut_info_null = function() {
  var error = assertThrows(function() {
    hutmap.templates.hut_info({hut: null});
  });
  assertEquals('opt_data.hut is null', error.message);
};

var test_hut_info_empty_hut = function() {
  var expected = '<h4 class="hut_info_title">unknown</h3><span class="hut_info_detail_table"><div class="hut_info_img"><img src="/static/img/no-image-available.gif" alt="No image available"></img></div><table><tr><td class="hut_info_detail_title">Country:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">State:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Location:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Accuracy:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Agency:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Hut Url:</td><td class="hut_info_detail">unknown</td></tr></table>'
  var actual = hutmap.templates.hut_info({hut: this.empty_hut});
  assertHTMLEquals(expected, actual);
};

var test_hut_info_incomplete_hut = function() {
  var expected = '<h4 class="hut_info_title">The Hut</h3><span class="hut_info_detail_table"><div class="hut_info_img"><img src="/static/img/no-image-available.gif" alt="No image available"></img></div><table><tr><td class="hut_info_detail_title">Country:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">State:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Location:</td><td class="hut_info_detail">47, -120</td></tr><tr><td class="hut_info_detail_title">Accuracy:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Agency:</td><td class="hut_info_detail">unknown</td></tr><tr><td class="hut_info_detail_title">Hut Url:</td><td class="hut_info_detail">unknown</td></tr></table>';
  var actual = hutmap.templates.hut_info({hut: this.incomplete_hut});
  assertHTMLEquals(expected, actual);
};

var test_hut_info_complete_hut = function() {
  var expected = '<h4 class="hut_info_title">The Hut</h3><span class="hut_info_detail_table"><div class="hut_info_img"><a href="http://hutwebsite.com" target="blank"><img src="http://hutphoto.com" alt="Broken photo link!"></img></a></div><table><tr><td class="hut_info_detail_title">Country:</td><td class="hut_info_detail">USA</td></tr><tr><td class="hut_info_detail_title">State:</td><td class="hut_info_detail">WA</td></tr><tr><td class="hut_info_detail_title">Location:</td><td class="hut_info_detail">47, -120</td></tr><tr><td class="hut_info_detail_title">Accuracy:</td><td class="hut_info_detail">3</td></tr><tr><td class="hut_info_detail_title">Agency:</td><td class="hut_info_detail"><a href="http://fs.usda.gov" target="blank">USDA Forest Service</a></td></tr><tr><td class="hut_info_detail_title">Hut Url:</td><td class="hut_info_detail"><a href="http://hutwebsite.com" target="blank">http://hutwebsite...</a></td></tr></table>'
  var actual = hutmap.templates.hut_info({hut: this.complete_hut});
  assertHTMLEquals(expected, actual);
};

/** hut_list */

var test_hut_list_null = function() {
  var error = assertThrows(function() {
    hutmap.templates.hut_list({huts: null});
  }); 
  assertTrue(/opt_data.huts is null/.test(error.message));
};

var test_hut_list_empty = function() {
  var expected = '';
  var actual = hutmap.templates.hut_list({huts: []});
  assertEquals(expected, actual);
};

var test_hut_list_list_empty_huts = function() {
  var expected = '<ol class="huts"><li class="hut clearfix"><div class="title"><figure><img src="/static/img/no-image-available.gif" alt="No image available"></img></figure><h5><a href="null">unknown</a></h5><h6>unknown, unknown, unknown</h6></div><div class="meta"><table><tbody><tr><td>Location:</td><td><span class="floatright">unknown</span></td></tr><tr><td>Accuracy:</td><td><span class="rating-4star rating-0 floatright up1"></span></td></tr></tbody></table></div><div class="meta"><table><tbody><tr><td>Agency:</td><td><a href="null">unknown</a></td></tr></tbody></table></div></li><li class="hut clearfix"><div class="title"><figure><img src="/static/img/no-image-available.gif" alt="No image available"></img></figure><h5><a href="null">unknown</a></h5><h6>unknown, unknown, unknown</h6></div><div class="meta"><table><tbody><tr><td>Location:</td><td><span class="floatright">unknown</span></td></tr><tr><td>Accuracy:</td><td><span class="rating-4star rating-0 floatright up1"></span></td></tr></tbody></table></div><div class="meta"><table><tbody><tr><td>Agency:</td><td><a href="null">unknown</a></td></tr></tbody></table></div></li></ol>';
  var actual = hutmap.templates.hut_list({huts: this.list_empty_huts});
  assertHTMLEquals(expected, actual);
};

var test_hut_list_list_null_huts = function() {
  var error = assertThrows(function() {
    hutmap.templates.hut_list({huts: this.list_null_huts});
  });   
  assertTrue(/opt_data.hut is null/.test(error.message));
};

var test_hut_list_incomplete_huts = function() {
  var expected = '<ol class="huts"><li class="hut clearfix"><div class="title"><figure><img src="/static/img/no-image-available.gif" alt="No image available"></img></figure><h5><a href="null">The Hut</a></h5><h6>unknown, unknown, unknown</h6></div><div class="meta"><table><tbody><tr><td>Location:</td><td><span class="floatright">47, -120</span></td></tr><tr><td>Accuracy:</td><td><span class="rating-4star rating-0 floatright up1"></span></td></tr></tbody></table></div><div class="meta"><table><tbody><tr><td>Agency:</td><td><a href="null">unknown</a></td></tr></tbody></table></div></li><li class="hut clearfix"><div class="title"><figure><img src="/static/img/no-image-available.gif" alt="No image available"></img></figure><h5><a href="null">The Hut2</a></h5><h6>unknown, unknown, unknown</h6></div><div class="meta"><table><tbody><tr><td>Location:</td><td><span class="floatright">unknown</span></td></tr><tr><td>Accuracy:</td><td><span class="rating-4star rating-0 floatright up1"></span></td></tr></tbody></table></div><div class="meta"><table><tbody><tr><td>Agency:</td><td><a href="http://fs.usda.gov">USDA Forest Service</a></td></tr></tbody></table></div></li></ol>';
  var actual = hutmap.templates.hut_list({huts: this.incomplete_list});
  assertHTMLEquals(expected, actual);
};

var test_hut_list_complete_huts = function() {
  var expected = '<ol class="huts"><li class="hut clearfix"><div class="title"><figure><a href="http://hutwebsite.com" target="blank"><img src="http://hutphoto.com" alt="Broken photo link!"></img></a></figure><h5><a href="http://hutwebsite.com">The Hut</a></h5><h6>Snoqualmie National Forest, WA, USA</h6></div><div class="meta"><table><tbody><tr><td>Location:</td><td><span class="floatright">47, -120</span></td></tr><tr><td>Accuracy:</td><td><span class="rating-4star rating-30 floatright up1"></span></td></tr></tbody></table></div><div class="meta"><table><tbody><tr><td>Agency:</td><td><a href="http://fs.usda.gov">USDA Forest Service</a></td></tr></tbody></table></div></li><li class="hut clearfix"><div class="title"><figure><a href="http://hutwebsite2.com" target="blank"><img src="http://assets.alltrails.com/uploads/photo/image/10237683/icon_5b75a2d3d533177951eef43dd7cc5a75.jpg" alt="Broken photo link!"></img></a></figure><h5><a href="http://hutwebsite2.com">The Hut2</a></h5><h6>A Region, BC, Canada</h6></div><div class="meta"><table><tbody><tr><td>Location:</td><td><span class="floatright">48, -125</span></td></tr><tr><td>Accuracy:</td><td><span class="rating-4star rating-0 floatright up1"></span></td></tr></tbody></table></div><div class="meta"><table><tbody><tr><td>Agency:</td><td><a href="http://bcmountaineeringclub.com">BC Mountaineering...</a></td></tr></tbody></table></div></li></ol>';
  var actual = hutmap.templates.hut_list({huts: this.complete_list});
  assertHTMLEquals(expected, actual);
};

