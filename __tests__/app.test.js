const request = require("supertest");
const { app } = require("../app.js");
const db = require("../db/connection.js")
const seed = require("../db/seed.js");
const mongoose = require("mongoose");

beforeEach(() => {
  return seed();
});

afterAll(() => {
  db.close();
});

// describe("GET /books", () => {
//   test("200: responds with an array of topics", () => {
//     return request(app)
//       .get("/books")
//       .expect(200)
//       .then(({ body }) => {
//         const { books } = body;
//         expect(books[0]).toMatchObject({
//           title: "The Hitchhiker's Guide to the Galaxy",
//           author: "Douglas Adams",
//           owner: "John Doe",
//           published_date: "1979-10-12",
//           genre: "Science Fiction",
//           isbn: "978-0-345-39180-3",
//         });
//       });
//   });
// });

describe("GET /books/:id", () => {
  test("200: responds with a single book by given id", () => {

    const expectedBook = 
    {
      _id: '6593f8b7fdb38e563114965f',
      title: "The Hitchhiker's Guide to the Galaxy",
      author: 'Douglas Adams',
      username: 'John Doe',
      published_date: '1979-10-12',
      genre: 'Science Fiction',
      isbn: '978-0-345-39180-3',
      description: 'A nice book',
      condition: 'Old',
      borrow_length: '2 weeks',
      book_img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU',
      __v: 0
    }

    return request(app)
      .get("/books/6593f8b7fdb38e563114965f")
      .expect(200)
      .then(({ body }) => {
        const { book } = body;
        expect(book).toMatchObject(expectedBook);
      });
  });
  test("404: responds with error if book id does not exist", () => {

    return request(app)
      .get("/books/6593f8b7fdb38e563114965h")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('book not found')
      });
  });
  test("400: responds with error if book id does not exist", () => {

    return request(app)
      .get("/books/doesnotexist")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request')
      });
  });
});