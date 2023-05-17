const mongoose = require('mongoose')


const CandidateSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  last_name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    minlength: 6,
  },
  picture: {
    type: String, 
  },
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      vote_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('Candidate', CandidateSchema);