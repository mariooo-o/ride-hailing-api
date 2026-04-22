const { Drivers } = require('../../../models');

async function getDrivers() {
  return Drivers.find({});
}

async function getDriver(id) {
  return Drivers.findById(id);
}

async function getDriverByEmail(email) {
  return Drivers.findOne({ email });
}

async function getDriverByLicenseNumber(licenseNumber) {
  return Drivers.findOne({ licenseNumber });
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
  return Drivers.create({
    fullName,
    email,
    phoneNumber,
    licenseNumber,
    vehicleType,
    vehicleNumber,
    status,
  });
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
  const result = await Drivers.updateOne(
    { _id: id },
    {
      $set: {
        fullName,
        email,
        phoneNumber,
        licenseNumber,
        vehicleType,
        vehicleNumber,
        status,
      },
    }
  );
  return result.matchedCount > 0;
}

async function deleteDriver(id) {
  const result = await Drivers.deleteOne({ _id: id });
  return result.deletedCount > 0;
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