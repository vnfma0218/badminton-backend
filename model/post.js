const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
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
});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
