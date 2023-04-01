const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const Song = mongoose.model('Song', songSchema,'song');

module.exports = Song;