const express = require('express');
const router = express.Router();
const { Dispute, Transaction, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { validateDisputeCreate, validateDisputeUpdate, validatePagination, validateDisputeQuery } = require('../middleware/validation');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

/**
 * @route   POST /api/disputes
 * @desc    Create new dispute
 * @access  Private (Buyer only)
 */
router.post('/', 
  authenticate, 
  authorize('buyer'), 
  validateDisputeCreate, 
  asyncHandler(async (req, res) => {
    const { transactionId, type, title, description, resolutionRequest } = req.body;
    const complainantId = req.user.id;

    // Verify transaction exists and user is the buyer
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    if (transaction.buyerId !== complainantId) {
      throw new AppError('You can only create disputes for your own transactions', 403);
    }

    if (!['PAID', 'SHIPPING', 'COMPLETED'].includes(transaction.status)) {
      throw new AppError('Disputes can only be created for paid, shipping, or completed transactions', 400);
    }

    // Check if dispute already exists
    const existingDispute = await Dispute.findOne({ where: { transactionId } });
    if (existingDispute) {
      throw new AppError('Dispute already exists for this transaction', 409);
    }

    // Create dispute
    const dispute = await Dispute.create({
      transactionId,
      complainantId,
      respondentId: transaction.sellerId,
      type,
      title,
      description,
      resolutionRequest
    });

    // Update transaction status
    await transaction.update({ status: 'DISPUTED' });

    // Load dispute with associations
    const fullDispute = await Dispute.findByPk(dispute.id, {
      include: [
        { model: Transaction, as: 'transaction' },
        { model: User, as: 'complainant', attributes: ['id', 'name', 'phone'] },
        { model: User, as: 'respondent', attributes: ['id', 'name', 'phone'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Dispute created successfully',
      data: { dispute: fullDispute }
    });
  })
);

/**
 * @route   GET /api/disputes
 * @desc    Get user disputes
 * @access  Private
 */
router.get('/', 
  authenticate, 
  validatePagination, 
  validateDisputeQuery, 
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status, type } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let where = {};
    
    // Filter by user role
    if (userRole === 'admin') {
      // Admin can see all disputes
    } else {
      // Regular users can only see their own disputes
      where[require('sequelize').Op.or] = [
        { complainantId: userId },
        { respondentId: userId }
      ];
    }

    // Apply filters
    if (status) where.status = status;
    if (type) where.type = type;

    const offset = (page - 1) * limit;
    const { count, rows: disputes } = await Dispute.findAndCountAll({
      where,
      include: [
        { model: Transaction, as: 'transaction' },
        { model: User, as: 'complainant', attributes: ['id', 'name', 'phone'] },
        { model: User, as: 'respondent', attributes: ['id', 'name', 'phone'] },
        { model: User, as: 'admin', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        disputes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  })
);

/**
 * @route   GET /api/disputes/statistics
 * @desc    Get dispute statistics
 * @access  Private (Admin only)
 */
router.get('/statistics',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const stats = await Dispute.getStatistics();

    res.json({
      success: true,
      data: { statistics: stats }
    });
  })
);

/**
 * @route   GET /api/disputes/:id
 * @desc    Get dispute by ID
 * @access  Private
 */
router.get('/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const dispute = await Dispute.findByPk(id, {
      include: [
        { model: Transaction, as: 'transaction' },
        { model: User, as: 'complainant', attributes: ['id', 'name', 'phone'] },
        { model: User, as: 'respondent', attributes: ['id', 'name', 'phone'] },
        { model: User, as: 'admin', attributes: ['id', 'name'] }
      ]
    });

    if (!dispute) {
      throw new AppError('Dispute not found', 404);
    }

    // Check access permissions
    if (!dispute.canBeViewedBy(userId, userRole)) {
      throw new AppError('Access denied', 403);
    }

    res.json({
      success: true,
      data: { dispute }
    });
  })
);

/**
 * @route   PUT /api/disputes/:id
 * @desc    Update dispute (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id',
  authenticate,
  authorize('admin'),
  validateDisputeUpdate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, adminResponse, winner } = req.body;
    const adminId = req.user.id;

    const dispute = await Dispute.findByPk(id);
    if (!dispute) {
      throw new AppError('Dispute not found', 404);
    }

    // Update dispute based on status
    if (status === 'investigating') {
      await dispute.assignToAdmin(adminId);
    } else if (status === 'resolved') {
      if (!winner || !adminResponse) {
        throw new AppError('Winner and admin response are required for resolution', 400);
      }
      await dispute.resolve(winner, adminResponse, adminId);
    } else if (status === 'rejected') {
      if (!adminResponse) {
        throw new AppError('Admin response is required for rejection', 400);
      }
      await dispute.reject(adminResponse, adminId);
    }

    // Load updated dispute
    const updatedDispute = await Dispute.findByPk(id, {
      include: [
        { model: Transaction, as: 'transaction' },
        { model: User, as: 'complainant', attributes: ['id', 'name', 'phone'] },
        { model: User, as: 'respondent', attributes: ['id', 'name', 'phone'] },
        { model: User, as: 'admin', attributes: ['id', 'name'] }
      ]
    });

    res.json({
      success: true,
      message: 'Dispute updated successfully',
      data: { dispute: updatedDispute }
    });
  })
);

module.exports = router;
