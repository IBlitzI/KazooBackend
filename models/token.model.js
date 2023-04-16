const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  token: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("tokenSchema", TokenSchema, "tokenSchema");
