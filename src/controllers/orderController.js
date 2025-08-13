const Order = require('../models/Order');
const Book = require('../models/Book');

/**
 * Order Controller
 * Handles all order-related operations for the bookstore API
 * 
 * This controller provides CRUD operations for orders including:
 * - Creating new orders with stock validation
 * - Retrieving orders with filtering and pagination
 * - Updating order information
 * - Managing order status
 * - Deleting orders
 */

/**
 * Create a new order
 * POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod,
      notes
    } = req.body;

    // Validate and calculate order totals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      // Check if book exists and has enough stock
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(400).json({
          success: false,
          message: `Book with ID ${item.book} not found`
        });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${book.title}". Available: ${book.stock}, Requested: ${item.quantity}`
        });
      }

      // Use current book price
      const itemTotal = book.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        book: item.book,
        quantity: item.quantity,
        price: book.price
      });
    }

    // Calculate tax and shipping (simple calculation for demo)
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // Create new order
    const order = new Order({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: validatedItems,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      notes
    });

    const savedOrder = await order.save();

    // Update book stock
    for (const item of validatedItems) {
      await Book.findByIdAndUpdate(
        item.book,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate book details in response
    await savedOrder.populate('items.book', 'title author isbn price');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

/**
 * Get all orders with filtering and pagination
 * GET /api/orders?limit=10&page=1&status=pending
 */
const getAllOrders = async (req, res) => {
  try {
    const { limit = 10, page = 1, status } = req.query;
    
    // Build query object
    const query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const orders = await Order.find(query)
      .populate('items.book', 'title author isbn price')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination info
    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

/**
 * Get a single order by ID
 * GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.book', 'title author isbn price genre')
      .populate('items.book.author', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

/**
 * Update an order completely
 * PUT /api/orders/:id
 */
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('items.book', 'title author isbn price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update order'
    });
  }
};

/**
 * Update order status only
 * PATCH /api/orders/:id/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.book', 'title author isbn price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update order status'
    });
  }
};

/**
 * Delete an order
 * DELETE /api/orders/:id
 */
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow deletion of pending or cancelled orders
    if (!['pending', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending or cancelled orders'
      });
    }

    // If order is pending, restore book stock
    if (order.status === 'pending') {
      for (const item of order.items) {
        await Book.findByIdAndUpdate(
          item.book,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Order deleted successfully',
      data: order
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order'
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder
};
