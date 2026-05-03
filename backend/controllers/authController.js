const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const jwtToken = jwt.sign({ id: user._id, username: user.username, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ id: user._id, jwtToken, username: user.username, roles: user.roles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
