const { Transaction, User, Room, TransactionHistory, Notification } = require('../models');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

// Create new transaction
const createTransaction = asyncHandler(async (req, res) => {
  const { sellerId, roomId, productName, productDescription, amount, notes } = req.body;
  const buyerId = req.user.id;

  // Validate seller exists
  const seller = await User.findByPk(sellerId);
  if (!seller) {
    throw new AppError('Seller not found', 404);
  }

  if (seller.role !== 'seller') {
    throw new AppError('User is not a seller', 400);
  }

  // Validate room if provided
  if (roomId) {
    const room = await Room.findByPk(roomId);
    if (!room) {
      throw new AppError('Room not found', 404);
    }
  }

  // Validate minimum amount
  const minAmount = parseFloat(process.env.MIN_TRANSACTION_AMOUNT) || 10000;
  if (amount < minAmount) {
    throw new AppError(`Minimum transaction amount is ${minAmount} VND`, 400);
  }

  // Create transaction
  const transaction = await Transaction.create({
    buyerId,
    sellerId,
    roomId,
    productName,
    productDescription,
    amount,
    notes
  });

  // Create notification for seller
  await Notification.createForUser(
    sellerId,
    'new_transaction',
    'Giao dịch mới cần xác nhận',
    `Bạn có giao dịch mới từ ${req.user.name} với giá trị ${amount.toLocaleString('vi-VN')} VND cho sản phẩm "${productName}".`,
    { transactionId: transaction.id }
  );

  // Load transaction with associations
  const fullTransaction = await Transaction.findByPk(transaction.id, {
    include: [
      { model: User, as: 'buyer', attributes: ['id', 'name', 'phone'] },
      { model: User, as: 'seller', attributes: ['id', 'name', 'phone'] },
      { model: Room, as: 'room', attributes: ['id', 'name'] }
    ]
  });

  res.status(201).json({
    success: true,
    message: 'Transaction created successfully',
    data: { transaction: fullTransaction }
  });
});

// Get user transactions
const getTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, role, startDate, endDate, minAmount, maxAmount } = req.query;
  const userId = req.user.id;

  // Build where clause
  const where = {};
  
  // Filter by user role in transaction
  if (role === 'buyer') {
    where.buyerId = userId;
  } else if (role === 'seller') {
    where.sellerId = userId;
  } else {
    where[Op.or] = [{ buyerId: userId }, { sellerId: userId }];
  }

  // Filter by status
  if (status) {
    where.status = status;
  }

  // Filter by date range
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[Op.lte] = new Date(endDate);
  }

  // Filter by amount range
  if (minAmount || maxAmount) {
    where.amount = {};
    if (minAmount) where.amount[Op.gte] = parseFloat(minAmount);
    if (maxAmount) where.amount[Op.lte] = parseFloat(maxAmount);
  }

  // Calculate pagination
  const offset = (page - 1) * limit;

  // Get transactions
  const { count, rows: transactions } = await Transaction.findAndCountAll({
    where,
    include: [
      { model: User, as: 'buyer', attributes: ['id', 'name', 'phone'] },
      { model: User, as: 'seller', attributes: ['id', 'name', 'phone'] },
      { model: Room, as: 'room', attributes: ['id', 'name'] }
    ],
    order: [['createdAt', 'DESC']],
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
});

// Get transaction by ID
const getTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  const transaction = await Transaction.findByPk(id, {
    include: [
      { model: User, as: 'buyer', attributes: ['id', 'name', 'phone'] },
      { model: User, as: 'seller', attributes: ['id', 'name', 'phone'] },
      { model: Room, as: 'room', attributes: ['id', 'name'] },
      {
        model: TransactionHistory,
        as: 'history',
        include: [{ model: User, as: 'changedByUser', attributes: ['id', 'name'] }],
        order: [['createdAt', 'DESC']]
      }
    ]
  });

  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  // Check access permissions
  if (userRole !== 'admin' && transaction.buyerId !== userId && transaction.sellerId !== userId) {
    throw new AppError('Access denied', 403);
  }

  res.json({
    success: true,
    data: { transaction }
  });
});

// Update transaction status
const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes, paymentMethod, paymentReference, shippingInfo } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  const transaction = await Transaction.findByPk(id);
  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  // Check if user can update this transaction
  if (!transaction.canBeUpdatedBy(userId, userRole)) {
    throw new AppError('You cannot update this transaction', 403);
  }

  // Validate status transition
  if (status) {
    const validStatuses = transaction.getNextValidStatuses(userRole);
    if (!validStatuses.includes(status)) {
      throw new AppError(`Cannot change status from ${transaction.status} to ${status}`, 400);
    }
  }

  // Update transaction
  const updateData = {};
  if (status) updateData.status = status;
  if (notes) updateData.notes = notes;
  if (paymentMethod) updateData.paymentMethod = paymentMethod;
  if (paymentReference) updateData.paymentReference = paymentReference;
  if (shippingInfo) updateData.shippingInfo = shippingInfo;

  await transaction.update(updateData, { userId, notes });

  // Create notifications based on status change
  if (status) {
    await createStatusNotification(transaction, status, userId);
  }

  // Load updated transaction
  const updatedTransaction = await Transaction.findByPk(id, {
    include: [
      { model: User, as: 'buyer', attributes: ['id', 'name', 'phone'] },
      { model: User, as: 'seller', attributes: ['id', 'name', 'phone'] },
      { model: Room, as: 'room', attributes: ['id', 'name'] }
    ]
  });

  res.json({
    success: true,
    message: 'Transaction updated successfully',
    data: { transaction: updatedTransaction }
  });
});

// Helper function to create status notifications
const createStatusNotification = async (transaction, newStatus, changedBy) => {
  const notifications = [];
  
  switch (newStatus) {
    case 'PENDING_PAYMENT':
      notifications.push({
        userId: transaction.buyerId,
        type: 'transaction_confirmed',
        title: 'Giao dịch đã được xác nhận',
        message: `Người bán đã xác nhận giao dịch. Vui lòng thanh toán để tiếp tục.`,
        data: { transactionId: transaction.id }
      });
      break;
      
    case 'PAID':
      notifications.push({
        userId: transaction.sellerId,
        type: 'payment_received',
        title: 'Đã nhận thanh toán',
        message: `Người mua đã thanh toán. Vui lòng gửi hàng cho khách hàng.`,
        data: { transactionId: transaction.id }
      });
      break;
      
    case 'SHIPPING':
      notifications.push({
        userId: transaction.buyerId,
        type: 'item_shipped',
        title: 'Hàng đã được gửi',
        message: `Người bán đã gửi hàng. Vui lòng kiểm tra và xác nhận khi nhận được.`,
        data: { transactionId: transaction.id }
      });
      break;
      
    case 'COMPLETED':
      notifications.push(
        {
          userId: transaction.buyerId,
          type: 'transaction_completed',
          title: 'Giao dịch hoàn tất',
          message: `Giao dịch đã hoàn tất thành công. Cảm ơn bạn đã sử dụng SafeTrade.`,
          data: { transactionId: transaction.id }
        },
        {
          userId: transaction.sellerId,
          type: 'transaction_completed',
          title: 'Giao dịch hoàn tất',
          message: `Giao dịch đã hoàn tất. Tiền đã được chuyển vào tài khoản của bạn.`,
          data: { transactionId: transaction.id }
        }
      );
      break;
  }

  // Create all notifications
  for (const notif of notifications) {
    await Notification.createForUser(
      notif.userId,
      notif.type,
      notif.title,
      notif.message,
      notif.data
    );
  }
};

// Get transaction statistics
const getStatistics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const userRole = req.user.role;

  if (userRole !== 'admin') {
    throw new AppError('Access denied', 403);
  }

  const stats = await Transaction.getStatistics(
    startDate ? new Date(startDate) : null,
    endDate ? new Date(endDate) : null
  );

  res.json({
    success: true,
    data: { statistics: stats }
  });
});

// Cancel transaction
const cancelTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const userId = req.user.id;

  const transaction = await Transaction.findByPk(id);
  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  // Only buyer or seller can cancel, and only in certain statuses
  if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
    throw new AppError('Access denied', 403);
  }

  if (!['PENDING_SELLER', 'PENDING_PAYMENT'].includes(transaction.status)) {
    throw new AppError('Transaction cannot be cancelled at this stage', 400);
  }

  // Update transaction
  await transaction.update({
    status: 'CANCELLED',
    notes: reason || 'Transaction cancelled by user'
  }, { userId });

  // Notify other party
  const otherUserId = transaction.buyerId === userId ? transaction.sellerId : transaction.buyerId;
  await Notification.createForUser(
    otherUserId,
    'transaction_cancelled',
    'Giao dịch đã bị hủy',
    `Giao dịch #${transaction.id} đã bị hủy. Lý do: ${reason || 'Không có lý do'}`,
    { transactionId: transaction.id }
  );

  res.json({
    success: true,
    message: 'Transaction cancelled successfully'
  });
});

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  getStatistics,
  cancelTransaction
};
