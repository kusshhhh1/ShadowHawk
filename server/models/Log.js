import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  details: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

logSchema.index({ user: 1, createdAt: -1 });
logSchema.index({ riskScore: -1 });

export default mongoose.model('Log', logSchema);