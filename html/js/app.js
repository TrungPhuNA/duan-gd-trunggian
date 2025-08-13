// App Configuration
const APP_CONFIG = {
    API_BASE_URL: '/api',
    STORAGE_PREFIX: 'safe_trade_',
    TRANSACTION_STATUSES: {
        PENDING_SELLER: 'Chờ xác nhận Seller',
        PENDING_PAYMENT: 'Chờ thanh toán',
        PAID: 'Đã thanh toán',
        SHIPPING: 'Đang giao',
        COMPLETED: 'Hoàn tất',
        DISPUTED: 'Tranh chấp'
    }
};

// Utility Functions
const Utils = {
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    },

    // Format date
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Generate transaction ID
    generateTransactionId: () => {
        return 'TXN' + Date.now().toString(36).toUpperCase();
    },

    // Show loading
    showLoading: (element) => {
        element.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Đang tải...</p>
            </div>
        `;
    },

    // Show error
    showError: (message, container) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.innerHTML = `
            <strong>Lỗi:</strong> ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()">×</button>
        `;
        container.insertBefore(errorDiv, container.firstChild);
    },

    // Show success
    showSuccess: (message, container) => {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.innerHTML = `
            <strong>Thành công:</strong> ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()">×</button>
        `;
        container.insertBefore(successDiv, container.firstChild);
    }
};

// Local Storage Manager
const Storage = {
    set: (key, value) => {
        localStorage.setItem(APP_CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
    },

    get: (key) => {
        const item = localStorage.getItem(APP_CONFIG.STORAGE_PREFIX + key);
        return item ? JSON.parse(item) : null;
    },

    remove: (key) => {
        localStorage.removeItem(APP_CONFIG.STORAGE_PREFIX + key);
    },

    clear: () => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(APP_CONFIG.STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
};

// User Management
const User = {
    current: null,

    login: (userData) => {
        User.current = userData;
        Storage.set('user', userData);
        window.location.href = userData.role === 'buyer' ? 'buyer-dashboard.html' : 'seller-dashboard.html';
    },

    logout: () => {
        User.current = null;
        Storage.remove('user');
        window.location.href = 'login.html';
    },

    getCurrentUser: () => {
        if (!User.current) {
            User.current = Storage.get('user');
        }
        return User.current;
    },

    isLoggedIn: () => {
        return User.getCurrentUser() !== null;
    },

    requireAuth: () => {
        if (!User.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};

// Transaction Management
const Transaction = {
    // Initialize mock data
    initializeMockData: () => {
        const existingTransactions = Storage.get('transactions');
        if (!existingTransactions || existingTransactions.length === 0) {
            const mockTransactions = [
                {
                    id: 'TXN001',
                    buyerId: 'buyer1',
                    buyerName: 'Nguyễn Văn A',
                    buyerPhone: '0901234567',
                    sellerId: 'seller1',
                    sellerName: 'Trần Thị B',
                    sellerPhone: '0907654321',
                    productName: 'iPhone 14 Pro Max',
                    productDescription: 'Máy mới 99%, fullbox, bảo hành 11 tháng',
                    amount: 25000000,
                    status: 'PENDING_SELLER',
                    createdAt: new Date('2024-01-15T10:30:00'),
                    updatedAt: new Date('2024-01-15T10:30:00')
                },
                {
                    id: 'TXN002',
                    buyerId: 'buyer1',
                    buyerName: 'Nguyễn Văn A',
                    buyerPhone: '0901234567',
                    sellerId: 'seller2',
                    sellerName: 'Lê Văn C',
                    sellerPhone: '0912345678',
                    productName: 'MacBook Air M2',
                    productDescription: 'Máy đẹp như mới, sử dụng 6 tháng',
                    amount: 28000000,
                    status: 'PAID',
                    createdAt: new Date('2024-01-14T14:20:00'),
                    updatedAt: new Date('2024-01-14T16:45:00')
                }
            ];
            Storage.set('transactions', mockTransactions);
        }
    },

    getAll: () => {
        Transaction.initializeMockData();
        return Storage.get('transactions') || [];
    },

    getById: (id) => {
        const transactions = Transaction.getAll();
        return transactions.find(t => t.id === id);
    },

    getByUser: (userId, role) => {
        const transactions = Transaction.getAll();
        return transactions.filter(t => 
            role === 'buyer' ? t.buyerId === userId : t.sellerId === userId
        );
    },

    create: (transactionData) => {
        const transactions = Transaction.getAll();
        const newTransaction = {
            id: Utils.generateTransactionId(),
            ...transactionData,
            status: 'PENDING_SELLER',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        transactions.push(newTransaction);
        Storage.set('transactions', transactions);
        return newTransaction;
    },

    update: (id, updates) => {
        const transactions = Transaction.getAll();
        const index = transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            transactions[index] = {
                ...transactions[index],
                ...updates,
                updatedAt: new Date()
            };
            Storage.set('transactions', transactions);
            return transactions[index];
        }
        return null;
    }
};

// Navigation
const Navigation = {
    setActive: (activeLink) => {
        document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
            link.classList.remove('active');
        });
        
        const currentLink = document.querySelector(`[href="${activeLink}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    },

    init: () => {
        const currentPage = window.location.pathname.split('/').pop();
        Navigation.setActive(currentPage);
    }
};

// Form Validation
const Validation = {
    validateRequired: (value, fieldName) => {
        if (!value || value.trim() === '') {
            return `${fieldName} không được để trống`;
        }
        return null;
    },

    validatePhone: (phone) => {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!phoneRegex.test(phone)) {
            return 'Số điện thoại không hợp lệ';
        }
        return null;
    },

    validateAmount: (amount) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return 'Số tiền phải lớn hơn 0';
        }
        if (numAmount < 10000) {
            return 'Số tiền tối thiểu là 10,000 VND';
        }
        return null;
    },

    validateForm: (formData, rules) => {
        const errors = {};
        
        Object.keys(rules).forEach(field => {
            const value = formData[field];
            const fieldRules = rules[field];
            
            fieldRules.forEach(rule => {
                if (!errors[field]) {
                    const error = rule(value);
                    if (error) {
                        errors[field] = error;
                    }
                }
            });
        });
        
        return errors;
    }
};

// Room Management
const Room = {
    initializeMockData: () => {
        const existingRooms = Storage.get('rooms');
        if (!existingRooms || existingRooms.length === 0) {
            const mockRooms = [
                {
                    id: 'ROOM001',
                    name: 'Phòng Điện Thoại',
                    description: 'Giao dịch mua bán điện thoại, máy tính bảng',
                    category: 'electronics',
                    ownerId: 'seller1',
                    ownerName: 'Trần Thị B',
                    status: 'active',
                    memberCount: 15,
                    transactionCount: 8,
                    createdAt: new Date('2024-01-10T09:00:00'),
                    updatedAt: new Date('2024-01-15T14:30:00')
                },
                {
                    id: 'ROOM002',
                    name: 'Phòng Thời Trang',
                    description: 'Mua bán quần áo, giày dép, phụ kiện thời trang',
                    category: 'fashion',
                    ownerId: 'seller2',
                    ownerName: 'Lê Văn C',
                    status: 'active',
                    memberCount: 23,
                    transactionCount: 12,
                    createdAt: new Date('2024-01-08T16:20:00'),
                    updatedAt: new Date('2024-01-14T11:15:00')
                }
            ];
            Storage.set('rooms', mockRooms);
        }
    },

    getAll: () => {
        Room.initializeMockData();
        return Storage.get('rooms') || [];
    },

    getById: (id) => {
        const rooms = Room.getAll();
        return rooms.find(r => r.id === id);
    },

    getByOwner: (ownerId) => {
        const rooms = Room.getAll();
        return rooms.filter(r => r.ownerId === ownerId);
    },

    create: (roomData) => {
        const rooms = Room.getAll();
        const newRoom = {
            id: 'ROOM' + Date.now().toString(36).toUpperCase(),
            ...roomData,
            status: 'active',
            memberCount: 1,
            transactionCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        rooms.push(newRoom);
        Storage.set('rooms', rooms);
        return newRoom;
    },

    update: (id, updates) => {
        const rooms = Room.getAll();
        const index = rooms.findIndex(r => r.id === id);
        if (index !== -1) {
            rooms[index] = {
                ...rooms[index],
                ...updates,
                updatedAt: new Date()
            };
            Storage.set('rooms', rooms);
            return rooms[index];
        }
        return null;
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();

    // Check authentication for protected pages
    const protectedPages = ['buyer-dashboard.html', 'seller-dashboard.html', 'create-transaction.html', 'transaction-detail.html', 'rooms.html', 'create-room.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage)) {
        User.requireAuth();
    }

    // Update user info in header if logged in
    const user = User.getCurrentUser();
    if (user) {
        const userNameElement = document.querySelector('.user-name');
        const userRoleElement = document.querySelector('.user-role');

        if (userNameElement) userNameElement.textContent = user.name;
        if (userRoleElement) userRoleElement.textContent = user.role === 'buyer' ? 'Người mua' : 'Người bán';
    }
});

// Dispute Management
const Dispute = {
    initializeMockData: () => {
        const existingDisputes = Storage.get('disputes');
        if (!existingDisputes || existingDisputes.length === 0) {
            const mockDisputes = [
                {
                    id: 'DSP001',
                    transactionId: 'TXN002',
                    buyerId: 'buyer1',
                    buyerName: 'Nguyễn Văn A',
                    sellerId: 'seller2',
                    sellerName: 'Lê Văn C',
                    type: 'damaged',
                    title: 'Sản phẩm bị hỏng',
                    description: 'MacBook nhận được có màn hình bị vỡ, không thể sử dụng được',
                    resolution: 'refund',
                    status: 'pending',
                    evidence: ['evidence1.jpg', 'evidence2.jpg'],
                    adminResponse: null,
                    createdAt: new Date('2024-01-16T10:30:00'),
                    updatedAt: new Date('2024-01-16T10:30:00')
                }
            ];
            Storage.set('disputes', mockDisputes);
        }
    },

    getAll: () => {
        Dispute.initializeMockData();
        return Storage.get('disputes') || [];
    },

    getById: (id) => {
        const disputes = Dispute.getAll();
        return disputes.find(d => d.id === id);
    },

    getByTransaction: (transactionId) => {
        const disputes = Dispute.getAll();
        return disputes.find(d => d.transactionId === transactionId);
    },

    getByUser: (userId, role) => {
        const disputes = Dispute.getAll();
        return disputes.filter(d =>
            role === 'buyer' ? d.buyerId === userId : d.sellerId === userId
        );
    },

    create: (disputeData) => {
        const disputes = Dispute.getAll();
        const newDispute = {
            id: 'DSP' + Date.now().toString(36).toUpperCase(),
            ...disputeData,
            status: 'pending',
            adminResponse: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        disputes.push(newDispute);
        Storage.set('disputes', disputes);
        return newDispute;
    },

    update: (id, updates) => {
        const disputes = Dispute.getAll();
        const index = disputes.findIndex(d => d.id === id);
        if (index !== -1) {
            disputes[index] = {
                ...disputes[index],
                ...updates,
                updatedAt: new Date()
            };
            Storage.set('disputes', disputes);
            return disputes[index];
        }
        return null;
    }
};

// Export for use in other files
window.App = {
    Utils,
    Storage,
    User,
    Transaction,
    Room,
    Dispute,
    Navigation,
    Validation,
    CONFIG: APP_CONFIG
};
