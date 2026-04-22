const express = require('express');

const driversController = require('./drivers-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/drivers', route);

  route.get('/', driversController.getDrivers);
  route.post('/', driversController.createDriver);
  route.get('/:id', driversController.getDriver);
  route.put('/:id', driversController.updateDriver);
  route.delete('/:id', driversController.deleteDriver);
};