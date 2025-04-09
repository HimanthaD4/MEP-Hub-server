import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  userType: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  }
}, { 
  timestamps: true 
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error(`[MODEL ERROR] Password hashing failed: ${error.message}`);
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error(`[MODEL ERROR] Password comparison failed: ${error.message}`);
    throw error;
  }
};

const User = mongoose.model('User', userSchema);
export default User;