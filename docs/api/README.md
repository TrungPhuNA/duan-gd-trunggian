# SafeTrade API Documentation

## Overview

SafeTrade API là một RESTful API được xây dựng với Node.js, Express.js và MySQL để hỗ trợ hệ thống trung gian giao dịch an toàn.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

API sử dụng JWT (JSON Web Tokens) để xác thực. Token phải được gửi trong header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

Tất cả responses đều có format chuẩn:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {}, // Response data (if any)
  "errors": [], // Validation errors (if any)
  "pagination": {} // Pagination info (for list endpoints)
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP
- Authenticated users: 1000 requests per hour

## Endpoints Overview

### Authentication
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `GET /auth/profile` - Lấy thông tin profile
- `PUT /auth/profile` - Cập nhật profile
- `PUT /auth/change-password` - Đổi mật khẩu

### Transactions
- `POST /transactions` - Tạo giao dịch mới
- `GET /transactions` - Lấy danh sách giao dịch
- `GET /transactions/:id` - Lấy chi tiết giao dịch
- `PUT /transactions/:id` - Cập nhật giao dịch
- `PUT /transactions/:id/cancel` - Hủy giao dịch

### Rooms
- `POST /rooms` - Tạo phòng giao dịch
- `GET /rooms` - Lấy danh sách phòng
- `GET /rooms/:id` - Lấy chi tiết phòng
- `PUT /rooms/:id` - Cập nhật phòng
- `POST /rooms/:id/join` - Tham gia phòng

### Disputes
- `POST /disputes` - Tạo khiếu nại
- `GET /disputes` - Lấy danh sách khiếu nại
- `GET /disputes/:id` - Lấy chi tiết khiếu nại
- `PUT /disputes/:id` - Cập nhật khiếu nại (Admin)

### Admin
- `GET /admin/dashboard` - Dashboard admin
- `GET /admin/users` - Quản lý users
- `GET /admin/transactions` - Quản lý giao dịch
- `GET /admin/disputes` - Quản lý khiếu nại

## Data Models

### User
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "email": "string",
  "role": "buyer|seller|admin",
  "avatarUrl": "string",
  "isVerified": "boolean",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Transaction
```json
{
  "id": "uuid",
  "buyerId": "uuid",
  "sellerId": "uuid",
  "roomId": "uuid",
  "productName": "string",
  "productDescription": "string",
  "amount": "decimal",
  "feePercentage": "decimal",
  "status": "PENDING_SELLER|PENDING_PAYMENT|PAID|SHIPPING|COMPLETED|DISPUTED|CANCELLED|REFUNDED",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Room
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "category": "electronics|fashion|home|books|sports|other",
  "ownerId": "uuid",
  "status": "active|inactive",
  "memberCount": "integer",
  "transactionCount": "integer",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Dispute
```json
{
  "id": "uuid",
  "transactionId": "uuid",
  "complainantId": "uuid",
  "respondentId": "uuid",
  "type": "not_received|wrong_item|damaged|fake|other",
  "title": "string",
  "description": "string",
  "status": "pending|investigating|resolved|rejected",
  "adminResponse": "string",
  "winner": "buyer|seller",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=safetrade_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Getting Started

1. Clone repository
2. Install dependencies: `npm run install:all`
3. Setup environment: Copy `.env.example` to `.env`
4. Setup database: `npm run db:setup`
5. Start development: `npm run dev`

## Testing

```bash
# Run all tests
npm test

# Run server tests
cd server && npm test

# Run client tests
cd client && npm test
```

## Deployment

See [Deployment Guide](../deployment/README.md) for production setup instructions.
