const mongoose = require('mongoose');

const ordersService = require('./orders-service');
const usersService = require('../users/users-service');
const driversService = require('../drivers/drivers-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

const allowedOrderStatuses = [
  'pending',
  'accepted',
  'ongoing',
  'completed',
  'cancelled',
];

function validateOrderId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Invalid order id');
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

function validateOrderStatus(status) {
  if (!allowedOrderStatuses.includes(status)) {
    throw errorResponder(
      errorTypes.VALIDATION,
      'Status must be one of: pending, accepted, ongoing, completed, cancelled'
    );
  }
}

function validateOrderPayload(
  user,
  driver,
  pickupAddress,
  destinationAddress,
  price,
  status
) {
  if (!user) {
    throw errorResponder(errorTypes.VALIDATION, 'User is required');
  }

  if (!pickupAddress) {
    throw errorResponder(errorTypes.VALIDATION, 'Pickup address is required');
  }

  if (!destinationAddress) {
    throw errorResponder(errorTypes.VALIDATION, 'Destination address is required');
  }

  if (price === undefined || price === null || Number.isNaN(Number(price))) {
    throw errorResponder(errorTypes.VALIDATION, 'Price must be a valid number');
  }

  if (Number(price) <= 0) {
    throw errorResponder(errorTypes.VALIDATION, 'Price must be greater than 0');
  }

  validateOrderStatus(status);

  if (!driver && ['accepted', 'ongoing', 'completed'].includes(status)) {
    throw errorResponder(
      errorTypes.VALIDATION,
      'Driver is required when status is accepted, ongoing, or completed'
    );
  }
}

async function validateOrderRelations(userId, driverId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Invalid user id');
  }

  const user = await usersService.getUser(userId);

  if (!user) {
    throw errorResponder(errorTypes.NOT_FOUND, 'User not found');
  }

  if (driverId !== null) {
    if (!mongoose.isValidObjectId(driverId)) {
      throw errorResponder(errorTypes.BAD_REQUEST, 'Invalid driver id');
    }

    const driver = await driversService.getDriver(driverId);

    if (!driver) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Driver not found');
    }
  }
}

async function getOrders(request, response, next) {
  try {
    const orders = await ordersService.getOrders();

    return response.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
}

async function getOrder(request, response, next) {
  try {
    validateOrderId(request.params.id);

    const order = await ordersService.getOrder(request.params.id);

    if (!order) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Order not found');
    }

    return response.status(200).json(order);
  } catch (error) {
    return next(error);
  }
}

async function createOrder(request, response, next) {
  try {
    const {
      user,
      driver = null,
      pickupAddress,
      destinationAddress,
      price,
      status = 'pending',
    } = request.body;

    validateOrderPayload(
      user,
      driver,
      pickupAddress,
      destinationAddress,
      price,
      status
    );

    await validateOrderRelations(user, driver);

    const order = await ordersService.createOrder(
      user,
      driver,
      pickupAddress,
      destinationAddress,
      Number(price),
      status
    );

    return response.status(201).json(order);
  } catch (error) {
    return next(error);
  }
}

async function updateOrder(request, response, next) {
  try {
    validateOrderId(request.params.id);

    const existingOrder = await ordersService.getOrder(request.params.id);

    if (!existingOrder) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Order not found');
    }

    const user = request.body.user ?? getObjectIdValue(existingOrder.user);
    const driver =
      request.body.driver !== undefined
        ? request.body.driver
        : getObjectIdValue(existingOrder.driver);

    const pickupAddress =
      request.body.pickupAddress ?? existingOrder.pickupAddress;

    const destinationAddress =
      request.body.destinationAddress ?? existingOrder.destinationAddress;

    const price = request.body.price ?? existingOrder.price;
    const status = request.body.status ?? existingOrder.status;

    validateOrderPayload(
      user,
      driver,
      pickupAddress,
      destinationAddress,
      price,
      status
    );

    await validateOrderRelations(user, driver);

    const success = await ordersService.updateOrder(
      request.params.id,
      user,
      driver,
      pickupAddress,
      destinationAddress,
      Number(price),
      status
    );

    if (!success) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Failed to update order');
    }

    return response.status(200).json({
      message: 'Order updated successfully',
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteOrder(request, response, next) {
  try {
    validateOrderId(request.params.id);

    const existingOrder = await ordersService.getOrder(request.params.id);

    if (!existingOrder) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Order not found');
    }

    const success = await ordersService.deleteOrder(request.params.id);

    if (!success) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Failed to delete order');
    }

    return response.status(200).json({
      message: 'Order deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};