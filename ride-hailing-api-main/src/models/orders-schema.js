module.exports = (db) =>
  db.model(
    'Orders',
    db.Schema({
      pickupAddress: String,
      destinationAddress: String,
      price: Number,
      phoneNumber: String,
      user: {
        type: db.Schema.Types.ObjectId,
        ref: 'orders',
        required: true,
      },
      driver: {
        type: db.Schema.Types.ObjectId,
        ref: 'Drivers',
        default: null,
      },
      status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Ongoing', 'Completed', 'cancelled'],
        default: 'Pending',
      },
      orderedAt: {
        type: Date,
        default: Date.now,
      },
    })
  );