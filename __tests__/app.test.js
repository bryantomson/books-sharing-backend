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
  test("PATCH:200 updates multiple properties for an existing user", () => {
    const update = {
      newLocation: "Liverpool",
      newPassword: "hjkjklokdfosjofds6783628173892",
    };
    const expectedResponse = {
      _id: "6594007551053b8f385697a3",
      username: "John Doe",
      location: "Liverpool",
      password: "hjkjklokdfosjofds6783628173892",
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

describe("GET /api/books/:id", () => {
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
      .get("/api/books/6593f8b7fdb38e563114965f")
      .expect(200)
      .then(({ body }) => {
        const { book } = body;
        expect(book).toMatchObject(expectedBook);
      });
  });
  test("404: responds with error if book id does not exist", () => {
    return request(app)
      .get("/api/books/6593f8b7fdb38e563114965h")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("book not found");
      });
  });
  test("400: responds with error if book id does not exist", () => {
    return request(app)
      .get("/api/books/doesnotexist")
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

describe("GET /books by genre", () => {
  test("200: responds with all genres", () => {
    return request(app)
      .get("/api/genres")
      .expect(200)
      .then(({ body }) => {
        expect(body[0]["genre"]).toEqual("Mystery");
        expect(body[1]["genre"]).toEqual("Science Fiction");
        expect(body[2]["genre"]).toEqual("Dystopian");
      });
  });
});

describe("POST /api/books", () => {
  test("201: responds with the added book", () => {
    const newBook = {
      title: "Harry Potter and the Goblet of Fire",
      username: "Beatrizzzz",
      author: "J. K. Rowling",
      published_date: "2000-05-30",
      genre: "Magical Realism",
      isbn: "978-0-06-112009-1",
      description: "A fun exciting book",
      condition: "New",
      borrow_length: "4 weeks",
      book_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
    };
    return request(app)
      .post("/api/books")
      .send(newBook)
      .expect(201)
      .then(({ body }) => {
        const { book } = body;
        expect(book).toMatchObject(newBook);
        expect(typeof book._id).toBe("string");
      });
  });
  test("POST error 400 there are missing properties of the posted book ", () => {
    const newBook = {
      username: "Beatrizzzz",
      author: "J. K. Rowling",
      published_date: "1999-05-30",
      genre: "Magical Realism",
      isbn: "978-0-06-112009-1",
      description: "A scary spooky book",
      condition: "New",
      borrow_length: "3 weeks",
      book_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
    };
    return request(app)
      .post("/api/books")
      .send(newBook)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Path `title` is required.");
      });
  });
  test("POST 201 should add default book img for book when not provided in newBook object ", () => {
    const newBook = {
      title: "Harry Potter and the Chamber of Secrets",
      username: "Beatrizzzz",
      author: "J. K. Rowling",
      published_date: "1998-05-30",
      genre: "Magical Realism",
      isbn: "978-0-06-142019-1",
      description: "A short sweet book",
      condition: "New",
      borrow_length: "5 weeks",
    };
    return request(app)
      .post("/api/books")
      .send(newBook)
      .expect(201)
      .then(({ body }) => {
        const { book } = body;
        expect(book).toMatchObject(newBook);
        expect(typeof book._id).toBe("string");
        expect(book.book_img).toBe(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Book_missing.svg/595px-Book_missing.svg.png"
        );
      });
  });
});


  describe('PATCH /api/books/:id', () => {
    test("PATCH:200 updates book condition, returns with updated book object", () => {
      const update = {
        newCondition: 'New',
      };
      const expectedResponse = {
        _id: '6593f8b7fdb38e563114965f',
        title: "The Hitchhiker's Guide to the Galaxy",
        author: 'Douglas Adams',
        username: 'John Doe',
        published_date: '1979-10-12',
        genre: 'Science Fiction',
        isbn: '978-0-345-39180-3',
        description: 'A nice book',
        condition: 'New',
        borrow_length: '2 weeks',
        book_img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU',
        __v: 0
      }
  
      return request(app)
        .patch("/api/books/6593f8b7fdb38e563114965f")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          const {book} = body
          expect(book).toMatchObject(expectedResponse);
        });
    });
    test("PATCH:200 updates book borrow_length, returns with updated book object", () => {
      const update = {
        newBorrow_length: '1 week',
      };
      const expectedResponse = {
        _id: '6593f8b7fdb38e563114965f',
        title: "The Hitchhiker's Guide to the Galaxy",
        author: 'Douglas Adams',
        username: 'John Doe',
        published_date: '1979-10-12',
        genre: 'Science Fiction',
        isbn: '978-0-345-39180-3',
        description: 'A nice book',
        condition: 'Old',
        borrow_length: '1 week',
        book_img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU',
        __v: 0
      }
  
      return request(app)
        .patch("/api/books/6593f8b7fdb38e563114965f")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          const {book} = body
          expect(book).toMatchObject(expectedResponse);
        });
    });
    test("PATCH:200 updates book 2 properties of a book returns with updated book object", () => {
      const update = {
        newGenre: 'Fiction',
        newDescription: 'A really intereting book about space',
      };
      const expectedResponse = {
        _id: '6593f8b7fdb38e563114965f',
        title: "The Hitchhiker's Guide to the Galaxy",
        author: 'Douglas Adams',
        username: 'John Doe',
        published_date: '1979-10-12',
        genre: 'Fiction',
        isbn: '978-0-345-39180-3',
        description: 'A really intereting book about space',
        condition: 'Old',
        borrow_length: '2 weeks',
        book_img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU',
        __v: 0
      }
  
      return request(app)
        .patch("/api/books/6593f8b7fdb38e563114965f")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          const {book} = body
          expect(book).toMatchObject(expectedResponse);
        });
    });
    test("PATCH:400 responds with an error if the data types in request body are invalid", () => {
      const update = {
        newGenre: 7,
      };
  
      return request(app)
        .patch("/api/books/6593f8b7fdb38e563114965f")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("PATCH:400 responds with an error if the key is invalid in request body", () => {
      const update = {
        newDog: "woof",
      };
  
      return request(app)
        .patch("/api/books/6593f8b7fdb38e563114965f")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("PATCH:400 responds with an error if the request body is empty", () => {
      const update = {};
  
      return request(app)
        .patch("/api/books/6593f8b7fdb38e563114965f")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
