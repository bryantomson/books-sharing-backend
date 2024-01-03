const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seed.js");

beforeEach(() => {
  return seed();
});

afterAll(() => {
  db.close();
});

describe("/api/users/:user_id", () => {
  test("GET:200 responds with a single user object", () => {
    const user = {
      _id: "6594007551053b8f385697a7",
      username: "Michael Brown",
      location: "Liverpool",
      password: "Fantasy",
      avatar_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
      bio: "hello my name is username",
      rating: 0,
      number_borrowed: 1,
      number_lent: 2,
    };

    return request(app)
      .get("/api/users/6594007551053b8f385697a7")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject(user);
      });
  });
  test("GET:404 responds with an error if the id is valid but user doesn't exist", () => {
    return request(app)
      .get("/api/users/6554007571753b8f385697b7")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
  test("GET:400 responds with an error if the id is invalid", () => {
    return request(app)
      .get("/api/users/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

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
          expect(book.condition).toEqual("New")
          expect(book.genre).toEqual("Fantasy");
        });
      });
  });
  test('returns 400 bad request when passed an invalid query ', () => {
    return request(app)
    .get("/api/books?dog=woof")
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe("bad request")
    })
  });
  test('returns 400 bad request when at least one  query is invalid ', () => {
    return request(app)
    .get("/api/books?dog=woof&condition=New")
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe("bad request")
    })
  });
  test('returns 404 not found whem  ', () => {
    return request(app)
    .get("/api/books?dog=woof&condition=New")
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe("bad request")
    })
  });
});

