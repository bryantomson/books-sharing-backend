const mongoose = require("mongoose");
const db = require("./app.js")
const Book = require("./book-schema")
const User = require("./user-schema")

const seedBooks = [
    {
      title: "The Hitchhiker's Guide to the Galaxy",
      owner: "John Doe",
      author: "Douglas Adams",
      published_date: "1979-10-12",
      genre: "Science Fiction",
      isbn: "978-0-345-39180-3",
    },
    {
      title: "To Kill a Mockingbird",
      owner: "Jane Smith",
      author: "Harper Lee",
      published_date: "1960-07-11",
      genre: "Fiction",
      isbn: "978-0-06-112008-4",
    },
    {
      title: "The Great Gatsby",
      owner: "Bob Johnson",
      author: "F. Scott Fitzgerald",
      published_date: "1925-04-10",
      genre: "Classic",
      isbn: "978-0-7432-7356-5",
    },
    {
      title: "Harry Potter and the Sorcerer's Stone",
      owner: "Emily White",
      author: "J.K. Rowling",
      published_date: "1997-06-26",
      genre: "Fantasy",
      isbn: "978-0-590-35340-3",
    },
    {
      title: "The Hobbit",
      owner: "Michael Brown",
      author: "J.R.R. Tolkien",
      published_date: "1937-09-21",
      genre: "Fantasy",
      isbn: "978-0-261-10295-2",
    },
    {
      title: "1984",
      owner: "Alice Green",
      author: "George Orwell",
      published_date: "1949-06-08",
      genre: "Dystopian",
      isbn: "978-0-452-28423-4",
    },
    {
      title: "The Catcher in the Rye",
      owner: "David Black",
      author: "J.D. Salinger",
      published_date: "1951-07-16",
      genre: "Coming-of-Age",
      isbn: "978-0-316-76948-0",
    },
    {
      title: "One Hundred Years of Solitude",
      owner: "Sarah Blue",
      author: "Gabriel Garcia Marquez",
      published_date: "1967-05-30",
      genre: "Magical Realism",
      isbn: "978-0-06-112009-1",
    }  
];

const seedUsers = [
  {
    name: "John Doe",
    age: 35,
    favourite_genre: "Science Fiction",
  },
  {
    name: "Jane Smith",
    age: 28,
    favourite_genre: "Fiction",
  },
  {
    name: "Bob Johnson",
    age: 40,
    favourite_genre: "Classic",
  },
  {
    name: "Emily White",
    age: 30,
    favourite_genre: "Fantasy",
  },
  {
    name: "Michael Brown",
    age: 45,
    favourite_genre: "Fantasy",
  },
  {
    name: "Alice Green",
    age: 32,
    favourite_genre: "Dystopian",
  },
  {
    name: "David Black",
    age: 29,
    favourite_genre: "Coming-of-Age",
  },
  {
    name: "Sarah Blue",
    age: 38,
    favourite_genre: "Magical Realism",
  },
];

const seedDB = async () => {
    await Book.deleteMany({})
    await User.deleteMany({})
    await Book.insertMany(seedBooks)
    await User.insertMany(seedUsers)
}



module.exports = seedDB