const mongoose = require("mongoose");

const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

console.log(ENV)

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set");
}

const config = {};
if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = db;
