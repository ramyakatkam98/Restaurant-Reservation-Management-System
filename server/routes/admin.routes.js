const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Get all reservations
router.get('/reservations', auth, role(['admin']), async (req, res) => {
  try {
    const { date } = req.query;
    let query = Reservation.find();
    
    if (date) {
      query = query.where({ date });
    }
    
    const reservations = await query
      .populate('userId', '-password')
      .populate('tableId')
      .sort({ date: -1, timeSlot: 1 });
    
    console.log(`Admin: Found ${reservations.length} reservations`);
    res.json(reservations);
  } catch (err) {
    console.error('Get reservations error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update reservation status
router.put('/reservations/:id', auth, role(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', '-password').populate('tableId');
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json(reservation);
  } catch (err) {
    console.error('Update reservation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tables
router.get('/tables', auth, role(['admin']), async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (err) {
    console.error('Get tables error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create table
router.post('/tables', auth, role(['admin']), async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    
    // Validation
    if (tableNumber === undefined || tableNumber === null || capacity === undefined || capacity === null) {
      return res.status(400).json({ message: 'Table number and capacity are required' });
    }

    const tableNum = parseInt(tableNumber);
    const tableCapacity = parseInt(capacity);

    if (isNaN(tableNum) || tableNum < 1 || !Number.isInteger(tableNum)) {
      return res.status(400).json({ message: 'Table number must be a positive integer' });
    }

    if (isNaN(tableCapacity) || tableCapacity < 1 || tableCapacity > 50 || !Number.isInteger(tableCapacity)) {
      return res.status(400).json({ message: 'Table capacity must be a positive integer between 1 and 50' });
    }
    
    const table = new Table({ tableNumber: tableNum, capacity: tableCapacity });
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    console.error('Create table error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Table number already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error: ' + Object.values(err.errors).map(e => e.message).join(', ') 
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update table
router.put('/tables/:id', auth, role(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity } = req.body;
    
    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    const updateData = {};
    
    if (tableNumber !== undefined && tableNumber !== null) {
      const tableNum = parseInt(tableNumber);
      if (isNaN(tableNum) || tableNum < 1 || !Number.isInteger(tableNum)) {
        return res.status(400).json({ message: 'Table number must be a positive integer' });
      }
      updateData.tableNumber = tableNum;
    }
    
    if (capacity !== undefined && capacity !== null) {
      const tableCapacity = parseInt(capacity);
      if (isNaN(tableCapacity) || tableCapacity < 1 || tableCapacity > 50 || !Number.isInteger(tableCapacity)) {
        return res.status(400).json({ message: 'Table capacity must be a positive integer between 1 and 50' });
      }
      updateData.capacity = tableCapacity;
    }

    // Check if updating capacity would affect existing active reservations
    if (updateData.capacity && updateData.capacity < table.capacity) {
      const activeReservations = await Reservation.find({
        tableId: id,
        status: 'ACTIVE',
        guests: { $gt: updateData.capacity }
      });

      if (activeReservations.length > 0) {
        return res.status(400).json({ 
          message: `Cannot reduce capacity. There are ${activeReservations.length} active reservation(s) with more guests than the new capacity.` 
        });
      }
    }
    
    Object.assign(table, updateData);
    await table.save();
    
    res.json(table);
  } catch (err) {
    console.error('Update table error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Table number already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error: ' + Object.values(err.errors).map(e => e.message).join(', ') 
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete table
router.delete('/tables/:id', auth, role(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if table has active reservations
    const activeReservations = await Reservation.find({
      tableId: id,
      status: 'ACTIVE'
    });
    
    if (activeReservations.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete table with active reservations' 
      });
    }
    
    const table = await Table.findByIdAndDelete(id);
    
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('Delete table error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
