```javascript
const express = require('express');
const books = require('./booksdb.js');
const auth_users = require('./auth_users.js');
const axios = require('axios');

const isValid = auth_users.isValid;
const users = auth_users.users;

const public_users = express.Router();

/*
 * Register a new user.
 * Validates that username and password are provided
 * and prevents duplicate usernames.
 */
public_users.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    const userExists = users.some(
        (user) => user.username === username
    );

    if (userExists) {
        return res.status(409).json({
            message: 'User already exists!'
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: 'Customer successfully registered. Now you can login'
    });
});


/*
 * Task 10:
 * Get the complete list of books.
 *
 * Axios is used together with async/await to perform
 * the asynchronous HTTP request.
 */
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(
            'http://localhost:3000/books'
        );

        return res.status(200).json(response.data);

    } catch (error) {
        // Consistent error response for Axios errors.
        if (error.response) {
            return res.status(error.response.status).json({
                message: 'Error fetching books',
                error: error.response.data
            });
        }

        return res.status(500).json({
            message: 'Error fetching books',
            error: error.message
        });
    }
});


/*
 * Task 11:
 * Get a book by ISBN.
 *
 * The ISBN parameter is validated before making
 * the Axios request.
 */
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    // Validate that an ISBN was provided.
    if (!isbn || isbn.trim() === '') {
        return res.status(400).json({
            message: 'ISBN is required'
        });
    }

    try {
        const response = await axios.get(
            `http://localhost:3000/isbn/${encodeURIComponent(isbn)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        // If the requested book does not exist,
        // return the status received from the API.
        if (error.response) {
            return res.status(error.response.status).json({
                message: 'Error fetching book by ISBN',
                error: error.response.data
            });
        }

        return res.status(500).json({
            message: 'Error fetching book by ISBN',
            error: error.message
        });
    }
});


/*
 * Task 12:
 * Get all books written by a specific author.
 *
 * The author parameter is validated and encoded
 * before being included in the request URL.
 */
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    // Validate the author parameter.
    if (!author || author.trim() === '') {
        return res.status(400).json({
            message: 'Author is required'
        });
    }

    try {
        const response = await axios.get(
            `http://localhost:3000/author/${encodeURIComponent(author)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        // Handle HTTP errors returned by Axios.
        if (error.response) {
            return res.status(error.response.status).json({
                message: 'Error fetching books by author',
                error: error.response.data
            });
        }

        // Handle connection or unexpected errors.
        return res.status(500).json({
            message: 'Error fetching books by author',
            error: error.message
        });
    }
});


/*
 * Task 13:
 * Get all books with a specific title.
 *
 * The title parameter is validated and encoded
 * to safely use it in the request URL.
 */
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    // Validate the title parameter.
    if (!title || title.trim() === '') {
        return res.status(400).json({
            message: 'Title is required'
        });
    }

    try {
        const response = await axios.get(
            `http://localhost:3000/title/${encodeURIComponent(title)}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        // Handle HTTP errors returned by Axios.
        if (error.response) {
            return res.status(error.response.status).json({
                message: 'Error fetching books by title',
                error: error.response.data
            });
        }

        // Handle connection or unexpected errors.
        return res.status(500).json({
            message: 'Error fetching books by title',
            error: error.message
        });
    }
});


/*
 * Get reviews for a specific book using its ISBN.
 *
 * This endpoint uses the local books database because
 * the reviews are already stored in booksdb.js.
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Validate ISBN before accessing the database.
    if (!isbn || isbn.trim() === '') {
        return res.status(400).json({
            message: 'ISBN is required'
        });
    }

    // Check whether the requested book exists.
    if (!books[isbn]) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    return res.status(200).json(
        books[isbn].reviews
    );
});


module.exports.general = public_users;
```
