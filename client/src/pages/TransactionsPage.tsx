import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Filter, Search, Eye } from 'lucide-react';

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();

  const transactions = [
    {
      id: '1',
      product: 'iPhone 14 Pro Max',
      amount: 25000000,
      status: 'COMPLETED',
      date: '2024-01-15',
      buyer: 'Nguyễn Văn A',
      seller: 'Trần Thị B'
    },
    {
      id: '2',
      product: 'MacBook Air M2',
      amount: 28000000,
      status: 'SHIPPING',
      date: '2024-01-14',
      buyer: 'Lê Văn C',
      seller: 'Phạm Thị D'
    },
    {
      id: '3',
      product: 'Samsung Galaxy S23',
      amount: 18000000,
      status: 'PAID',
      date: '2024-01-13',
      buyer: 'Hoàng Văn E',
      seller: 'Ngô Thị F'
    },
    {
      id: '4',
      product: 'iPad Pro 11 inch',
      amount: 22000000,
      status: 'PENDING_PAYMENT',
      date: '2024-01-12',
      buyer: 'Võ Văn G',
      seller: 'Đặng Thị H'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPING':
        return 'bg-blue-100 text-blue-800';
      case 'PAID':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_PAYMENT':
        return 'bg-orange-100 text-orange-800';
      case 'DISPUTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'SHIPPING':
        return 'Đang giao';
      case 'PAID':
        return 'Đã thanh toán';
      case 'PENDING_PAYMENT':
        return 'Chờ thanh toán';
      case 'DISPUTED':
        return 'Khiếu nại';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Giao dịch</h1>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi các giao dịch của bạn</p>
        </div>
        {user?.role === 'buyer' && (
          <Link
            to="/transactions/create"
            className="btn btn-primary flex items-center mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo giao dịch mới
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Status filter */}
            <div className="sm:w-48">
              <select className="input">
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING_PAYMENT">Chờ thanh toán</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="SHIPPING">Đang giao</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="DISPUTED">Khiếu nại</option>
              </select>
            </div>

            {/* Role filter */}
            <div className="sm:w-48">
              <select className="input">
                <option value="">Tất cả vai trò</option>
                <option value="buyer">Người mua</option>
                <option value="seller">Người bán</option>
              </select>
            </div>

            {/* Filter button */}
            <button className="btn btn-secondary flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.product}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user?.role === 'buyer' 
                          ? `Bán bởi: ${transaction.seller}` 
                          : `Mua bởi: ${transaction.buyer}`
                        }
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.amount.toLocaleString('vi-VN')} VND
                    </div>
                    <div className="text-sm text-gray-500">
                      Phí: {(transaction.amount * 0.02).toLocaleString('vi-VN')} VND
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {getStatusText(transaction.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/transactions/${transaction.id}`}
                      className="text-primary-600 hover:text-primary-900 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="btn btn-secondary">Trước</button>
            <button className="btn btn-secondary">Sau</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">4</span> trong{' '}
                <span className="font-medium">4</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Trước
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-primary-600 text-sm font-medium text-white">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Sau
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
