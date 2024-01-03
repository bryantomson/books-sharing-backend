const express = require("express");
const { getUserById } = require("./controllers/users.controllers");
const { getBookById, getBooks } = require("./controllers/books.controllers");
const { handleCustomErrors, handleServerErrors } = require("./errors/errors");
const app = express();

app.use(express.json());

app.get("/api/users/:user_id", getUserById);

app.get("/api/books", getBooks);

app.get("/books/:id", getBookById);

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
