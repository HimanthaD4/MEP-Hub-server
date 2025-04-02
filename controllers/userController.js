import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  const updatedUser = await user.save();
  res.json({ 
    _id: updatedUser._id, 
    username: updatedUser.username, 
    email: updatedUser.email 
  });
});

export { getUserProfile, updateUser };