// Product model example (Product.js)
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  producerId: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: { type: String, enum: ['Point'], required: true }, coordinates: { type: [Number], required: true } },
  mobileNumber: { type: String, required: true }, // Add this line for mobile number
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
