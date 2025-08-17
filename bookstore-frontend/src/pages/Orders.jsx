/**
 * Orders Page Component
 * Displays all orders with status management capabilities
 */

import { useState, useEffect } from 'react';
import { ordersAPI, handleAPIError } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const { canEdit, isAdmin } = useAuth();

  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  
  // Filter state
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Order statuses
  const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  // Fetch orders when component mounts or filters change
  useEffect(() => {
    fetchOrders();
  }, [currentPage, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {
        page: currentPage,
        limit: limit,
      };

      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const response = await ordersAPI.getAll(params);
      setOrders(response.data || []);
      setPagination(response.pagination || {});

    } catch (err) {
      console.error('Error fetching orders:', err);
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle order status update - Admin only
  const handleStatusUpdate = async (orderId, newStatus) => {
    // Security check: Only admins can update order status
    if (!canEdit()) {
      alert('Access denied. Only administrators can update order status.');
      return;
    }

    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      // Refresh the orders list
      fetchOrders();
      alert('Order status updated successfully!');
    } catch (err) {
      console.error('Error updating order status:', err);
      const errorInfo = handleAPIError(err);
      alert(`Failed to update order status: ${errorInfo.message}`);
    }
  };

  // Handle order deletion - Admin only
  const handleDeleteOrder = async (orderId, customerName) => {
    // Security check: Only admins can delete orders
    if (!canEdit()) {
      alert('Access denied. Only administrators can delete orders.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the order for "${customerName}"?`)) {
      return;
    }

    try {
      await ordersAPI.delete(orderId);
      // Refresh the orders list
      fetchOrders();
      alert('Order deleted successfully!');
    } catch (err) {
      console.error('Error deleting order:', err);
      const errorInfo = handleAPIError(err);
      alert(`Failed to delete order: ${errorInfo.message}`);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || 'status-default';
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="loading">
          <h2>🛒 Loading Orders...</h2>
          <p>Fetching order information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>🛒 Orders Management</h1>
        <div className="header-stats">
          <span>Total Orders: {pagination.totalOrders || orders.length}</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="controls">
        <div className="filter-box">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            {orderStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error">
          <p>❌ {error}</p>
          <button onClick={fetchOrders} className="btn btn-secondary">
            🔄 Retry
          </button>
        </div>
      )}

      {/* Orders List */}
      {orders.length > 0 ? (
        <>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-date">
                    {formatDate(order.createdAt)}
                  </div>
                </div>

                <div className="order-content">
                  <div className="customer-info">
                    <h4>👤 Customer Information</h4>
                    <p><strong>Name:</strong> {order.customerName}</p>
                    <p><strong>Email:</strong> {order.customerEmail}</p>
                    {order.customerPhone && (
                      <p><strong>Phone:</strong> {order.customerPhone}</p>
                    )}
                  </div>

                  <div className="shipping-info">
                    <h4>📍 Shipping Address</h4>
                    <p>
                      {order.shippingAddress.street}<br/>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br/>
                      {order.shippingAddress.country}
                    </p>
                  </div>

                  <div className="order-items">
                    <h4>📦 Items ({order.totalItems || order.items.length})</h4>
                    <div className="items-list">
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <span className="item-title">
                            {item.book?.title || 'Unknown Book'}
                          </span>
                          <span className="item-details">
                            Qty: {item.quantity} × ₹{item.price} = ₹{(item.quantity * item.price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-totals">
                    <div className="total-line">
                      <span>Subtotal:</span>
                      <span>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="total-line">
                      <span>Tax:</span>
                      <span>₹{order.tax.toFixed(2)}</span>
                    </div>
                    <div className="total-line">
                      <span>Shipping:</span>
                      <span>₹{order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="total-line total">
                      <span><strong>Total:</strong></span>
                      <span><strong>₹{order.total.toFixed(2)}</strong></span>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="order-notes">
                      <h4>📝 Notes</h4>
                      <p>{order.notes}</p>
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  {canEdit() ? (
                    <div className="status-update">
                      <label>Update Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="status-select"
                      >
                        {orderStatuses.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="status-display">
                      <span className={`status-badge status-${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  )}

                  {canEdit() && (
                    <button
                      onClick={() => handleDeleteOrder(order._id, order.customerName)}
                      className="btn btn-sm btn-burgundy"
                      disabled={!['pending', 'cancelled'].includes(order.status)}
                    >
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
                ({pagination.totalOrders} total orders)
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
          <h3>🛒 No Orders Found</h3>
          {selectedStatus ? (
            <p>No orders match your current filter criteria.</p>
          ) : (
            <p>No orders have been placed yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
