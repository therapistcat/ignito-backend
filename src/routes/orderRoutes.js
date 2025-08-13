const express = require('express');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

/**
 * Order Routes
 * Defines all the routes for order-related operations
 * 
 * Base URL: /api/orders
 */

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Public
 * @body    { customerName, customerEmail, customerPhone, shippingAddress, items, paymentMethod, notes }
 */
router.post('/', createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders with optional filtering and pagination
 * @access  Public
 * @query   limit, page, status
 * @example GET /api/orders?limit=5&page=1&status=pending
 */
router.get('/', getAllOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get a single order by ID
 * @access  Public
 * @params  id - Order ID
 */
router.get('/:id', getOrderById);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update an order completely (replace all fields)
 * @access  Public
 * @params  id - Order ID
 * @body    Complete order object
 */
router.put('/:id', updateOrder);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update only the status of an order
 * @access  Public
 * @params  id - Order ID
 * @body    { status }
 */
router.patch('/:id/status', updateOrderStatus);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete an order (only pending or cancelled orders)
 * @access  Public
 * @params  id - Order ID
 */
router.delete('/:id', deleteOrder);

module.exports = router;
