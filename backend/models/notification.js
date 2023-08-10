const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  message: { type: String },
  position: { type: String , required:true},
  electionId: {  type: mongoose.Schema.Types.ObjectId, ref: 'elections',required: true,},
  accepted: { type: Boolean, default: false }, // Whether the user accepted the notification or not
  answered: { type: Boolean, default: false }, // Whether the user accepted the notification or not
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
