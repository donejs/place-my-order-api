'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var firstName = ['Brunch', 'Pig', 'Cow', 'Crab', 'Lettuce', 'Bagel'];
var secondName = ['Place', 'Barn', 'Bar', 'Restaurant', 'Shack'];
var cities = {
  MI: ['Detroit', 'Detroit', 'Ann Arbor'],
  IL: ['Chicago', 'Chicago', 'Chicago', 'Peoria'],
  WI: ['Milwaukee', 'Green Bay']
};
var addresses = ['3108 Winchester Ct.', '230 W Kinzie Street', '1601-1625 N Campbell Ave', '2451 W Washburne Ave', '285 W Adams Ave'];
var zips = ['60045', '60602', '60632', '48211', '48229', '53205', '53295'];
var images = {
  thumbnail: ['node_modules/place-my-order-assets/images/1-thumbnail.jpg', 'node_modules/place-my-order-assets/images/2-thumbnail.jpg', 'node_modules/place-my-order-assets/images/3-thumbnail.jpg', 'node_modules/place-my-order-assets/images/4-thumbnail.jpg'],
  owner: ['node_modules/place-my-order-assets/images/1-owner.jpg', 'node_modules/place-my-order-assets/images/2-owner.jpg', 'node_modules/place-my-order-assets/images/3-owner.jpg', 'node_modules/place-my-order-assets/images/4-owner.jpg'],
  banner: ['node_modules/place-my-order-assets/images/1-banner.jpg', 'node_modules/place-my-order-assets/images/2-banner.jpg', 'node_modules/place-my-order-assets/images/3-banner.jpg', 'node_modules/place-my-order-assets/images/4-banner.jpg']
};
var resources = {
  thumbnail: ['api/resources/images/1-thumbnail.jpg', 'api/resources/images/2-thumbnail.jpg', 'api/resources/images/3-thumbnail.jpg', 'api/resources/images/4-thumbnail.jpg'],
  owner: ['api/resources/images/1-owner.jpg', 'api/resources/images/2-owner.jpg', 'api/resources/images/3-owner.jpg', 'api/resources/images/4-owner.jpg'],
  banner: ['api/resources/images/1-banner.jpg', 'api/resources/images/2-banner.jpg', 'api/resources/images/3-banner.jpg', 'api/resources/images/4-banner.jpg']
};
var items = [{
  "name": "Spinach Fennel Watercress Ravioli",
  "price": 35.99
}, {
  "name": "Garlic Fries",
  "price": 15.99
}, {
  "name": "Herring in Lavender Dill Reduction",
  "price": 45.99
}, {
  "name": "Crab Pancakes with Sorrel Syrup",
  "price": 35.99
}, {
  "name": "Chicken with Tomato Carrot Chutney Sauce",
  "price": 45.99
}, {
  "name": "Onion fries",
  "price": 15.99
}, {
  "name": "Ricotta Gnocchi",
  "price": 15.99
}, {
  "name": "Steamed Mussels",
  "price": 21.99
}, {
  "name": "Truffle Noodles",
  "price": 14.99
}, {
  "name": "Charred Octopus",
  "price": 25.99
}, {
  "name": "Gunthorp Chicken",
  "price": 21.99
}, {
  "name": "Roasted Salmon",
  "price": 23.99
}];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeName() {
  return random(firstName) + ' ' + random(secondName);
}

function makeImages() {
  return {
    thumbnail: random(images.thumbnail),
    owner: random(images.owner),
    banner: random(images.banner)
  };
}

function makeMenu() {
  var addedItems = [];
  var result = { lunch: [], dinner: [] };
  var make = function make(time) {
    for (var i = 0; i < 3; i++) {
      var item = random(items);
      while (addedItems.indexOf(item) !== -1) {
        item = random(items);
      }
      result[time].push(item);
      addedItems.push(item);
    }
  };

  make('lunch');
  make('dinner');
  return result;
}

function makeResources() {
  return {
    thumbnail: random(resources.thumbnail),
    owner: random(resources.owner),
    banner: random(resources.banner)
  };
}

function makeRestaurant(name, city, state) {
  return {
    name: name,
    slug: name.toLowerCase().replace(/\s/g, '-'),
    images: makeImages(),
    menu: makeMenu(),
    address: {
      street: random(addresses),
      city: city,
      state: state,
      zip: random(zips)
    },
    resources: makeResources()
  };
}

function makeOrder(restaurantIndex) {
  return {
    "restaurantIndex": restaurantIndex,
    "status": "delivered",
    "items": makeMenu().dinner,
    "name": "Justin Meyer",
    "address": random(addresses)
  };
}

function makeFixedRestaurants() {
  var restaurants = [];
  restaurants.push(makeRestaurant('Cheese Curd City', 'Green Bay', 'WI'));
  restaurants.push(makeRestaurant('Poutine Palace', 'Green Bay', 'WI'));
  return restaurants;
}

function makeFixedOrders() {
  // generate five previous orders for our fixed restaurants
  var orders = [];
  for (var i = 0; i < 5; i++) {
    orders.push(makeOrder(0));
    orders.push(makeOrder(1));
  }
  return orders;
}

exports['default'] = function () {
  var restaurants = makeFixedRestaurants();
  var orders = makeFixedOrders();
  var names = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(cities)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var state = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = cities[state][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var city = _step2.value;

          var _name = makeName();
          while (names.indexOf(_name) !== -1) {
            _name = makeName();
          }
          names.push(_name);
          restaurants.push(makeRestaurant(_name, city, state));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    'restaurants': restaurants,
    'orders': orders
  };
};

module.exports = exports['default'];