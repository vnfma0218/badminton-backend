const mongoose = require('mongoose');
const moment = require('moment');
const notificationSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: moment().format('YYYY-MM-DD hh:mm:ss'),
  },
});
const Notification = mongoose.model('Notification', notificationSchema);
