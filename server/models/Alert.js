import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  details: {
    action: String,
    ip: String,
    riskScore: Number,
    context: String
  }
}, {
  timestamps: true
});

alertSchema.index({ user: 1, createdAt: -1 });
alertSchema.index({ severity: 1, resolved: 1 });

export default mongoose.model('Alert', alertSchema);