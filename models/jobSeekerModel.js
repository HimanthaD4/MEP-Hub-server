import mongoose from 'mongoose';

const jobSeekerSchema = new mongoose.Schema({
  // Basic Information
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
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
    maxlength: [20, 'Contact number cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },

  // Professional Information
  professionalType: {
    type: String,
    required: [true, 'Professional type is required'],
    enum: [
      'Chartered Engineer',
      'Project Manager',
      'Engineer',
      'Assistant Engineer',
      'Technologist',
      'Technical Officer',
      'Supervisor',
      'Chargehand'
    ]
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  currentlyEmployed: {
    type: Boolean,
    default: false
  },
  currentCompany: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },

  // Education
  highestQualification: {
    type: String,
    enum: [
      'PhD', 'Master', 'Bachelor', 'Diploma',
      'Professional Certification', 'Trade Certification'
    ],
    required: true
  },

  visible: {
    type: Boolean,
    default: true
  },

  // Work History (simplified)
  workHistory: [{
    jobTitle: String,
    company: String,
    duration: String
  }],

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

jobSeekerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('JobSeeker', jobSeekerSchema);