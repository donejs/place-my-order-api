"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

require('babel/polyfill');

var _feathers = require('feathers');

var _feathers2 = _interopRequireDefault(_feathers);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _feathersHooks = require('feathers-hooks');

var _feathersHooks2 = _interopRequireDefault(_feathersHooks);

var _feathersNedb = require('feathers-nedb');

var _feathersNedb2 = _interopRequireDefault(_feathersNedb);

var _madison = require('madison');

var _madison2 = _interopRequireDefault(_madison);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _importer = require('./importer');

var _importer2 = _interopRequireDefault(_importer);

var _hooks = require('./hooks');

var _hooks2 = _interopRequireDefault(_hooks);

var apiResourcesPath = _path2["default"].resolve(__dirname, "..", "node_modules", "place-my-order-assets");
if (_fs2["default"].existsSync(apiResourcesPath)) {
  console.log("URLs starting with \"api/resources\" will be served from \"" + apiResourcesPath + "\"");
} else {
  console.log("URLs starting with \"api/resources\" will NOT be served. The path \"" + apiResourcesPath + "\" does NOT exist.");
}

function fromRestaurants(mapper) {
  console.log('hello fromRestaurants');
  return function (req, res, next) {
    console.log('hello from retrun func');
    var query = {};
    var reqQuery = req.query.filter || req.query;
    Object.keys(reqQuery).forEach(function (key) {
      return query["address." + key] = reqQuery[key];
    });
    req.app.service('restaurants').find({ query: query }, function (error, restaurants) {
      console.log('ERROR', error, restaurants, next);
      if (error) {
        return res.json({ error: error });
      }
      res.json({ data: mapper(restaurants) });
    });
  };
}

var api = (0, _feathers2["default"])().configure(_feathers2["default"].rest()).configure(_feathers2["default"].socketio()).configure((0, _feathersHooks2["default"])()).use(_bodyParser2["default"].json()).use(_bodyParser2["default"].urlencoded({ extended: true })).use((0, _cors2["default"])()).get('/states', fromRestaurants(function (restaurants) {
  var result = {};
  restaurants.data.forEach(function (restaurant) {
    var short = restaurant.address.state;
    if (!result[short]) {
      result[short] = { short: short, name: _madison2["default"].getStateNameSync(short) };
    }
  });

  return Object.keys(result).map(function (key) {
    return result[key];
  });
})).get('/cities', fromRestaurants(function (restaurants) {
  var result = {};
  restaurants.data.forEach(function (restaurant) {
    var name = restaurant.address.city;
    if (!result[name]) {
      result[name] = { name: name, state: restaurant.address.state };
    }
  });

  return Object.keys(result).map(function (key) {
    return result[key];
  });
})).use('/api/resources', _feathers2["default"]["static"](apiResourcesPath)).use('/restaurants', new _feathersNedb2["default"]('restaurants')).use('/orders', new _feathersNedb2["default"]('orders'));

api.service('orders').before(_hooks2["default"].addDelay(_config2["default"].delay)).before(_hooks2["default"].useFilter).before(_hooks2["default"].convertOrderItems).before({
  find: _hooks2["default"].allowArray('status')
}).after({
  find: _hooks2["default"].wrapData
});

api.service('restaurants').before(_hooks2["default"].addDelay(_config2["default"].delay)).before(_hooks2["default"].useFilter).before({
  get: _hooks2["default"].alternateId('slug')
}).after({
  find: _hooks2["default"].wrapData
});

api.service('restaurants').find({}, function (error, restaurants) {
  if (error) {
    console.error(error.message);
  }

  if (restaurants && !restaurants.data.length) {
    (0, _importer2["default"])(api);
  }
});

module.exports = api;