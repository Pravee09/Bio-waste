const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.loginUser);
router.put('/consumers/:consumerId', authController.updateConsumerDetails); // Ensure correct route
router.get('/consumers/:consumerId', authController.getConsumerDetails);
router.put('/consumers/:consumerId/update-password', authController.updatePassword);

module.exports = router;
