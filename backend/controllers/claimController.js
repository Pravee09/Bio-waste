// controllers/claimController.js
const Claim = require('../models/Claim');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Create a new claim
const createClaim = async (req, res) => {
    try {
        const { productId, consumerId } = req.body;

        // Find the consumer's ObjectId based on consumerId (e.g., "consumer_8ekfp0l")
        const consumer = await User.findOne({ consumerId });
        if (!consumer) {
            return res.status(404).json({ message: 'Consumer not found' });
        }

        const newClaim = new Claim({
            claimId: `claim_${new mongoose.Types.ObjectId()}`, // Use ObjectId for unique claimId
            productId,
            claimedBy: consumer._id, // Use the ObjectId of the consumer
        });

        await newClaim.save();
        res.status(201).json(newClaim);
    } catch (error) {
        console.error('Error creating claim:', error);
        res.status(500).json({ message: 'Failed to create claim', error: error.message });
    }
}

// Get claims for a specific consumer
const getClaimsByConsumer = async (req, res) => {
    const consumerId = req.params.consumerId; // Get consumerId from the route parameters
    console.log(`Fetching claims for consumerId: ${consumerId}`); // Log consumerId

    try {
        // Ensure consumerId is an ObjectId
        const consumer = await User.findOne({ consumerId });
        if (!consumer) {
            console.log('Consumer not found'); // Log if consumer is not found
            return res.status(404).json({ message: 'Consumer not found' });
        }

        // Fetch claims using the ObjectId of the consumer
        const claims = await Claim.find({ claimedBy: consumer._id })
            .populate({
                path: 'productId',
                select: 'productName image price createdAt', // Fields to select from the Product model
            })
            .populate({
                path: 'claimedBy',
                select: 'name mobile', // Fields to select from the User model
            });

        console.log(`Claims found: ${claims.length}`); // Log the number of claims found
        res.status(200).json(claims); // Respond with the claims
    } catch (error) {
        console.error('Error fetching claims:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Delete a claim by its ID
const deleteClaim = async (req, res) => {
    const { claimId } = req.params; // Get claimId from the route parameters
    console.log(`Deleting claim with ID: ${claimId}`); // Log the claim ID
    try {
        const claim = await Claim.findByIdAndDelete(claimId); // Attempt to delete the claim
        if (!claim) {
            console.log('Claim not found'); // Log if the claim is not found
            return res.status(404).json({ error: 'Claim not found' });
        }
        console.log('Claim deleted successfully'); // Log successful deletion
        return res.status(200).json({ message: 'Claim deleted successfully' });
    } catch (error) {
        console.error('Error deleting claim:', error); // Log any errors encountered
        return res.status(500).json({ error: 'Failed to delete claim' });
    }
};

const getClaimsByProducer = async (req, res) => {
    const producerId = req.params.producerId;

    try {
        // Find products listed by the producer
        const products = await Product.find({ producerId });

        // Get claims associated with those products
        const claims = await Claim.find({ productId: { $in: products.map(p => p._id) } })
            .populate('productId', 'productName') // Include product name
            .populate({
                path: 'claimedBy',
                select: 'name mobile', // Include consumer's name and mobile
            }).sort({ createdAt: -1 });

        const claimsWithDetails = claims.map(claim => ({
            claimId: claim.claimId,
            productName: claim.productId?.productName || 'Product Unavailable', // In case product details are missing
            consumerName: claim.claimedBy?.name || 'Unknown Consumer', // Check if consumer details are populated
            consumerMobile: claim.claimedBy?.mobile || 'Unknown Contact',
            claimedAt: claim.createdAt,
        }));

        res.status(200).json(claimsWithDetails);
    } catch (error) {
        console.error('Error fetching claims for producer:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    createClaim,
    getClaimsByConsumer,
    getClaimsByProducer,
    deleteClaim,
};
