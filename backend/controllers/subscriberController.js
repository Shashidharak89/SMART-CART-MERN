const Subscriber = require('../models/Subscriber');

// @desc    Subscribe a user email to newsletter (Create)
// @route   POST /api/subscribers
// @access  Public / Admin
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

// @desc    Get all subscribers (Read)
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

// @desc    Update a subscriber email (Update)
// @route   PUT /api/subscribers/:id
// @access  Public / Admin
const updateSubscriber = async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if another subscriber has this email
    const existing = await Subscriber.findOne({ email: cleanEmail, _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(400).json({ message: 'Another subscriber with this email already exists' });
    }

    subscriber.email = cleanEmail;
    const updated = await subscriber.save();

    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Another subscriber with this email already exists' });
    }
    console.error('Error updating subscriber:', error);
    res.status(500).json({ message: error.message || 'Server error updating subscriber' });
  }
};

// @desc    Delete a subscriber (Delete)
// @route   DELETE /api/subscribers/:id
// @access  Public / Admin
const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber removed successfully' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ message: 'Server error deleting subscriber' });
  }
};

module.exports = {
  subscribeUser,
  getSubscribers,
  updateSubscriber,
  deleteSubscriber,
};
