const express = require('express');
const router = express.Router();
const { Room, User, RoomMember } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRoomCreate, validateRoomUpdate, validatePagination, validateRoomQuery } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   POST /api/rooms
 * @desc    Create new room
 * @access  Private (Seller only)
 */
router.post('/', 
  authenticate, 
  authorize('seller'), 
  validateRoomCreate, 
  asyncHandler(async (req, res) => {
    const { name, description, category, rules } = req.body;
    const ownerId = req.user.id;

    const room = await Room.create({
      name,
      description,
      category,
      ownerId,
      rules
    });

    // Add owner as member
    await room.addMember(ownerId);

    const fullRoom = await Room.findByPk(room.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { room: fullRoom }
    });
  })
);

/**
 * @route   GET /api/rooms
 * @desc    Get rooms with filters
 * @access  Private
 */
router.get('/', 
  authenticate, 
  validatePagination, 
  validateRoomQuery, 
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, category, status = 'active', search } = req.query;
    
    const where = { status };
    if (category) where.category = category;
    if (search) {
      where[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.like]: `%${search}%` } },
        { description: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows: rooms } = await Room.findAndCountAll({
      where,
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name'] }
      ],
      order: [['memberCount', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        rooms,
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
 * @route   GET /api/rooms/:id
 * @desc    Get room by ID
 * @access  Private
 */
router.get('/:id', 
  authenticate, 
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const room = await Room.findByPk(id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] },
        { 
          model: User, 
          as: 'members', 
          attributes: ['id', 'name', 'role'],
          through: { attributes: ['joinedAt'] }
        }
      ]
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      data: { room }
    });
  })
);

/**
 * @route   PUT /api/rooms/:id
 * @desc    Update room
 * @access  Private (Owner only)
 */
router.put('/:id', 
  authenticate, 
  validateRoomUpdate, 
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, rules, status } = req.body;
    const userId = req.user.id;

    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (!room.canBeModifiedBy(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Only room owner can modify this room'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (rules !== undefined) updateData.rules = rules;
    if (status) updateData.status = status;

    await room.update(updateData);

    const updatedRoom = await Room.findByPk(id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] }
      ]
    });

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: { room: updatedRoom }
    });
  })
);

/**
 * @route   POST /api/rooms/:id/join
 * @desc    Join room
 * @access  Private
 */
router.post('/:id/join', 
  authenticate, 
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (room.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot join inactive room'
      });
    }

    try {
      await room.addMember(userId);
      res.json({
        success: true,
        message: 'Joined room successfully'
      });
    } catch (error) {
      if (error.message.includes('already a member')) {
        return res.status(409).json({
          success: false,
          message: 'You are already a member of this room'
        });
      }
      throw error;
    }
  })
);

/**
 * @route   DELETE /api/rooms/:id/leave
 * @desc    Leave room
 * @access  Private
 */
router.delete('/:id/leave', 
  authenticate, 
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (room.ownerId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Room owner cannot leave the room'
      });
    }

    const removed = await room.removeMember(userId);
    if (!removed) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this room'
      });
    }

    res.json({
      success: true,
      message: 'Left room successfully'
    });
  })
);

module.exports = router;
