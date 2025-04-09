
import jwt from 'jsonwebtoken';
import User from '../models/authModel.js';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`Registration attempt for: ${email}`);
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.error(`[REGISTER FAIL] User already exists: ${email}`);
      return res.status(400).json({ 
        error: 'User exists',
        details: `Email ${email} is already registered`
      });
    }

    const user = await User.create({ name, email, password });
    console.log(`[REGISTER SUCCESS] Created user: ${user.email}`);

    res.cookie('jwt', generateToken(user._id, user.userType), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error(`[REGISTER ERROR] ${error.message}`);
    res.status(500).json({ 
      error: 'Registration failed',
      details: error.message 
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`[LOGIN FAIL] User not found: ${email}`);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        details: 'Email not registered'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.error(`[LOGIN FAIL] Password mismatch for: ${email}`);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        details: 'Incorrect password'
      });
    }

    console.log(`[LOGIN SUCCESS] User authenticated: ${user.email}`);
    res.cookie('jwt', generateToken(user._id, user.userType), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      message: 'Login successful'
    });
  } catch (error) {
    console.error(`[LOGIN ERROR] ${error.message}`);
    res.status(500).json({ 
      error: 'Login failed',
      details: error.message 
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    console.log(`Profile request for: ${req.user._id}`);
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      console.error(`[PROFILE FAIL] User not found: ${req.user._id}`);
      return res.status(404).json({ 
        error: 'Profile not found',
        details: 'User does not exist'
      });
    }

    console.log(`[PROFILE SUCCESS] Retrieved profile: ${user.email}`);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error(`[PROFILE ERROR] ${error.message}`);
    res.status(500).json({ 
      error: 'Profile fetch failed',
      details: error.message 
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    console.log(`Update request for: ${req.user._id}`);
    const user = await User.findById(req.user._id);

    if (!user) {
      console.error(`[UPDATE FAIL] User not found: ${req.user._id}`);
      return res.status(404).json({ 
        error: 'Update failed',
        details: 'User does not exist'
      });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();
    console.log(`[UPDATE SUCCESS] Updated user: ${updatedUser.email}`);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      userType: updatedUser.userType,
      message: 'Profile updated'
    });
  } catch (error) {
    console.error(`[UPDATE ERROR] ${error.message}`);
    res.status(500).json({ 
      error: 'Update failed',
      details: error.message 
    });
  }
};

const logoutUser = (req, res) => {
  console.log(`Logout request for: ${req.user._id}`);
  res.cookie('jwt', '', { 
    httpOnly: true, 
    expires: new Date(0) 
  });
  console.log(`[LOGOUT SUCCESS] User logged out: ${req.user.email}`);
  res.json({ message: 'Logged out successfully' });
};

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      console.error('[AUTH FAIL] No token provided');
      return res.status(401).json({ 
        error: 'Not authorized',
        details: 'No authentication token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.error(`[AUTH FAIL] Invalid user token: ${decoded.id}`);
      return res.status(401).json({ 
        error: 'Not authorized',
        details: 'Invalid user token'
      });
    }

    req.user = user;
    console.log(`[AUTH SUCCESS] Authorized user: ${user.email}`);
    next();
  } catch (error) {
    console.error(`[AUTH ERROR] ${error.message}`);
    res.status(401).json({ 
      error: 'Not authorized',
      details: error.message 
    });
  }
};

const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.json({ isAuthenticated: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.json({ isAuthenticated: false });
    }

    res.json({
      isAuthenticated: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    res.json({ isAuthenticated: false });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  protect,
  checkAuth
};