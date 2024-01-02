const mongoose = require("mongoose");

const genresSchema = new mongoose.Schema({
  genre: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Genre", genresSchema);
