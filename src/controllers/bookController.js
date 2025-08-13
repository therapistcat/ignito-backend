const Book = require('../models/Book');
const Author = require('../models/Author');

/**
 * Book Controller
 * Handles all book-related operations for the bookstore API
 * 
 * This controller provides CRUD operations for books including:
 * - Creating new books
 * - Retrieving books with filtering and pagination
 * - Updating book information
 * - Managing book stock
 * - Deleting books
 */

/**
 * Create a new book
 * POST /api/books
 */
const createBook = async (req, res) => {
  try {
    const { title, author, isbn, genre, price, stock, description, publishedDate, pages } = req.body;

    // Validate that the author exists
    const authorExists = await Author.findById(author);
    if (!authorExists) {
      return res.status(400).json({
        success: false,
        message: 'Author not found'
      });
    }

    // Create new book
    const book = new Book({
      title,
      author,
      isbn,
      genre,
      price,
      stock,
      description,
      publishedDate,
      pages
    });

    const savedBook = await book.save();
    
    // Populate author information in response
    await savedBook.populate('author', 'name nationality');

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: savedBook
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create book'
    });
  }
};

/**
 * Get all books with filtering and pagination
 * GET /api/books?limit=10&page=1&genre=Fiction&q=search
 */
const getAllBooks = async (req, res) => {
  try {
    const { limit = 10, page = 1, genre, q } = req.query;
    
    // Build query object
    const query = {};
    
    // Filter by genre if provided
    if (genre) {
      query.genre = genre;
    }
    
    // Text search if query provided
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const books = await Book.find(query)
      .populate('author', 'name nationality')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination info
    const total = await Book.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: books,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBooks: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books'
    });
  }
};

/**
 * Get a single book by ID
 * GET /api/books/:id
 */
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('author', 'name nationality biography website');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch book'
    });
  }
};

/**
 * Update a book completely
 * PUT /api/books/:id
 */
const updateBook = async (req, res) => {
  try {
    const { author } = req.body;

    // Validate author exists if provided
    if (author) {
      const authorExists = await Author.findById(author);
      if (!authorExists) {
        return res.status(400).json({
          success: false,
          message: 'Author not found'
        });
      }
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name nationality');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update book'
    });
  }
};

/**
 * Update book partially
 * PATCH /api/books/:id
 */
const patchBook = async (req, res) => {
  try {
    const { author } = req.body;

    // Validate author exists if provided
    if (author) {
      const authorExists = await Author.findById(author);
      if (!authorExists) {
        return res.status(400).json({
          success: false,
          message: 'Author not found'
        });
      }
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name nationality');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update book'
    });
  }
};

/**
 * Update book stock only
 * PATCH /api/books/:id/stock
 */
const updateBookStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock quantity is required'
      });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    ).populate('author', 'name nationality');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book stock updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Error updating book stock:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update book stock'
    });
  }
};

/**
 * Delete a book
 * DELETE /api/books/:id
 */
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully',
      data: book
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete book'
    });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  patchBook,
  updateBookStock,
  deleteBook
};
