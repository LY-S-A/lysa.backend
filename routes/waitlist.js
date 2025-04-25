const express = require('express');
const router = express.Router();
const Waitlist = require('../models/Waitlist');

// GET /api/waitlist - Handle GET requests
router.get('/', (req, res) => {
  res.json({ message: 'Waitlist API is active. Use POST to join the waitlist.' });
});

// POST /api/waitlist - Store Solana address and email
router.post('/', async (req, res) => {
  console.log('POST /api/waitlist body:', req.body); // Debug
  const { solAddress, email } = req.body;

  // Validate input
  if (!solAddress || !email) {
    return res.status(400).json({ error: 'Solana address and email are required' });
  }

  try {
    // Check if the email or Solana address already exists
    const existingEntry = await Waitlist.findOne({ $or: [{ email }, { solAddress }] });
    if (existingEntry) {
      return res.status(400).json({ error: 'Email or Solana address already registered' });
    }

    // Create new waitlist entry
    const waitlistEntry = new Waitlist({ solAddress, email });
    await waitlistEntry.save();

    res.status(201).json({ message: 'Successfully joined the waitlist' });
  } catch (error) {
    console.error('Error saving waitlist entry:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;
