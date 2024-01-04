const {
  selectSingleBook,
  findBooks,
  addBook,
  updateBookById,
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

exports.postBook = (req, res, next) => {
  const { body } = req;
  addBook(body)
    .then((book) => {
      res.status(201).send({ book });
    })
    .catch(next);
};

exports.patchBookById =()=>{
  console.log('in the controller');
  updateBookById()

}