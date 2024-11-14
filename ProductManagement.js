import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductManagement.css';

const ProductManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: ''
  });
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const navigate = useNavigate();

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/MyProducts');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Error fetching products');
      }
    };
    fetchProducts();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || isNaN(formData.price)) newErrors.price = 'Valid price is required';
    if (!formData.quantity || isNaN(formData.quantity)) newErrors.quantity = 'Valid quantity is required';
    return newErrors;
  };

  // Handle form submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingProductIndex !== null) {
        // Update existing product
        const productToUpdate = products[editingProductIndex];
        const response = await axios.put(`http://localhost:8081/api/MyProducts/${productToUpdate._id}`, {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        });

        const updatedProducts = [...products];
        updatedProducts[editingProductIndex] = response.data; // Update the product in the list
        setProducts(updatedProducts);
        alert('Product updated successfully!');
      } else {
        // Add new product
        const response = await axios.post('http://localhost:8081/api/MyProducts', {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        });

        setProducts((prevProducts) => [...prevProducts, response.data]); // Add the new product to the list
        alert('Product added successfully!');
      }

      // Reset form after submission
      setFormData({ name: '', description: '', category: '', price: '', quantity: '' });
      setEditingProductIndex(null); // Reset editing state

    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  // Handle updating an existing product
  const handleEdit = (index) => {
    const productToEdit = products[index];
    setFormData({
      name: productToEdit.name,
      description: productToEdit.description,
      category: productToEdit.category,
      price: productToEdit.price,
      quantity: productToEdit.quantity
    });
    setEditingProductIndex(index);
  };

  // Handle deleting a product
  const handleDelete = async (index) => {
    const productToDelete = products[index];

    // Optimistically remove the product from the UI (before the API call)
    const updatedProducts = products.filter(product => product._id !== productToDelete._id);
    setProducts(updatedProducts);

    try {
      // Perform the delete request
      const response = await axios.delete(`http://localhost:8081/api/MyProducts/${productToDelete._id}`);

      // If the deletion was successful, the response will have a 200 status
      if (response.status === 200) {
        alert('Product deleted successfully!');
      } else {
        // If not, revert the optimistic update and show an error
        setProducts(products);
        alert('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      // Revert the optimistic UI update in case of an error
      setProducts(products);
      alert('Error deleting product');
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
    <section className="product-management">
      <h2>Manage Products</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}

        <input
          type="text"
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}

        <input
          type="text"
          name="category"
          placeholder="Product Category"
          value={formData.category}
          onChange={handleChange}
        />
        {errors.category && <span className="error-message">{errors.category}</span>}

        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={formData.price}
          onChange={handleChange}
        />
        {errors.price && <span className="error-message">{errors.price}</span>}

        <input
          type="number"
          name="quantity"
          placeholder="Product Quantity"
          value={formData.quantity}
          onChange={handleChange}
        />
        {errors.quantity && <span className="error-message">{errors.quantity}</span>}

        <button type="submit">{editingProductIndex !== null ? 'Update Product' : 'Add Product'}</button>
      </form>

      <div className="product-list">
        <h3>Product List</h3>
        <ul>
          {products.length > 0 ? (
            products.map((product, index) => (
              <li key={product._id}>
                <strong>{product.name}</strong> - Quantity: {product.quantity} - Price: LSL {product.price}
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </li>
            ))
          ) : (
            <p>No products available</p>
          )}
        </ul>
      </div>

      <button className="back" onClick={handleBack}>Back to Dashboard</button>
      <button className="logout" onClick={handleLogOut}>Log Out</button>
    </section>
  );
};

export default ProductManagement;
