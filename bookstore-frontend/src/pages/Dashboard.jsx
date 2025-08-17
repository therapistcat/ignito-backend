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
import { useAuth } from '../contexts/AuthContext'; // Authentication context

const Dashboard = () => {
  const { canEdit, isAdmin, user } = useAuth();

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
          <h2>Loading Dashboard...</h2>
          <p>Fetching your bookstore data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <div className="btn-container-center">
            <button onClick={fetchDashboardData} className="btn btn-burgundy">
              Retry
            </button>
          </div>
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
          <p>Welcome to your Modern Library Management System</p>
          {user && (
            <div className="user-info-header">
              <span className="user-badge">
                {user.username} - {isAdmin() ? 'Administrator' : 'Guest'}
              </span>
            </div>
          )}
        </div>
        <div className="header-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
        </div>
      </div>

      {/* Statistics Overview Table */}
      <div className="dashboard-section">
        <h2>System Overview</h2>
        <div className="stats-table-container">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Count</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="stats-row">
                <td className="category-cell">
                  <div className="category-info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z"/>
                    </svg>
                    <span>Books</span>
                  </div>
                </td>
                <td className="count-cell">{stats.totalBooks}</td>
                <td className="status-cell">
                  <span className="status-badge status-active">Active</span>
                </td>
                <td className="actions-cell">
                  <Link to="/books" className="btn btn-sm btn-emerald">View</Link>
                  {canEdit() && <Link to="/books/new" className="btn btn-sm btn-amber">Add</Link>}
                </td>
              </tr>
              <tr className="stats-row">
                <td className="category-cell">
                  <div className="category-info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>Authors</span>
                  </div>
                </td>
                <td className="count-cell">{stats.totalAuthors}</td>
                <td className="status-cell">
                  <span className="status-badge status-active">Active</span>
                </td>
                <td className="actions-cell">
                  <Link to="/authors" className="btn btn-sm btn-emerald">View</Link>
                  {canEdit() && <Link to="/authors/new" className="btn btn-sm btn-amber">Add</Link>}
                </td>
              </tr>
              <tr className="stats-row">
                <td className="category-cell">
                  <div className="category-info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7Z"/>
                    </svg>
                    <span>Orders</span>
                  </div>
                </td>
                <td className="count-cell">{stats.totalOrders}</td>
                <td className="status-cell">
                  <span className="status-badge status-info">Processing</span>
                </td>
                <td className="actions-cell">
                  <Link to="/orders" className="btn btn-sm btn-emerald">View</Link>
                </td>
              </tr>
              <tr className="stats-row warning-row">
                <td className="category-cell">
                  <div className="category-info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                    <span>Low Stock Books</span>
                  </div>
                </td>
                <td className="count-cell">{stats.lowStockBooks}</td>
                <td className="status-cell">
                  <span className="status-badge status-warning">Attention</span>
                </td>
                <td className="actions-cell">
                  <Link to="/books?filter=low-stock" className="btn btn-sm btn-burgundy">Check</Link>
                </td>
              </tr>
              <tr className="stats-row info-row">
                <td className="category-cell">
                  <div className="category-info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z"/>
                    </svg>
                    <span>Pending Orders</span>
                  </div>
                </td>
                <td className="count-cell">{stats.pendingOrders}</td>
                <td className="status-cell">
                  <span className="status-badge status-pending">Pending</span>
                </td>
                <td className="actions-cell">
                  <Link to="/orders?status=pending" className="btn btn-sm btn-amber">Process</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      {canEdit() && (
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons btn-group-center">
            <Link to="/books/new" className="btn btn-emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add New Book
            </Link>
            <Link to="/authors/new" className="btn btn-amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Add New Author
            </Link>
            <Link to="/orders" className="btn btn-burgundy">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              View Orders
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity Tables */}
      <div className="recent-activity-grid">
        <div className="dashboard-section">
          <h3>Recent Books</h3>
          {recentBooks.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Stock</th>
                    {canEdit() && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {recentBooks.map(book => (
                    <tr key={book._id}>
                      <td className="title-cell">{book.title}</td>
                      <td>{book.author?.name || 'Unknown Author'}</td>
                      <td className="price-cell">₹{book.price}</td>
                      <td className="stock-cell">
                        <span className={`stock-badge ${book.stock < 10 ? 'low-stock' : 'normal-stock'}`}>
                          {book.stock}
                        </span>
                      </td>
                      {canEdit() && (
                        <td className="actions-cell">
                          <Link to={`/books/edit/${book._id}`} className="btn btn-sm btn-amber">
                            Edit
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">
              {canEdit() ? (
                <>No books found. <Link to="/books/new">Add your first book!</Link></>
              ) : (
                'No books available at the moment.'
              )}
            </p>
          )}
        </div>

        <div className="dashboard-section">
          <h3>Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order._id}>
                      <td className="order-id-cell">#{order._id.slice(-6)}</td>
                      <td>{order.customerName}</td>
                      <td className="price-cell">₹{order.total}</td>
                      <td className="status-cell">
                        <span className={`status-badge status-${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
