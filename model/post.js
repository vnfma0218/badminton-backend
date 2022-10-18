const mongoose = require('mongoose');
const moment = require('moment');
const postSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  created_at: {
    type: Date,
    default: moment().format('YYYY-MM-DD hh:mm:ss'),
  },
});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
