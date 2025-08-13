# SafeTrade - Hệ thống trung gian giao dịch an toàn

## 📋 Tổng quan

SafeTrade là một hệ thống trung gian giao dịch (escrow) được xây dựng với Node.js, React.js, Tailwind CSS và MySQL. Hệ thống bảo vệ quyền lợi của cả người mua và người bán trong các giao dịch trực tuyến.

## ✨ Tính năng chính

### 🛒 Cho người mua
- Tạo giao dịch mới với người bán
- Thanh toán an toàn qua hệ thống trung gian
- Theo dõi trạng thái giao dịch real-time
- Tạo khiếu nại khi có vấn đề
- Tham gia phòng giao dịch theo danh mục

### 🏪 Cho người bán
- Xác nhận và quản lý đơn hàng
- Tạo và quản lý phòng giao dịch
- Theo dõi thu nhập và thống kê
- Xử lý giao hàng và xác nhận
- Quản lý thành viên phòng

### 👨‍💼 Cho admin
- Dashboard quản lý tổng quan
- Xử lý khiếu nại và phân xử
- Quản lý người dùng và giao dịch
- Thống kê và báo cáo hệ thống
- Cấu hình hệ thống

## 🏗️ Kiến trúc hệ thống

```
safetrade-system/
├── server/                 # Backend API (Node.js + Express)
│   ├── config/            # Database và cấu hình
│   ├── controllers/       # API controllers
│   ├── middleware/        # Authentication, validation
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── scripts/          # Database migration/seeding
├── client/               # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── contexts/     # React contexts
│   │   └── types/        # TypeScript types
└── docs/                 # Documentation
    ├── api/              # API documentation
    ├── deployment/       # Deployment guides
    └── user-guide/       # User manuals
```

## 🚀 Quick Start

### Yêu cầu hệ thống
- Node.js 16.0.0+
- MySQL 8.0+
- npm 8.0.0+

### Cài đặt

1. **Clone repository**
```bash
git clone https://github.com/your-repo/safetrade-system.git
cd safetrade-system
```

2. **Cài đặt dependencies**
```bash
npm run install:all
```

3. **Cấu hình môi trường**
```bash
cp server/.env.example server/.env
# Chỉnh sửa file .env với thông tin database và cấu hình
```

4. **Setup database**
```bash
npm run db:setup
```

5. **Chạy ứng dụng**
```bash
npm run dev
```

Ứng dụng sẽ chạy tại:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 Tài liệu

### API Documentation
- [API Overview](docs/api/README.md)
- [Authentication API](docs/api/authentication.md)
- [Transactions API](docs/api/transactions.md)
- [Rooms API](docs/api/rooms.md)
- [Disputes API](docs/api/disputes.md)

### Deployment
- [Production Deployment](docs/deployment/README.md)
- [Docker Setup](docs/deployment/docker.md)
- [SSL Configuration](docs/deployment/ssl.md)

### User Guides
- [User Manual](docs/user-guide/README.md)
- [Admin Guide](docs/user-guide/admin.md)
- [API Integration](docs/user-guide/api-integration.md)

## 🧪 Testing

### Chạy tests
```bash
# Test toàn bộ
npm test

# Test backend
cd server && npm test

# Test frontend
cd client && npm test
```

### Tài khoản demo
```
Admin: admin / admin123456
Buyer: 0901234567 / 123456
Seller: 0907654321 / 123456
```

## 📱 Mobile App Development

Hệ thống được thiết kế với RESTful API hoàn chỉnh, dễ dàng tích hợp với:
- React Native
- Flutter
- Native iOS/Android apps

API endpoints đầy đủ cho tất cả tính năng:
- Authentication & User management
- Transaction lifecycle
- Room management
- Dispute handling
- Real-time notifications

## 🔧 Scripts có sẵn

```bash
# Development
npm run dev              # Chạy cả frontend và backend
npm run server:dev       # Chỉ chạy backend
npm run client:dev       # Chỉ chạy frontend

# Production
npm run build           # Build frontend
npm start              # Chạy production server

# Database
npm run db:setup       # Setup database (migrate + seed)
npm run db:migrate     # Chỉ migrate
npm run db:seed        # Chỉ seed data

# Testing & Quality
npm test               # Chạy tests
npm run lint           # Lint code
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MySQL với Sequelize ORM
- **Authentication**: JWT
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate limiting
- **File Upload**: Multer
- **Email**: Nodemailer

### Frontend
- **Framework**: React 18 với TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Forms**: React Hook Form với Yup validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### DevOps
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt
- **Monitoring**: PM2 monitoring
- **Backup**: Automated MySQL dumps

## 🔒 Security Features

- JWT-based authentication
- Password hashing với bcrypt
- Rate limiting
- Input validation và sanitization
- SQL injection protection
- XSS protection
- CORS configuration
- Security headers
- File upload restrictions

## 📊 Database Schema

Hệ thống sử dụng 9 bảng chính:
- `users` - Thông tin người dùng
- `transactions` - Giao dịch
- `rooms` - Phòng giao dịch
- `room_members` - Thành viên phòng
- `disputes` - Khiếu nại
- `dispute_evidence` - Bằng chứng khiếu nại
- `transaction_history` - Lịch sử giao dịch
- `notifications` - Thông báo
- `system_settings` - Cấu hình hệ thống

Chi tiết schema: [Database Schema](docs/database-schema.sql)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- Email: support@safetrade.com
- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/your-repo/safetrade-system/issues)

## 🗺️ Roadmap

### Phase 1 (Completed) ✅
- [x] Core transaction system
- [x] User authentication
- [x] Room management
- [x] Dispute handling
- [x] Admin dashboard
- [x] API documentation

### Phase 2 (In Progress) 🚧
- [ ] Real-time notifications
- [ ] Payment gateway integration
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Multi-language support

### Phase 3 (Planned) 📋
- [ ] AI-powered fraud detection
- [ ] Automated dispute resolution
- [ ] Blockchain integration
- [ ] Advanced reporting
- [ ] Third-party integrations

---

**SafeTrade** - Giao dịch an toàn, tin cậy tuyệt đối! 🛡️
