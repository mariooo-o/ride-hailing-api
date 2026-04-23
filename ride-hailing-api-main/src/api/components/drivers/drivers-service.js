const driversRepository = require('./drivers-repository');

async function getDrivers() {
  return driversRepository.getDrivers();
}

async function getDriver(id) {
  return driversRepository.getDriver(id);
}

async function getDriverByEmail(email) {
  return driversRepository.getDriverByEmail(email);
}

async function getDriverByLicenseNumber(licenseNumber) {
  return driversRepository.getDriverByLicenseNumber(licenseNumber);
}

async function createDriver(
  fullName,
  email,
  phoneNumber,
  licenseNumber,
  vehicleType,
  vehicleNumber,
  status
) {
  return driversRepository.createDriver(
    fullName,
    email,
    phoneNumber,
    licenseNumber,
    vehicleType,
    vehicleNumber,
    status
  );
}

async function updateDriver(
  id,
  fullName,
  email,
  phoneNumber,
  licenseNumber,
  vehicleType,
  vehicleNumber,
  status
) {
  return driversRepository.updateDriver(
    id,
    fullName,
    email,
    phoneNumber,
    licenseNumber,
    vehicleType,
    vehicleNumber,
    status
  );
}

async function deleteDriver(id) {
  return driversRepository.deleteDriver(id);
}

module.exports = {
  getDrivers,
  getDriver,
  getDriverByEmail,
  getDriverByLicenseNumber,
  createDriver,
  updateDriver,
  deleteDriver,
};