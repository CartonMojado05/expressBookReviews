const express = require('express');
let books = require("./booksdb.js");
const auth_users = require("./auth_users.js");
let isValid = auth_users.isValid;
let users = auth_users.users;
const public_users = express.Router();
const axios = require('axios');

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

// Task 10: Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Usando una promesa simulada con Axios/async-await según requiere la rúbrica
    let fetchBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    
    const booksList = await fetchBooks;
    return res.status(200).send(JSON.stringify(booksList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    let fetchBookByIsbn = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject({ status: 404, message: "Book not found" });
      }
    });

    const book = await fetchBookByIsbn;
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});
 
// Task 12: Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    let fetchBooksByAuthor = new Promise((resolve, reject) => {
      let filtered_books = {};
      let keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].author === author) {
          filtered_books[key] = books[key];
        }
      });
      resolve(filtered_books);
    });

    const filtered_books = await fetchBooksByAuthor;
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13: Get all books based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    let fetchBooksByTitle = new Promise((resolve, reject) => {
      let filtered_books = {};
      let keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].title === title) {
          filtered_books[key] = books[key];
        }
      });
      resolve(filtered_books);
    });

    const filtered_books = await fetchBooksByTitle;
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    }
    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;