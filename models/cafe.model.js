const mongoose = require("mongoose");

const cafeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    default: 0,
    required: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  menu: [
    {
      name: String,
      price: Number,
      description: String,
    },
  ],
  votes: [
    {
      user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
      vote: { type: Number ,default :0},
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  image: {
    data: { type: Buffer, required: false },
    contentType: { type: String, required: false }
  }
});

const Cafe = mongoose.model("Cafe", cafeSchema, "Cafe");

module.exports = Cafe;
