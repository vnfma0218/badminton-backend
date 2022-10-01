const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  refreshToken: String,
});
const User = mongoose.model('User', userSchema);
module.exports = User;
