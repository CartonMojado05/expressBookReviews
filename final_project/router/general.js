javascript
const express = require('express');
const books = require('./booksdb.js');
const auth_users = require('./auth_users.js');
const axios = require('axios');

const isValid = auth_users.isValid;
const users = auth_users.users;

const public_users = express.Router();


/*
 * ============================================================
 * USER REGISTRATION
 * ============================================================
 *
 * Registers a new user after validating the username
 * and password. Duplicate usernames are not allowed.
 */
public_users.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Validate that both required fields were provided.
    if (
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        username.trim() === '' ||
        password.trim() === ''
    ) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    // Check whether the username is already registered.
    const userExists = users.some(
        (user) => user.username === username.trim()
    );

    if (userExists) {
        return res.status(409).json({
            message: 'User already exists!'
        });
    }

    // Store the new user.
    users.push({
        username: username.trim(),
        password: password
    });

    return res.status(200).json({
        message: 'Customer successfully registered. Now you can login'
    });
});


/*
 * ============================================================
 * TASK 10 - GET ALL BOOKS
 * ============================================================
 *
 * Uses async/await with Axios to retrieve the complete
 * list of books from the API.
 */
public_users.get('/', async function (req, res) {
    try {
        // Axios performs the asynchronous HTTP request.
        const response = await axios.get(
            'http://localhost:3000/books'
        );

        // Return the data received from the API.
        return res.status(200).json(response.data);

    } catch (error) {
        /*
         * If Axios receives an HTTP error response,
         * return the same status code and useful information.
         */
        if (error.response) {
            return res.status(error.response.status).json({
                message: 'Error fetching books',
                error: error.response.data
            });
        }

        // Handle connection errors and unexpected errors.
        return res.status(500).json({
            message: 'Error fetching books',
            error: error.message
        });
    }
});


/*
 * ============================================================
 * TASK 11 - GET BOOK BY ISBN
 * ============================================================
 *
 * Retrieves a specific book using its ISBN.
 * The ISBN is validated before making the request.
 */
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    /*
     * Validate that the ISBN exists and is not empty.
     * trim() also prevents values containing only spaces.
     */
    if (
        typeof isbn !== 'string' ||
        isbn.trim() === ''
    ) {
        return res.status(400).json({
            message: 'ISBN is required and cannot be empty'
        });
    }

    /*
     * Validate the ISBN format.
     * This accepts ISBN values containing digits and
     * optional hyphens.
     */
    const isbnPattern = /^[0-9-]+$/;

    if (!isbnPattern.test(isbn.trim())) {
        return res.status(400).json({
            message: 'Invalid ISBN format'
        });
    }

    try {
        /*
         * encodeURIComponent prevents special characters
         * from breaking the request URL.
         */
        const response = await axios.get(
            `http://localhost:3000/isbn/${encodeURIComponent(isbn.trim())}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        /*
         * Axios provides error.response when the server
         * returned an HTTP error such as 404.
         */
        if (error.response) {
            return res.status(error.response.status).json({
                message: 'Error fetching book by ISBN',
                error: error.response.data
            });
        }

        // Handle network and unexpected errors.
        return res.status(500).json({
            message: 'Error fetching book by ISBN',
            error: error.message
        });
    }
});


/*
 * ============================================================
 * TASK 12 - GET BOOKS BY AUTHOR
 * ============================================================
 *
 * Retrieves all books written by the specified author.
 * The author parameter is validated before the request.
 */
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    /*
     * Check that the author parameter exists,
     * is a string and contains actual characters.
     */
    if (
        typeof author !== 'string' ||
        author.trim() === ''
    ) {
        return res.status(400).json({
            message: 'Author is required and cannot be empty'
        });
    }

    try {
        /*
         * encodeURIComponent allows author names containing
         * spaces and special characters to be safely sent.
         */
        const response = await axios.get(
            `http://localhost:3000/author/${encodeURIComponent(author.trim())}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        /*
         * Return the HTTP status received from the API
         * when Axios receives an error response.
         */
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
 * ============================================================
 * TASK 13 - GET BOOKS BY TITLE
 * ============================================================
 *
 * Retrieves all books that match the specified title.
 * The title parameter is validated before the request.
 */
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    /*
     * Validate that the title exists and is not empty.
     */
    if (
        typeof title !== 'string' ||
        title.trim() === ''
    ) {
        return res.status(400).json({
            message: 'Title is required and cannot be empty'
        });
    }

    try {
        /*
         * encodeURIComponent protects the URL when the title
         * contains spaces, symbols or other special characters.
         */
        const response = await axios.get(
            `http://localhost:3000/title/${encodeURIComponent(title.trim())}`
        );

        return res.status(200).json(response.data);

    } catch (error) {
        /*
         * Handle errors returned by the API consistently.
         */
        if (error.response) {
            return res.status(error.response.status).json({
                message: 'Error fetching books by title',
                error: error.response.data
            });
        }

        // Handle network and unexpected errors.
        return res.status(500).json({
            message: 'Error fetching books by title',
            error: error.message
        });
    }
});


/*
 * ============================================================
 * GET BOOK REVIEWS
 * ============================================================
 *
 * Returns the reviews associated with a specific ISBN.
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Validate the ISBN parameter.
    if (
        typeof isbn !== 'string' ||
        isbn.trim() === ''
    ) {
        return res.status(400).json({
            message: 'ISBN is required and cannot be empty'
        });
    }

    // Validate the ISBN format.
    const isbnPattern = /^[0-9-]+$/;

    if (!isbnPattern.test(isbn.trim())) {
        return res.status(400).json({
            message: 'Invalid ISBN format'
        });
    }

    /*
     * Check whether the requested book exists
     * in the local books database.
     */
    if (!books[isbn.trim()]) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }

    // Return the reviews associated with the book.
    return res.status(200).json(
        books[isbn.trim()].reviews
    );
});


/*
 * Export the router so it can be used by the main
 * Express application.
 */
module.exports.general = public_users;
```

