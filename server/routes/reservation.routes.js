const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Get reservations - admin sees all, user sees own
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const reservations = await Reservation.find().populate('userId', '-password').populate('tableId');
      return res.json(reservations);
    }
    const reservations = await Reservation.find({ userId: req.user._id }).populate('tableId');
    res.json(reservations);
  } catch (err) {
    console.error('Get reservations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's own reservations
router.get('/my', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id })
      .populate('tableId')
      .sort({ date: -1, timeSlot: 1 });
    res.json(reservations);
  } catch (err) {
    console.error('Get my reservations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create reservation
router.post('/', auth, async (req, res) => {
  try {
    const { date, timeSlot, guests } = req.body;

    // Input validation
    if (!date || !timeSlot || guests === undefined || guests === null) {
      return res.status(400).json({ 
        message: 'Date, time slot, and number of guests are required' 
      });
    }

    // Validate guests count
    const guestsNum = parseInt(guests);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 50) {
      return res.status(400).json({ 
        message: 'Number of guests must be between 1 and 50' 
      });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ 
        message: 'Invalid date format. Please use YYYY-MM-DD format' 
      });
    }

    // Validate date is not in the past
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    reservationDate.setHours(0, 0, 0, 0);
    
    if (reservationDate < today) {
      return res.status(400).json({ 
        message: 'Cannot make reservations for past dates' 
      });
    }

    // Validate time slot format
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(timeSlot)) {
      return res.status(400).json({ 
        message: 'Invalid time format. Please use HH:MM format (24-hour)' 
      });
    }

    // Check if any tables exist
    const totalTables = await Table.countDocuments();
    if (totalTables === 0) {
      return res.status(503).json({ 
        message: 'No tables configured. Please contact administrator.' 
      });
    }

    // Find tables that are already booked for the same date and time slot
    // Only consider ACTIVE reservations (CANCELLED and COMPLETED don't block availability)
    const bookedTables = await Reservation.find({
      date,
      timeSlot,
      status: 'ACTIVE'
    }).distinct('tableId');

    // Find available table with capacity >= guests that is not already booked
    const availableTable = await Table.findOne({
      _id: { $nin: bookedTables },
      capacity: { $gte: guestsNum }
    }).sort({ capacity: 1 }); // Get smallest table that fits (first-fit strategy)

    if (!availableTable) {
      // Check if issue is capacity or availability
      const tablesWithCapacity = await Table.countDocuments({ capacity: { $gte: guestsNum } });
      
      if (tablesWithCapacity === 0) {
        return res.status(400).json({ 
          message: `No tables available with capacity for ${guestsNum} guests. Maximum table capacity is insufficient.` 
        });
      }
      
      return res.status(409).json({ 
        message: 'No tables available for the selected date and time. All suitable tables are already reserved.' 
      });
    }

    // Double-check: Verify the table is still available (prevent race conditions)
    const conflictingReservation = await Reservation.findOne({
      tableId: availableTable._id,
      date,
      timeSlot,
      status: 'ACTIVE'
    });

    if (conflictingReservation) {
      return res.status(409).json({ 
        message: 'Table was just reserved by another customer. Please try again.' 
      });
    }

    // Create reservation
    const reservation = new Reservation({
      userId: req.user._id,
      tableId: availableTable._id,
      date,
      timeSlot,
      guests: guestsNum,
      status: 'ACTIVE'
    });

    await reservation.save();
    await reservation.populate('tableId');

    res.status(201).json(reservation);
  } catch (err) {
    console.error('Create reservation error:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error: ' + Object.values(err.errors).map(e => e.message).join(', ') 
      });
    }
    
    res.status(500).json({ message: 'Server error while creating reservation' });
  }
});

// Cancel reservation
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const reservation = await Reservation.findById(id);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Users can only cancel their own reservations, admins can cancel any
    if (req.user.role !== 'admin' && reservation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    reservation.status = 'CANCELLED';
    await reservation.save();

    res.status(204).send();
  } catch (err) {
    console.error('Cancel reservation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
