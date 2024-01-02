const request = require("supertest");
const { app } = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seed.js");

beforeEach(() => {
  return seed();
});

afterAll(() => {
  db.close();
});

describe("GET /books", () => {
  test("200: responds with an array of all books", () => {
    return request(app)
      .get("/books")
      .expect(200)
      .then(({ body }) => {
        const { books } = body;
        books.forEach((book) => {
          expect(book).toMatchObject({
            title: expect.any(String),
            author: expect.any(String),
            username: expect.any(String),
            published_date: expect.any(String),
            genre: expect.any(String),
            isbn: expect.any(String),
            description: expect.any(String),
            condition: expect.any(String),
            borrow_length: expect.any(String),
            book_img: expect.any(String),
            _id: expect.any(String),
          });
        });
      });
  });
  test("accepts a query and returns the appropriate books ", () => {
    return request(app)
      .get("/books?condition=New")
      .expect(200)
      .then(({ body }) => {
        const { books } = body;
        expect(books).toHaveLength(3);
        books.forEach((book) => {
          expect(book.condition).toEqual("New");
        });
      });
  });
  test('returns 400 not found when passed an invalid query ', () => {
    return request(app)
    .get("/books?dog=woof")
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe("bad request")
    })
  });
});
