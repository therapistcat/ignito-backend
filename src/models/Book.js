const mongoose = require('mongoose');

// Book schema definition
// This represents a book in our bookstore with all necessary fields
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  // Reference to Author model - establishing relationship
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: [true, 'Author is required']
  },
  
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Basic ISBN validation (10 or 13 digits)
        return /^(?:\d{10}|\d{13})$/.test(v.replace(/[-\s]/g, ''));
      },
      message: 'Invalid ISBN format'
    }
  },
  
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    enum: {
      values: ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Technical'],
      message: 'Invalid genre'
    }
  },
  
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        // Ensure price has at most 2 decimal places
        return /^\d+(\.\d{1,2})?$/.test(v.toString());
      },
      message: 'Price must have at most 2 decimal places'
    }
  },
  
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  publishedDate: {
    type: Date,
    validate: {
      validator: function(v) {
        // Published date cannot be in the future
        return v <= new Date();
      },
      message: 'Published date cannot be in the future'
    }
  },
  
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  
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
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual field to check if book is in stock
bookSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Index for better query performance
bookSchema.index({ title: 'text', description: 'text' }); // Text search
bookSchema.index({ genre: 1 }); // Genre filtering
bookSchema.index({ author: 1 }); // Author filtering
bookSchema.index({ price: 1 }); // Price sorting

module.exports = mongoose.model('Book', bookSchema);
