const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');  // User authentication routes
const productRoutes = require('./routes/productRoutes');  // Product-related routes
const claimRoutes = require('./routes/claimRoutes');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Parse incoming JSON data

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with failure
  });

// Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);  // Routes for authentication (login/register)
app.use('/api/products', productRoutes);  // Routes for product management (add/view/update/delete/claim)
app.use('/api/claims', claimRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
