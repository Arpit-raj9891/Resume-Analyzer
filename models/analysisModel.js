const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    extractedSkills: [String],
    suggestedRoles: [String],
    score: Number,
    feedback: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Analysis', analysisSchema);
