const express = require('express');
let books = require("./booksdb.js");
const auth_users = require("./auth_users.js");
let isValid = auth_users.isValid;
let users = auth_users.users; // Usamos la misma referencia de usuarios
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
 
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
 
    const userExists = users.some((user) => user.username === username);
 
    if (userExists) {
      return res.status(409).json({ message: "User already exists!" });
    }
 
    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks
    .then((booksList) => {
      return res.status(200).send(JSON.stringify(booksList, null, 4));
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching books" });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});
 
// Get book details based on author
// Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    const getBooksByAuthor = new Promise((resolve, reject) => {
      let filtered_books = {};
      let keys = Object.keys(books);
      
      keys.forEach((key) => {
        if (books[key].author === author) {
          filtered_books[key] = books[key];
        }
      });
  
      resolve(filtered_books);
    });
  
    getBooksByAuthor
      .then((filtered_books) => {
        return res.status(200).send(JSON.stringify(filtered_books, null, 4));
      })
      .catch((error) => {
        return res.status(500).json({ message: "Error fetching books by author" });
      });
  });

// Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    const getBooksByTitle = new Promise((resolve, reject) => {
      let filtered_books = {};
      let keys = Object.keys(books);
      
      keys.forEach((key) => {
        if (books[key].title === title) {
          filtered_books[key] = books[key];
        }
      });
  
      resolve(filtered_books);
    });
  
    getBooksByTitle
      .then((filtered_books) => {
        return res.status(200).send(JSON.stringify(filtered_books, null, 4));
      })
      .catch((error) => {
        return res.status(500).json({ message: "Error fetching books by title" });
      });
  });

// Get book review
// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    const getBookByIsbn = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject({ status: 404, message: "Book not found" });
      }
    });
  
    getBookByIsbn
      .then((book) => {
        return res.status(200).send(JSON.stringify(book, null, 4));
      })
      .catch((error) => {
        return res.status(error.status || 500).json({ message: error.message });
      });
  });

module.exports.general = public_users;
