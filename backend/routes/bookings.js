const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (date) query.appointmentDate = { $gte: new Date(date) };
    
    const bookings = await Booking.find(query).sort({ appointmentDate: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ 
      message: '✅ Booking created successfully!', 
      bookingId: booking._id 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: '✅ Booking updated!', booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
