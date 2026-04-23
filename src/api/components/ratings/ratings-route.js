const express = require('express');

const ratingsController = require('./ratings-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/ratings', route);

  route.get('/', ratingsController.getRatings);
  route.post('/', ratingsController.createRating);
  route.get('/:id', ratingsController.getRating);
  route.put('/:id', ratingsController.updateRating);
  route.delete('/:id', ratingsController.deleteRating);
};
