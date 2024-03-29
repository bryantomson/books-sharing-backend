const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seed.js");
const { ObjectId } = require("mongodb");
let authToken;
const listOfEndpoints = require("../endpoints.json");

beforeEach(() => {
  return (
    seed()
      //logs in so that a webtoken can be generated for testing the /api/protected endpoint
      .then(() => {
        const testUser = { username: "John Doe", password: "Fiction" };

        return request(app)
          .post("/api/login")
          .send(testUser)
          .expect(200)
          .then(({ body }) => {
            authToken = body.token;
          });
      })
  );
});

afterAll(() => {
  db.close();
});

describe("GET /api", () => {
  test("/api status 200: responds with the endpoint avaialble using the endpoints.json file", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("endpoints");
        expect(body.endpoints).toEqual(listOfEndpoints);
      });
  });
  test("Error 404: returns an error 404 for a route that does not exist", () => {
    return request(app)
      .get("/api/invalidpath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
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
  test("?username= GET:200 accepts a username query and responds with a single user object", () => {
    return request(app)
      .get("/api/users?username=Michael Brown")
      .expect(200)
      .then(({ body }) => {
        const user = body.users[0];
        expect(user.username).toBe("Michael Brown");
        expect(user.location).toBe("Liverpool");
        expect(user.avatar_img).toBe(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU"
        );
        expect(user.bio).toBe("hello my name is username");
        expect(user.rating).toBe(0);
        expect(user.number_borrowed).toBe(1);
        expect(user.number_lent).toBe(2);
      });
  });
  test("?username= GET:404 responds with an error if the username doesn't exist", () => {
    return request(app)
      .get("/api/users?username=Bob Ross")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
  test("?username= GET:400 responds with an error if the query is invalid", () => {
    return request(app)
      .get("/api/users?banana=Bob Ross")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
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
        //password has been replaced with the hashed version
        expect(body.user.password).not.toBe("Art");
        //compares the original password with the hashed password to find match
        expect(bcrypt.compare("Art", body.user.password)).resolves.toBe(true);

        expect(body.user._id).toBe("6594007551053b8f385697ab");
        expect(body.user.username).toBe("Bob Ross");
        expect(body.user.location).toBe("Liverpool");
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
    return request(app)
      .get("/api/users/6594007551053b8f385697a7")
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).toBe("Michael Brown");
        expect(body.user.location).toBe("Liverpool");
        expect(body.user.avatar_img).toBe(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU"
        );
        expect(body.user.bio).toBe("hello my name is username");
        expect(body.user.rating).toBe(0);
        expect(body.user.number_borrowed).toBe(1);
        expect(body.user.number_lent).toBe(2);
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

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).toBe("John Doe");
        expect(body.user.location).toBe("Liverpool");
        expect(body.user.avatar_img).toBe(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU"
        );
        expect(body.user.bio).toBe("hello my name is username");
        expect(body.user.rating).toBe(0);
        expect(body.user.number_borrowed).toBe(1);
        expect(body.user.number_lent).toBe(2);
      });
  });
  test("PATCH:200 updates password, returns with updated user object", () => {
    const hashedPassword = bcrypt.hashSync("fjksaoijhio768", 10);

    const update = {
      newPassword: hashedPassword,
    };

    const expectedResponse = {
      _id: "6594007551053b8f385697a3",
      username: "John Doe",
      location: "Manchester",
      password: hashedPassword,
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

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).toBe("John Doe");
        expect(body.user.location).toBe("Manchester");
        expect(body.user.avatar_img).toBe(
          "https://cdn.iconscout.com/icon/free/png-512/free-avatar-370-456322.png?f=webp&w=512"
        );
        expect(body.user.bio).toBe("hello my name is username");
        expect(body.user.rating).toBe(0);
        expect(body.user.number_borrowed).toBe(1);
        expect(body.user.number_lent).toBe(2);
      });
  });
  test("PATCH:200 updates bio, returns with updated user object", () => {
    const update = {
      newBio: "This my new, updated bio. So cool!",
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).toBe("John Doe");
        expect(body.user.location).toBe("Manchester");
        expect(body.user.avatar_img).toBe(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU"
        );
        expect(body.user.bio).toBe("This my new, updated bio. So cool!");
        expect(body.user.rating).toBe(0);
        expect(body.user.number_borrowed).toBe(1);
        expect(body.user.number_lent).toBe(2);
      });
  });
  test("PATCH:200 increases rating by 1, returns with updated user object", () => {
    const update = {
      incrementRating: 1,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).toBe("John Doe");
        expect(body.user.location).toBe("Manchester");
        expect(body.user.avatar_img).toBe(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU"
        );
        expect(body.user.bio).toBe("hello my name is username");
        expect(body.user.rating).toBe(1);
        expect(body.user.number_borrowed).toBe(1);
        expect(body.user.number_lent).toBe(2);
      });
  });
  test("PATCH:200 changes rating by any number, returns with updated user object", () => {
    const update = {
      incrementRating: -1,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).toBe("John Doe");
        expect(body.user.location).toBe("Manchester");
        expect(body.user.avatar_img).toBe(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU"
        );
        expect(body.user.bio).toBe("hello my name is username");
        expect(body.user.rating).toBe(-1);
        expect(body.user.number_borrowed).toBe(1);
        expect(body.user.number_lent).toBe(2);
      });
  });
  test("PATCH:200 increases number_borrowed by 1, returns with updated user object", () => {
    const update = {
      incrementBorrowed: 1,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).toBe("John Doe");
        expect(body.user.location).toBe("Manchester");
        expect(body.user.avatar_img).toBe(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU"
        );
        expect(body.user.bio).toBe("hello my name is username");
        expect(body.user.rating).toBe(0);
        expect(body.user.number_borrowed).toBe(2);
        expect(body.user.number_lent).toBe(2);
      });
  });
  test("PATCH:200 increases lent by 1, returns with updated user object", () => {
    const update = {
      incrementLent: 1,
    };

    return request(app)
      .patch("/api/users/6594007551053b8f385697a3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).toBe("John Doe");
        expect(body.user.location).toBe("Manchester");
        expect(body.user.avatar_img).toBe(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU"
        );
        expect(body.user.bio).toBe("hello my name is username");
        expect(body.user.rating).toBe(0);
        expect(body.user.number_borrowed).toBe(1);
        expect(body.user.number_lent).toBe(3);
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

describe("DELETE /api/users/:user_id", () => {
  test("DELETE:204 responds with a single user object of the deleted user", () => {
    return request(app)
      .delete("/api/users/6594007551053b8f385697a7")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("DELETE:404 responds with an error if the id is valid but user doesn't exist", () => {
    return request(app)
      .delete("/api/users/6554007571753b8f385697b7")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
  test("DELETE:400 responds with an error if the id is invalid", () => {
    return request(app)
      .delete("/api/users/banana")
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

  test("accepts a search query in combination with a filter query and returns matched results", () => {
    return request(app)
      .get("/api/books?search=green&condition=old")
      .expect(200)
      .then(({ body }) => {
        const { books } = body;
        expect(books).toHaveLength(2);
        expect(books[0].title).toBe("1984");
        expect(books[1].title).toBe("Harry Potter and the Sorcerer's Stone");
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

  test("returns 404 not found when the query is valid but the value is not found", () => {
    return request(app)
      .get("/api/books?title=not-a-book12749dj")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  test("returns 404 not found when the search query value is not found", () => {
    return request(app)
      .get("/api/books?search=not-a-thing12749dj")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
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

describe("/api/genres", () => {
  test("POST 201: responds with new genre", () => {
    const newGenre = {
      genre: "Horror",
    };

    return request(app)
      .post("/api/genres")
      .send(newGenre)
      .expect(201)
      .then(({ body }) => {
        expect(body.genre.genre).toBe("Horror");
      });
  });
  test("POST:400: respods with an error message if genre is missing", () => {
    const newGenre = {};

    return request(app)
      .post("/api/genres")
      .send(newGenre)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Path `genre` is required.");
      });
  });
  test("POST:400 responds with an error message if genre posted already exists", () => {
    const newGenre = {
      genre: "Mystery",
    };
    return request(app)
      .post("/api/genres")
      .send(newGenre)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("genre already exists");
      });
  });
  test("POST:201 ignores unnecessary fields", () => {
    const newGenre = {
      genre: "Horror",
      banana: "banana",
    };
    return request(app)
      .post("/api/genres")
      .send(newGenre)
      .expect(201)
      .then(({ body }) => {
        expect(body.genre.genre).toBe("Horror");
      });
  });
  test("POST:400 responds with an error if the request genre is not a string", () => {
    const newGenre = {
      genre: 12,
    };
    return request(app)
      .post("/api/genres")
      .send(newGenre)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("DELETE: /api/books/:book_id", () => {
  test("DELETE: 204 deletes the book", () => {
    return request(app)
      .delete("/api/books/6593f8b7fdb38e563114965f")
      .expect(204);
  });
  test("DELETE: 400 sends an error if the book ID is invalid", () => {
    return request(app)
      .delete("/api/books/dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("DELETE: 404 sends an error if the book isnt found", () => {
    return request(app)
      .delete("/api/books/1234007551053b8f385127a8")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("book not found");
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

describe("POST: /api/login", () => {
  test("POST: 201 post login info", () => {
    return request(app)
      .post("/api/login")
      .send({ username: "John Doe", password: "Fiction" })
      .expect(200)
      .then(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });
  test("POST: 401 incorrect password", () => {
    return request(app)
      .post("/api/login")
      .send({ username: "John Doe", password: "incorrect" })
      .expect(401);
  });
  test("POST: 404 user does not exist", () => {
    return request(app)
      .post("/api/login")
      .send({ username: "King Richard III", password: "incorrect" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
});

describe("GET: /api/protected", () => {
  test('should return 200 and "Protected route accessed" with a valid token', (done) => {
    request(app)
      .get("/api/protected")
      .set("Authorization", authToken)
      .expect(200)
      .expect("Protected route accessed", done);
  });
  test('should return 401 and "Invalid token" if given non existant token', (done) => {
    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzA0NDUyNjU0fQ.Yp4wqddmJbAM9L2nav951pX4XP7v7mXoGeDmoPFg8bs";
    request(app)
      .get("/api/protected")
      .set("Authorization", fakeToken)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.msg).toBe("Invalid token");
        done();
      });
  });
  test('should return 401 and "Token not provided" if no token is provided', (done) => {
    let fakeToken = "";
    request(app)
      .get("/api/protected")
      .set("Authorization", fakeToken)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.msg).toBe("Token not provided");
        done();
      });
  });
});

describe("/api/messages?users=...", () => {
  test("GET:200 responds with an array of all messages between 2 users", () => {
    return request(app)
      .get("/api/messages?users=Sarah+Blue-David+Black")
      .expect(200)
      .then(({ body }) => {
        const { messages } = body;
        expect(messages).toHaveLength(4);
        expect(messages).toBeSortedBy("timestamp", {
          descending: false,
        });
        messages.forEach((message) => {
          expect(message).toMatchObject({
            _id: expect.any(String),
            between: expect.any(Array),
            from: expect.any(String),
            timestamp: expect.any(String),
            body: expect.any(String),
          });
          expect(message.between.includes("Sarah Blue")).toBe(true);
          expect(message.between.includes("David Black")).toBe(true);
        });
      });
  });
  test("GET:200 responds with an array of all messages between 2 other users", () => {
    return request(app)
      .get("/api/messages?users=David+Black-Emily+White")
      .expect(200)
      .then(({ body }) => {
        const { messages } = body;
        expect(messages).toHaveLength(1);
        messages.forEach((message) => {
          expect(message).toMatchObject({
            _id: expect.any(String),
            between: expect.any(Array),
            from: expect.any(String),
            timestamp: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("GET:400 responds with an error if no users in query", () => {
    return request(app)
      .get("/api/messages")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("GET:400 responds with an error for an invalid query", () => {
    return request(app)
      .get("/api/messages?bananas=David+Black-Emily+White")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("GET:400 responds with an error for requesting not 2 users", () => {
    return request(app)
      .get("/api/messages?users=David+Black-Emily+White-Sarah+Blue")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("GET:404 responds with an error if no messages found", () => {
    return request(app)
      .get("/api/messages?users=Emily+White-Sarah+Blue")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("/api/messages/:username", () => {
  test("GET:200 serves an array of all conversations for a username with most recent conversation first", () => {
    return request(app)
      .get("/api/messages/David%20Black")
      .expect(200)
      .then(({ body }) => {
        expect(body.conversations).toHaveLength(2);
        expect(body.conversations).toBeSortedBy("timestamp", {
          descending: true,
        });
        body.conversations.forEach((conversation) => {
          expect(conversation).toMatchObject({
            with: expect.any(String),
            timestamp: expect.any(String),
          });
        });
      });
  });
  test("GET:200 serves an array of all conversations for a different user", () => {
    return request(app)
      .get("/api/messages/Sarah%20Blue")
      .expect(200)
      .then(({ body }) => {
        expect(body.conversations).toHaveLength(1);
        body.conversations.forEach((conversation) => {
          expect(conversation).toMatchObject({
            with: expect.any(String),
            timestamp: expect.any(String),
          });
        });
      });
  });
  test("GET:200 serves an empty array if user exists but has no conversations", () => {
    return request(app)
      .get("/api/messages/Bob%20Johnson")
      .expect(200)
      .then(({ body }) => {
        expect(body.conversations).toEqual([]);
      });
  });
  test("GET:404 responds with an error if the username is not found", () => {
    return request(app)
      .get("/api/messages/Bob%20Ross")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
});

describe("PATCH /api/books/:id", () => {
  test("PATCH:200 updates book condition, returns with updated book object", () => {
    const update = {
      newCondition: "New",
    };
    const expectedResponse = {
      _id: "6593f8b7fdb38e563114965f",
      title: "The Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      username: "John Doe",
      published_date: "1979-10-12",
      genre: "Science Fiction",
      isbn: "978-0-345-39180-3",
      description: "A nice book",
      condition: "New",
      borrow_length: "2 weeks",
      book_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
      __v: 0,
    };

    return request(app)
      .patch("/api/books/6593f8b7fdb38e563114965f")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const { book } = body;
        expect(book).toMatchObject(expectedResponse);
      });
  });
  test("PATCH:200 updates book borrow_length, returns with updated book object", () => {
    const update = {
      newBorrow_length: "1 week",
    };
    const expectedResponse = {
      _id: "6593f8b7fdb38e563114965f",
      title: "The Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      username: "John Doe",
      published_date: "1979-10-12",
      genre: "Science Fiction",
      isbn: "978-0-345-39180-3",
      description: "A nice book",
      condition: "Old",
      borrow_length: "1 week",
      book_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
      __v: 0,
    };

    return request(app)
      .patch("/api/books/6593f8b7fdb38e563114965f")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const { book } = body;
        expect(book).toMatchObject(expectedResponse);
      });
  });
  test("PATCH:200 updates book 2 properties of a book returns with updated book object", () => {
    const update = {
      newGenre: "Fiction",
      newDescription: "A really intereting book about space",
    };
    const expectedResponse = {
      _id: "6593f8b7fdb38e563114965f",
      title: "The Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      username: "John Doe",
      published_date: "1979-10-12",
      genre: "Fiction",
      isbn: "978-0-345-39180-3",
      description: "A really intereting book about space",
      condition: "Old",
      borrow_length: "2 weeks",
      book_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
      __v: 0,
    };

    return request(app)
      .patch("/api/books/6593f8b7fdb38e563114965f")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const { book } = body;
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
  test("PATCH:404 responds with an error if the id is valid but book doesn't exist", () => {
    const update = {
      newGenre: "Fiction",
    };

    return request(app)
      .patch("/api/books/6598g8b7fdb38e563114965f")
      .send(update)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("book not found");
      });
  });
});
