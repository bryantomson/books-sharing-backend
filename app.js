const { getGenres, postGenres } = require("./controllers/genres.controllers");
const express = require("express");
const { getUsers, getUserById } = require("./controllers/users.controllers");
const { getBookById, getBooks } = require("./controllers/books.controllers");
const { handleCustomErrors, handleServerErrors, handleMongoErrors } = require("./errors/errors");
const app = express();

app.use(express.json());

app.get("/api/users", getUsers);

app.get("/api/users/:user_id", getUserById);

app.get("/api/books", getBooks);

app.get("/books/:id", getBookById);

app.get("/api/genres", getGenres);

app.post("/api/genres", postGenres)

app.use(handleCustomErrors);
app.use(handleMongoErrors);
app.use(handleServerErrors);

module.exports = app;
