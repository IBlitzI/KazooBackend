const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  favorites: [
    {
      name: String,
      url: String,
      
    },
  ],
  vote:{
    type: Number,
    default: 0
  }
});
const User = mongoose.model("User", userSchema, "User");
module.exports = User;
