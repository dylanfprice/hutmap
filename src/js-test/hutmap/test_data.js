goog.provide('hutmap.test_data');

goog.require('hutmap.Hut');
goog.require('hutmap.Agency');
goog.require('hutmap.Region');

hutmap.test_data.empty_hut = function() {
  return new hutmap.Hut();
};

hutmap.test_data.incomplete_hut0 = function() {
  return new hutmap.Hut({
    name: "The Hut", 
    location: "47, -120"
  });
};

hutmap.test_data.incomplete_hut1 = function() {
  return new hutmap.Hut({
    name: "The Hut2", 
    agency: new hutmap.Agency({
      name:"USDA Forest Service", 
      url: "http://fs.usda.gov"
    })
  });
};

hutmap.test_data.hut0 = function() {
  return new hutmap.Hut({
    id: 0,
    name: "The Hut",
    agency: new hutmap.Agency({name: "USDA Forest Service", url: "http://fs.usda.gov"}),
    region: new hutmap.Region({country: "USA", state: "WA", region: "Snoqualmie National Forest"}),
    hut_url: "http://hutwebsite.com",
    photo_url: "http://hutphoto.com",
    location: "47, -120",
    location_accuracy: 3
  });
};

hutmap.test_data.hut1 = function() {
  return new hutmap.Hut({
    id: 1,
    name: "The Hut2",
    agency: new hutmap.Agency({name: "BC Mountaineering Club", url: "http://bcmountaineeringclub.com"}),
    region: new hutmap.Region({country: "Canada", state: "BC", region: "A Region"}),
    hut_url: "http://hutwebsite2.com",
    photo_url: "http://assets.alltrails.com/uploads/photo/image/10237683/icon_5b75a2d3d533177951eef43dd7cc5a75.jpg",
    location: "48, -125",
    location_accuracy: 0
  });
};

