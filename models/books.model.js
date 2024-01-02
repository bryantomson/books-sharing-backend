const Book = require("../db/schema/book-schema");

exports.findBooks = async (queries) => {
  const {
    username,
    author,
    title,
    genre,
    published_date,
    condition,
    borrow_length,
    isbn,
  } = queries;

  const filters = {
    ...(author && { author }),
    ...(username && { username }),
    ...(title && { title }),
    ...(genre && { genre }),
    ...(published_date && { published_date }),
    ...(condition && { condition }),
    ...(borrow_length && { borrow_length }),
    ...(isbn && { isbn }),
  };

console.log(filters, queries, "queries")

  if (!Object.keys(filters).length && Object.keys(queries).length) {
    console.log(queries, "hello")
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  const books = await Book.find(filters);
  return books;
};
