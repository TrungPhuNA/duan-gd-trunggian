# Authentication API

## Overview

SafeTrade sử dụng JWT (JSON Web Tokens) để xác thực người dùng. Mỗi request cần authentication phải include JWT token trong Authorization header.

## Endpoints

### Register User

Đăng ký tài khoản mới.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "phone": "0901234567",
  "email": "user@example.com", // optional
  "password": "123456",
  "role": "buyer" // buyer|seller
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nguyễn Văn A",
      "phone": "0901234567",
      "email": "user@example.com",
      "role": "buyer",
      "isVerified": false,
      "isActive": true,
      "createdAt": "2024-01-17T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- `name`: Required, 2-255 characters
- `phone`: Required, unique, valid phone format
- `email`: Optional, valid email format, unique
- `password`: Required, minimum 6 characters
- `role`: Required, must be 'buyer' or 'seller'

---

### Login User

Đăng nhập vào hệ thống.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "phone": "0901234567",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nguyễn Văn A",
      "phone": "0901234567",
      "email": "user@example.com",
      "role": "buyer",
      "isVerified": false,
      "isActive": true,
      "lastLoginAt": "2024-01-17T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get Profile

Lấy thông tin profile của user hiện tại.

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nguyễn Văn A",
      "phone": "0901234567",
      "email": "user@example.com",
      "role": "buyer",
      "avatarUrl": null,
      "isVerified": false,
      "isActive": true,
      "createdAt": "2024-01-17T10:00:00.000Z",
      "notifications": [
        {
          "id": "uuid",
          "type": "welcome",
          "title": "Chào mừng đến với SafeTrade!",
          "message": "Tài khoản của bạn đã được tạo thành công.",
          "isRead": false,
          "createdAt": "2024-01-17T10:00:00.000Z"
        }
      ]
    }
  }
}
```

---

### Update Profile

Cập nhật thông tin profile.

**Endpoint:** `PUT /api/auth/profile`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Nguyễn Văn A Updated",
  "email": "newemail@example.com",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nguyễn Văn A Updated",
      "phone": "0901234567",
      "email": "newemail@example.com",
      "role": "buyer",
      "avatarUrl": "https://example.com/avatar.jpg",
      "updatedAt": "2024-01-17T11:00:00.000Z"
    }
  }
}
```

---

### Change Password

Đổi mật khẩu.

**Endpoint:** `PUT /api/auth/change-password`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "currentPassword": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### Refresh Token

Làm mới access token.

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Logout

Đăng xuất (client-side token removal).

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get User Statistics

Lấy thống kê của user.

**Endpoint:** `GET /api/auth/stats`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTransactions": 5,
    "completedTransactions": 3,
    "totalDisputes": 1,
    "unreadNotifications": 2
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "phone",
      "message": "Phone number already registered",
      "value": "0901234567"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid phone number or password"
}
```

### Token Expired (401)
```json
{
  "success": false,
  "message": "Token expired"
}
```

## JWT Token Structure

```json
{
  "userId": "uuid",
  "role": "buyer|seller|admin",
  "iat": 1642428000,
  "exp": 1643032800
}
```

## Security Notes

1. Tokens expire after 7 days (configurable)
2. Refresh tokens expire after 30 days
3. Always use HTTPS in production
4. Store tokens securely on client side
5. Implement proper logout to clear tokens
