const mongoose = require('mongoose')

const electionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  description: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 3,
  },
  start_time: {
    type: Date,
    required: [true, 'Please provide start time'],
    default: Date.now,
  },
  end_time: {
    type: Date,
    required: [true, 'Please provide end time'],
  },
  candidates: [
    {
      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
      },
    }
  ]
})

module.exports = mongoose.model('Election', electionSchema)