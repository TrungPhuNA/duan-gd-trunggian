const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
router.get('/', 
  authenticate, 
  authorize('admin'), 
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, role, search } = req.query;
    
    const where = {};
    if (role) where.role = role;
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
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
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
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin or own profile)
 */
router.get('/:id', 
  authenticate, 
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if user can access this profile
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  })
);

/**
 * @route   PUT /api/users/:id/status
 * @desc    Update user status (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/status', 
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
