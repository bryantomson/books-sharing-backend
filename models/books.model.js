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

for (const key in queries){
  if (!filters.hasOwnProperty(key)){
    return Promise.reject({ status: 400, msg: "bad request" })
  }
}

  const books = await Book.find(filters);
  if(!books.length){
    return Promise.reject({status: 404, msg: 'not found'})
  } else{
    return books;
  }
};
