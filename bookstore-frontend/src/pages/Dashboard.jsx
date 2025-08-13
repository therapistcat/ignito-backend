/**
 * Dashboard Page Component
 * This is the main page that shows statistics about our bookstore
 *
 * Student: University Student
 * Project: Bookstore Management System
 * Note: This component fetches data from multiple APIs and displays cards
 */

import { useState, useEffect } from 'react'; // React hooks for state management
import { Link } from 'react-router-dom'; // For navigation links
import { booksAPI, authorsAPI, ordersAPI, handleAPIError } from '../services/api'; // Our API functions

const Dashboard = () => {
  // State variables to store our dashboard data
  const [stats, setStats] = useState({
    totalBooks: 0, // Total number of books
    totalAuthors: 0, // Total number of authors
    totalOrders: 0, // Total number of orders
    lowStockBooks: 0, // Books with low stock (less than 10)
    pendingOrders: 0, // Orders that are still pending
  });

  const [recentBooks, setRecentBooks] = useState([]); // Array to store recent books
  const [recentOrders, setRecentOrders] = useState([]); // Array to store recent orders
  const [loading, setLoading] = useState(true); // Boolean for loading state
  const [error, setError] = useState(null); // String for error messages

  // Fetch dashboard data when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching dashboard data...'); // Debug log

      // Fetch data from all endpoints at the same time
      const [booksResponse, authorsResponse, ordersResponse] = await Promise.all([
        booksAPI.getAll({ limit: 5 }),
        authorsAPI.getAll({ limit: 1 }),
        ordersAPI.getAll({ limit: 5 })
      ]);

      console.log('Got books:', booksResponse); // Debug what we got
      console.log('Got authors:', authorsResponse); // Debug what we got
      console.log('Got orders:', ordersResponse); // Debug what we got

      // Calculate statistics from the API responses
      const booksData = booksResponse.data || []; // Array of books
      const authorsCount = authorsResponse.pagination?.totalAuthors || 0; // Total authors
      const ordersData = ordersResponse.data || []; // Array of orders

      // Count books with low stock (less than 10 items)
      let lowStockCount = 0;
      for (let i = 0; i < booksData.length; i++) {
        if (booksData[i].stock < 10) {
          lowStockCount++; // Increment counter
        }
      }
      console.log('Found', lowStockCount, 'books with low stock'); // Debug log

      // Count orders that are still pending
      let pendingCount = 0;
      ordersData.forEach(order => {
        if (order.status === 'pending') {
          pendingCount++; // Count pending orders
        }
      });
      console.log('Found', pendingCount, 'pending orders'); // Debug log

      // Update our stats state with the calculated values
      setStats({
        totalBooks: booksResponse.pagination?.totalBooks || booksData.length,
        totalAuthors: authorsCount,
        totalOrders: ordersResponse.pagination?.totalOrders || ordersData.length,
        lowStockBooks: lowStockCount,
        pendingOrders: pendingCount,
      });

      // Set recent data for display (first 5 items)
      setRecentBooks(booksData.slice(0, 5)); // Get first 5 books
      setRecentOrders(ordersData.slice(0, 5)); // Get first 5 orders

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <h2>📊 Loading Dashboard...</h2>
          <p>Fetching your bookstore data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <h2>❌ Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="btn btn-primary">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p>Welcome to your Bookstore Management System</p>
        </div>
        <div className="header-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalBooks}</h3>
            <p>Total Books</p>
          </div>
          <Link to="/books" className="stat-link">View All →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalAuthors}</h3>
            <p>Total Authors</p>
          </div>
          <Link to="/authors" className="stat-link">View All →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7Z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
          <Link to="/orders" className="stat-link">View All →</Link>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.lowStockBooks}</h3>
            <p>Low Stock Books</p>
          </div>
          <Link to="/books?filter=low-stock" className="stat-link">Check Stock →</Link>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
          <Link to="/orders?status=pending" className="stat-link">Process →</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>🚀 Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/books/new" className="btn btn-primary">
            ➕ Add New Book
          </Link>
          <Link to="/authors/new" className="btn btn-secondary">
            👤 Add New Author
          </Link>
          <Link to="/orders" className="btn btn-info">
            📋 View Orders
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="recent-section">
          <h3>📖 Recent Books</h3>
          {recentBooks.length > 0 ? (
            <div className="recent-list">
              {recentBooks.map(book => (
                <div key={book._id} className="recent-item">
                  <div className="item-info">
                    <h4>{book.title}</h4>
                    <p>by {book.author?.name || 'Unknown Author'}</p>
                    <span className="item-meta">
                      ₹{book.price} • Stock: {book.stock}
                    </span>
                  </div>
                  <div className="item-actions">
                    <Link to={`/books/edit/${book._id}`} className="btn btn-sm">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No books found. <Link to="/books/new">Add your first book!</Link></p>
          )}
        </div>

        <div className="recent-section">
          <h3>🛒 Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <div className="recent-list">
              {recentOrders.map(order => (
                <div key={order._id} className="recent-item">
                  <div className="item-info">
                    <h4>Order #{order._id.slice(-6)}</h4>
                    <p>{order.customerName}</p>
                    <span className="item-meta">
                      ₹{order.total} • {order.status}
                    </span>
                  </div>
                  <div className="item-actions">
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
