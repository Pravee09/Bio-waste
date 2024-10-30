// models/Claim.js
const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    claimId: { type: String, required: true, unique: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Change to ObjectId reference
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Claim', claimSchema);
