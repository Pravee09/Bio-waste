const User = require('../models/User');
const mongoose = require('mongoose');

const generateProducerId = () => {
  return `producer_${new mongoose.Types.ObjectId().toString()}`;
};
const generateConsumerId = () => {
  return `consumer_${Math.random().toString(36).slice(2, 9)}`; // Simple random ID generator
};

exports.register = async (req, res) => {
  const { name, email, password, mobile, role } = req.body;

  try {
    // Log the incoming request body for debugging
    console.log('Registering user:', req.body);
    
    // Create user
    const user = await User.create({ name, email, password, mobile, role });
    
    // Generate producerId if the user is a producer
    if (role === 'producer') {
      user.producerId = generateProducerId();
    } else if (role === 'consumer') {
      user.consumerId = generateConsumerId();
    }
    await user.save();

    res.status(201).json({ message: 'User registered successfully!', producerId: user.producerId, consumerId: user.consumerId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const responseData = {
      role: user.role,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        producerId: user.role === 'producer' ? user.producerId : null,
        consumerId: user.role === 'consumer' ? user.consumerId : null,
      },
    };

    res.json(responseData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getConsumerDetails = async (req, res) => {
  const { consumerId } = req.params;
  try {
    const user = await User.findOne({ consumerId });
    if (!user) {
      return res.status(404).json({ message: 'Consumer not found.' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error fetching consumer details:', error);
    res.status(500).json({ message: 'Failed to fetch consumer details.', error: error.message });
  }
};


exports.updateConsumerDetails = async (req, res) => {
  const { consumerId, name, email, mobile, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ consumerId });
    if (!user) {
      return res.status(404).json({ message: 'Consumer not found.' });
    }

    // Check if old password matches (if provided)
    if (oldPassword && user.password !== oldPassword) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (newPassword) user.password = newPassword; // Update the password

    await user.save();
    res.json({ message: 'Consumer details updated successfully!', user });
  } catch (error) {
    console.error('Error updating consumer details:', error);
    res.status(500).json({ message: 'Failed to update details.', error: error.message });
  }
};
// exports.updatePassword = async (req, res) => {
//   const { consumerId } = req.params;
//   const { currentPassword, newPassword } = req.body;

//   try {
//     const user = await User.findOne({ consumerId });
//     if (!user) {
//       return res.status(404).json({ message: 'Consumer not found.' });
//     }

//     // Check if the current password is correct
//     if (user.password !== currentPassword) {
//       return res.status(401).json({ message: 'Current password is incorrect.' });
//     }

//     // Update the password
//     user.password = newPassword; // Here you might want to hash the new password
//     await user.save();

//     res.json({ message: 'Password updated successfully!' });
//   } catch (error) {
//     console.error('Error updating password:', error);
//     res.status(500).json({ message: 'Failed to update password.', error: error.message });
//   }
// };
exports.updateProducerDetails = async (req, res) => {
  const { producerId, name, email, mobile, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ producerId });
    if (!user) {
      return res.status(404).json({ message: 'Producer not found.' });
    }

    // Check if old password matches (if provided)
    if (oldPassword && user.password !== oldPassword) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (newPassword) user.password = newPassword; // Update the password

    await user.save();
    res.json({ message: 'Producer details updated successfully!', user });
  } catch (error) {
    console.error('Error updating producer details:', error);
    res.status(500).json({ message: 'Failed to update details.', error: error.message });
  }
};

// exports.updatePassword = async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   const userId = req.params.userId; // assuming you pass the user ID in the route

//   try {
//       // Fetch user and check current password logic goes here
//       const user = await User.findById(userId);
      
//       if (!user || !(await user.isValidPassword(currentPassword))) {
//           return res.status(401).json({ message: 'Current password is incorrect' });
//       }

//       user.password = newPassword; // You should hash this password before saving
//       await user.save();

//       res.status(200).json({ message: 'Password updated successfully' });
//   } catch (error) {
//       res.status(500).json({ message: 'Failed to update password', error });
//   }
// };

exports.updatePassword = async (req, res) => {
  const { consumerId, producerId } = req.params; // Get both IDs from request parameters
  const { currentPassword, newPassword } = req.body;

  try {
    // Check if a producerId is provided; prioritize it over consumerId
    let user;
    if (producerId) {
      user = await User.findOne({ producerId });
    } else if (consumerId) {
      user = await User.findOne({ consumerId });
    } else {
      return res.status(400).json({ message: 'No valid user ID provided.' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the current password is correct
    if (user.password !== currentPassword) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Failed to update password.', error: error.message });
  }
};
