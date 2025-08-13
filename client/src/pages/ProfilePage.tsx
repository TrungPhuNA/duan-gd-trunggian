import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Shield, Calendar } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
        <p className="text-gray-600 mt-1">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile info */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium">Thông tin tài khoản</h3>
            </div>
            <div className="card-body space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{user?.name}</h4>
                  <p className="text-gray-600 capitalize">{user?.role}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{user?.name}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{user?.phone}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{user?.email || 'Chưa cập nhật'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vai trò
                  </label>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 capitalize">{user?.role}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày tham gia
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="btn btn-primary">Chỉnh sửa thông tin</button>
                <button className="btn btn-secondary">Đổi mật khẩu</button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium">Thống kê</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng giao dịch</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hoàn thành</span>
                <span className="font-semibold text-green-600">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Đang xử lý</span>
                <span className="font-semibold text-yellow-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Khiếu nại</span>
                <span className="font-semibold text-red-600">1</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium">Đánh giá</h3>
            </div>
            <div className="card-body">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">4.8</div>
                <div className="text-sm text-gray-600">Từ 15 đánh giá</div>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
