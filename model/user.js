const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
    trim: true,
    minlength: 8,
    maxlength: 16,
  },
});
const User = mongoose.model('User', userSchema);
module.exports = { User };
