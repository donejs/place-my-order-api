import path from "path";
import fs from "fs";
import 'babel/polyfill';
import feathers from 'feathers';
import bodyParser from 'body-parser';
import hooks from 'feathers-hooks';
import NeDB from 'feathers-nedb';
import madison from 'madison';
import cors from 'cors';

import config from './config';
import importer from './importer';
import serviceHooks from './hooks';

const apiResourcesPath = path.resolve(__dirname, "..", "node_modules", "place-my-order-assets");
if (fs.existsSync(apiResourcesPath)) {
  console.log(`URLs starting with "api/resources" will be served from "${apiResourcesPath}"`);
} else {
  console.log(`URLs starting with "api/resources" will NOT be served. The path "${apiResourcesPath}" does NOT exist.`);
}

function fromRestaurants(mapper) {
  return function(req, res, next) {
    let query = {};
    let reqQuery = req.query.filter || req.query;
    Object.keys(reqQuery).forEach(key => query[`address.${key}`] = reqQuery[key]);
    req.app.service('restaurants').find({ query },
      (error, restaurants) => {
        if(error) {
          return next(error);
        }
        res.json({ data: mapper(restaurants) });
      });
  };
}

const favoritesDB = new NeDB('favorites')
// combining update and create into one create endpoint
const favoritesService = {
  find: function (params, callback) {
    return favoritesDB.find(params, callback);
  },
  get: function (id, params, callback) {
    return favoritesDB.get(id, params, callback)
  },
  create: function(data, params, callback) {
    if(data._id) {
      const { _id, ..._data } = data;
      favoritesDB.patch(_id, _data, params, callback);
    } else {
      favoritesDB.create(data, params, callback);
    }
  }
}

const api = feathers()
    .configure(feathers.rest())
    .configure(feathers.socketio())
    .configure(hooks())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors())
    .get('/states', fromRestaurants(restaurants => {
      let result = {};
      restaurants.data.forEach(restaurant => {
        let short = restaurant.address.state;
        if(!result[short]) {
          result[short] = { short, name: madison.getStateNameSync(short) };
        }
      });

      return Object.keys(result).map(key => result[key]);
    }))
    .get('/cities', fromRestaurants(restaurants => {
      let result = {};
      restaurants.data.forEach(restaurant => {
        let name = restaurant.address.city;
        if(!result[name]) {
          result[name] = { name, state: restaurant.address.state };
        }
      });

      return Object.keys(result).map(key => result[key]);
    }))
    .use('/api/resources', feathers.static(apiResourcesPath))
    .use('/restaurants', new NeDB('restaurants'))
    .use('/orders', new NeDB('orders'))
    .use('/favorites', favoritesService);

  api.service('orders')
    .before(serviceHooks.addDelay(config.delay))
    .before(serviceHooks.useFilter)
    .before(serviceHooks.convertOrderItems)
    .before({
      find: serviceHooks.allowArray('status')
    }).after({
      find: serviceHooks.wrapData
    });

  api.service('restaurants')
    .before(serviceHooks.addDelay(config.delay))
    .before(serviceHooks.useFilter)
    .before({
      get: serviceHooks.alternateId('slug')
    }).after({
      find: serviceHooks.wrapData
    });

  api.service('favorites')
    .before(serviceHooks.addDelay(config.delay))
    .before({
      create: [
        serviceHooks.checkRequiredFields(['userId', 'restaurantId', 'favorite', 'datetimeUpdated']), 
        serviceHooks.checkUniqueConstraint(['userId', 'restaurantId'])  
      ],
      find: serviceHooks.checkQueryParam('userId'),
    }).after({
      create: serviceHooks.wrapData,
      find: serviceHooks.wrapData
    });

  api.service('restaurants').find({}, function(error, restaurants) {
    if(error) {
      console.error(error.message);
    }

    if(restaurants && !restaurants.data.length) {
      importer(api);
    }
  });

module.exports = api;
