const express = require('express');
const router = express.Router();
const { User, Transaction, Dispute, Room, SystemSetting } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin only)
 */
router.get('/dashboard', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(async (req, res) => {
    const [
      totalUsers,
      totalTransactions,
      totalDisputes,
      totalRooms,
      pendingDisputes,
      recentTransactions,
      recentUsers
    ] = await Promise.all([
      User.count(),
      Transaction.count(),
      Dispute.count(),
      Room.count(),
      Dispute.count({ where: { status: 'pending' } }),
      Transaction.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'buyer', attributes: ['id', 'name'] },
          { model: User, as: 'seller', attributes: ['id', 'name'] }
        ]
      }),
      User.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'name', 'role', 'createdAt']
      })
    ]);

    // Calculate transaction statistics
    const transactionStats = await Transaction.getStatistics();
    const disputeStats = await Dispute.getStatistics();

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalTransactions,
          totalDisputes,
          totalRooms,
          pendingDisputes
        },
        transactionStats,
        disputeStats,
        recentActivity: {
          transactions: recentTransactions,
          users: recentUsers
        }
      }
    });
  })
);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with advanced filters
 * @access  Private (Admin only)
 */
router.get('/users', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(async (req, res) => {
    const { 
      page = 1, 
      limit = 20, 
      role, 
      status, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const where = {};
    if (role) where.role = role;
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;
    if (search) {
      where[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.like]: `%${search}%` } },
        { phone: { [require('sequelize').Op.like]: `%${search}%` } },
        { email: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows: users } = await User.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ['passwordHash'] }
    });

    res.json({
      success: true,
      data: {
        users,
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
 * @route   GET /api/admin/transactions
 * @desc    Get all transactions with advanced filters
 * @access  Private (Admin only)
 */
router.get('/transactions', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(async (req, res) => {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      startDate, 
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[require('sequelize').Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[require('sequelize').Op.lte] = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount[require('sequelize').Op.gte] = parseFloat(minAmount);
      if (maxAmount) where.amount[require('sequelize').Op.lte] = parseFloat(maxAmount);
    }

    const offset = (page - 1) * limit;
    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where,
      include: [
        { model: User, as: 'buyer', attributes: ['id', 'name', 'phone'] },
        { model: User, as: 'seller', attributes: ['id', 'name', 'phone'] },
        { model: Room, as: 'room', attributes: ['id', 'name'] }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        transactions,
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
 * @route   GET /api/admin/disputes
 * @desc    Get all disputes with advanced filters
 * @access  Private (Admin only)
 */
router.get('/disputes', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(async (req, res) => {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      type,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'ASC'
    } = req.query;

    const where = {};
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
      order: [[sortBy, sortOrder]],
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
 * @route   GET /api/admin/settings
 * @desc    Get system settings
 * @access  Private (Admin only)
 */
router.get('/settings', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(async (req, res) => {
    const settings = await SystemSetting.findAll({
      order: [['settingKey', 'ASC']]
    });

    res.json({
      success: true,
      data: { settings }
    });
  })
);

/**
 * @route   PUT /api/admin/settings/:key
 * @desc    Update system setting
 * @access  Private (Admin only)
 */
router.put('/settings/:key', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    const adminId = req.user.id;

    const setting = await SystemSetting.setValue(key, value, adminId);

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: { setting }
    });
  })
);

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Update user status
 * @access  Private (Admin only)
 */
router.put('/users/:id/status', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ isActive });

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  })
);

module.exports = router;
