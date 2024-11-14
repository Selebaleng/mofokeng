import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Form.css';

const SignUpPage = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Get existing users from localStorage, or initialize with an empty array
    let existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the username already exists
    const isUsernameTaken = existingUsers.some(user => user.username === username);
    if (isUsernameTaken) {
      alert("Username already taken. Please choose a different username.");
      return;
    }

    // Store new user data
    const user = { username, password };
    existingUsers.push(user); // Add the new user to the existing users list
    localStorage.setItem('users', JSON.stringify(existingUsers)); // Save the updated users list to localStorage
    
    // Trigger the onRegister function to update the parent component's state
    onRegister();

    // Show success message
    alert("Registration successful! Please log in.");

    // Navigate to login page after successful sign-up
    navigate('/login'); // Ensure navigation goes to the Login page
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
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
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p> {/* Link to Login */}
    </div>
  );
};

export default SignUpPage;
