const ratingsRepository = require('./ratings-repository');

async function getRatings() {
  return ratingsRepository.getRatings();
}

async function getRating(id) {
  return ratingsRepository.getRating(id);
}

async function getRatingByOrder(order) {
  return ratingsRepository.getRatingByOrder(order);
}

async function createRating(order, user, driver, score, comment) {
  return ratingsRepository.createRating(order, user, driver, score, comment);
}

async function updateRating(id, order, user, driver, score, comment) {
  return ratingsRepository.updateRating(id, order, user, driver, score, comment);
}

async function deleteRating(id) {
  return ratingsRepository.deleteRating(id);
}

module.exports = {
  getRatings,
  getRating,
  getRatingByOrder,
  createRating,
  updateRating,
  deleteRating,
};
