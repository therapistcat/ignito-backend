/**
 * Main App Component
 * Handles routing and overall layout for the Modern Library Management System
 * Includes authentication context
 */

import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Authors from './pages/Authors'
import Orders from './pages/Orders'
import BookForm from './pages/BookForm'
import AuthorForm from './pages/AuthorForm'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="App">
      <div className="app-layout">
        {/* Navigation Bar - Hide on login page */}
        {!isLoginPage && <Navbar />}

        {/* Main Content Area */}
        <main className={`main-content ${isLoginPage ? 'login-main' : ''}`}>
            <Routes>
              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />

              {/* Dashboard - Home page */}
              <Route path="/" element={<Dashboard />} />

              {/* Books Management */}
              <Route path="/books" element={<Books />} />
              <Route path="/books/new" element={
                <ProtectedRoute requireAdmin={true}>
                  <BookForm />
                </ProtectedRoute>
              } />
              <Route path="/books/edit/:id" element={
                <ProtectedRoute requireAdmin={true}>
                  <BookForm />
                </ProtectedRoute>
              } />

              {/* Authors Management */}
              <Route path="/authors" element={<Authors />} />
              <Route path="/authors/new" element={
                <ProtectedRoute requireAdmin={true}>
                  <AuthorForm />
                </ProtectedRoute>
              } />
              <Route path="/authors/edit/:id" element={
                <ProtectedRoute requireAdmin={true}>
                  <AuthorForm />
                </ProtectedRoute>
              } />

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
      </div>
    </div>
  )
}

export default App
