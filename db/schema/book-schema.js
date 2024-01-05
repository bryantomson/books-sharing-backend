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
  username: {
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
  },
  description: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  borrow_length: {
    type: String,
    required: true,
  },
  book_img: {
    type: String,
    required: false,
  }
});

booksSchema.index({
  title: "text",
  username: "text",
  author: "text",
  published_date: "text",
  genre: "text",
  isbn: "text",
  description: "text",
  condition: "text",
  borrow_length: "text",
});

module.exports = mongoose.model("Book", booksSchema);
