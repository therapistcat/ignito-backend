const express = require('express');
const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  patchBook,
  updateBookStock,
  deleteBook
} = require('../controllers/bookController');

/**
 * Book Routes
 * Defines all the routes for book-related operations
 * 
 * Base URL: /api/books
 */

const router = express.Router();

/**
 * @route   POST /api/books
 * @desc    Create a new book
 * @access  Public
 * @body    { title, author, isbn, genre, price, stock, description, publishedDate, pages }
 */
router.post('/', createBook);

/**
 * @route   GET /api/books
 * @desc    Get all books with optional filtering and pagination
 * @access  Public
 * @query   limit, page, genre, q (search query)
 * @example GET /api/books?limit=5&page=1&genre=Fiction&q=harry
 */
router.get('/', getAllBooks);

/**
 * @route   GET /api/books/:id
 * @desc    Get a single book by ID
 * @access  Public
 * @params  id - Book ID
 */
router.get('/:id', getBookById);

/**
 * @route   PUT /api/books/:id
 * @desc    Update a book completely (replace all fields)
 * @access  Public
 * @params  id - Book ID
 * @body    { title, author, isbn, genre, price, stock, description, publishedDate, pages }
 */
router.put('/:id', updateBook);

/**
 * @route   PATCH /api/books/:id
 * @desc    Update a book partially (update only provided fields)
 * @access  Public
 * @params  id - Book ID
 * @body    Any subset of book fields
 */
router.patch('/:id', patchBook);

/**
 * @route   PATCH /api/books/:id/stock
 * @desc    Update only the stock quantity of a book
 * @access  Public
 * @params  id - Book ID
 * @body    { stock }
 */
router.patch('/:id/stock', updateBookStock);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book
 * @access  Public
 * @params  id - Book ID
 */
router.delete('/:id', deleteBook);

module.exports = router;
