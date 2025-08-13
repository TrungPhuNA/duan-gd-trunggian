import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CreditCard, 
  Building2, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Plus,
  ArrowRight
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Tổng giao dịch',
      value: '12',
      change: '+2.5%',
      changeType: 'positive',
      icon: CreditCard,
    },
    {
      name: 'Giao dịch hoàn thành',
      value: '8',
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      name: 'Phòng tham gia',
      value: '5',
      change: '+1',
      changeType: 'positive',
      icon: Building2,
    },
    {
      name: 'Khiếu nại',
      value: '1',
      change: '0',
      changeType: 'neutral',
      icon: AlertTriangle,
    },
  ];

  const quickActions = user?.role === 'buyer' ? [
    {
      title: 'Tạo giao dịch mới',
      description: 'Bắt đầu giao dịch an toàn với người bán',
      href: '/transactions/create',
      icon: Plus,
      color: 'bg-primary-600 hover:bg-primary-700',
    },
    {
      title: 'Tham gia phòng',
      description: 'Khám phá các phòng giao dịch',
      href: '/rooms',
      icon: Building2,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Xem giao dịch',
      description: 'Theo dõi các giao dịch của bạn',
      href: '/transactions',
      icon: CreditCard,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
  ] : [
    {
      title: 'Tạo phòng mới',
      description: 'Tạo phòng giao dịch cho sản phẩm',
      href: '/rooms/create',
      icon: Plus,
      color: 'bg-primary-600 hover:bg-primary-700',
    },
    {
      title: 'Quản lý phòng',
      description: 'Quản lý các phòng của bạn',
      href: '/rooms',
      icon: Building2,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Xem đơn hàng',
      description: 'Xử lý các đơn hàng mới',
      href: '/transactions',
      icon: CreditCard,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
  ];

  const recentTransactions = [
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
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Chào mừng, {user?.name}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              {user?.role === 'buyer' 
                ? 'Sẵn sàng cho giao dịch mua sắm an toàn?' 
                : 'Hôm nay có đơn hàng mới nào không?'
              }
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className={`${action.color} text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8" />
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                <p className="text-white/80">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Giao dịch gần đây</h2>
          <Link
            to="/transactions"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
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
                    Ngày
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.product}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user?.role === 'buyer' ? `Bán bởi: ${transaction.seller}` : `Mua bởi: ${transaction.buyer}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.amount.toLocaleString('vi-VN')} VND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
