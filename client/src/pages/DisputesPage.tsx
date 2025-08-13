import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisputesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Khiếu nại</h1>
        <p className="text-gray-600 mt-1">Quản lý các khiếu nại giao dịch</p>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Trang khiếu nại</h3>
          <p className="text-gray-600">Danh sách và quản lý khiếu nại sẽ được hiển thị ở đây</p>
        </div>
      </div>
    </div>
  );
};

export default DisputesPage;
