const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar_img: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: true,
  },
  number_borrowed: {
    type: Number,
    required: true,
  },
  number_lent: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("User", usersSchema);