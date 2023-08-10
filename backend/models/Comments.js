const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide a comment'],
    minlength: 1,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);
