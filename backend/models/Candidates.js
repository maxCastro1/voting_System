const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  // Reference to the User collection using userId
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    minlength: 6,
  },
  Department: {
    type: String,
  },
  age: {
    type: Number,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      vote_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'votes',
        required: true,
      },
      election_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'elections',
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Candidate', CandidateSchema);
