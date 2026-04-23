const mongoose = require('mongoose');
const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

function validateUserId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Invalid user id');
  }
}

function validateUserPayload(fullName, email, phoneNumber) {
  if (!fullName) {
    throw errorResponder(errorTypes.VALIDATION, 'Full name is required');
  }

  if (!email) {
    throw errorResponder(errorTypes.VALIDATION, 'Email is required');
  }

  if (!phoneNumber) {
    throw errorResponder(errorTypes.VALIDATION, 'Phone number is required');
  }
}

async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();

    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

async function getUser(request, response, next) {
  try {
    validateUserId(request.params.id);

    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.NOT_FOUND, 'User not found');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

async function createUser(request, response, next) {
  try {
    const { fullName, email, phoneNumber } = request.body;

    validateUserPayload(fullName, email, phoneNumber);

    if (await usersService.emailExists(email)) {
      throw errorResponder(errorTypes.EMAIL_ALREADY_TAKEN, 'Email already exists');
    }

    const user = await usersService.createUser(fullName, email, phoneNumber);

    return response.status(201).json(user);
  } catch (error) {
    return next(error);
  }
}

async function updateUser(request, response, next) {
  try {
    validateUserId(request.params.id);

    const existingUser = await usersService.getUser(request.params.id);

    if (!existingUser) {
      throw errorResponder(errorTypes.NOT_FOUND, 'User not found');
    }

    const fullName = request.body.fullName ?? existingUser.fullName;
    const email = request.body.email ?? existingUser.email;
    const phoneNumber = request.body.phoneNumber ?? existingUser.phoneNumber;

    validateUserPayload(fullName, email, phoneNumber);

    if (email !== existingUser.email && (await usersService.emailExists(email))) {
      throw errorResponder(errorTypes.EMAIL_ALREADY_TAKEN, 'Email already exists');
    }

    const success = await usersService.updateUser(
      request.params.id,
      fullName,
      email,
      phoneNumber
    );

    if (!success) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Failed to update user');
    }

    return response.status(200).json({
      message: 'User updated successfully',
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(request, response, next) {
  try {
    validateUserId(request.params.id);

    const existingUser = await usersService.getUser(request.params.id);

    if (!existingUser) {
      throw errorResponder(errorTypes.NOT_FOUND, 'User not found');
    }

    const success = await usersService.deleteUser(request.params.id);

    if (!success) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Failed to delete user');
    }

    return response.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};