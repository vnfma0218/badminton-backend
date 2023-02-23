const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
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
  intro: {
    type: String,
    required: false,
    maxlength: 200,
  },
  level: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: false,
  },
  club: [{ type: Schema.Types.ObjectId, ref: 'Club' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  noti: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  refreshToken: String,
});
const User = mongoose.model('User', userSchema);
module.exports = User;
