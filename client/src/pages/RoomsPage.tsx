import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Building2, Users, TrendingUp } from 'lucide-react';

const RoomsPage: React.FC = () => {
  const { user } = useAuth();

  const rooms = [
    {
      id: '1',
      name: 'Phòng Điện Thoại',
      description: 'Giao dịch mua bán điện thoại, máy tính bảng',
      category: 'electronics',
      memberCount: 156,
      transactionCount: 89,
      owner: 'Trần Thị B'
    },
    {
      id: '2',
      name: 'Phòng Laptop Gaming',
      description: 'Chuyên về laptop gaming và phụ kiện',
      category: 'electronics',
      memberCount: 98,
      transactionCount: 45,
      owner: 'Nguyễn Văn C'
    },
    {
      id: '3',
      name: 'Phòng Thời Trang',
      description: 'Quần áo, giày dép, phụ kiện thời trang',
      category: 'fashion',
      memberCount: 234,
      transactionCount: 167,
      owner: 'Lê Thị D'
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'electronics':
        return 'bg-blue-100 text-blue-800';
      case 'fashion':
        return 'bg-pink-100 text-pink-800';
      case 'home':
        return 'bg-green-100 text-green-800';
      case 'books':
        return 'bg-yellow-100 text-yellow-800';
      case 'sports':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'electronics':
        return 'Điện tử';
      case 'fashion':
        return 'Thời trang';
      case 'home':
        return 'Gia dụng';
      case 'books':
        return 'Sách';
      case 'sports':
        return 'Thể thao';
      default:
        return 'Khác';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phòng giao dịch</h1>
          <p className="text-gray-600 mt-1">Tham gia các phòng giao dịch theo danh mục</p>
        </div>
        {user?.role === 'seller' && (
          <Link
            to="/rooms/create"
            className="btn btn-primary flex items-center mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo phòng mới
          </Link>
        )}
      </div>

      {/* Rooms grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="card hover:shadow-lg transition-shadow">
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {room.name}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(room.category)}`}>
                    {getCategoryText(room.category)}
                  </span>
                </div>
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {room.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {room.memberCount} thành viên
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {room.transactionCount} giao dịch
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Chủ phòng: {room.owner}
              </div>

              <div className="flex gap-2">
                <button className="btn btn-primary flex-1 text-sm">
                  Tham gia
                </button>
                <Link
                  to={`/rooms/${room.id}`}
                  className="btn btn-secondary text-sm"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state for no rooms */}
      {rooms.length === 0 && (
        <div className="card">
          <div className="card-body text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có phòng giao dịch nào
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'seller' 
                ? 'Hãy tạo phòng giao dịch đầu tiên của bạn'
                : 'Hiện tại chưa có phòng giao dịch nào. Hãy quay lại sau!'
              }
            </p>
            {user?.role === 'seller' && (
              <Link to="/rooms/create" className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Tạo phòng mới
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
