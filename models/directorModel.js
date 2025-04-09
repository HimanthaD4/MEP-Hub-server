import mongoose from 'mongoose';

const directorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Director name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
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
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    enum: [
      'Managing Director',
      'Technical Director',
      'Finance Director',
      'Operations Director',
      'Commercial Director',
      'Other'
    ]
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  qualifications: {
    type: [String],
    required: [true, 'At least one qualification is required'],
    enum: [
      'BSc',
      'MSc',
      'PhD',
      'MBA',
      'Chartered Engineer',
      'Professional Engineer',
      'Other'
    ]
  },
  projectsManaged: [{
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true
    },
    value: {
      type: Number,
      required: [true, 'Project value is required'],
      min: [0, 'Project value cannot be negative']
    },
    completionYear: {
      type: Number,
      required: [true, 'Completion year is required'],
      min: [1900, 'Invalid year'],
      max: [new Date().getFullYear(), 'Year cannot be in the future']
    }
  }],
  areasOfExpertise: {
    type: [String],
    required: [true, 'At least one area of expertise is required'],
    enum: [
      'Construction Management',
      'Cost Control',
      'Contract Administration',
      'Project Planning',
      'Risk Management',
      'Health & Safety',
      'Quality Assurance',
      'Stakeholder Management'
    ]
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  visible: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

directorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Director', directorSchema);