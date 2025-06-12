const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema(
  {
    videoUrl: { 
      type: String, 
      required: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    notepadText: { 
      type: String, 
      default: '' 
    }
  }, 
  { 
    timestamps: true 
  }
);

ContentSchema.index({ videoUrl: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Content', ContentSchema);
