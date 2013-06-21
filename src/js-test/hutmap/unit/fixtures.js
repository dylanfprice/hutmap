hutmap = {};
hutmap.fixtures = {};

hutmap.fixtures.hutdata = function() {
  return {
    huts: {
      meta: { total_count: 2 },
      object_index: {
        1: {
          id: 1,
          location: {
            type: 'Point',
            coordinates: [3, 2]
          }, 
          location_accuracy: 4,
          resource_uri: '/huts/api/v1/hut/1/',
          agency: 1,
          region: 1,
          open_summer: true,
          open_winter: true,
          types: ['Yurt', 'Emergency Shelter'],
          photo_url: 'http://somephoto.com',
        },
        2: {
          id: 2,
          location: {
            type: 'Point',
            coordinates: [4, 3]
          }, 
          location_accuracy: 3,
          resource_uri: '/huts/api/v2/hut/2/',
          agency: 2,
          region: 2,
          open_summer: true,
          open_winter: false,
          types: ['Hostel'],
          photo_url: null,
        },
        3: {
          id: 3,
          location: {
            type: 'Point',
            coordinates: [5, 4]
          }, 
          location_accuracy: 2,
          resource_uri: '/huts/api/v3/hut/3/',
          agency: 3,
          region: 3,
          open_summer: null,
          open_winter: null,
          types: ['Hut'],
          photo_url: null,
        },
      }
    },
    agencies: {
      meta: {total_count: 2},
      object_index: {
        1: {
          id: 1,
          name: '1'
        },
        2: {
          id: 2,
          name: '2'
        }
      }
    },
    regions: {
      meta: {total_count: 2},
      object_index: {
        1: {
          id: 1,
          name: '1'
        },
        2: {
          id: 2,
          name: '2'
        }
      }
    }
  };
};

