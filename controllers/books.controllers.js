
const Book = require("../db/schema/book-schema");
const { findBooks } = require("../models/books.models");
    
const {
  selectSingleBook,
  findBooks,
  addBook,
  deleteBookListing
} = require("../models/books.models");

exports.getBookById = (req, res, next) => {
  const paramId = req.params.id;

  selectSingleBook(paramId)
    .then((result) => {
      res.status(200).send({ book: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getBooks = (req, res, next) => {

    const queries = req.query;
  
    findBooks(queries)
      .then((books) => {
        res.status(200).send({ books: books });
      })
      .catch(next);
  };

  exports.deleteBookById = (req, res, next) => {
    const { book_id } = req.params;
    deleteBookListing( book_id )
    .then(() => {
        res.status(204).end();
    })
    .catch((err) => {
        next(err)
    })
}

exports.postBook = (req, res, next) => {
  const { body } = req;
  addBook(body)
    .then((book) => {
      res.status(201).send({ book });
    })
    .catch(next);
};
