const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Write code to check if the username is valid (you may implement additional validation rules)
  return /^[a-zA-Z0-9_]+$/.test(username);
}

const authenticatedUser = (username, password) => {
  // Write code to check if the username and password match the ones we have in records.
  const user = users.find(u => u.username === username && u.password === password);
  return !!user;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username format" });
  }

  // Check if the user is authenticated
  if (authenticatedUser(username, password)) {
    // Generate and send a JWT token upon successful login
    const token = jwt.sign({ username: username }, "yourSecretKey", { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token: token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add a book review (assuming a user is already authenticated using the JWT token)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Check if the review is provided
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Find the book by ISBN and update the review
  const bookIndex = books.findIndex(b => b.isbn === isbn);
  if (bookIndex !== -1) {
    books[bookIndex].review = review;
    return res.status(200).json({ message: "Review added successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
