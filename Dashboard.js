import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Dashboard.css';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize navigate for navigation
  const [products, setProducts] = useState([]); // State to hold product data
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [error, setError] = useState(null); // Error state for API call

  // Fetch products from the backend API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use the same API URL as in ProductManagement
        const response = await axios.get('http://localhost:8081/api/MyProducts');
        setProducts(response.data); // Set fetched products to state
        setLoading(false); // Set loading state to false once data is fetched
      } catch (err) {
        setError('Error fetching products'); // Set error message if request fails
        setLoading(false); // Set loading state to false on error
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to fetch data once on mount

  // Compute various statistics for the dashboard
  const totalProducts = products.length;
  const lowStockCount = products.filter((product) => product.quantity < 20).length;
  const outOfStockCount = products.filter((product) => product.quantity === 0).length;
  const stockValue = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  const suppliers = 5; // Static value for demo purposes
  const unfulfilledOrders = 4; // Static value for demo purposes
  const receivedOrders = 1; // Static value for demo purposes

  // Prepare data for the bar chart
  const barChartData = {
    labels: products.map((product) => product.name),
    datasets: [
      {
        label: 'Sales',
        data: products.map((product) => product.quantity),
        backgroundColor: '#2F4F8F',
      },
    ],
  };

  // Configure chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        suggestedMax: Math.max(...products.map((product) => product.quantity)) + 10,
        ticks: {
          stepSize: 10,
        },
      },
      x: {
        grid: {
          display: true,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  // Log out function to clear localStorage and redirect to the sign-up page
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/signup');
  };

  return (
    <div className="dashboard">
      {/* Header section with navigation links and log out button */}
      <div className="dashboard-header">
        <div className="navigation-links">
          <Link to="/product-management" className="nav-link">
            Product Management
          </Link>
          <Link to="/user-management" className="nav-link">
            User Management
          </Link>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <h2 className="dashboard-title">Inventory Management</h2>

      {/* Loading and Error handling */}
      {loading ? (
        <div className="loading-message">Loading products...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="stats-overview">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
          <div className="stat-card">
            <h3>Low Stock</h3>
            <p>{lowStockCount}</p>
          </div>
          <div className="stat-card">
            <h3>Out of Stock</h3>
            <p>{outOfStockCount}</p>
          </div>
          <div className="stat-card">
            <h3>Suppliers</h3>
            <p>{suppliers}</p>
          </div>
        </div>
      )}

      {/* Main Content Section */}
      <div className="main-content">
        <div className="side-panel">
          <h4>Value of Stock</h4>
          <p className="stock-value">LSL {stockValue}</p>
          <h4>Stock Purchases</h4>
          <div className="purchase-stats">
            <p>Unfulfilled Orders: {unfulfilledOrders}</p>
            <p>Received Orders: {receivedOrders}</p>
          </div>
        </div>

        <div className="chart-section">
          <h3>Warehouse Stock</h3>
          <div className="chart-container">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Product List Section */}
        <div className="product-list">
          <h3>Product List</h3>
          <ul>
            {products.length > 0 ? (
              products.map((product) => (
                <li key={product._id}>
                  <strong>{product.name}</strong> - Quantity: {product.quantity} - Price: LSL {product.price}
                </li>
              ))
            ) : (
              <p>No products available</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
