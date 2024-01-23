const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user to the users object (you should handle password hashing in a real application)
  users[username] = { username, password };

  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json({ book: book });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = books.filter((b) => b.author === author);

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "Books by author not found" });
  }

  return res.status(200).json({ books: booksByAuthor });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksWithTitle = books.filter((b) => b.title.includes(title));

  if (booksWithTitle.length === 0) {
    return res.status(404).json({ message: "Books with title not found" });
  }

  return res.status(200).json({ books: booksWithTitle });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find((b) => b.isbn === isbn);

  if (!book || !book.review) {
    return res.status(404).json({ message: "Review not found for the book" });
  }

  return res.status(200).json({ review: book.review });
});

module.exports.general = public_users;
