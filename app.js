const { getGenres } = require("./controllers/genres.controllers");
const express = require("express");
const { getUsers, getUserById, patchUser } = require("./controllers/users.controllers");
const { getBookById, getBooks } = require("./controllers/books.controllers");
const { handleCustomErrors, handleServerErrors } = require("./errors/errors");
const app = express();

app.use(express.json());

app.get("/api/users", getUsers);

app.get("/api/users/:user_id", getUserById);
app.patch("/api/users/:user_id", patchUser);

app.get("/api/books", getBooks);

app.get("/books/:id", getBookById);

app.get("/api/genres", getGenres);

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
