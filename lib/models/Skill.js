import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);