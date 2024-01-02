const Book = require("../db/schema/book-schema");
const { findBooks } = require("../models/books.model");

exports.getBooks = async (req, res, next) => {

const queries = req.query


  try {
    const books = await findBooks(queries)
 res.status(200).json({ books: books });
  } catch (err) {
    next(err)
  }
}
