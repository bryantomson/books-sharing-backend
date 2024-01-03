const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seed.js");
const { ObjectId } = require("mongodb");

beforeEach(() => {
  return seed();
});

afterAll(() => {
  db.close();
});

describe("/api/users", () => {
  test("GET:200 responds with an array with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users.length).toBe(8);
        users.forEach((user) => {
          expect(user).toMatchObject({
            _id: expect.any(String),
            username: expect.any(String),
            location: expect.any(String),
            password: expect.any(String),
            avatar_img: expect.any(String),
            bio: expect.any(String),
            rating: expect.any(Number),
            number_borrowed: expect.any(Number),
            number_lent: expect.any(Number),
          });
        });
      });
  });
  test("POST:201 responds with a new user object", () => {
    const newUser = {
      _id: new ObjectId("6594007551053b8f385697ab"),
      username: "Bob Ross",
      location: "Liverpool",
      password: "Art",
      avatar_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
      bio: "hello my name is username",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.user._id).toBe("6594007551053b8f385697ab");
        expect(body.user.username).toBe("Bob Ross");
        expect(body.user.location).toBe("Liverpool");
        expect(body.user.password).toBe("Art");
        expect(body.user.avatar_img).toBe(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU"
        );
        expect(body.user.bio).toBe("hello my name is username");
        expect(body.user.rating).toBe(0);
        expect(body.user.number_borrowed).toBe(0);
        expect(body.user.number_lent).toBe(0);
      });
  });
  test("POST:201 responds with a new user object if the request body does not contain the non required keys", () => {
    const newUser = {
      username: "Bob Ross",
      location: "Liverpool",
      password: "Art",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.user.avatar_img).toBe(
          "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-avatar-vector-isolated-on-white-background-png-image_1694546.jpg"
        );
        expect(body.user.bio).toBe("");
      });
  });
  test("POST:400 responds with an error message if username is missing", () => {
    const newUser = {
      location: "Liverpool",
      password: "Art",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Path `username` is required.");
      });
  });
  test("POST:400 responds with an error message if password is missing", () => {
    const newUser = {
      username: "Bob Ross",
      location: "Liverpool",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Path `password` is required.");
      });
  });
  test("POST:400 responds with an error message if more than one required fields are missing", () => {
    const newUser = {
      username: "Bob Ross",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Path `password` is required.");
      });
  });
  test("POST:201 ignores unnecessary fields", () => {
    const newUser = {
      username: "Bob Ross",
      location: "Liverpool",
      password: "Art",
      banana: "banana",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.user.banana).toBe(undefined);
      });
  });
  test("POST:400 responds with an error if username already exists (case insensitive)", () => {
    const newUser = {
      username: "jane smith",
      location: "Liverpool",
      password: "Art",
    };
    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("username already in use");
      });
  });
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
    const expectedBook = {
      _id: "6593f8b7fdb38e563114965f",
      title: "The Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      username: "John Doe",
      published_date: "1979-10-12",
      genre: "Science Fiction",
      isbn: "978-0-345-39180-3",
      description: "A nice book",
      condition: "Old",
      borrow_length: "2 weeks",
      book_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
      __v: 0,
    };

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
        expect(body.msg).toBe("book not found");
      });
  });
  test("400: responds with error if book id does not exist", () => {
    return request(app)
      .get("/books/doesnotexist")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
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
          expect(book.condition).toEqual("New");
          expect(book.genre).toEqual("Fantasy");
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
  test("returns 404 not found whem  ", () => {
    return request(app)
      .get("/api/books?dog=woof&condition=New")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
