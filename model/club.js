const mongoose = require('mongoose');
const { Schema } = mongoose;

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const clubSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  address: {
    jibun: String,
    loadAddress: String,
  },

  location: {
    type: pointSchema,
  },
});
clubSchema.index({ location: '2dsphere' });

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
