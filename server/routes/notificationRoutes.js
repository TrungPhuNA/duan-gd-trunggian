const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/', 
  authenticate, 
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const userId = req.user.id;

    const where = { userId };
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const offset = (page - 1) * limit;
    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        notifications,
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
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', 
  authenticate, 
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });
  })
);

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', 
  authenticate, 
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    await Notification.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  })
);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notifications count
 * @access  Private
 */
router.get('/unread-count', 
  authenticate, 
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const count = await Notification.count({
      where: { userId, isRead: false }
    });

    res.json({
      success: true,
      data: { count }
    });
  })
);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', 
  authenticate, 
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  })
);

module.exports = router;
