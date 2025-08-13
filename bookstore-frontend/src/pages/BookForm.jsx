/**
 * Book Form Component
 * Handles creating and editing books
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { booksAPI, authorsAPI, handleAPIError } from '../services/api';

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get book ID from URL if editing
  const isEditing = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    price: '',
    stock: '',
    description: '',
    publishedDate: '',
    pages: ''
  });

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Available genres
  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Technical'];

  // Fetch data when component mounts
  useEffect(() => {
    fetchAuthors();
    if (isEditing) {
      fetchBook();
    }
  }, [id]);

  const fetchAuthors = async () => {
    try {
      const response = await authorsAPI.getAll({ limit: 100 }); // Get all authors
      setAuthors(response.data || []);
    } catch (err) {
      console.error('Error fetching authors:', err);
    }
  };

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getById(id);
      const book = response.data;
      
      // Format date for input field
      const publishedDate = book.publishedDate 
        ? new Date(book.publishedDate).toISOString().split('T')[0] 
        : '';

      setFormData({
        title: book.title || '',
        author: book.author?._id || '',
        isbn: book.isbn || '',
        genre: book.genre || '',
        price: book.price?.toString() || '',
        stock: book.stock?.toString() || '',
        description: book.description || '',
        publishedDate: publishedDate,
        pages: book.pages?.toString() || ''
      });
    } catch (err) {
      console.error('Error fetching book:', err);
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        pages: formData.pages ? parseInt(formData.pages) : undefined
      };

      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      if (isEditing) {
        await booksAPI.update(id, submitData);
        alert('Book updated successfully!');
      } else {
        await booksAPI.create(submitData);
        alert('Book created successfully!');
      }

      navigate('/books');
    } catch (err) {
      console.error('Error saving book:', err);
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="book-form-page">
        <div className="loading">
          <h2>📚 Loading Book...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="book-form-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>{isEditing ? '✏️ Edit Book' : '➕ Add New Book'}</h1>
        <button 
          onClick={() => navigate('/books')} 
          className="btn btn-secondary"
        >
          ← Back to Books
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Book Form */}
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-grid">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter book title"
            />
          </div>

          {/* Author */}
          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <select
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            >
              <option value="">Select an author</option>
              {authors.map(author => (
                <option key={author._id} value={author._id}>
                  {author.name}
                </option>
              ))}
            </select>
            <small>Don't see the author? <a href="/authors/new" target="_blank">Add a new author</a></small>
          </div>

          {/* ISBN */}
          <div className="form-group">
            <label htmlFor="isbn">ISBN *</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
              placeholder="Enter ISBN (10 or 13 digits)"
            />
          </div>

          {/* Genre */}
          <div className="form-group">
            <label htmlFor="genre">Genre *</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            >
              <option value="">Select a genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="1"
              placeholder="0"
            />
          </div>

          {/* Stock */}
          <div className="form-group">
            <label htmlFor="stock">Stock Quantity *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

          {/* Published Date */}
          <div className="form-group">
            <label htmlFor="publishedDate">Published Date</label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
            />
          </div>

          {/* Pages */}
          <div className="form-group">
            <label htmlFor="pages">Number of Pages</label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              min="1"
              placeholder="0"
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter book description..."
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="btn btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? '⏳ Saving...' : (isEditing ? '💾 Update Book' : '➕ Create Book')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
