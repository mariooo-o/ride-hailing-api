const ordersRepository = require('./orders-repository');

async function getOrders() {
  return ordersRepository.getOrders();
}

async function getOrder(id) {
  return ordersRepository.getOrder(id);
}

async function createOrder(
  user,
  driver,
  pickupAddress,
  destinationAddress,
  price,
  status
) {
  return ordersRepository.createOrder(
    user,
    driver,
    pickupAddress,
    destinationAddress,
    price,
    status
  );
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
  return ordersRepository.updateOrder(
    id,
    user,
    driver,
    pickupAddress,
    destinationAddress,
    price,
    status
  );
}

async function deleteOrder(id) {
  return ordersRepository.deleteOrder(id);
}

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};