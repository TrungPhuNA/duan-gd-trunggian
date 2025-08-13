-- SafeTrade Database Schema
-- Created: 2024-01-17
-- Description: Database schema for SafeTrade escrow system

CREATE DATABASE IF NOT EXISTS duan-2025-gdtg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE duan-2025-gdtg;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('buyer', 'seller', 'admin') NOT NULL DEFAULT 'buyer',
    avatar_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_phone (phone),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);

-- Rooms table (Trading rooms)
CREATE TABLE rooms (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('electronics', 'fashion', 'home', 'books', 'sports', 'other') NOT NULL,
    owner_id VARCHAR(36) NOT NULL,
    rules TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    member_count INT DEFAULT 1,
    transaction_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_owner_id (owner_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Room members table
CREATE TABLE room_members (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    room_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_room_member (room_id, user_id),
    INDEX idx_room_id (room_id),
    INDEX idx_user_id (user_id)
);

-- Transactions table
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    buyer_id VARCHAR(36) NOT NULL,
    seller_id VARCHAR(36) NOT NULL,
    room_id VARCHAR(36),
    product_name VARCHAR(500) NOT NULL,
    product_description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    fee_percentage DECIMAL(5,2) DEFAULT 2.00,
    fee_amount DECIMAL(15,2) GENERATED ALWAYS AS (amount * fee_percentage / 100) STORED,
    seller_amount DECIMAL(15,2) GENERATED ALWAYS AS (amount - fee_amount) STORED,
    status ENUM(
        'PENDING_SELLER',
        'PENDING_PAYMENT', 
        'PAID',
        'SHIPPING',
        'COMPLETED',
        'DISPUTED',
        'CANCELLED',
        'REFUNDED'
    ) NOT NULL DEFAULT 'PENDING_SELLER',
    notes TEXT,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    shipping_info JSON,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL,
    INDEX idx_buyer_id (buyer_id),
    INDEX idx_seller_id (seller_id),
    INDEX idx_room_id (room_id),
    INDEX idx_status (status),
    INDEX idx_amount (amount),
    INDEX idx_created_at (created_at),
    
    CONSTRAINT chk_amount_positive CHECK (amount > 0),
    CONSTRAINT chk_fee_percentage CHECK (fee_percentage >= 0 AND fee_percentage <= 100)
);

-- Disputes table
CREATE TABLE disputes (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    transaction_id VARCHAR(36) NOT NULL,
    complainant_id VARCHAR(36) NOT NULL,
    respondent_id VARCHAR(36) NOT NULL,
    type ENUM('not_received', 'wrong_item', 'damaged', 'fake', 'other') NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    resolution_request ENUM('refund', 'exchange', 'partial_refund', 'other') NOT NULL,
    status ENUM('pending', 'investigating', 'resolved', 'rejected') DEFAULT 'pending',
    admin_id VARCHAR(36),
    admin_response TEXT,
    winner ENUM('buyer', 'seller'),
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (complainant_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (respondent_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_complainant_id (complainant_id),
    INDEX idx_respondent_id (respondent_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    
    UNIQUE KEY unique_transaction_dispute (transaction_id)
);

-- Dispute evidence table
CREATE TABLE dispute_evidence (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    dispute_id VARCHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT NOT NULL,
    uploaded_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_dispute_id (dispute_id),
    INDEX idx_uploaded_by (uploaded_by)
);

-- Transaction history table (for audit trail)
CREATE TABLE transaction_history (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    transaction_id VARCHAR(36) NOT NULL,
    status_from VARCHAR(50),
    status_to VARCHAR(50) NOT NULL,
    changed_by VARCHAR(36),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_created_at (created_at)
);

-- Notifications table
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- System settings table
CREATE TABLE system_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_setting_key (setting_key)
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('default_fee_percentage', '2.00', 'Default transaction fee percentage'),
('min_transaction_amount', '10000', 'Minimum transaction amount in VND'),
('max_transaction_amount', '1000000000', 'Maximum transaction amount in VND'),
('dispute_auto_resolve_days', '7', 'Days after which disputes are auto-resolved'),
('maintenance_mode', 'false', 'System maintenance mode flag');

-- Create views for reporting
CREATE VIEW transaction_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_transactions,
    SUM(amount) as total_amount,
    SUM(fee_amount) as total_fees,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_transactions,
    COUNT(CASE WHEN status = 'DISPUTED' THEN 1 END) as disputed_transactions
FROM transactions 
GROUP BY DATE(created_at);

CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.phone,
    u.role,
    COUNT(CASE WHEN t.buyer_id = u.id THEN 1 END) as transactions_as_buyer,
    COUNT(CASE WHEN t.seller_id = u.id THEN 1 END) as transactions_as_seller,
    SUM(CASE WHEN t.buyer_id = u.id THEN t.amount ELSE 0 END) as total_bought,
    SUM(CASE WHEN t.seller_id = u.id THEN t.seller_amount ELSE 0 END) as total_earned
FROM users u
LEFT JOIN transactions t ON (u.id = t.buyer_id OR u.id = t.seller_id)
GROUP BY u.id;
