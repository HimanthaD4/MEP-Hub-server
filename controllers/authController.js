import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const registerUser  = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    res.status(400);
    throw new Error('User  already exists');
  }
  const user = await User.create({ username, email, password });
  const token = generateToken(user._id);
  res.status(201).json({ _id: user._id, username: user.username, email: user.email, token });
});

const loginUser  = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    const token = generateToken(user._id);
    res.json({ _id: user._id, username: user.username, email: user.email, token });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export { registerUser , loginUser  };