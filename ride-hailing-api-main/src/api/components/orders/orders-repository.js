const { Orders } = require('../../../models');

async function getOrders() {
  return Orders.find({}).populate('user').populate('driver');
}

async function getOrder(id) {
  return Orders.findById(id).populate('user').populate('driver');
}

async function createOrder(
  user,
  driver,
  pickupAddress,
  destinationAddress,
  price,
  status
) {
  return Orders.create({
    user,
    driver,
    pickupAddress,
    destinationAddress,
    price,
    status,
  });
}

async function updateOrder(
  id,
  user,
  driver,
  pickupAddress,
  destinationAddress,
  price,
  status
) {
  const result = await Orders.updateOne(
    { _id: id },
    {
      $set: {
        user,
        driver,
        pickupAddress,
        destinationAddress,
        price,
        status,
      },
    }
  );

  return result.matchedCount > 0;
}

async function deleteOrder(id) {
  const result = await Orders.deleteOne({ _id: id });

  return result.deletedCount > 0;
}

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};