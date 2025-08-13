const mongoose = require('mongoose');

// Author schema definition
// This represents an author in our bookstore system
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        // Basic email validation
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  
  nationality: {
    type: String,
    trim: true,
    maxlength: [50, 'Nationality cannot exceed 50 characters']
  },
  
  birthDate: {
    type: Date,
    validate: {
      validator: function(v) {
        // Birth date cannot be in the future
        return !v || v <= new Date();
      },
      message: 'Birth date cannot be in the future'
    }
  },
  
  biography: {
    type: String,
    trim: true,
    maxlength: [2000, 'Biography cannot exceed 2000 characters']
  },
  
  // Social media and website links
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Basic URL validation
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid website URL'
    }
  },
  
  // Awards and achievements
  awards: [{
    name: {
      type: String,
      trim: true,
      maxlength: [200, 'Award name cannot exceed 200 characters']
    },
    year: {
      type: Number,
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear(), 'Year cannot be in the future']
    }
  }],
  
  // Metadata fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Enable virtual fields in JSON output
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware to update the updatedAt field before saving
authorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual field to calculate age
authorSchema.virtual('age').get(function() {
  if (!this.birthDate) return null;
  
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual field to get books by this author
authorSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'author'
});

// Index for better query performance
authorSchema.index({ name: 'text', biography: 'text' }); // Text search
authorSchema.index({ nationality: 1 }); // Nationality filtering

module.exports = mongoose.model('Author', authorSchema);
