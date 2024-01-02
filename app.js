const express = require("express");
const { getUserById } = require("./controllers/users.controllers");
const { handleCustomErrors } = require("./errors/errors");
const app = express();

app.use(express.json());

app.get("/api/users/:user_id", getUserById);

app.use(handleCustomErrors);

module.exports = app;
