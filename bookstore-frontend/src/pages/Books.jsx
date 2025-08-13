/**
 * Books Page Component
 * This page shows all the books in our bookstore
 * Students can search for books, filter by genre, and manage inventory
 *
 * Made by: University Student
 * Course: Web Development Project
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI, handleAPIError } from '../services/api';

const Books = () => {
  // State variables to store our data
  const [books, setBooks] = useState([]); // This will hold all our books
  const [loading, setLoading] = useState(true); // Shows loading spinner
  const [error, setError] = useState(null); // For error messages
  const [pagination, setPagination] = useState({}); // Pagination info from API

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(''); // What user is searching for
  const [selectedGenre, setSelectedGenre] = useState(''); // Selected genre filter
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [limit] = useState(10); // How many books per page

  // List of all available genres - hardcoded for now
  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Technical'];

  // This useEffect runs when the component loads or when page/genre changes
  // For search, we'll use a separate debounced effect
  useEffect(() => {
    console.log('useEffect triggered - fetching books...'); // Debug log
    fetchBooks();
  }, [currentPage, selectedGenre]); // Removed searchQuery from dependencies

  // Separate useEffect for debounced search - waits 500ms after user stops typing
  useEffect(() => {
    if (searchQuery === '') {
      // If search is empty, fetch immediately
      fetchBooks();
      return;
    }

    console.log('Setting up search timer for:', searchQuery); // Debug log
    const searchTimer = setTimeout(() => {
      console.log('Search timer fired - searching for:', searchQuery); // Debug log
      fetchBooks();
    }, 500); // Wait 500ms after user stops typing

    // Cleanup function - cancels the timer if user types again
    return () => {
      console.log('Clearing search timer'); // Debug log
      clearTimeout(searchTimer);
    };
  }, [searchQuery]); // Only depends on searchQuery

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters for API call
      const params = {
        page: currentPage,
        limit: limit,
      };

      // Add search query if user typed something
      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
        console.log('Searching for:', searchQuery.trim()); // Debug log
      }

      // Add genre filter if selected
      if (selectedGenre) {
        params.genre = selectedGenre;
        console.log('Filtering by genre:', selectedGenre); // Debug log
      }

      console.log('API params:', params); // Debug - see what we're sending to API

      const response = await booksAPI.getAll(params);
      console.log('API response:', response); // Debug - see what we got back

      setBooks(response.data || []);
      setPagination(response.pagination || {});

    } catch (err) {
      console.error('Error fetching books:', err);
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change - this runs every time user types
  const handleSearchChange = (e) => {
    const newSearchQuery = e.target.value;
    console.log('User typed:', newSearchQuery); // Debug what user is typing
    setSearchQuery(newSearchQuery);
    setCurrentPage(1); // Reset to first page when searching

    // Note: search will be debounced by useEffect
  };

  // Handle Enter key press for immediate search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('User pressed Enter - searching immediately'); // Debug log
      fetchBooks(); // Search immediately when Enter is pressed
    }
  };

  // Handle genre filter change
  const handleGenreChange = (e) => {
    const newGenre = e.target.value;
    console.log('User selected genre:', newGenre); // Debug log
    setSelectedGenre(newGenre);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Simple function to test if search is working - for debugging
  const testSearch = () => {
    console.log('Current search query:', searchQuery);
    console.log('Current genre filter:', selectedGenre);
    console.log('Current page:', currentPage);
  };

  // Function to delete a book - asks user to confirm first
  const handleDeleteBook = async (bookId, bookTitle) => {
    // Ask user if they really want to delete
    const userConfirmed = window.confirm(`Are you sure you want to delete "${bookTitle}"?`);
    if (!userConfirmed) {
      console.log('User cancelled deletion'); // Debug log
      return; // Exit function if user says no
    }

    try {
      console.log('Deleting book with ID:', bookId); // Debug log
      await booksAPI.delete(bookId); // Call API to delete book
      fetchBooks(); // Refresh the list to show updated data
      alert('Book deleted successfully!'); // Show success message
    } catch (err) {
      console.error('Error deleting book:', err); // Log the error
      const errorInfo = handleAPIError(err);
      alert(`Failed to delete book: ${errorInfo.message}`); // Show error to user
    }
  };

  // Function to update stock - student might write this in a simple way
  const updateStock = async (bookId, currentStock) => {
    // Simple prompt to get new stock value
    const newStockValue = prompt(`Update stock for this book (current: ${currentStock}):`);

    if (newStockValue === null) return; // User clicked cancel

    const stockNum = parseInt(newStockValue); // Convert to number
    if (isNaN(stockNum) || stockNum < 0) {
      alert('Please enter a valid stock number (0 or greater)');
      return;
    }

    try {
      console.log('Updating stock to:', stockNum); // Debug log
      await booksAPI.updateStock(bookId, stockNum);
      fetchBooks(); // Refresh data
      alert('Stock updated successfully!');
    } catch (err) {
      console.error('Error updating stock:', err);
      const errorInfo = handleAPIError(err);
      alert(`Failed to update stock: ${errorInfo.message}`);
    }
  };



  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="books-page">
        <div className="loading">
          <h2>📚 Loading Books...</h2>
          <p>Fetching your book collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="books-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Books Management</h1>
          <p>Manage your book inventory</p>
        </div>
        <Link to="/books/new" className="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add New Book
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="controls">
        <div className="search-box">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search books by title or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-box">
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="filter-select"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Debug button - student might add this for testing */}
        <button onClick={testSearch} className="btn btn-secondary" style={{fontSize: '0.8rem'}}>
          Debug Search
        </button>
      </div>

      {/* Debug info - student might add this for testing */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px'}}>
          <strong>Debug Info:</strong> Search: "{searchQuery}" | Genre: "{selectedGenre}" | Page: {currentPage} | Total Books: {books.length}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error">
          <p>❌ {error}</p>
          <button onClick={fetchBooks} className="btn btn-secondary">
            🔄 Retry
          </button>
        </div>
      )}

      {/* Books List */}
      {books.length > 0 ? (
        <>
          <div className="books-grid">
            {books.map(book => (
              <div key={book._id} className="book-card">
                <div className="book-header">
                  <h3 className="book-title">{book.title}</h3>
                  <span className="book-genre">{book.genre}</span>
                </div>
                
                <div className="book-info">
                  <p className="book-author">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    {book.author?.name || 'Unknown Author'}
                  </p>
                  <p className="book-isbn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z"/>
                    </svg>
                    ISBN: {book.isbn}
                  </p>
                  <p className="book-price">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 15h7v2H7zm0-4h10v2H7zm0-4h10v2H7zm-3 0h2v2H4zm0 4h2v2H4zm0 4h2v2H4z"/>
                    </svg>
                    ₹{book.price}
                  </p>
                  <p className={`book-stock ${book.stock < 10 ? 'low-stock' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 6h-2c0-2.21-1.79-4-4-4S10 3.79 10 6H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM14 6c0-1.1-.9-2-2-2s-2 .9-2 2h4z"/>
                    </svg>
                    Stock: {book.stock}
                    {book.stock < 10 && (
                      <span className="warning">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                        </svg>
                        Low Stock
                      </span>
                    )}
                  </p>
                  {book.description && (
                    <p className="book-description">{book.description}</p>
                  )}
                </div>

                <div className="book-actions">
                  <Link
                    to={`/books/edit/${book._id}`}
                    className="btn btn-sm btn-secondary"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    Edit
                  </Link>

                  <button
                    onClick={() => updateStock(book._id, book.stock)}
                    className="btn btn-sm btn-info"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 6h-2c0-2.21-1.79-4-4-4S10 3.79 10 6H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
                    </svg>
                    Stock
                  </button>

                  <button
                    onClick={() => handleDeleteBook(book._id, book.title)}
                    className="btn btn-sm btn-danger"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="btn btn-secondary"
              >
                ← Previous
              </button>
              
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
                ({pagination.totalBooks} total books)
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="btn btn-secondary"
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-data">
          <h3>📚 No Books Found</h3>
          {searchQuery || selectedGenre ? (
            <p>No books match your current search or filter criteria.</p>
          ) : (
            <p>You haven't added any books yet.</p>
          )}
          <Link to="/books/new" className="btn btn-primary">
            ➕ Add Your First Book
          </Link>
        </div>
      )}
    </div>
  );
};

export default Books;
