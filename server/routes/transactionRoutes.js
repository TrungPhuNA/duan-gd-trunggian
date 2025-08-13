const express = require('express');
const router = express.Router();

const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  getStatistics,
  cancelTransaction
} = require('../controllers/transactionController');

const { authenticate, authorize } = require('../middleware/auth');
const {
  validateTransactionCreate,
  validateTransactionUpdate,
  validatePagination,
  validateTransactionQuery
} = require('../middleware/validation');

/**
 * @route   POST /api/transactions
 * @desc    Create new transaction
 * @access  Private (Buyer only)
 */
router.post('/', 
  authenticate, 
  authorize('buyer'), 
  validateTransactionCreate, 
  createTransaction
);

/**
 * @route   GET /api/transactions
 * @desc    Get user transactions with filters and pagination
 * @access  Private
 */
router.get('/', 
  authenticate, 
  validatePagination, 
  validateTransactionQuery, 
  getTransactions
);

/**
 * @route   GET /api/transactions/statistics
 * @desc    Get transaction statistics
 * @access  Private (Admin only)
 */
router.get('/statistics', 
  authenticate, 
  authorize('admin'), 
  getStatistics
);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction by ID
 * @access  Private (Owner or Admin)
 */
router.get('/:id', 
  authenticate, 
  getTransaction
);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update transaction status
 * @access  Private (Owner or Admin)
 */
router.put('/:id', 
  authenticate, 
  validateTransactionUpdate, 
  updateTransaction
);

/**
 * @route   PUT /api/transactions/:id/cancel
 * @desc    Cancel transaction
 * @access  Private (Owner only)
 */
router.put('/:id/cancel', 
  authenticate, 
  cancelTransaction
);

module.exports = router;
