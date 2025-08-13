const express = require('express');
const {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor
} = require('../controllers/authorController');

/**
 * Author Routes
 * Defines all the routes for author-related operations
 * 
 * Base URL: /api/authors
 */

const router = express.Router();

/**
 * @route   POST /api/authors
 * @desc    Create a new author
 * @access  Public
 * @body    { name, email, nationality, birthDate, biography, website, awards }
 */
router.post('/', createAuthor);

/**
 * @route   GET /api/authors
 * @desc    Get all authors with optional filtering and pagination
 * @access  Public
 * @query   limit, page, nationality
 * @example GET /api/authors?limit=5&page=1&nationality=American
 */
router.get('/', getAllAuthors);

/**
 * @route   GET /api/authors/:id
 * @desc    Get a single author by ID (includes their books)
 * @access  Public
 * @params  id - Author ID
 */
router.get('/:id', getAuthorById);

/**
 * @route   PUT /api/authors/:id
 * @desc    Update an author completely (replace all fields)
 * @access  Public
 * @params  id - Author ID
 * @body    { name, email, nationality, birthDate, biography, website, awards }
 */
router.put('/:id', updateAuthor);

/**
 * @route   DELETE /api/authors/:id
 * @desc    Delete an author (only if they have no books)
 * @access  Public
 * @params  id - Author ID
 */
router.delete('/:id', deleteAuthor);

module.exports = router;
