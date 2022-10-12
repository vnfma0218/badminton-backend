const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 300,
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
});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
