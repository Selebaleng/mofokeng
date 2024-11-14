import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import UserManagement from './components/UserManagement';
import './App.css';

// Utility function for safe JSON parsing
const safeJsonParse = (key, defaultValue = null) => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error parsing JSON for key "${key}":`, error);
    return defaultValue;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => safeJsonParse('isAuthenticated', false));
  const [isRegistered, setIsRegistered] = useState(() => safeJsonParse('isRegistered', false));

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('isRegistered', JSON.stringify(isRegistered));
  }, [isRegistered]);

  const handleRegister = () => {
    setIsRegistered(true);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // ProtectedRoute component to guard authenticated routes
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="app">
        <header>
          <h1>Wings Cafe Stock Inventory System</h1>
        </header>
        <main>
          <Routes>
            {/* Default route that redirects to login if registered, otherwise sign up */}
            <Route
              path="/"
              element={isRegistered ? <Navigate to="/login" /> : <SignUpPage onRegister={handleRegister} />}
            />
            {/* Login Route */}
            <Route
              path="/login"
              element={isRegistered && !isAuthenticated ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" />
              )}
            />
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/product-management" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
            <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/signup" element={<SignUpPage onRegister={handleRegister} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
