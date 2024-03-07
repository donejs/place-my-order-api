const firstName = ['Brunch', 'Pig', 'Cow', 'Crab', 'Lettuce', 'Bagel'];
const secondName = ['Place', 'Barn', 'Bar', 'Restaurant', 'Shack'];
const cities = {
  MI: [
    { name: 'Detroit', coordinate: { latitude: 42.349953, longitude: -83.075480 } },
    { name: 'Detroit', coordinate: { latitude: 42.311374, longitude: -82.998525 } },
    { name: 'Ann Arbor', coordinate: { latitude: 42.280827, longitude: -83.743034 } }
  ],
  IL: [
    { name: 'Chicago', coordinate: { latitude: 41.925334, longitude: -87.727238 } },
    { name: 'Chicago', coordinate: { latitude: 41.860932, longitude: -87.703877 } },
    { name: 'Chicago', coordinate: { latitude: 41.831264, longitude: -87.640664 } },
    { name: 'Peoria', coordinate: { latitude: 40.694592, longitude: -89.590363 } }
  ],
  WI: [
    { name: 'Milwaukee', coordinate: { latitude: 43.038902, longitude: -87.906471 } },
    { name: 'Green Bay', coordinate: { latitude: 44.492575, longitude: -87.972238 } }
  ]
};
const addresses = ['3108 Winchester Ct.', '230 W Kinzie Street', '1601-1625 N Campbell Ave', '2451 W Washburne Ave', '285 W Adams Ave'];
const zips = ['60045', '60602', '60632', '48211', '48229', '53205', '53295'];
const images = {
  thumbnail: ['node_modules/place-my-order-assets/images/1-thumbnail.jpg', 'node_modules/place-my-order-assets/images/2-thumbnail.jpg', 'node_modules/place-my-order-assets/images/3-thumbnail.jpg', 'node_modules/place-my-order-assets/images/4-thumbnail.jpg'],
  owner: ['node_modules/place-my-order-assets/images/1-owner.jpg', 'node_modules/place-my-order-assets/images/2-owner.jpg', 'node_modules/place-my-order-assets/images/3-owner.jpg', 'node_modules/place-my-order-assets/images/4-owner.jpg'],
  banner: ['node_modules/place-my-order-assets/images/1-banner.jpg', 'node_modules/place-my-order-assets/images/2-banner.jpg', 'node_modules/place-my-order-assets/images/3-banner.jpg', 'node_modules/place-my-order-assets/images/4-banner.jpg']
};
const resources = {
  thumbnail: ['api/resources/images/1-thumbnail.jpg', 'api/resources/images/2-thumbnail.jpg', 'api/resources/images/3-thumbnail.jpg', 'api/resources/images/4-thumbnail.jpg'],
  owner: ['api/resources/images/1-owner.jpg', 'api/resources/images/2-owner.jpg', 'api/resources/images/3-owner.jpg', 'api/resources/images/4-owner.jpg'],
  banner: ['api/resources/images/1-banner.jpg', 'api/resources/images/2-banner.jpg', 'api/resources/images/3-banner.jpg', 'api/resources/images/4-banner.jpg']
};
const items = [{
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
  return `${random(firstName)} ${random(secondName)}`;
}

function makeImages() {
  return {
    thumbnail: random(images.thumbnail),
    owner: random(images.owner),
    banner: random(images.banner)
  };
}

function makeMenu() {
  let addedItems = [];
  let result = { lunch: [], dinner: [] };
  let make = time => {
    for(let i = 0; i < 3; i++) {
      let item = random(items);
      while(addedItems.indexOf(item) !== -1) {
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

function makeRestaurant(name, city, state, coordinate) {
  return {
    name,
    slug: name.toLowerCase().replace(/\s/g, '-'),
    images: makeImages(),
    menu: makeMenu(),
    address: {
      street: random(addresses),
      city,
      state,
      zip: random(zips)
    },
    coordinate: coordinate,
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
  let restaurants = [];
  restaurants.push(makeRestaurant('Cheese Curd City', 'Green Bay', 'WI', { latitude: 44.530768, longitude: -88.049888 }));
  restaurants.push(makeRestaurant('Poutine Palace', 'Green Bay', 'WI', { latitude: 44.480329, longitude: -88.038207 }));
  return restaurants;
}

function makeFixedOrders() {
  // generate five previous orders for our fixed restaurants
  let orders = [];
  for(var i = 0; i < 5; i++) {
    orders.push(makeOrder(0));
    orders.push(makeOrder(1));
  }
  return orders;
}

export default function() {
  let restaurants = makeFixedRestaurants();
  let orders = makeFixedOrders();
  let names = [];

  for(let state of Object.keys(cities)) {
    for(let city of cities[state]) {
      let name = makeName();
      while(names.indexOf(name) !== -1) {
        name = makeName();
      }
      names.push(name);
      restaurants.push(makeRestaurant(name, city.name, state, city.coordinate));
    }
  }

  return {
    'restaurants': restaurants,
    'orders': orders
  };
}
