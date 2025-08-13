/**
 * Author Form Component
 * Handles creating and editing authors
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authorsAPI, handleAPIError } from '../services/api';

const AuthorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get author ID from URL if editing
  const isEditing = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nationality: '',
    birthDate: '',
    biography: '',
    website: '',
    awards: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch author data if editing
  useEffect(() => {
    if (isEditing) {
      fetchAuthor();
    }
  }, [id]);

  const fetchAuthor = async () => {
    try {
      setLoading(true);
      const response = await authorsAPI.getById(id);
      const author = response.data;
      
      // Format date for input field
      const birthDate = author.birthDate 
        ? new Date(author.birthDate).toISOString().split('T')[0] 
        : '';

      setFormData({
        name: author.name || '',
        email: author.email || '',
        nationality: author.nationality || '',
        birthDate: birthDate,
        biography: author.biography || '',
        website: author.website || '',
        awards: author.awards || []
      });
    } catch (err) {
      console.error('Error fetching author:', err);
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

  // Handle awards management
  const addAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { name: '', year: '' }]
    }));
  };

  const removeAward = (index) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const updateAward = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.map((award, i) => 
        i === index ? { ...award, [field]: value } : award
      )
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Prepare data for submission
      const submitData = { ...formData };

      // Filter out empty awards
      submitData.awards = submitData.awards.filter(award => 
        award.name.trim() && award.year
      );

      // Convert year strings to numbers
      submitData.awards = submitData.awards.map(award => ({
        ...award,
        year: parseInt(award.year)
      }));

      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || (Array.isArray(submitData[key]) && submitData[key].length === 0)) {
          delete submitData[key];
        }
      });

      if (isEditing) {
        await authorsAPI.update(id, submitData);
        alert('Author updated successfully!');
      } else {
        await authorsAPI.create(submitData);
        alert('Author created successfully!');
      }

      navigate('/authors');
    } catch (err) {
      console.error('Error saving author:', err);
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="author-form-page">
        <div className="loading">
          <h2>👨‍💼 Loading Author...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="author-form-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>{isEditing ? '✏️ Edit Author' : '➕ Add New Author'}</h1>
        <button 
          onClick={() => navigate('/authors')} 
          className="btn btn-secondary"
        >
          ← Back to Authors
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Author Form */}
      <form onSubmit={handleSubmit} className="author-form">
        <div className="form-grid">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter author's full name"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="author@example.com"
            />
          </div>

          {/* Nationality */}
          <div className="form-group">
            <label htmlFor="nationality">Nationality</label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="e.g., American, British, Canadian"
            />
          </div>

          {/* Birth Date */}
          <div className="form-group">
            <label htmlFor="birthDate">Birth Date</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          {/* Website */}
          <div className="form-group full-width">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://authorwebsite.com"
            />
          </div>
        </div>

        {/* Biography */}
        <div className="form-group full-width">
          <label htmlFor="biography">Biography</label>
          <textarea
            id="biography"
            name="biography"
            value={formData.biography}
            onChange={handleChange}
            rows="4"
            placeholder="Enter author's biography..."
          />
        </div>

        {/* Awards Section */}
        <div className="awards-section">
          <div className="awards-header">
            <h3>🏆 Awards</h3>
            <button
              type="button"
              onClick={addAward}
              className="btn btn-sm btn-secondary"
            >
              ➕ Add Award
            </button>
          </div>

          {formData.awards.map((award, index) => (
            <div key={index} className="award-item">
              <div className="award-inputs">
                <input
                  type="text"
                  placeholder="Award name"
                  value={award.name}
                  onChange={(e) => updateAward(index, 'name', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Year"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={award.year}
                  onChange={(e) => updateAward(index, 'year', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeAward(index)}
                  className="btn btn-sm btn-danger"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/authors')}
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
            {submitting ? '⏳ Saving...' : (isEditing ? '💾 Update Author' : '➕ Create Author')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthorForm;
