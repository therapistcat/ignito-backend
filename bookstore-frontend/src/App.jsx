/**
 * Main App Component
 * Handles routing, authentication, and overall layout for the Bookstore Management System
 */

import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Authors from './pages/Authors'
import Orders from './pages/Orders'
import BookForm from './pages/BookForm'
import AuthorForm from './pages/AuthorForm'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="app-layout">
                {/* Navigation Bar */}
                <Navbar />

                {/* Main Content Area */}
                <main className="main-content">
                  <Routes>
                    {/* Dashboard - Home page */}
                    <Route path="/" element={<Dashboard />} />

                    {/* Books Management */}
                    <Route path="/books" element={<Books />} />
                    <Route path="/books/new" element={<BookForm />} />
                    <Route path="/books/edit/:id" element={<BookForm />} />

                    {/* Authors Management */}
                    <Route path="/authors" element={<Authors />} />
                    <Route path="/authors/new" element={<AuthorForm />} />
                    <Route path="/authors/edit/:id" element={<AuthorForm />} />

                    {/* Orders Management */}
                    <Route path="/orders" element={<Orders />} />

                    {/* 404 Page */}
                    <Route path="*" element={
                      <div className="not-found">
                        <h2>📚 Page Not Found</h2>
                        <p>The page you're looking for doesn't exist.</p>
                      </div>
                    } />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
