const request = require("supertest");
const { app } = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seed.js");
const mongoose = require("mongoose");

beforeEach(() => {
  return seed();
});

afterAll(() => {
  db.close();
});

describe("GET /books by genre", () => {
  test("200: responds with an array of books witin a specific genre", () => {
    return request(app)
      .get("/genres")
      .expect(200)
      .then(({ body }) => {
        expect(body[0]["genre"]).toEqual("Mystery");
        expect(body[1]["genre"]).toEqual("Science Fiction");
        expect(body[2]["genre"]).toEqual("Dystopian");
      });
  });
});
