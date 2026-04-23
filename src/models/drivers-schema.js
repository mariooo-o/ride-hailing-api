module.exports = (db) =>
  db.model(
    'Drivers',
    db.Schema({
      email: String,
      password: String,
      fullName: String,
      phoneNumber: String,
      vehicleType: String,
      vehicleNumber: String,
      status: {
        type: String,
        enum: ['available', 'busy', 'offline'],
        default: 'available',
      },
    })
  );