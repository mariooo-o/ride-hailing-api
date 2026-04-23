const { Users } = require('../../../models');

async function getUsers() {
  return Users.find({});
}

async function getUser(id) {
  return Users.findById(id);
}

async function getUserByEmail(email) {
  return Users.findOne({ email });
}

async function createUser(fullName, email, phoneNumber) {
  return Users.create({fullName, email, phoneNumber,});
}

async function updateUser(id, fullName, email, phoneNumber) {
  const result = await Users.updateOne({ _id: id }, {$set: {fullName, email, phoneNumber,},}
  );
  return result.matchedCount > 0;
}

async function deleteUser(id) {
  const result = await Users.deleteOne({ _id: id });
  return result.deletedCount > 0;
}

module.exports = {
  getUsers,
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
