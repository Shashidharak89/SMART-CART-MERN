const Subscriber = require('../models/Subscriber');

// @desc    Subscribe a user email to newsletter
// @route   POST /api/subscribers
// @access  Public
const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check for duplicate subscriber
    const existing = await Subscriber.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        status: 'exists',
        message: 'This email is already subscribed to our newsletter!',
      });
    }

    const subscriber = await Subscriber.create({ email: cleanEmail });

    res.status(201).json({
      status: 'success',
      message: 'Successfully subscribed to the newsletter!',
      subscriber: {
        id: subscriber._id,
        email: subscriber.email,
        createdAt: subscriber.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'exists',
        message: 'This email is already subscribed to our newsletter!',
      });
    }
    console.error('Error subscribing email:', error);
    res.status(500).json({ message: error.message || 'Server error during subscription' });
  }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Public / Admin
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Server error fetching subscribers' });
  }
};

module.exports = {
  subscribeUser,
  getSubscribers,
};
