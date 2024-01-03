const { selectSingleBook, findBooks } = require("../models/books.models");

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
