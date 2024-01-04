const { ObjectId } = require("mongodb");
const Book = require("./schema/book-schema.js");
const User = require("./schema/user-schema.js");
const Message = require("./schema/message-schema.js");
const Genre = require("./schema/genre-schema.js");

const seedBooks = [
  {
    _id: new ObjectId("6593f8b7fdb38e563114965f"),
    title: "The Hitchhiker's Guide to the Galaxy",
    username: "John Doe",
    author: "Douglas Adams",
    published_date: "1979-10-12",
    genre: "Science Fiction",
    isbn: "978-0-345-39180-3",
    description: "A nice book",
    condition: "Old",
    borrow_length: "2 weeks",
    book_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
  },
  {
    title: "The Great Gatsby",
    username: "Bob Johnson",
    author: "F. Scott Fitzgerald",
    published_date: "1925-04-10",
    genre: "Classic",
    isbn: "978-0-7432-7356-5",
    description: "A nice book",
    condition: "New",
    borrow_length: "1 week",
    book_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    username: "Emily White",
    author: "J.K. Rowling",
    published_date: "1997-06-26",
    genre: "Fantasy",
    isbn: "978-0-590-35340-3",
    description: "A nice book",
    condition: "Old",
    borrow_length: "2 weeks",
    book_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
  },
  {
    title: "The Hobbit",
    username: "Michael Brown",
    author: "J.R.R. Tolkien",
    published_date: "1937-09-21",
    genre: "Fantasy",
    isbn: "978-0-261-10295-2",
    description: "A nice book",
    condition: "New",
    borrow_length: "1 week",
    book_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
  },
  {
    title: "1984",
    username: "Alice Green",
    author: "George Orwell",
    published_date: "1949-06-08",
    genre: "Dystopian",
    isbn: "978-0-452-28423-4",
    description: "A nice book",
    condition: "Old",
    borrow_length: "2 weeks",
    book_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
  },
  {
    title: "The Catcher in the Rye",
    username: "David Black",
    author: "J.D. Salinger",
    published_date: "1951-07-16",
    genre: "Coming-of-location",
    isbn: "978-0-316-76948-0",
    description: "A nice book",
    condition: "New",
    borrow_length: "1 week",
    book_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
  },
  {
    title: "One Hundred Years of Solitude",
    username: "Sarah Blue",
    author: "Gabriel Garcia Marquez",
    published_date: "1967-05-30",
    genre: "Magical Realism",
    isbn: "978-0-06-112009-1",
    description: "A nice book",
    condition: "Old",
    borrow_length: "2 weeks",
    book_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTXgU-vt2koE7lGQcUZ2r4d03kOrDjsfFVye9cyJI4DOwseczvjqCZRqjOWL53u0IQUcs&usqp=CAU",
  },
];

const seedUsers = [
  {
    _id: new ObjectId("6594007551053b8f385697a3"),
    username: "John Doe",
    location: "Manchester",
    password: "Science Fiction",
    avatar_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
    bio: "hello my name is username",
    rating: 0,
    number_borrowed: 1,
    number_lent: 2,
  },
  {
    _id: new ObjectId("6594007551053b8f385697a4"),
    username: "Jane Smith",
    location: "Leeds",
    password: "Fiction",
    avatar_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
    bio: "hello my name is username",
    rating: 0,
    number_borrowed: 1,
    number_lent: 2,
  },
  {
    _id: new ObjectId("6594007551053b8f385697a5"),
    username: "Bob Johnson",
    location: "Liverpool",
    password: "Liverpool",
    avatar_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
    bio: "hello my name is username",
    rating: 0,
    number_borrowed: 1,
    number_lent: 2,
  },
  {
    _id: new ObjectId("6594007551053b8f385697a6"),
    username: "Emily White",
    location: "Manchester",
    password: "Leeds",
    avatar_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
    bio: "hello my name is username",
    rating: 0,
    number_borrowed: 1,
    number_lent: 2,
  },
  {
    _id: new ObjectId("6594007551053b8f385697a7"),
    username: "Michael Brown",
    location: "Liverpool",
    password: "Fantasy",
    avatar_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
    bio: "hello my name is username",
    rating: 0,
    number_borrowed: 1,
    number_lent: 2,
  },
  {
    _id: new ObjectId("6594007551053b8f385697a8"),
    username: "Alice Green",
    location: "Liverpool",
    password: "Dystopian",
    avatar_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
    bio: "hello my name is username",
    rating: 0,
    number_borrowed: 1,
    number_lent: 2,
  },
  {
    _id: new ObjectId("6594007551053b8f385697a9"),
    username: "David Black",
    location: "London",
    password: "Leeds",
    avatar_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
    bio: "hello my name is username",
    rating: 0,
    number_borrowed: 1,
    number_lent: 2,
  },
  {
    _id: new ObjectId("6594007551053b8f385697aa"),
    username: "Sarah Blue",
    location: "Liverpool",
    password: "Magical Realism",
    avatar_img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtsmhBWoeKAlvI672Yz9z-f_P1MO6efK1RCfhJKXPHQwBhv91X-hqlXbpNbJAej0wDMo&usqp=CAU",
    bio: "hello my name is username",
    rating: 0,
    number_borrowed: 1,
    number_lent: 2,
  },
];
const seedMessages = [
  {
    between: ["David Black", "Sarah Blue"],
    from: "Sarah Blue",
    timestamp: "2023/12/31 13:31",
    body: "Hello David",
  },
  {
    between: ["David Black", "Sarah Blue"],
    from: "David Black",
    timestamp: "2023/12/31 13:34",
    body: "Hello Sarah",
  },
  {
    between: ["David Black", "Sarah Blue"],
    from: "Sarah Blue",
    timestamp: "2023/12/31 13:36",
    body: "How are you David",
  },
  {
    between: ["David Black", "Sarah Blue"],
    from: "David Black",
    timestamp: "2023/12/31 13:40",
    body: "I am good Sarah",
  },
  {
    between: ["David Black", "Emily White"],
    from: "Alice Green",
    timestamp: "2023/12/31 13:40",
    body: "Hello, is anyone there?",
  },
];
const seedGenres = [
  {
    genre: "Mystery",
  },
  {
    genre: "Science Fiction",
  },
  {
    genre: "Dystopian",
  },
  {
    genre: "Magical Realism",
  },
  {
    genre: "Fiction",
  },
  {
    genre: "Classic",
  },
  {
    genre: "Fantasy",
  },
  {
    genre: "Coming-of-Age",
  },
];

const seedDB = async () => {
  await Book.collection.dropIndexes();
  await Book.deleteMany({});
  await User.deleteMany({});
  await Message.deleteMany({});
  await Genre.deleteMany({});
  await Book.insertMany(seedBooks);
  await User.insertMany(seedUsers);
  await Message.insertMany(seedMessages);
  await Genre.insertMany(seedGenres);
  await Book.createIndexes({
    title: "text",
    username: "text",
    author: "text",
    published_date: "text",
    genre: "text",
    isbn: "text",
    description: "text",
    condition: "text",
    borrow_length: "text",
  });
};

module.exports = seedDB;
