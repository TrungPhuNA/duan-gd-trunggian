const { User, Notification } = require('../models');
const { generateToken, generateRefreshToken } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Register new user
const register = asyncHandler(async (req, res) => {
  const { name, phone, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findByPhone(phone);
  if (existingUser) {
    throw new AppError('Phone number already registered', 409);
  }

  if (email) {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      throw new AppError('Email already registered', 409);
    }
  }

  // Create user
  const user = await User.create({
    name,
    phone,
    email,
    passwordHash: password,
    role
  });

  // Generate tokens
  const token = generateToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id });

  // Create welcome notification
  await Notification.createForUser(
    user.id,
    'welcome',
    'Chào mừng đến với SafeTrade!',
    `Xin chào ${user.name}, tài khoản của bạn đã được tạo thành công. Hãy bắt đầu giao dịch an toàn với SafeTrade.`
  );

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.toJSON(),
      token,
      refreshToken
    }
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  // Find user by phone
  const user = await User.findOne({
    where: { phone },
    attributes: ['id', 'name', 'phone', 'email', 'role', 'passwordHash', 'isActive', 'isVerified']
  });

  if (!user) {
    throw new AppError('Invalid phone number or password', 401);
  }

  // Check if account is active
  if (!user.isActive) {
    throw new AppError('Account is deactivated', 401);
  }

  // Validate password
  const isValidPassword = await user.validatePassword(password);
  if (!isValidPassword) {
    throw new AppError('Invalid phone number or password', 401);
  }

  // Update last login
  await user.updateLastLogin();

  // Generate tokens
  const token = generateToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toJSON(),
      token,
      refreshToken
    }
  });
});

// Get current user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: Notification,
        as: 'notifications',
        where: { isRead: false },
        required: false,
        limit: 5,
        order: [['created_at', 'DESC']]
      }
    ]
  });

  res.json({
    success: true,
    data: { user }
  });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatarUrl } = req.body;
  const user = req.user;

  // Check if email is being changed and already exists
  if (email && email !== user.email) {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      throw new AppError('Email already registered', 409);
    }
  }

  // Update user
  await user.update({
    name: name || user.name,
    email: email || user.email,
    avatarUrl: avatarUrl || user.avatarUrl
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id, {
    attributes: ['id', 'passwordHash']
  });

  // Validate current password
  const isValidPassword = await user.validatePassword(currentPassword);
  if (!isValidPassword) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Update password
  await user.update({ passwordHash: newPassword });

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Refresh token
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const newToken = generateToken({ userId: user.id, role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user.id });

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
});

// Logout (client-side token removal)
const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get user statistics
const getStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { Transaction, Dispute } = require('../models');

  const [
    totalTransactions,
    completedTransactions,
    totalDisputes,
    unreadNotifications
  ] = await Promise.all([
    Transaction.count({
      where: {
        [require('sequelize').Op.or]: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      }
    }),
    Transaction.count({
      where: {
        [require('sequelize').Op.or]: [
          { buyerId: userId },
          { sellerId: userId }
        ],
        status: 'COMPLETED'
      }
    }),
    Dispute.count({
      where: {
        [require('sequelize').Op.or]: [
          { complainantId: userId },
          { respondentId: userId }
        ]
      }
    }),
    Notification.count({
      where: { userId, isRead: false }
    })
  ]);

  res.json({
    success: true,
    data: {
      totalTransactions,
      completedTransactions,
      totalDisputes,
      unreadNotifications
    }
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
  getStats
};
