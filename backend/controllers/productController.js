const Product = require('../models/Product');

// Add Product
const addProduct = async (req, res) => {
  try {
    const {location, producerId, mobileNumber } = req.body;

    // Validate required fields
    if (!producerId || !mobileNumber) {
      return res.status(400).json({ message: 'Product name, producer ID, and mobile number are required.' });
    }

    // Parse location if provided
    let locationData = null;
    if (location) {
      try {
        const parsedLocation = JSON.parse(location);
        locationData = {
          type: 'Point',
          coordinates: [parsedLocation.longitude, parsedLocation.latitude],
        };
      } catch (error) {
        console.error('Error parsing location:', error);
        return res.status(400).json({ message: 'Invalid location format' });
      }
    }

    // Handle image upload
    const image = req.file ? req.file.path : null;

    // Create product instance
    const product = new Product({
      producerId,
      image,
      location: locationData,
      mobileNumber,
    });

    // Save product to database
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Products by Producer
const getProductsByProducer = async (req, res) => {
  try {
    const producerId = req.params.producerId;

    // Validate producerId
    if (!producerId) {
      return res.status(403).json({ message: 'You are not authorized to view these products.' });
    }

    console.log('Producer ID in backend:', producerId);
    const products = await Product.find({ producerId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by producer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Product by ID and Producer ID
const updateProduct = async (req, res) => {
  const { id, producerId } = req.params;

  try {
    const product = await Product.findOne({ _id: id, producerId });

    if (!product) {
      console.log(`Product not found or producer ID mismatch for ID ${id}`);
      return res.status(404).json({ message: 'Product not found or permission denied' });
    }

    // Update fields based on request body
    product.productName = req.body.productName || product.productName;
    product.mobileNumber = req.body.mobileNumber || product.mobileNumber;
    // You can also handle image update if needed

    await product.save();
    console.log(`Product with ID ${id} updated successfully`);
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete Product by ID and Producer ID
const deleteProduct = async (req, res) => {
  const { id, producerId } = req.params;

  try {
    const product = await Product.findOne({ _id: id, producerId });
    if (!product) {
      console.log(`Product not found or producer ID mismatch for ID ${id}`);
      return res.status(404).json({ message: 'Product not found or permission denied' });
    }

    await Product.findByIdAndDelete(id);
    console.log(`Product with ID ${id} deleted successfully`);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductsByProducer,
  getProductById,
  updateProduct,
  deleteProduct,
};
