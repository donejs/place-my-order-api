'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _generator = require('./generator');

var _generator2 = _interopRequireDefault(_generator);

module.exports = function (api) {
  var restaurantService = api.service('restaurants');
  var orderService = api.service('orders');
  var restaurants = (0, _generator2['default'])().restaurants;
  var orders = (0, _generator2['default'])().orders;
  var itemsToInsert = restaurants.length + orders.length;
  var count = 0;
  var restaurantCount = 0;
  var check = function check() {
    count++;
    if (count === itemsToInsert) {
      restaurantService.emit('imported', restaurants);
    }
  };

  console.log('Dropped database');
  restaurants.forEach(function (restaurant) {
    restaurantService.create(restaurant, {}, function (error, restaurant) {
      console.log('Created restaurant ' + restaurant.name + '(' + restaurant._id + ')');

      orders.forEach(function (order) {
        if (order.restaurantIndex === count) {

          delete order.restaurantIndex;
          order.slug = restaurant.slug;
          orderService.create(order, {}, function (error, order) {
            console.log('Created order', order._id, 'from', restaurant.name);
            check();
          });
        }
      });

      restaurantCount++;
      check();
    });
  });
};