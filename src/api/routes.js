const express = require('express');

const users = require('./components/users/users-route');
const drivers = require('./components/drivers/drivers-route');
const orders = require('./components/orders/orders-route');
const ratings = require('./components/ratings/ratings-route');

module.exports = () => {
  const app = express.Router();

  users(app);
  drivers(app);
  // orders(app);
  ratings(app);

  return app;
};