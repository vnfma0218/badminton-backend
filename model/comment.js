const mongoose = require('mongoose');
const moment = require('moment');
const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 300,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },

  created_at: {
    type: Date,
    default: moment().format('YYYY-MM-DD hh:mm:ss'),
  },
});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
