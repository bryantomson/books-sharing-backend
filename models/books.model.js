const Book = require("../db/schema/book-schema");

exports.findBooks = (queries) => {
  const {
    username,
    author,
    title,
    genre,
    published_date,
    condition,
    borrow_length,
    isbn,
    search,
  } = queries;

  const filters = {
    ...(author && { author: { $regex: `^${author}$`, $options: "i" } }),
    ...(username && { username: { $regex: `^${username}$`, $options: "i" } }),
    ...(title && { title: { $regex: `^${title}$`, $options: "i" } }),
    ...(genre && { genre: { $regex: `^${genre}$`, $options: "i" } }),
    ...(published_date && {
      published_date: { $regex: `^${published_date}$`, $options: "i" },
    }),
    ...(condition && {
      condition: { $regex: `^${condition}$`, $options: "i" },
    }),
    ...(borrow_length && {
      borrow_length: { $regex: `^${borrow_length}$`, $options: "i" },
    }),
    ...(isbn && { isbn: { $regex: `^${isbn}$`, $options: "i" } }),
    ...(search && { $text: { $search: search } }),
  };

  for (const key in queries) {
    if (!filters.hasOwnProperty(key) && !filters.hasOwnProperty("$text")) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
  }

  return Book.find(filters).then((res) => {
    if (!res.length) {
      return Promise.reject({ status: 404, msg: "not found" });
    } else {
      return res;
    }
  })
};
