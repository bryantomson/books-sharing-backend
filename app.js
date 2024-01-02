const express = require("express");
const { getUsers, getUserById, postUser } = require("./controllers/users.controllers");
const { handleCustomErrors, handleMongoErrors } = require("./errors/errors");
const app = express();

app.use(express.json());

app.get('/api/users', getUsers)

app.get("/api/users/:user_id", getUserById);

app.post("/api/users", postUser)

app.use(handleCustomErrors);

app.use(handleMongoErrors);

module.exports = app;
