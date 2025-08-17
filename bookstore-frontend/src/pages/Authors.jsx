/**
 * Authors Page Component
 * Displays all authors with management capabilities
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authorsAPI, handleAPIError } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Authors = () => {
  const { canEdit, isAdmin } = useAuth();

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

  // Handle author deletion - Admin only
  const handleDeleteAuthor = async (authorId, authorName) => {
    // Security check: Only admins can delete authors
    if (!canEdit()) {
      alert('Access denied. Only administrators can delete authors.');
      return;
    }

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
        <h1>Authors Management</h1>
        <p>{canEdit() ? 'Manage your author database' : 'Browse our author collection'}</p>
        {canEdit() && (
          <div className="btn-container-center">
            <Link to="/authors/new" className="btn btn-emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Add New Author
            </Link>
          </div>
        )}
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

                <div className="author-actions actions-center">
                  {canEdit() && (
                    <Link
                      to={`/authors/edit/${author._id}`}
                      className="btn btn-sm btn-amber"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                      Edit
                    </Link>
                  )}

                  <Link
                    to={`/books?author=${author._id}`}
                    className="btn btn-sm btn-emerald"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z"/>
                    </svg>
                    View Books
                  </Link>

                  {canEdit() && (
                    <button
                      onClick={() => handleDeleteAuthor(author._id, author.name)}
                      className="btn btn-sm btn-burgundy"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                      Delete
                    </button>
                  )}
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
