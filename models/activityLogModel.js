// models/activityLogModel.js
import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 
      'DELETE', 'APPROVE', 'REJECT', 'SYSTEM'
    ]
  },
  entityType: {
    type: String,
    enum: [
      'USER', 'AGENT', 'CONSULTANT', 'CONTRACTOR',
      'JOB_SEEKER', 'JOB', 'PROJECT', 'LECTURER'
    ]
  },
  entityId: mongoose.Schema.Types.ObjectId,
  description: String,
  ipAddress: String,
  userAgent: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.model('ActivityLog', activityLogSchema);