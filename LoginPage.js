import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Form.css';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Debug: Log the username and password
    console.log('Attempting to log in with:', username, password);

    // Get the users list from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Users from localStorage:', users);

    // Check if user exists and the password matches
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      console.log('User found:', user);
      // If user found, call onLogin to update authentication state
      onLogin();

      // Redirect to dashboard after successful login
      navigate('/dashboard'); // Redirect to the dashboard
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">Log In</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p> {/* Link to Sign Up */}
    </div>
  );
};

export default LoginPage;
