const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const transactionRoutes = require('./transactionRoutes');
const roomRoutes = require('./roomRoutes');
const disputeRoutes = require('./disputeRoutes');
const adminRoutes = require('./adminRoutes');
const notificationRoutes = require('./notificationRoutes');

// API version and health check
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SafeTrade API v1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      transactions: '/api/transactions',
      rooms: '/api/rooms',
      disputes: '/api/disputes',
      admin: '/api/admin',
      notifications: '/api/notifications'
    }
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/rooms', roomRoutes);
router.use('/disputes', disputeRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
