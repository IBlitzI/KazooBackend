const mongoose = require("mongoose");

const cafeSchema = new mongoose.Schema({
  name: {
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
  },
  menu: [
    {
      name: String,
      price: Number,
      description: String,
    },
  ],
  playlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song"
    },
  ],
  votes: [
    {
      user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
      vote : {type : Number}
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

const Cafe = mongoose.model("Cafe", cafeSchema, "Cafe");

module.exports = Cafe;
