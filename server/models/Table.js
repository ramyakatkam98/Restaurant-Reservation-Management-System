
const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  }
});

// Ensure table number and capacity are positive integers
TableSchema.pre('save', function(next) {
  if (this.tableNumber <= 0 || !Number.isInteger(this.tableNumber)) {
    return next(new Error('Table number must be a positive integer'));
  }
  if (this.capacity <= 0 || !Number.isInteger(this.capacity)) {
    return next(new Error('Table capacity must be a positive integer'));
  }
  next();
});

module.exports = mongoose.model("Table", TableSchema);
