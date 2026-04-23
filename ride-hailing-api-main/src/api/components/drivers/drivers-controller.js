const mongoose = require('mongoose');

const driversService = require('./drivers-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

const allowedDriverStatuses = ['available', 'busy', 'offline'];

function validateDriverId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw errorResponder(errorTypes.BAD_REQUEST, 'Invalid driver id');
  }
}

function validateDriverStatus(status) {
  if (!allowedDriverStatuses.includes(status)) {
    throw errorResponder(
      errorTypes.VALIDATION,
      'Status must be one of: available, busy, offline'
    );
  }
}

function validateDriverPayload(
  fullName,
  email,
  phoneNumber,
  licenseNumber,
  vehicleType,
  vehicleNumber
) {
  if (!fullName) {
    throw errorResponder(errorTypes.VALIDATION, 'Full name is required');
  }

  if (!email) {
    throw errorResponder(errorTypes.VALIDATION, 'Email is required');
  }

  if (!phoneNumber) {
    throw errorResponder(errorTypes.VALIDATION, 'Phone number is required');
  }

  if (!licenseNumber) {
    throw errorResponder(errorTypes.VALIDATION, 'License number is required');
  }

  if (!vehicleType) {
    throw errorResponder(errorTypes.VALIDATION, 'Vehicle type is required');
  }
  if (!vehicleNumber) {
    throw errorResponder(errorTypes.VALIDATION, 'Vehicle number is required');
  }
}

async function getDrivers(request, response, next) {
  try {
    const drivers = await driversService.getDrivers();

    return response.status(200).json(drivers);
  } catch (error) {
    return next(error);
  }
}

async function getDriver(request, response, next) {
  try {
    validateDriverId(request.params.id);

    const driver = await driversService.getDriver(request.params.id);

    if (!driver) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Driver not found');
    }

    return response.status(200).json(driver);
  } catch (error) {
    return next(error);
  }
}

async function createDriver(request, response, next) {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      licenseNumber,
      vehicleType,
      vehicleNumber,
      status = 'available',
    } = request.body;

    validateDriverPayload(
      fullName,
      email,
      phoneNumber,
      licenseNumber,
      vehicleType,
      vehicleNumber
    );
    validateDriverStatus(status);

    const existingDriverByEmail = await driversService.getDriverByEmail(email);

    if (existingDriverByEmail) {
      throw errorResponder(errorTypes.EMAIL_ALREADY_TAKEN, 'Email already exists');
    }

    const existingDriverByLicense = await driversService.getDriverByLicenseNumber(
      licenseNumber
    );

    if (existingDriverByLicense) {
      throw errorResponder(
        errorTypes.DB_DUPLICATE_CONFLICT,
        'License number already exists'
      );
    }

    const driver = await driversService.createDriver(
      fullName,
      email,
      phoneNumber,
      licenseNumber,
      vehicleType,
      vehicleNumber,
      status
    );

    return response.status(201).json(driver);
  } catch (error) {
    return next(error);
  }
}

async function updateDriver(request, response, next) {
  try {
    validateDriverId(request.params.id);

    const existingDriver = await driversService.getDriver(request.params.id);

    if (!existingDriver) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Driver not found');
    }

    const fullName = request.body.fullName ?? existingDriver.fullName;
    const email = request.body.email ?? existingDriver.email;
    const phoneNumber = request.body.phoneNumber ?? existingDriver.phoneNumber;
    const licenseNumber =
      request.body.licenseNumber ?? existingDriver.licenseNumber;
    const vehicleType = request.body.vehicleType ?? existingDriver.vehicleType;
    const vehicleNumber =
      request.body.vehicleNumber ?? existingDriver.vehicleNumber;
    const status = request.body.status ?? existingDriver.status;

    validateDriverPayload(
      fullName,
      email,
      phoneNumber,
      licenseNumber,
      vehicleType,
      vehicleNumber
    );
    validateDriverStatus(status);

    const emailOwner = await driversService.getDriverByEmail(email);

    if (emailOwner && emailOwner.id !== request.params.id) {
      throw errorResponder(errorTypes.EMAIL_ALREADY_TAKEN, 'Email already exists');
    }

    const licenseOwner = await driversService.getDriverByLicenseNumber(
      licenseNumber
    );

    if (licenseOwner && licenseOwner.id !== request.params.id) {
      throw errorResponder(
        errorTypes.DB_DUPLICATE_CONFLICT,
        'License number already exists'
      );
    }

    const success = await driversService.updateDriver(
      request.params.id,
      fullName,
      email,
      phoneNumber,
      licenseNumber,
      vehicleType,
      vehicleNumber,
      status
    );

    if (!success) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Failed to update driver');
    }

    return response.status(200).json({
      message: 'Driver updated successfully',
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteDriver(request, response, next) {
  try {
    validateDriverId(request.params.id);

    const existingDriver = await driversService.getDriver(request.params.id);

    if (!existingDriver) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Driver not found');
    }

    const success = await driversService.deleteDriver(request.params.id);

    if (!success) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Failed to delete driver');
    }

    return response.status(200).json({
      message: 'Driver deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
};