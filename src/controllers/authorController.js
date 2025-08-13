const Author = require('../models/Author');
const Book = require('../models/Book');

/**
 * Author Controller
 * Handles all author-related operations for the bookstore API
 * 
 * This controller provides CRUD operations for authors including:
 * - Creating new authors
 * - Retrieving authors with filtering and pagination
 * - Updating author information
 * - Deleting authors (with validation)
 */

/**
 * Create a new author
 * POST /api/authors
 */
const createAuthor = async (req, res) => {
  try {
    const { name, email, nationality, birthDate, biography, website, awards } = req.body;

    // Create new author
    const author = new Author({
      name,
      email,
      nationality,
      birthDate,
      biography,
      website,
      awards
    });

    const savedAuthor = await author.save();

    res.status(201).json({
      success: true,
      message: 'Author created successfully',
      data: savedAuthor
    });
  } catch (error) {
    console.error('Error creating author:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create author'
    });
  }
};

/**
 * Get all authors with filtering and pagination
 * GET /api/authors?limit=10&page=1&nationality=American
 */
const getAllAuthors = async (req, res) => {
  try {
    const { limit = 10, page = 1, nationality } = req.query;
    
    // Build query object
    const query = {};
    
    // Filter by nationality if provided
    if (nationality) {
      query.nationality = { $regex: nationality, $options: 'i' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const authors = await Author.find(query)
      .sort({ name: 1 }) // Sort alphabetically by name
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination info
    const total = await Author.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: authors,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalAuthors: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch authors'
    });
  }
};

/**
 * Get a single author by ID
 * GET /api/authors/:id
 */
const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    // Get books by this author
    const books = await Book.find({ author: req.params.id })
      .select('title isbn genre price stock publishedDate');

    // Add books to author data
    const authorWithBooks = {
      ...author.toObject(),
      books: books
    };

    res.json({
      success: true,
      data: authorWithBooks
    });
  } catch (error) {
    console.error('Error fetching author:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch author'
    });
  }
};

/**
 * Update an author completely
 * PUT /api/authors/:id
 */
const updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    res.json({
      success: true,
      message: 'Author updated successfully',
      data: author
    });
  } catch (error) {
    console.error('Error updating author:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update author'
    });
  }
};

/**
 * Delete an author
 * DELETE /api/authors/:id
 */
const deleteAuthor = async (req, res) => {
  try {
    // Check if author has any books
    const booksCount = await Book.countDocuments({ author: req.params.id });
    
    if (booksCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete author. They have ${booksCount} book(s) in the system. Please reassign or delete the books first.`
      });
    }

    const author = await Author.findByIdAndDelete(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    res.json({
      success: true,
      message: 'Author deleted successfully',
      data: author
    });
  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete author'
    });
  }
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor
};
