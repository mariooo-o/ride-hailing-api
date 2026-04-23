const mongoose = require('mongoose');

const ratingsService = require('./ratings-service');
const ordersService = require('../orders/orders-service');
const usersService = require('../users/users-service');
const driversService = require('../drivers/drivers-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

function validateRatingId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Invalid rating id');
  }
}

function getObjectIdValue(data) {
  if (!data) {
    return null;
  }

  if (typeof data === 'string') {
    return data;
  }

  if (data._id) {
    return data._id.toString();
  }

  return data.toString();
}

function validateRatingPayload(order, user, driver, score) {
  if (!order) {
    throw errorResponder(errorTypes.VALIDATION, 'Order is required');
  }

  if (!user) {
    throw errorResponder(errorTypes.VALIDATION, 'User is required');
  }

  if (!driver) {
    throw errorResponder(errorTypes.VALIDATION, 'Driver is required');
  }

  if (score === undefined || score === null || Number.isNaN(Number(score))) {
    throw errorResponder(errorTypes.VALIDATION, 'Score must be a valid number');
  }

  if (Number(score) < 1 || Number(score) > 5) {
    throw errorResponder(errorTypes.VALIDATION, 'Score must be between 1 and 5');
  }
}

async function validateRatingRelations(orderId, userId, driverId) {
  if (!mongoose.isValidObjectId(orderId)) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Invalid order id');
  }

  if (!mongoose.isValidObjectId(userId)) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Invalid user id');
  }

  if (!mongoose.isValidObjectId(driverId)) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Invalid driver id');
  }

  const [order, user, driver] = await Promise.all([
    ordersService.getOrder(orderId),
    usersService.getUser(userId),
    driversService.getDriver(driverId),
  ]);

  if (!order) {
    throw errorResponder(errorTypes.NOT_FOUND, 'Order not found');
  }

  if (!user) {
    throw errorResponder(errorTypes.NOT_FOUND, 'User not found');
  }

  if (!driver) {
    throw errorResponder(errorTypes.NOT_FOUND, 'Driver not found');
  }

  const orderUserId = getObjectIdValue(order.user);
  const orderDriverId = getObjectIdValue(order.driver);

  if (order.status !== 'completed') {
    throw errorResponder(
      errorTypes.VALIDATION,
      'Rating can only be created for completed orders'
    );
  }

  if (!orderDriverId) {
    throw errorResponder(
      errorTypes.VALIDATION,
      'Order does not have a driver assigned'
    );
  }

  if (orderDriverId !== driverId) {
    throw errorResponder(
      errorTypes.VALIDATION,
      'Driver does not match the selected order'
    );
  }

  return order;
}

async function getRatings(request, response, next) {
  try {
    const ratings = await ratingsService.getRatings();

    return response.status(200).json(ratings);
  } catch (error) {
    return next(error);
  }
}

async function getRating(request, response, next) {
  try {
    validateRatingId(request.params.id);

    const rating = await ratingsService.getRating(request.params.id);

    if (!rating) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Rating not found');
    }

    return response.status(200).json(rating);
  } catch (error) {
    return next(error);
  }
}

async function createRating(request, response, next) {
  try {
    const { order, user, driver, score, comment = '' } = request.body;

    validateRatingPayload(order, user, driver, score);
    await validateRatingRelations(order, user, driver);

    const existingRating = await ratingsService.getRatingByOrder(order);

    if (existingRating) {
      throw errorResponder(
        errorTypes.DB_DUPLICATE_CONFLICT,
        'Rating for this order already exists'
      );
    }

    const rating = await ratingsService.createRating(
      order,
      user,
      driver,
      Number(score),
      comment
    );

    return response.status(201).json(rating);
  } catch (error) {
    return next(error);
  }
}

async function updateRating(request, response, next) {
  try {
    validateRatingId(request.params.id);

    const existingRating = await ratingsService.getRating(request.params.id);

    if (!existingRating) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Rating not found');
    }

    const order = request.body.order ?? getObjectIdValue(existingRating.order);
    const user = request.body.user ?? getObjectIdValue(existingRating.user);
    const driver = request.body.driver ?? getObjectIdValue(existingRating.driver);
    const score = request.body.score ?? existingRating.score;
    const comment = request.body.comment ?? existingRating.comment;

    validateRatingPayload(order, user, driver, score);
    await validateRatingRelations(order, user, driver);

    const ratingOwner = await ratingsService.getRatingByOrder(order);

    if (ratingOwner && ratingOwner.id !== request.params.id) {
      throw errorResponder(
        errorTypes.DB_DUPLICATE_CONFLICT,
        'Rating for this order already exists'
      );
    }

    const success = await ratingsService.updateRating(
      request.params.id,
      order,
      user,
      driver,
      Number(score),
      comment
    );

    if (!success) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Failed to update rating');
    }

    return response.status(200).json({
      message: 'Rating updated successfully',
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteRating(request, response, next) {
  try {
    validateRatingId(request.params.id);

    const existingRating = await ratingsService.getRating(request.params.id);

    if (!existingRating) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Rating not found');
    }

    const success = await ratingsService.deleteRating(request.params.id);

    if (!success) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Failed to delete rating');
    }

    return response.status(200).json({
      message: 'Rating deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getRatings,
  getRating,
  createRating,
  updateRating,
  deleteRating,
};
