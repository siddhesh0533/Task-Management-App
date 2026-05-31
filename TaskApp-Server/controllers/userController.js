const User = require('../models/User');

// @desc    Get all users (manager: for assign dropdown)
// @route   GET /api/users
// @access  Private (manager only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' }).select('name email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    createdAt: req.user.createdAt,
  });
};

module.exports = { getUsers, getMe };
