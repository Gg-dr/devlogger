import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  techStack: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'paused'],
    default: 'planning',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  estimatedHours: {
    type: Number,
    default: 0,
  },
  actualHours: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);