module.exports = (db) =>
  db.model(
    'Ratings',
    db.Schema({
      order: {
        type: db.Schema.Types.ObjectId,
        ref: 'Orders',
        required: true,
      },
      user: {
        type: db.Schema.Types.ObjectId,
        ref: 'ratings',
        required: true,
      },
      driver: {
        type: db.Schema.Types.ObjectId,
        ref: 'Drivers',
        required: true,
      },
      score: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        default: '',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    })
  );