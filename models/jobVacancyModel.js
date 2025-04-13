import mongoose from 'mongoose';

const jobVacancySchema = new mongoose.Schema({
  // Core Job Information
  positionTitle: {
    type: String,
    required: [true, 'Position title is required'],
    trim: true,
    maxlength: [100, 'Position title cannot exceed 100 characters']
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: [
      'MECHANICAL',
      'ELECTRICAL',
      'BUILDING_SERVICES',
      'DRAFTING',
      'QUANTITY_SURVEYING'
    ]
  },
  jobDescription: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  qualifications: {
    type: [String],
    enum: [
      'Diploma', 'Bachelor', 'Master', 'PhD',
      'Professional Certification', 'Trade Certification', 'None'
    ]
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: [
      'Entry Level', 'Junior', 'Mid-Level', 'Senior', 
      'Lead', 'Manager', 'Director'
    ]
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative']
  },

  // Employment Details
  employmentType: {
    type: String,
    required: [true, 'Employment type is required'],
    enum: [
      'Full-time', 'Part-time', 'Contract', 'Temporary',
      'Internship', 'Freelance'
    ]
  },
  city: {
    type: String,
    required: function() {
      return this.locationType !== 'Remote';
    },
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },

  // Company Information
  company: {
    type: String,
    required: [true, 'Company reference is required']
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },

  // Status and Visibility
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Filled'],
    default: 'Draft'
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

jobVacancySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('JobVacancy', jobVacancySchema);