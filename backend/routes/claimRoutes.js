// routes/claimRoutes.js
const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');

router.post('/', claimController.createClaim); // Create a claim
router.get('/:consumerId', claimController.getClaimsByConsumer); // Get claims by consumerId
router.delete('/:claimId', claimController.deleteClaim);
router.get('/producer/:producerId', claimController.getClaimsByProducer); // Get claims by producerId


module.exports = router;
