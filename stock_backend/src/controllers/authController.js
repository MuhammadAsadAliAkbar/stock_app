const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, walletBalance: 100000 });
    res.status(201).json({
      success: true,
      data: {
        _id: user._id, name: user.name, email: user.email, role: user.role,
        walletBalance: user.walletBalance, token: generateToken(user._id),
      },
    });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.json({
      success: true,
      data: {
        _id: user._id, name: user.name, email: user.email, role: user.role,
        walletBalance: user.walletBalance, token: generateToken(user._id),
      },
    });
  } catch (e) { next(e); }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};
