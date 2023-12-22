const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  favourite_genre: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("User", usersSchema);