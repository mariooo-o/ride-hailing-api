const express = require('express');

const ordersController = require('./orders-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/orders', route);

  route.get('/', ordersController.getOrders);
  route.post('/', ordersController.createOrder);
  route.get('/:id', ordersController.getOrder);
  route.put('/:id', ordersController.updateOrder);
  route.delete('/:id', ordersController.deleteOrder);
};