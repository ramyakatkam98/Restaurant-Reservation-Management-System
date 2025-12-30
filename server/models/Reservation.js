
const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Validate date format YYYY-MM-DD
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'Date must be in YYYY-MM-DD format'
    }
  },
  timeSlot: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Validate time format HH:MM
        return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Time slot must be in HH:MM format (24-hour)'
    }
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'CANCELLED', 'COMPLETED'],
    default: 'ACTIVE'
  }
}, { timestamps: true });

module.exports = mongoose.model("Reservation", ReservationSchema);
