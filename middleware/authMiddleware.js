import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import dotenv from 'dotenv';

dotenv.config();

const protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log(`❌ User not found with token`);
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    console.log(`✅ Authorized user: ${user.email}`);
    next();
  } catch (error) {
    console.error(`❌ Authorization error: ${error.message}`);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export { protect };
