const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 8081; 

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Update your MySQL username
    password: 'mphosi88', // Update your MySQL password
    database: 'inventory' // Use the created database
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Product Management API Endpoints

// Create Product
app.post('/api/MyProducts', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    const query = 'INSERT INTO MyProducts (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, description, category, price, quantity], (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Error creating product', details: err });
        }
        res.status(201).json({
            id: result.insertId,
            name,
            description,
            category,
            price,
            quantity
        });
    });
});

// Get Products
app.get('/api/MyProducts', (req, res) => {
    const query = 'SELECT * FROM MyProducts';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error fetching products', details: err });
        }
        res.json(results);
    });
});

// Update Product
app.put('/api/MyProducts/:id', (req, res) => {
    const id = req.params.id;
    const { name, description, category, price, quantity } = req.body;
    const query = 'UPDATE MyProducts SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?';
    db.query(query, [name, description, category, price, quantity, id], (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Error updating product', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully', id, name, description, category, price, quantity });
    });
});

// Delete Product
app.delete('/api/MyProducts/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM MyProducts WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Error deleting product', details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
