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
  test("PATCH:200 updates location, returns with updated user object", () => {
    const update = {
      newLocation: "Liverpool",
    };
    const expectedResponse = {
      _id: "6594007551053b8f385697a3",
      username: "John Doe",
      location: "Liverpool",
      password: "Science Fiction",
      avatar_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
      bio: "hello my name is username",
      rating: 0,
      number_borrowed: 1,
      number_lent: 2,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject(expectedResponse);
      });
  });
  test("PATCH:200 updates password, returns with updated user object", () => {
    const update = {
      newPassword: "fjksaoijhio768",
    };
    const expectedResponse = {
      _id: "6594007551053b8f385697a3",
      username: "John Doe",
      location: "Manchester",
      password: "fjksaoijhio768",
      avatar_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
      bio: "hello my name is username",
      rating: 0,
      number_borrowed: 1,
      number_lent: 2,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject(expectedResponse);
      });
  });
  test("PATCH:200 updates avatar_img, returns with updated user object", () => {
    const update = {
      newAvatar:
        "https://cdn.iconscout.com/icon/free/png-512/free-avatar-370-456322.png?f=webp&w=512",
    };
    const expectedResponse = {
      _id: "6594007551053b8f385697a3",
      username: "John Doe",
      location: "Manchester",
      password: "Science Fiction",
      avatar_img:
        "https://cdn.iconscout.com/icon/free/png-512/free-avatar-370-456322.png?f=webp&w=512",
      bio: "hello my name is username",
      rating: 0,
      number_borrowed: 1,
      number_lent: 2,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject(expectedResponse);
      });
  });
  test("PATCH:200 updates bio, returns with updated user object", () => {
    const update = {
      newBio: "This my new, updated bio. So cool!",
    };
    const expectedResponse = {
      _id: "6594007551053b8f385697a3",
      username: "John Doe",
      location: "Manchester",
      password: "Science Fiction",
      avatar_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
      bio: "This my new, updated bio. So cool!",
      rating: 0,
      number_borrowed: 1,
      number_lent: 2,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject(expectedResponse);
      });
  });
  test("PATCH:200 increases rating by 1, returns with updated user object", () => {
    const update = {
      incrementRating: 1,
    };
    const expectedResponse = {
      _id: "6594007551053b8f385697a3",
      username: "John Doe",
      location: "Manchester",
      password: "Science Fiction",
      avatar_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
      bio: "hello my name is username",
      rating: 1,
      number_borrowed: 1,
      number_lent: 2,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject(expectedResponse);
      });
  });
  test("PATCH:200 changes rating by any number, returns with updated user object", () => {
    const update = {
      incrementRating: -1,
    };
    const expectedResponse = {
      _id: "6594007551053b8f385697a3",
      username: "John Doe",
      location: "Manchester",
      password: "Science Fiction",
      avatar_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
      bio: "hello my name is username",
      rating: -1,
      number_borrowed: 1,
      number_lent: 2,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject(expectedResponse);
      });
  });
  test("PATCH:200 increases number_borrowed by 1, returns with updated user object", () => {
    const update = {
      incrementBorrowed: 1,
    };
    const expectedResponse = {
      _id: "6594007551053b8f385697a3",
      username: "John Doe",
      location: "Manchester",
      password: "Science Fiction",
      avatar_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
      bio: "hello my name is username",
      rating: 0,
      number_borrowed: 2,
      number_lent: 2,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject(expectedResponse);
      });
  });
  test("PATCH:200 increases lent by 1, returns with updated user object", () => {
    const update = {
      incrementLent: 1,
    };
    const expectedResponse = {
      _id: "6594007551053b8f385697a3",
      username: "John Doe",
      location: "Manchester",
      password: "Science Fiction",
      avatar_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
      bio: "hello my name is username",
      rating: 0,
      number_borrowed: 1,
      number_lent: 3,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject(expectedResponse);
      });
  });
  test("PATCH:404 responds with an error if the id is valid but user doesn't exist", () => {
    const update = {
      incrementLent: 1,
    };

    return request(app)
      .patch("/api/users/6554007571753b8f385697b7")
      .send(update)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
  test("PATCH:400 responds with an error if the id is invalid", () => {
    const update = {
      incrementLent: 1,
    };

    return request(app)
      .patch("/api/users/banana")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("PATCH:400 responds with an error if the data types in request body are invalid", () => {
    const update = {
      newLocation: 1,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("PATCH:400 responds with an error if the data type (for password) in request body are invalid", () => {
    const update = {
      newPassword: 9000,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("PATCH:400 responds with an error if there are invalid key(s) in request body", () => {
    const update = {
      newBanana: "Gold banana",
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("PATCH:400 responds with an error if the request body is empty", () => {
    const update = {};

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
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
