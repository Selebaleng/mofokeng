import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductManagement.css';  // Importing the same CSS file for styling

const UserManagement = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        position: '',
        idNumber: '',
        phoneNumber: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    // Form validation
    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.position) newErrors.position = "Position is required";
        if (!formData.idNumber) newErrors.idNumber = "ID Number is required";
        if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/api/MyUsers', formData);
            alert('User added successfully: ' + response.data.username);

            // Reset form data after successful submit
            setFormData({ username: '', password: '', position: '', idNumber: '', phoneNumber: '' });
        } catch (error) {
            console.error(error);
            alert('Error adding user: ' + (error.response?.data?.error || error.message));
        }
    };

    // Handle navigation back to dashboard
    const handleBack = () => {
        navigate('/dashboard');
    };

    // Handle user log out
    const handleLogOut = () => {
        localStorage.removeItem('authToken');
        navigate('/signup');
    };

    return (
        <section className="user-management">
            <h2>Manage Users</h2>
            <form className="form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    value={formData.username} 
                    onChange={handleChange} 
                />
                {errors.username && <span className="error-message">{errors.username}</span>}

                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                />
                {errors.password && <span className="error-message">{errors.password}</span>}

                <input 
                    type="text" 
                    name="position" 
                    placeholder="Position" 
                    value={formData.position} 
                    onChange={handleChange} 
                />
                {errors.position && <span className="error-message">{errors.position}</span>}

                <input 
                    type="text" 
                    name="idNumber" 
                    placeholder="ID Number" 
                    value={formData.idNumber} 
                    onChange={handleChange} 
                />
                {errors.idNumber && <span className="error-message">{errors.idNumber}</span>}

                <input 
                    type="text" 
                    name="phoneNumber" 
                    placeholder="Phone Number" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}

                <button type="submit">Add User</button>
            </form>

            <button className="back" onClick={handleBack}>Back to Dashboard</button>
            <button className="logout" onClick={handleLogOut}>Log Out</button>
        </section>
    );
};

export default UserManagement;
