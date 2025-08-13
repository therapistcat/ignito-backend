/**
 * Authors Page Component
 * Displays all authors with management capabilities
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authorsAPI, handleAPIError } from '../services/api';

const Authors = () => {
  // State management
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  
  // Filter state
  const [selectedNationality, setSelectedNationality] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);

  // Fetch authors when component mounts or filters change
  useEffect(() => {
    fetchAuthors();
  }, [currentPage, selectedNationality]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {
        page: currentPage,
        limit: limit,
      };

      if (selectedNationality) {
        params.nationality = selectedNationality;
      }

      const response = await authorsAPI.getAll(params);
      setAuthors(response.data || []);
      setPagination(response.pagination || {});

    } catch (err) {
      console.error('Error fetching authors:', err);
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle nationality filter change
  const handleNationalityChange = (e) => {
    setSelectedNationality(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle author deletion
  const handleDeleteAuthor = async (authorId, authorName) => {
    if (!window.confirm(`Are you sure you want to delete "${authorName}"? This will fail if the author has books.`)) {
      return;
    }

    try {
      await authorsAPI.delete(authorId);
      // Refresh the authors list
      fetchAuthors();
      alert('Author deleted successfully!');
    } catch (err) {
      console.error('Error deleting author:', err);
      const errorInfo = handleAPIError(err);
      alert(`Failed to delete author: ${errorInfo.message}`);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Get unique nationalities for filter
  const nationalities = [...new Set(authors.map(author => author.nationality).filter(Boolean))];

  if (loading) {
    return (
      <div className="authors-page">
        <div className="loading">
          <h2>👨‍💼 Loading Authors...</h2>
          <p>Fetching author information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="authors-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>👨‍💼 Authors Management</h1>
        <Link to="/authors/new" className="btn btn-primary">
          ➕ Add New Author
        </Link>
      </div>

      {/* Filter Controls */}
      <div className="controls">
        <div className="filter-box">
          <select
            value={selectedNationality}
            onChange={handleNationalityChange}
            className="filter-select"
          >
            <option value="">All Nationalities</option>
            {nationalities.map(nationality => (
              <option key={nationality} value={nationality}>{nationality}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error">
          <p>❌ {error}</p>
          <button onClick={fetchAuthors} className="btn btn-secondary">
            🔄 Retry
          </button>
        </div>
      )}

      {/* Authors List */}
      {authors.length > 0 ? (
        <>
          <div className="authors-grid">
            {authors.map(author => (
              <div key={author._id} className="author-card">
                <div className="author-header">
                  <h3 className="author-name">{author.name}</h3>
                  {author.nationality && (
                    <span className="author-nationality">🌍 {author.nationality}</span>
                  )}
                </div>
                
                <div className="author-info">
                  {author.email && (
                    <p className="author-email">📧 {author.email}</p>
                  )}
                  
                  {author.birthDate && (
                    <p className="author-birth">
                      🎂 Born: {new Date(author.birthDate).toLocaleDateString()}
                      {author.age && <span> (Age: {author.age})</span>}
                    </p>
                  )}
                  
                  {author.website && (
                    <p className="author-website">
                      🌐 <a href={author.website} target="_blank" rel="noopener noreferrer">
                        Website
                      </a>
                    </p>
                  )}
                  
                  {author.biography && (
                    <p className="author-bio">{author.biography}</p>
                  )}
                  
                  {author.awards && author.awards.length > 0 && (
                    <div className="author-awards">
                      <h4>🏆 Awards:</h4>
                      <ul>
                        {author.awards.map((award, index) => (
                          <li key={index}>
                            {award.name} ({award.year})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="author-actions">
                  <Link 
                    to={`/authors/edit/${author._id}`} 
                    className="btn btn-sm btn-secondary"
                  >
                    ✏️ Edit
                  </Link>
                  
                  <Link 
                    to={`/books?author=${author._id}`} 
                    className="btn btn-sm btn-info"
                  >
                    📚 View Books
                  </Link>
                  
                  <button
                    onClick={() => handleDeleteAuthor(author._id, author.name)}
                    className="btn btn-sm btn-danger"
                  >
                    🗑️ Delete
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
                ({pagination.totalAuthors} total authors)
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
          <h3>👨‍💼 No Authors Found</h3>
          {selectedNationality ? (
            <p>No authors match your current filter criteria.</p>
          ) : (
            <p>You haven't added any authors yet.</p>
          )}
          <Link to="/authors/new" className="btn btn-primary">
            ➕ Add Your First Author
          </Link>
        </div>
      )}
    </div>
  );
};

export default Authors;
