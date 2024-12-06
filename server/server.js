const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const User = require('./models/user');
const Product = require('./models/product');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware to parse JSON requests
app.use(express.json());

// // MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log('MongoDB connection error:', err));

// User signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { uid, firstName, lastName, email, city, province, phoneNumber } = req.body;

    const newUser = new User({
      uid,
      firstName,
      lastName,
      email,
      city,
      province,
      phoneNumber,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully in MongoDB' });
  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
    res.status(500).json({ error: 'Failed to save user in MongoDB' });
  }
});

// Get user information for Profile page
app.get('/api/user/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user information if edited on profile page
app.put('/api/user/:uid', async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findOneAndUpdate({ uid: req.params.uid }, updates, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to upload products with image
app.post('/api/products', upload.single('image'), async (req, res) => {
  const { title, description, price, location, userId } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image provided' });
  }

  const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  const newProduct = new Product({
    title,
    description,
    price,
    location,
    userId,
    imageUrl,
  });

  try {
    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ success: false, error: 'Failed to add product' });
  }
});

// Retrieve products for a specific user
app.get('/api/products', async (req, res) => {
  const userId = req.query.userId;

  try {
    const products = await Product.find({ userId });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Update a product
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location } = req.body;
  const updateData = { title, description, price, location };

  if (req.file) {
    updateData.imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Retrieve all products except those created by a specific user
app.get('/api/products/others', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const products = await Product.find({ userId: { $ne: userId } });
    res.json(products);
  } catch (error) {
    console.error('Error fetching other users\' products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Default route to check server status
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));