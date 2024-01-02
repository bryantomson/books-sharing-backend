const express = require("express");
const { getBooks } = require("./controllers/books.controller");
const { handle500, handle404, handle400 } = require("./errors/errors");
const app = express();


app.use(express.json());




app.get("/books", getBooks)
app.use(handle400)
app.use(handle404)
app.use(handle500)


app.get("/owners", async (req, res) => {
  const { name } = req.query;

  console.log(name);
  try {
    const owners = await Book.find({ name });
    res.json({ owners: owners });
  } catch (err) {
    res.json({ msg: "ERR" });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else throw err;
  } catch {}
});

app.post("/books", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    owner: req.body.owner,
  });

  try {
    //saves to the database
    const newBook = await book.save();

    //response to client
    res.json(newBook);
  } catch (err) {
    console.log(err);
  }
});

app.post("/users", async (req, res) => {
  const user = new User({
    name: req.body.name,
    age: req.body.age,
  });

  try {
    //saves to the database
    const newUser = await user.save();

    //response to client
    res.json(newUser);
  } catch (err) {
    console.log(err);
  }
});

app.patch("/:id", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
  });
  res.book.title = req.body.title;
  try {
    const updatedBook = await res.book.save();
  } catch {}
});

app.delete("/:id", (req, res) => {});


module.exports = {app}