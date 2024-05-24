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
    
  },
  created: {
    type: Date,
    default: Date.now,
  },
  token: {
    type: Number
  },
  vote:{
    type: Number,
    default: 0
  },
  authProvider: {
    type: String,
    required: true,
    enum: ['local', 'google'],
    default: 'local'
  }
});
const User = mongoose.model("User", userSchema, "User");
module.exports = User;
