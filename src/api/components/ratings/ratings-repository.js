const { Ratings } = require('../../../models');

async function getRatings() {
  return Ratings.find({}).populate('order').populate('user').populate('driver');
}

async function getRating(id) {
  return Ratings.findById(id).populate('order').populate('user').populate('driver');
}

async function getRatingByOrder(order) {
  return Ratings.findOne({ order });
}

async function createRating(order, user, driver, score, comment) {
  return Ratings.create({
    order,
    user,
    driver,
    score,
    comment,
  });
}

async function updateRating(id, order, user, driver, score, comment) {
  const result = await Ratings.updateOne(
    { _id: id },
    {
      $set: {
        order,
        user,
        driver,
        score,
        comment,
      },
    }
  );

  return result.matchedCount > 0;
}

async function deleteRating(id) {
  const result = await Ratings.deleteOne({ _id: id });

  return result.deletedCount > 0;
}

module.exports = {
  getRatings,
  getRating,
  getRatingByOrder,
  createRating,
  updateRating,
  deleteRating,
};
