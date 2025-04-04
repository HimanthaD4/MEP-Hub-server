import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Project amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    required: [true, 'Project status is required'],
    enum: {
      values: ['pending', 'active', 'completed'],
      message: 'Status must be either pending, active, or completed'
    },
    default: 'pending'
  },
  visible: {
    type: Boolean,
    default: true
  },
  contractor: {
    type: String,
    required: [true, 'Contractor name is required'],
    trim: true,
    maxlength: [100, 'Contractor name cannot exceed 100 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Project', projectSchema);