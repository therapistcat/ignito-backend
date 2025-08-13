const mongoose = require('mongoose');

// Order schema definition
// This represents a customer order in our bookstore
const orderSchema = new mongoose.Schema({
  // Customer information
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        // Email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  
  customerPhone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Basic phone validation (optional field)
        return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)]/g, ''));
      },
      message: 'Invalid phone number format'
    }
  },
  
  // Shipping address
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      maxlength: [200, 'Street address cannot exceed 200 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters']
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true,
      maxlength: [20, 'Zip code cannot exceed 20 characters']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [100, 'Country cannot exceed 100 characters'],
      default: 'USA'
    }
  },
  
  // Order items - array of books with quantities
  items: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book reference is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    }
  }],
  
  // Order status tracking
  status: {
    type: String,
    required: [true, 'Order status is required'],
    enum: {
      values: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      message: 'Invalid order status'
    },
    default: 'pending'
  },
  
  // Payment information
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
      message: 'Invalid payment method'
    }
  },
  
  paymentStatus: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded'],
      message: 'Invalid payment status'
    },
    default: 'pending'
  },
  
  // Order totals
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  
  tax: {
    type: Number,
    required: [true, 'Tax amount is required'],
    min: [0, 'Tax cannot be negative'],
    default: 0
  },
  
  shipping: {
    type: Number,
    required: [true, 'Shipping cost is required'],
    min: [0, 'Shipping cost cannot be negative'],
    default: 0
  },
  
  total: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total cannot be negative']
  },
  
  // Order notes
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
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
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual field to calculate total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Index for better query performance
orderSchema.index({ customerEmail: 1 }); // Customer lookup
orderSchema.index({ status: 1 }); // Status filtering
orderSchema.index({ createdAt: -1 }); // Date sorting
orderSchema.index({ 'items.book': 1 }); // Book lookup in orders

module.exports = mongoose.model('Order', orderSchema);
