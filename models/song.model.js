const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  }
});

const Song = mongoose.model("Song", songSchema, "song");

module.exports = Song;
