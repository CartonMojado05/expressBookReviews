```javascript
const express = require('express');
let books = require("./booksdb.js");
const auth_users = require("./auth_users.js");

let isValid = auth_users.isValid;
let users = auth_users.users;

const public_users = express.Router();
const axios = require('axios');


// Register user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    const userExists = users.some(
        (user) => user.username === username
    );

    if (userExists) {
        return res.status(409).json({
            message: "User already exists!"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "Customer successfully registered. Now you can login"
    });
});


// Task 10:
// Get the book list available in the shop
// using async-await with Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(
            'http://localhost:3000/'
        );

        return res.status(200).json(response.data);

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching books",
            error: error.message
        });
    }
});


// Task 11:
// Get book details based on ISBN
// using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(
            `http://localhost:3000/isbn/${isbn}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(
                error.response.data
            );
        }

        return res.status(500).json({
            message: "Error fetching book by ISBN",
            error: error.message
        });
    }
});


// Task 12:
// Get book details based on author
// using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const response = await axios.get(
            `http://localhost:3000/author/${encodeURIComponent(author)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(
                error.response.data
            );
        }

        return res.status(500).json({
            message: "Error fetching books by author",
            error: error.message
        });
    }
});


// Task 13:
// Get all books based on title
// using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const response = await axios.get(
            `http://localhost:3000/title/${encodeURIComponent(title)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(
                error.response.data
            );
        }

        return res.status(500).json({
            message: "Error fetching books by title",
            error: error.message
        });
    }
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(
            books[isbn].reviews
        );
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


module.exports.general = public_users;
```
