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
      .get("/api/books")
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
      .get("/api/books?condition=new")
      .expect(200)
      .then(({ body }) => {
        const { books } = body;
        expect(books).toHaveLength(3);
        books.forEach((book) => {
          expect(book.condition).toEqual("New");
        });
      });
  });
  test("accepts a username query and returns the books listed by that user ", () => {
    return request(app)
      .get("/api/books?username=Sarah%20blue")
      .expect(200)
      .then(({ body }) => {
        const { books } = body;
        expect(books).toHaveLength(1);
        books.forEach((book) => {
          expect(book.username).toEqual("Sarah Blue");
        });
      });
  });
  test("accepts multiple queries query returns the appropriate books ", () => {
    return request(app)
      .get("/api/books?condition=New&genre=fantasy")
      .expect(200)
      .then(({ body }) => {
        const { books } = body;
        expect(books).toHaveLength(1);
        books.forEach((book) => {
          expect(book.condition).toEqual("New");
          expect(book.genre).toEqual("Fantasy");
        });
      });
  });
  test("accepts a search query and returns matched results", () => {
    return request(app)
      .get("/api/books?search=1984")
      .expect(200)
      .then(({ body }) => {
        const { books } = body;
        expect(books).toHaveLength(1);
        books.forEach((book) => {
          expect(Object.values(book).includes("1984")).toBe(true);
        });
      });
  });
  test("accepts a search query and a filter query and returns matched results", () => {
    return request(app)
      .get("/api/books?search=green&genre=dystopian")
      .expect(200)
      .then(({ body }) => {
        const { books } = body;
        expect(books).toHaveLength(1);
        expect(books[0].username).toBe("Alice Green");
      });
  });
});

test("returns 400 bad request when passed an invalid query ", () => {
  return request(app)
    .get("/api/books?dog=woof")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("bad request");
    });
});
test("returns 400 bad request when at least one  query is invalid ", () => {
  return request(app)
    .get("/api/books?dog=woof&condition=New")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("bad request");
    });
});
test("returns 404 when query value not found", () => {
  return request(app)
    .get("/api/books?search=kjyvawkuyebfuyigwef")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("not found");
    });
});
