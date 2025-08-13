const Joi = require('joi');

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    req[property] = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // User schemas
  userRegister: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).required(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('buyer', 'seller').default('buyer')
  }),

  userLogin: Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required()
  }),

  userUpdate: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    email: Joi.string().email().optional(),
    avatarUrl: Joi.string().uri().optional()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  }),

  // Room schemas
  roomCreate: Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(5000).optional(),
    category: Joi.string().valid('electronics', 'fashion', 'home', 'books', 'sports', 'other').required(),
    rules: Joi.string().max(5000).optional()
  }),

  roomUpdate: Joi.object({
    name: Joi.string().min(3).max(255).optional(),
    description: Joi.string().max(5000).optional(),
    rules: Joi.string().max(5000).optional(),
    status: Joi.string().valid('active', 'inactive').optional()
  }),

  // Transaction schemas
  transactionCreate: Joi.object({
    sellerId: Joi.string().uuid().required(),
    roomId: Joi.string().uuid().optional(),
    productName: Joi.string().min(1).max(500).required(),
    productDescription: Joi.string().max(5000).optional(),
    amount: Joi.number().positive().precision(2).required(),
    notes: Joi.string().max(1000).optional()
  }),

  transactionUpdate: Joi.object({
    status: Joi.string().valid(
      'PENDING_SELLER',
      'PENDING_PAYMENT',
      'PAID',
      'SHIPPING',
      'COMPLETED',
      'DISPUTED',
      'CANCELLED',
      'REFUNDED'
    ).optional(),
    notes: Joi.string().max(1000).optional(),
    paymentMethod: Joi.string().max(50).optional(),
    paymentReference: Joi.string().max(255).optional(),
    shippingInfo: Joi.object().optional()
  }),

  // Dispute schemas
  disputeCreate: Joi.object({
    transactionId: Joi.string().uuid().required(),
    type: Joi.string().valid('not_received', 'wrong_item', 'damaged', 'fake', 'other').required(),
    title: Joi.string().min(5).max(500).required(),
    description: Joi.string().min(20).max(5000).required(),
    resolutionRequest: Joi.string().valid('refund', 'exchange', 'partial_refund', 'other').required()
  }),

  disputeUpdate: Joi.object({
    status: Joi.string().valid('pending', 'investigating', 'resolved', 'rejected').optional(),
    adminResponse: Joi.string().max(5000).optional(),
    winner: Joi.string().valid('buyer', 'seller').optional()
  }),

  // Query parameter schemas
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
  }),

  transactionQuery: Joi.object({
    status: Joi.string().valid(
      'PENDING_SELLER',
      'PENDING_PAYMENT',
      'PAID',
      'SHIPPING',
      'COMPLETED',
      'DISPUTED',
      'CANCELLED',
      'REFUNDED'
    ).optional(),
    role: Joi.string().valid('buyer', 'seller').optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    minAmount: Joi.number().positive().optional(),
    maxAmount: Joi.number().positive().optional()
  }),

  roomQuery: Joi.object({
    category: Joi.string().valid('electronics', 'fashion', 'home', 'books', 'sports', 'other').optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    search: Joi.string().max(255).optional()
  }),

  disputeQuery: Joi.object({
    status: Joi.string().valid('pending', 'investigating', 'resolved', 'rejected').optional(),
    type: Joi.string().valid('not_received', 'wrong_item', 'damaged', 'fake', 'other').optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional()
  })
};

// Validation middleware functions
const validateUserRegister = validate(schemas.userRegister);
const validateUserLogin = validate(schemas.userLogin);
const validateUserUpdate = validate(schemas.userUpdate);
const validateChangePassword = validate(schemas.changePassword);

const validateRoomCreate = validate(schemas.roomCreate);
const validateRoomUpdate = validate(schemas.roomUpdate);

const validateTransactionCreate = validate(schemas.transactionCreate);
const validateTransactionUpdate = validate(schemas.transactionUpdate);

const validateDisputeCreate = validate(schemas.disputeCreate);
const validateDisputeUpdate = validate(schemas.disputeUpdate);

const validatePagination = validate(schemas.pagination, 'query');
const validateTransactionQuery = validate(schemas.transactionQuery, 'query');
const validateRoomQuery = validate(schemas.roomQuery, 'query');
const validateDisputeQuery = validate(schemas.disputeQuery, 'query');

module.exports = {
  validate,
  schemas,
  validateUserRegister,
  validateUserLogin,
  validateUserUpdate,
  validateChangePassword,
  validateRoomCreate,
  validateRoomUpdate,
  validateTransactionCreate,
  validateTransactionUpdate,
  validateDisputeCreate,
  validateDisputeUpdate,
  validatePagination,
  validateTransactionQuery,
  validateRoomQuery,
  validateDisputeQuery
};
