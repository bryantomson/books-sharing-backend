const { getGenres, postGenres } = require("./controllers/genres.controllers");
const express = require("express");
const {
  getUsers,
  getUserById,
  patchUser,
  postUser,
  deleteUser,
} = require("./controllers/users.controllers");
const {
  getBookById,
  getBooks,
  postBook,
  deleteBookById,
  patchBookById
} = require("./controllers/books.controllers");
const {
  handleCustomErrors,
  handleServerErrors,
  handleMongoErrors,
  handle404s,
} = require("./errors/errors");

const app = express();
const db = require("./db/connection"); // this is necessary for the connection file to run, do not delete
const { getEndpoints } = require("./controllers/app.controllers");


app.use(express.json());

app.get('/api',getEndpoints)

app.get("/api/users", getUsers);
app.post("/api/users", postUser);

app.get("/api/users/:user_id", getUserById);
app.patch("/api/users/:user_id", patchUser);

app.post("/api/users", postUser);

app.get("/api/books", getBooks);

app.get("/api/books/:id", getBookById);

app.post("/api/books", postBook);

app.patch('/api/books/:id',patchBookById)

app.get("/api/genres", getGenres);

app.post("/api/genres", postGenres);

app.delete("/api/books/:book_id", deleteBookById);

app.delete("/api/users/:user_id", deleteUser);

app.all('/*',handle404s)
app.use(handleMongoErrors);
app.use(handleCustomErrors);
app.use(handleMongoErrors);
app.use(handleServerErrors);

module.exports = app;
