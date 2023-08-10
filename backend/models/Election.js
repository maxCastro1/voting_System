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
    required: [true, 'Please provide description'],
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
  typeAdministrative: {
    type:Boolean,
    default:false,
  },
  finished: {
   type:Boolean,
   default:false,
  },
  failed: {
   type:Boolean,
   default:false,
  },
  pending: [
    {
      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
      }, answer : {
        type:Boolean,
        default: false,
      }
    }
  ],
  candidates: [
    {
      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
      },
    }
  ],
  winners: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
})

module.exports = mongoose.model('Election', electionSchema)