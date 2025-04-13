// lecturerModel.js
import mongoose from 'mongoose';

const lecturerSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  personalEmail: {
    type: String,
    required: [true, 'Personal email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
    maxlength: [20, 'Contact number cannot exceed 20 characters']
  },
  
  // Professional Information
  lecturerType: {
    type: String,
    required: [true, 'Lecturer type is required'],
    enum: [
      'MECHANICAL',
      'ELECTRICAL',
      'BUILDING_SERVICES',
      'DRAFTING',
      'QS'
    ]
  },
  qualifications: {
    type: [String],
    required: [true, 'Qualifications are required'],
    enum: [
      'PhD', 'MSc', 'BEng', 'Diploma', 
      'Professional Certification', 'Trade Certification'
    ]
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  
  // Institutional Information
  institution: {
    type: String,
    required: [true, 'Institution is required'],
    trim: true,
    maxlength: [100, 'Institution name cannot exceed 100 characters']
  },
  institutionalEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Retired', 'Suspended'],
    default: 'Active'
  },
  visible: {
    type: Boolean,
    default: true
  },
  
  // System Fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

lecturerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Lecturer', lecturerSchema);