// User types
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'buyer' | 'seller' | 'admin';
  avatarUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Transaction types
export type TransactionStatus = 
  | 'PENDING_SELLER'
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'SHIPPING'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  roomId?: string;
  productName: string;
  productDescription?: string;
  amount: number;
  feePercentage: number;
  status: TransactionStatus;
  notes?: string;
  paymentMethod?: string;
  paymentReference?: string;
  shippingInfo?: any;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  buyer?: User;
  seller?: User;
  room?: Room;
}

// Room types
export type RoomCategory = 'electronics' | 'fashion' | 'home' | 'books' | 'sports' | 'other';

export interface Room {
  id: string;
  name: string;
  description?: string;
  category: RoomCategory;
  ownerId: string;
  rules?: string;
  status: 'active' | 'inactive';
  memberCount: number;
  transactionCount: number;
  createdAt: string;
  updatedAt: string;
  owner?: User;
}

// Dispute types
export type DisputeType = 'not_received' | 'wrong_item' | 'damaged' | 'fake' | 'other';
export type DisputeStatus = 'pending' | 'investigating' | 'resolved' | 'rejected';
export type ResolutionRequest = 'refund' | 'exchange' | 'partial_refund' | 'other';

export interface Dispute {
  id: string;
  transactionId: string;
  complainantId: string;
  respondentId: string;
  type: DisputeType;
  title: string;
  description: string;
  resolutionRequest: ResolutionRequest;
  status: DisputeStatus;
  adminId?: string;
  adminResponse?: string;
  winner?: 'buyer' | 'seller';
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  transaction?: Transaction;
  complainant?: User;
  respondent?: User;
  admin?: User;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types
export interface LoginForm {
  phone: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role?: 'buyer' | 'seller';
}

export interface TransactionForm {
  sellerId: string;
  roomId?: string;
  productName: string;
  productDescription?: string;
  amount: number;
  notes?: string;
}

export interface RoomForm {
  name: string;
  description?: string;
  category: RoomCategory;
  rules?: string;
}

export interface DisputeForm {
  transactionId: string;
  type: DisputeType;
  title: string;
  description: string;
  resolutionRequest: ResolutionRequest;
}

// Query types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface TransactionQuery extends PaginationQuery {
  status?: TransactionStatus;
  role?: 'buyer' | 'seller';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface RoomQuery extends PaginationQuery {
  category?: RoomCategory;
  status?: 'active' | 'inactive';
  search?: string;
}

export interface DisputeQuery extends PaginationQuery {
  status?: DisputeStatus;
  type?: DisputeType;
  priority?: 'low' | 'medium' | 'high';
}

// Statistics types
export interface UserStats {
  totalTransactions: number;
  completedTransactions: number;
  totalDisputes: number;
  unreadNotifications: number;
}

export interface TransactionStats {
  totalTransactions: number;
  totalAmount: number;
  totalFees: number;
  completedTransactions: number;
  disputedTransactions: number;
}

export interface DisputeStats {
  totalDisputes: number;
  pendingDisputes: number;
  investigatingDisputes: number;
  resolvedDisputes: number;
  rejectedDisputes: number;
}
