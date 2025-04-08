import mongoose from 'mongoose';

const consultantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Consultant name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
    maxlength: [20, 'Contact number cannot exceed 20 characters']
  },
  companyEmail: {
    type: String,
    required: [true, 'Company email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  companyWebsite: {
    type: String,
    trim: true,
    match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, 'Please fill a valid website URL']
  },
  companyAddress: {
    type: String,
    required: [true, 'Company address is required'],
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  specialties: {
    type: [String],
    required: [true, 'At least one specialty is required'],
    enum: {
      values: [
        'Air Conditioning systems (Central, Packaged, VRF & Splits)',
        'Mechanical ventilation systems',
        'Water supply & drainage systems',
        'Fire Protection systems',
        'Fire Detection systems',
        'Storm water & rain water harvesting systems',
        'Low Voltage Electrical Systems',
        'Extra low voltages systems - BMS, Data, CCTV, IPTV, AC',
        'Lighting systems',
        'Elevator & escalators',
        'Boilers & steam systems',
        'Swimming pools',
        'LPG distribution',
        'Solar electricity',
        'Compressed air systems',
        'Generators',
        'Structured cabling & IT network',
        'Waste water treatment',
        'Solid waste management',
        'Facade Engineering',
        'Cold rooms'
      ],
      message: 'Invalid specialty selected'
    }
  },
  projects: [{
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    completedYear: {
      type: Number,
      required: [true, 'Completion year is required'],
      min: [1900, 'Invalid year'],
      max: [new Date().getFullYear(), 'Year cannot be in the future']
    }
  }],
  paymentModeDetails: {
    paymentMode: {
      type: String,
      required: [true, 'Payment mode is required'],
      enum: {
        values: ['online', 'cheque', 'cash'],
        message: 'Payment mode must be online, cheque, or cash'
      }
    },
    paymentDate: {
      type: Date,
      required: [true, 'Payment date is required']
    }
  },
  registrationMode: {
    type: String,
    required: [true, 'Registration mode is required'],
    enum: {
      values: ['annual', 'multi-year'],
      message: 'Registration mode must be either annual or multi-year'
    }
  },
  registrationYears: {
    type: Number,
    required: function() {
      return this.registrationMode === 'multi-year';
    },
    min: [2, 'Multi-year registration must be at least 2 years'],
    max: [5, 'Multi-year registration cannot exceed 5 years']
  },
  status: {
    type: String,
    required: [true, 'Consultant status is required'],
    enum: {
      values: ['pending', 'active', 'suspended'],
      message: 'Status must be either pending, active, or suspended'
    },
    default: 'pending'
  },
  visible: {
    type: Boolean,
    default: true
  },
  consultantType: {
    type: String,
    enum: ['MEP', 'Project Management', 'Cost'],
    required: [true, 'Consultant type is required']
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

consultantSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Consultant', consultantSchema);
