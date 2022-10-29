const mongoose = require('mongoose');
const moment = require('moment');
const notificationSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },

  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  created_at: {
    type: Date,
    default: moment().format('YYYY-MM-DD hh:mm:ss'),
  },
});
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
