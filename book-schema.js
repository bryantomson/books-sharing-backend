const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  published_date: {
    type: String,
    required: false
  },
  genre: {
    type: String,
    required: false
  },
  isbn: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Book", booksSchema);
