import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  hours: {
    type: Number,
    required: true,
    min: 0.5,
    max: 24,
  },
  description: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  tags: [{
    type: String,
  }],
  mood: {
    type: String,
    enum: ['productive', 'stuck', 'excited', 'tired', 'focused'],
    default: 'productive',
  },
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema);