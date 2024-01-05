const Book = require("../db/schema/book-schema");

exports.selectSingleBook = (id) => {
  if (id.length !== 24) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  return Book.findById(id)
    .then((result) => {
      if (result) {
        return result;
      }
    })
    .catch((error) => {
      return Promise.reject({ status: 404, msg: "book not found" });
    });
};

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
  };

  for (const key in queries) {
    if (!filters.hasOwnProperty(key)) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
  }

  return Book.find(filters)
    .then((res) => {
      if (!res.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return res;
      }
    })
    .catch((next) => {});
};

exports.addBook = (newBook) => {
  if (!newBook.book_img) {
    newBook.book_img =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Book_missing.svg/595px-Book_missing.svg.png";
  }

  const book = new Book(newBook);
  return book.save().then((postedBook) => {
    return postedBook;
  });
};

exports.updateBookById = async (book,request)=>{
  const validUpdates = [
    "newTitle",
    "newAuthor",
    "newPublished_date",
    "newGenre",
    "newIsbn",
    "newDescription",
    "newCondition",
    "newBorrow_length",
    "newBook_img"
  ];
  for (const key in request) {
    if (!validUpdates.includes(key)) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
  }

  if (
    !Object.keys(request).length ||
    (request.newTitle && typeof request.newTitle !== "string") ||
    (request.newAuthor && typeof request.newAuthor !== "string") ||
    (request.newPublished_date && typeof request.newPublished_date !== "string") ||
    (request.newGenre && typeof request.newGenre !== "string") ||
    (request.newIsbn && typeof request.newIsbn !== "string") ||
    (request.newDescription && typeof request.newDescription !== "string") ||
    (request.newCondition && typeof request.newCondition !== "string") || 
    (request.newBorrow_length && typeof request.newBorrow_length !== "string") || 
    (request.newBook_img && typeof request.newBook_img !== "string") 
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  
  if (request.newTitle) book.title = request.newTitle;
  if (request.newAuthor) book.author = request.newAuthor;
  if (request.newPublished_date) book.published_date = request.newPublished_date;
  if (request.newGenre) book.genre = request.newGenre;
  if (request.newIsbn)  book.isbn = request.newIsbn;
  if (request.newDescription) book.description = request.newDescription;
  if (request.newCondition) book.condition = request.newCondition;
  if (request.newBorrow_length) book.borrow_length = request.newBorrow_length;
  if (request.newBook_img) book.book_img = request.newBook_img;

  return book.save().then((patchedBook) => {
    return patchedBook;
  });
  
}
