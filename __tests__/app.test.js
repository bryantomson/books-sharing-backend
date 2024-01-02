const request = require("supertest");
const { db, app } = require("../app.js");
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
