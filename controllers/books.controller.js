const Book = require("../db/schema/book-schema");
const { findBooks } = require("../models/books.model");

exports.getBooks = (req, res, next) => {
  const queries = req.query;

  findBooks(queries)
    .then((books) => {
      res.status(200).send({ books: books });
    })
    .catch(next);
};
